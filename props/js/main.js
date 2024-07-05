var users = [], isLocalDev = window.location.host.indexOf('local.') >= 0;
(function () {
	if (isLocalDev) {
		var arLiveLinks = document.querySelectorAll('[href*="/mcgi-mass-indoc-invite/"], [src*="/mcgi-mass-indoc-invite/"], [content*="/mcgi-mass-indoc-invite/"], meta[property]');
		if (arLiveLinks.length) {
			// console.log(arLiveLinks);
			arLiveLinks.forEach(function (element) {
				// console.log(element.tagName.toLowerCase());
				switch (element.tagName.toLowerCase()) {
					case 'link':
						if (element.rel != 'canonical') {
							element.href = element.href.replace('/mcgi-mass-indoc-invite/', '/');
						} else {
							element.remove();
						}
						break;
					case 'img':
						element.src = element.src.replace('/mcgi-mass-indoc-invite/', '/');
						break;
					case 'meta':
						element.remove();
						break;
				}
			});
		}
	}

	var localeInfos = sessionStorage.getItem('locale-informations');
	if (window.location.search) {
		// console.log('search');
		var search = decodeURIComponent(location.search.replace(/[+]/g, ' ')).substring(1);
		var localeInfosSearch = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
		if (localeInfosSearch && (localeInfosSearch.name && localeInfosSearch.address)) {
			document.getElementsByClassName('locale-name')[0].textContent = localeInfosSearch.name.toUpperCase();
			document.getElementsByClassName('locale-address')[0].textContent = localeInfosSearch.address.toUpperCase();
			popContacts(localeInfosSearch);
			// sessionStorage.setItem('locale-informations', JSON.stringify(localeInfosSearch));
		}
	} else if (localeInfos != null) {
		// console.log('sessionStorage');
		localeInfos = JSON.parse(localeInfos);
		document.getElementsByClassName('locale-name')[0].textContent = localeInfos.name.toUpperCase();
		document.getElementsByClassName('locale-address')[0].textContent = localeInfos.address.toUpperCase();
		popContacts(localeInfos);
		var urlParams = new URLSearchParams(localeInfos).toString();
		window.history.pushState({}, '', '?' + urlParams);
	}

	// Create a new XMLHttpRequest object
	var xhr = new XMLHttpRequest();
	// Configure the request
	xhr.open('GET', 'props/data/users.json', true);
	// Set the response type to JSON
	xhr.responseType = 'json';
	// Handle the response
	xhr.onload = function () {
		if (xhr.status === 200) {
			users = xhr.response;
			// console.log(users);
		} else {
			console.error('Request failed. Status: ' + xhr.status);
		}
	};
	// Send the request
	xhr.send();

	window.addEventListener('DOMContentLoaded', setSessionEvent);

	window.addEventListener('keypress', function (e) {
		// console.log(e);
		if (e.ctrlKey && e.code == "KeyM") {
			runLocaleChangeEvent();
		}
	});

	window.addEventListener('click', function () {
		numberOfClicks += 1;
		// console.log(numberOfClicks);
		if (numberOfClicks === 4) {
			numberOfClicks = 0;
			// console.log('Forth Click!');
			runLocaleChangeEvent();
		} else if (numberOfClicks < 3) {
			secondsResetClick(1);
		}
	});

	if (navigator.geolocation) {
		// Request the user's location
		navigator.geolocation.getCurrentPosition(
			function (position) {
				// Success callback
				const latitude = position.coords.latitude;
				const longitude = position.coords.longitude;
				console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
			},
			function (error) {
				// Error callback
				switch (error.code) {
					case error.PERMISSION_DENIED:
						console.log("User denied the request for Geolocation.");
						break;
					case error.POSITION_UNAVAILABLE:
						console.log("Location information is unavailable.");
						break;
					case error.TIMEOUT:
						console.log("The request to get user location timed out.");
						break;
					case error.UNKNOWN_ERROR:
						console.log("An unknown error occurred.");
						break;
				}
			}
		);
	} else {
		// Geolocation is not supported by this browser
		console.log("Geolocation is not supported by this browser.");
	}
})();

var hasPressed = false;
var changeLocaleBtn = document.getElementById('change-locale');

/* function generatePassword(length) {
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let password = '';
	for (let i = 0; i < length; i++) {
		var randomIndex = Math.floor(Math.random() * characters.length);
		password += characters[randomIndex];
	}
	return password;
} */

var enteredPass = false;
function runLocaleChangeEvent() {
	if (changeLocaleBtn.style.display == 'none') {
		changeLocaleBtn.style.display = 'block';
	} else {
		changeLocaleBtn.style.display = 'none';
	}
	if (hasPressed == false) {
		hasPressed = true;
		changeLocaleBtn.addEventListener('click', function (e) {
			if (enteredPass == false) {
				if (confirm('Click OK or Hit Enter to Login')) {
					var username = prompt('Please enter your email');
					if (username) {
						var password = prompt('Please enter your password');
						var oClass = new JSONQuery(users);
						var hash = CryptoJS.MD5(password).toString();
						var oCondition = [
							{ field: 'username', operator: '=', value: username },
							{ field: 'password', operator: '=', value: hash },
						];
						var query = {
							select: { fields: '*' },
							where: { condition: oCondition }
						};
						var result = oClass.execute(query);
						// console.log(result);
						if (result.data.length) {
							enteredPass = true;
							enterNewLocale();
						}
					} else {
						alert("Please enter your email as username!");
						changeLocaleBtn.click();
					}
				}
			} else {
				var password = prompt('Please enter your password');
				var oClass = new JSONQuery(users);
				var hash = CryptoJS.MD5(password).toString();
				var oCondition = [
					{ field: 'password', operator: '=', value: hash },
				];
				var query = {
					select: { fields: '*' },
					where: { condition: oCondition }
				};
				var result = oClass.execute(query);
				// console.log(result);
				if (result.data.length) {
					enterNewLocale();
				}
			}
		});
	}
}

function enterNewLocale() {
	var localeName = prompt('Please enter MCGI Locale name?');
	// console.log(localeName);
	if (localeName && localeName.length) {
		var localeAddress = prompt('Please enter MCGI Locale address?');
		if (localeAddress && localeAddress.length) {
			var localeContacts = prompt('Please enter MCGI Locale contact numbers? (Separated with comma if many)');
			if (localeContacts && localeContacts.length) {
				document.getElementsByClassName('locale-name')[0].textContent = localeName.toUpperCase();
				document.getElementsByClassName('locale-address')[0].textContent = localeAddress.toUpperCase();
				var localeData = { name: localeName, address: localeAddress, contacts: localeContacts };
				popContacts(localeData);
				sessionStorage.setItem('locale-informations', JSON.stringify(localeData));
				var urlParams = new URLSearchParams(localeData).toString();
				window.history.pushState({}, '', '?' + urlParams);
			}
		}
	}
}

let numberOfClicks = 0;
function secondsResetClick(seconds) {
	setTimeout(function () {
		numberOfClicks = 0;
	}, seconds * 1000)
}

function popContacts(localeInfos) {
	var contacts = localeInfos.contacts.split(',');
	var uiContacts = document.getElementsByClassName('locale-contacts');
	uiContacts[0].textContent = '';
	for (var key in contacts) {
		if (Object.hasOwnProperty.call(contacts, key)) {
			var number = contacts[key];
			var a = document.createElement('a');
			var comma = '';
			if (key != 0) comma = ', ';
			a.textContent = comma + number.trim();
			a.href = 'tel:' + number.trim();
			uiContacts[0].appendChild(a);
		}
	}
}