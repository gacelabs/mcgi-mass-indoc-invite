function addDaysToDate(date, days, minus) {
	var result = new Date(date);
	if (minus) {
		result.setDate(result.getDate() - days);
	} else {
		result.setDate(result.getDate() + days);
	}
	return result;
}

function formatDateToFJY(date) {
	var options = { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Manila' };
	return new Intl.DateTimeFormat('en-US', options).format(date);
}

function countMonths(startDate) {
	var today = new Date(new Date().setHours(19, 0, 0, 0));
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
	if (baptismDate == false) {
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