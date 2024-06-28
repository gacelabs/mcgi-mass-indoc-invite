var users = [];
(function () {
	if (window.location.host.indexOf('local.') >= 0) {
		var arLiveLinks = document.querySelectorAll('[href*="/mcgi-mass-indoc-invite/"], [src*="/mcgi-mass-indoc-invite/"], [content*="/mcgi-mass-indoc-invite/"]');
		if (arLiveLinks.length) {
			// console.log(arLiveLinks);
			arLiveLinks.forEach(function (element) {
				// console.log(element.tagName.toLowerCase());
				switch (element.tagName.toLowerCase()) {
					case 'link':
						if (element.rel != 'canonical') {
							element.href = element.href.replace('/mcgi-mass-indoc-invite/', '/');
						}
						break;
					case 'img':
						element.src = element.src.replace('/mcgi-mass-indoc-invite/', '/');
						break;
					case 'meta':
						if (element.property != "og:url") {
							element.content = element.content.replace('/mcgi-mass-indoc-invite/', '/');
						}
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

	window.addEventListener('DOMContentLoaded', setDateEvent);

	window.addEventListener('keypress', function (e) {
		console.log(e);
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

window.mobileCheck = function () {
	let check = false;
	(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};

/* var specificYoutubeChannel = ((mobileCheck()) ? 'youtube://channel/' : 'https://www.youtube.com/') + '@MCGIChannel';
var specificFacebookChannel = ((mobileCheck()) ? 'fb://page/' : 'https://www.facebook.com/') + 'MCGI.org'; */

var specificYoutubeChannel = 'https://m.youtube.com/@MCGIChannel';
var specificFacebookChannel = 'https://m.facebook.com/MCGI.org';

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

function getDaySuffix(day) {
	if (day >= 11 && day <= 13) {
		return day + 'th';
	}
	switch (day % 10) {
		case 1: return day + 'st';
		case 2: return day + 'nd';
		case 3: return day + 'rd';
		default: return day + 'th';
	}
}

function getDayCount(startDate, endDate, bEnded) {
	if (bEnded) {
		var nextDay = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
		var isWeekend = nextDay.getDay() === 6 || nextDay.getDay() === 0;
		var tillNextMonday = 0;
		if (isWeekend) {
			// Got to weekdays when next day is Saturday (6) or Sunday (0)
			do {
				nextDay.setDate(nextDay.getDate() + 1); // Move to the next day
				tillNextMonday++;
			} while (nextDay.getDay() === 0 || nextDay.getDay() === 6);
			// console.log(nextDay);
		}

		document.getElementById("session-day").innerHTML = '<strong>Day ' + session_count + ', Tune-in ' + (isWeekend ? 'Monday' : 'tomorrow') + '</strong>';
		if (notificationShown == false) {
			notificationShown = true;
			var sTitle = 'Tune-in ' + (isWeekend ? 'Monday' : 'tomorrow');
			showNotification(sTitle, 'Watch via MCGI YouTube Channel', specificYoutubeChannel);
		}

		var formattedDate = formatDateToFJY(nextDay);
		var dateTextContent = formattedDate;
		if (nextDay.getMonth() != 4) {
			dateTextContent = addDotAfterThirdCharacter(formattedDate);
		}
		document.getElementsByClassName("date-value")[0].textContent = dateTextContent;
		var sWeekDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(nextDay);
		document.getElementsByClassName('weekday')[0].textContent = sWeekDay;
		clearInterval(interval);
		startCountdown(nextDay, true, (tillNextMonday > 0));
		// console.log(nextDay, true, tillNextMonday);
	} else {
		var nowDate = new Date();
		// var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
		// var today = new Intl.DateTimeFormat('en-US', options).format(nowDate);
		// var endDay = new Intl.DateTimeFormat('en-US', options).format(endDate);
		// console.log(nowDate, endDate);
		var sTitle = 'Tune-in tomorrow';
		if (nowDate.getTime() <= endDate.getTime()) {
			sTitle = 'Tune-in tonight';
		}
		if (session_count % 14 === 0) {
			sTitle = 'Last session tonight';
		} else if (session_count % 5 === 0) {
			sTitle = 'Tune-in Monday';
		} else if (session_count % 15 === 0) {
			sTitle = 'Doctrine Acceptance';
		}

		document.getElementById("session-day").innerHTML = '<strong>Day ' + session_count + ', ' + sTitle + '</strong>';
		if (notificationShown == false) {
			notificationShown = true;
			showNotification(sTitle, 'Watch via MCGI YouTube Channel', specificYoutubeChannel);
		}
	}
}

function addDaysToDate(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

function formatDateToFJY(date) {
	var options = { month: 'short', day: 'numeric', year: 'numeric' };
	return new Intl.DateTimeFormat('en-US', options).format(date);
}

function countMonths(startDate) {
	var today = new Date();
	var start = new Date(startDate);

	var startYear = start.getFullYear();
	var startMonth = start.getMonth();

	var todayYear = today.getFullYear();
	var todayMonth = today.getMonth();

	var monthsDifference = (todayYear - startYear) * 12 + (todayMonth - startMonth);

	return monthsDifference;
}

function addDotAfterThirdCharacter(str) {
	return str.slice(0, 3) + '.' + str.slice(3);
}

var notificationShown = false, interval, savedStartSession, savedEndSession, savedCurrentDay;
var notificationStartSoon = false, baptismDay = false;
function startCountdown(startDate, bForce, tillNextMonday) {
	var now = new Date();
	var start = new Date(startDate);

	var hours = now.getHours();
	var minutes = now.getMinutes();
	var seconds = now.getSeconds();
	// Set the time components to the given date
	start.setHours(hours);
	start.setMinutes(minutes);
	start.setSeconds(seconds);

	var pass = now > start;
	var end;
	var cnt = 0;

	if (pass || bForce) {
		if (bForce) {
			end = new Date(start);
		} else {
			// If the start date is in the future, set the countdown to 7 PM on the start date
			end = new Date(now);
		}

		if (tillNextMonday != undefined) bForce = false;
		if (baptismDay) {
			end.setHours(8, 0, 0, 0); // set to 8am
		} else {
			end.setHours(19, 0, 0, 0); // set to 7pm
			if (now.getTime() > end.getTime()) {
				end.setHours(21, 0, 0, 0); // set to 9pm
			}
		}
	} else {
		// If the start date is in the past or today, set the countdown to 8 days from the start date
		// end = new Date(start.getTime() + 8 * 24 * 60 * 60 * 1000); // Add 8 days to start date
		end = new Date(new Date(start).setHours(19, 0, 0, 0)); // set to 7pm
	}
	// console.log(now.getTime(), end.getTime(), now.getTime() > end.getTime());
	// console.log(start, end);

	function updateCountdown(end, tillNextMonday) {
		var now = new Date().getTime();
		var distance = end.getTime() - now;
		// console.log(distance, new Date(now), end);
		var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
		var today = new Intl.DateTimeFormat('en-US', options).format(now);
		var programEnds = new Intl.DateTimeFormat('en-US', options).format(end);

		if (distance < 0) {
			session_count++;
			getDayCount(sDefaultStartDate, savedCurrentDay, true);
			return;
		} else if (today == programEnds && now < end.getTime()) {
			document.getElementById("countdown").innerHTML = "On going";
			getDayCount(sDefaultStartDate, savedCurrentDay);
			/* reset and update counter when program ended */
			clearInterval(interval);
			startCountdown(start);
			return;
		}
		
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		console.log(pass, bForce, end, tillNextMonday, days);
		// console.log((pass || bForce) || tillNextMonday == false);
		if (((pass || bForce) || tillNextMonday == false) && (session_count % 5 !== 0 && days == 0)) {
		// if (session_count % 5 !== 0 && days == 0) { /* not friday but days count is zero */
			if (hours != 0 || minutes != 0 || seconds != 0) {
				getDayCount(sDefaultStartDate, savedCurrentDay);
				document.getElementById("countdown").innerHTML =
					`<div class="countdown-segment"><span class="countdown-label">Hours</span><span class="countdown-number hours">${hours}</span></div>` +
					`<div class="countdown-segment"><span class="countdown-label">Minutes</span><span class="countdown-number">${minutes}</span></div>` +
					`<div class="countdown-segment"><span class="countdown-label">Seconds</span><span class="countdown-number">${seconds}</span></div>` +
					`<div style="margin-top: -10px;"><span class="countdown-label">To go</span></div>`;
			}
		} else {
			if (days != 0 || hours != 0 || minutes != 0 || seconds != 0) {
				document.getElementById("countdown").innerHTML =
					`<div class="countdown-segment"><span class="countdown-label">Days</span><span class="countdown-number days">${days}</span></div>` +
					`<div class="countdown-segment"><span class="countdown-label">Hours</span><span class="countdown-number hours">${hours}</span></div>` +
					`<div class="countdown-segment"><span class="countdown-label">Minutes</span><span class="countdown-number">${minutes}</span></div>` +
					`<div class="countdown-segment"><span class="countdown-label">Seconds</span><span class="countdown-number">${seconds}</span></div>` +
					`<div style="margin-top: -10px;"><span class="countdown-label">To go</span></div>`;
			}
		}

		if ((days == 0 && hours == 0) && notificationStartSoon == false) {
			notificationStartSoon = true;
			showNotification('Starting soon - Standby', 'Watch via MCGI YouTube Channel', specificYoutubeChannel);
		}
		// console.log(cnt);
		cnt++;

		if (cnt == 59) {
			// console.info('reset ram every 60 seconds');
			cnt = 0;
			clearInterval(interval);
			interval = setInterval(function () {
				updateCountdown(end, tillNextMonday);
			}, 1000);
		}
	}

	interval = setInterval(function () {
		updateCountdown(end, bForce);
	}, 1000);
}

var sDefaultStartDate = /* localStorage.getItem('lastStartDate') == null ?  */new Date(new Date('2024-04-22').setHours(19, 0, 0, 0))/*  : new Date(localStorage.getItem('lastStartDate')) */;
var session_count = 0;
function setDateEvent() {
	var monthsCount = countMonths(sDefaultStartDate);
	// console.log(monthsCount, sDefaultStartDate);
	// var monthsCount = 2;
	var bForce = undefined;
	var givenDate = new Date(sDefaultStartDate);
	var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
	sDefaultStartDate = new Date(new Intl.DateTimeFormat('en-US', options).format(givenDate));
	// console.log(sDefaultStartDate);
	
	var nextSessionDay = new Date();
	if (monthsCount) {
		for (let index = 0; index < monthsCount; index++) {
			var givenDate = new Date(sDefaultStartDate);
			var dateAfter28Days = addDaysToDate(givenDate, 28);
			sDefaultStartDate = new Date(new Intl.DateTimeFormat('en-US', options).format(dateAfter28Days));
		}
	}

	var currStartSession = new Date(sDefaultStartDate);
	var dStart = currStartSession.setDate(currStartSession.getDate() - (monthsCount * 14));
	// console.log(new Date(dStart), nextSessionDay);
	var savedSessionStartDate = new Date(new Date(dStart).setHours(19, 0, 0, 0));
	var dEnd = (new Date(dStart).setDate(new Date(dStart).getDate() + 18)); // calculate end date including weekends
	var savedSessionEndDate = new Date(new Date(dEnd).setHours(8, 0, 0, 0));
	savedStartSession = savedSessionStartDate;
	savedEndSession = savedSessionEndDate;
	savedCurrentDay = new Date(new Date(nextSessionDay).setHours(21, 0, 0, 0));
	sDefaultStartDate = new Date(new Date(sDefaultStartDate).setHours(19, 0, 0, 0));
	var sDefaultEndDate = new Date(new Date(sDefaultStartDate).setDate(new Date(sDefaultStartDate).getDate() + 18)); // calculate end date including weekends
	sDefaultEndDate = new Date(sDefaultEndDate.setHours(8, 0, 0, 0));
	var curSessionDate = new Date(sDefaultStartDate);

	while (curSessionDate <= savedCurrentDay) {
		var dayOfWeek = curSessionDate.getDay();
		if (dayOfWeek !== 6 && dayOfWeek !== 0) { // Exclude Saturday (6) and Sunday (0)
			session_count++;
		}
		curSessionDate.setDate(curSessionDate.getDate() + 1); // Move to the next day
	}
	// console.log(sDefaultStartDate, savedCurrentDay, session_count);

	console.log('Previous session start date:', savedSessionStartDate);
	console.log('Previous session end date:', savedSessionEndDate);
	console.log("Current day count:", session_count, "\nCurrent date:", nextSessionDay, "\nProgram ends:", savedCurrentDay);
	console.log('Next session start date:', sDefaultStartDate);
	/* if (localStorage.getItem('lastStartDate') == null) {
		localStorage.setItem('lastStartDate', sDefaultStartDate);
	} */
	console.log('Next session end date:', sDefaultEndDate);

	if (session_count >= 15) {
		// 14th session has passed, render new session dates
		if (nextSessionDay == savedSessionEndDate) {
			var d8Am = new Date(nextSessionDay).setHours(8, 0, 0, 0);
			// console.log(new Date(), new Date(d8Am));
			if (new Date() < new Date(d8Am)) {
				// mass baptist day at 8am
				document.getElementsByClassName("arial-fnt")[0].innerHTML = 'MASS BAPTISM';
				// document.getElementsByClassName("info-loc")[0].style.display = 'none';
				document.querySelector(".info-sess .sessions").style.display = 'none';
				document.querySelector(".info-sess .social-medias").style.display = 'none';
				document.querySelector(".daytime .weektime").innerHTML = '8 AM PHT';
				baptismDay = true;
			}
		}
	} else {
		if (session_count % 14 === 0) {
			// mass baptist day at 8am
			document.getElementsByClassName("arial-fnt")[0].innerHTML = 'MASS BAPTISM';
			// document.getElementsByClassName("info-loc")[0].style.display = 'none';
			document.querySelector(".info-sess .sessions").style.display = 'none';
			document.querySelector(".info-sess .social-medias").style.display = 'none';
			document.querySelector(".daytime .weektime").innerHTML = '8 AM PHT';
			baptismDay = true;
		}

		var isWeekend = nextSessionDay.getDay() === 6 || nextSessionDay.getDay() === 0;
		if (isWeekend) {
			// console.log(isWeekend);
			var tillNextMonday = 0;
			// Got to weekdays when next day is Saturday (6) or Sunday (0)
			do {
				nextSessionDay.setDate(nextSessionDay.getDate() + 1); // Move to the next day
				tillNextMonday++;
			} while (nextSessionDay.getDay() === 0 || nextSessionDay.getDay() === 6);
			// console.log(nextSessionDay);

			document.getElementById("session-day").innerHTML = '<strong>Day ' + (session_count + 1) + ', Tune-in Monday</strong>';
			if (notificationShown == false) {
				notificationShown = true;
				showNotification('Tune-in Monday', 'Watch via MCGI YouTube Channel', specificYoutubeChannel);
			}

			var formattedDate = formatDateToFJY(nextSessionDay);
			var dateTextContent = formattedDate;
			if (nextSessionDay.getMonth() != 4) {
				dateTextContent = addDotAfterThirdCharacter(formattedDate);
			}
			document.getElementsByClassName("date-value")[0].textContent = dateTextContent;
			var sWeekDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(nextSessionDay);
			document.getElementsByClassName('weekday')[0].textContent = sWeekDay;
			clearInterval(interval);
			startCountdown(nextSessionDay, true, (tillNextMonday > 0));
			return;
		} else {
			bForce = false;
		}
		// sDefaultStartDate = new Date(new Intl.DateTimeFormat('en-US', options).format(nextSessionDay));
	}
	// console.log(sDefaultStartDate);

	var start = new Date(sDefaultStartDate);
	var formattedDate = formatDateToFJY(start);
	// console.log(start, formattedDate);
	var dateTextContent = formattedDate;
	if (start.getMonth() != 4) {
		dateTextContent = addDotAfterThirdCharacter(formattedDate);
	}

	var now = new Date();
	var pass = now > start;
	if (pass) {
		var sWeekDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
		document.getElementsByClassName('weekday')[0].textContent = sWeekDay;
		var formattedDate = formatDateToFJY(now);
		var dateTextContent = formattedDate;
		if (start.getMonth() != 4) {
			dateTextContent = addDotAfterThirdCharacter(formattedDate);
		}
	}

	document.getElementsByClassName('date-value')[0].textContent = dateTextContent;
	startCountdown(sDefaultStartDate, bForce);
}

function reqNotification(title, body, redirectUrl) {
	Notification.requestPermission().then(function (permission) {
		if (permission === 'granted') {
			navigator.serviceWorker.getRegistrations().then(function (reg) {
				if (reg && reg.length) {
					for (var key in reg) {
						if (Object.hasOwnProperty.call(reg, key)) {
							var registration = reg[key];
							if (registration.scope == 'https://gacelabs.github.io/mcgi-mass-indoc-invite/props/js/') {
								var options = {
									body: body,
									icon: '/mcgi-mass-indoc-invite/props/images/logo.png',
									data: {
										redirectUrl: redirectUrl // Pass the redirect URL to the notification data
									}
								};
								registration.showNotification(title, options)
									.then(function () {
										console.warn('Notification displayed successfully');
									})
									.catch(function (error) {
										console.warn('Error displaying notification:', error);
										document.getElementsByClassName('errors')[0].innerHTML += error + '<br>';
									});
							}
						}
					}
				} else {
					console.warn('Service Worker registration not found');
					document.getElementsByClassName('errors')[0].innerHTML += 'Service Worker registration not found<br>';
				}
			}).catch(function (error) {
				console.error('Error getting Service Worker registration:', error);
				document.getElementsByClassName('errors')[0].innerHTML += error + '<br>';
			});
		} else {
			console.warn('Notification permission denied');
		}
	});
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
	navigator.serviceWorker.register('https://gacelabs.github.io/mcgi-mass-indoc-invite/props/js/service-worker.js')
		.then(function (registration) {
			console.log('Service Worker registered with scope:', registration.scope);
			setTimeout(() => {
				registration.update(); // Ensure the service worker is up to date
			}, 333);
		}).catch(function (error) {
			console.error('Service Worker registration failed:', error);
		});
}

function showNotification(title, body, redirectUrl) {
	if (baptismDay == false) {
		if (("Notification" in window) == false) {
			console.warn("This browser does not support desktop notification");
			return;
		}

		try {
			if (('serviceWorker' in navigator && 'PushManager' in window) && mobileCheck()) {
				reqNotification(title, body, redirectUrl);
			} else {
				var options = {
					body: body,
					icon: '/mcgi-mass-indoc-invite/props/images/logo.png'
				};
				// Check if the user has granted permission to show notifications
				if (Notification.permission === "granted") {
					// If permission is granted, create a notification
					var notification = new Notification(title, options);

					notification.onclick = function (event) {
						event.preventDefault(); // Prevent the browser from focusing the Notification's tab
						window.open(redirectUrl, '_blank');
						notification.close();
					};
				} else if (Notification.permission !== "denied") {
					// If permission has not been denied, request permission
					Notification.requestPermission().then(function (permission) {
						if (permission === "granted") {
							var notification = new Notification(title, options);

							notification.onclick = function (event) {
								event.preventDefault(); // Prevent the browser from focusing the Notification's tab
								window.open(redirectUrl, '_blank');
								notification.close();
							};
						}
					});
				} else {
					if (window.location.host.indexOf('local.') < 0) {
						console.warn('Notifications is off, allow it and reload the page.');
						alert('Notifications is off, allow it and reload the page.');
					} else {
						console.warn('Notifications not allowed for local environment.');
					}
				}
			}
		} catch (error) {
			console.warn(error);
			document.getElementsByClassName('errors')[0].innerHTML += error + '<br>';
			// alert(error);
		}
	}
}

function openInNewTab(ui) {
	if (ui) {
		if (mobileCheck()) {
			// console.log(ui.tagName, ui.textContent, ui.classList.value);
			var sPrepend = '';
			if (ui.classList.value == 'locale') sPrepend = 'MCGI ';
			var url = 'https://www.google.com/maps/dir/Your+location/' + encodeURIComponent(sPrepend + ui.textContent);
			window.open(url, '_blank').focus();
		} else {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'https://ipinfo.io/json', true);
			xhr.onload = function () {
				if (xhr.status >= 200 && xhr.status < 300) {
					var data = JSON.parse(xhr.responseText);
					var loc = data.loc.split(',');
					var latitude = loc[0], longitude = loc[1];

					var sPrepend = '';
					if (ui.classList.value == 'locale') {
						sPrepend = 'MCGI ';
					}
					// var url = `https://www.google.com/maps/dir/${latitude},${longitude}/` + encodeURIComponent(sPrepend + ui.textContent);
					var url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=` + encodeURIComponent(sPrepend + ui.textContent) + '&avoid=ferries';
					window.open(url, '_blank').focus();
				} else {
					console.warn('Error fetching coordinates:', xhr.statusText);
				}
			};
			xhr.onerror = function () {
				console.warn('Request failed!');
			};
			xhr.send();
		}
	}
}
