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

window.mobileCheck = function () {
	let check = false;
	(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};