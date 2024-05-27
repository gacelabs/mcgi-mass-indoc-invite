
window.addEventListener('DOMContentLoaded', setDateEvent);

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
	var count = 0;
	var currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		var dayOfWeek = currentDate.getDay();
		if (dayOfWeek !== 6 && dayOfWeek !== 0) { // Exclude Saturday (6) and Sunday (0)
			count++;
		}
		currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
	}

	// document.getElementById("session-day").innerHTML = '<strong>' + getDaySuffix(count) + ' Session, Started ' + formatDateToFJY(startDate) + '</strong>';
	if (bEnded) {
		document.getElementById("session-day").innerHTML = '<strong>Day ' + (count + 1) + ', Tune-in tomorrow</strong>';
		var nextDay = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);
		var formattedDate = formatDateToFJY(nextDay);
		var dateTextContent = addDotAfterThirdCharacter(formattedDate);
		document.getElementsByClassName("date-value")[0].textContent = dateTextContent;
		document.getElementsByClassName('weekday')[0].textContent = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(nextDay);
		startCountdown(nextDay, true);
	} else {
		document.getElementById("session-day").innerHTML = '<strong>Day ' + count + ', Started ' + formatDateToFJY(startDate) + '</strong>';
	}
}

function addDaysToDate(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

function formatDateToFJY(date) {
	var options = { month: 'short', day: 'numeric', year: 'numeric'/* , weekday: 'long' */ };
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

var notificationShown = false;
function startCountdown(startDate, bForce) {
	var now = new Date();
	var start = new Date(startDate);
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
		end.setHours(19, 0, 0, 0);
	} else {
		// If the start date is in the past or today, set the countdown to 8 days from the start date
		end = new Date(start.getTime() + 8 * 24 * 60 * 60 * 1000); // Add 8 days to start date
	}

	function updateCountdown(end) {
		var now = new Date().getTime();
		var distance = end - now;

		if (distance < 0) {
			// console.log(new Date(now), now, end.getTime(), end);
			if (now < end.getTime()) {
				getDayCount(start, end);
				document.getElementById("countdown").innerHTML = "On going";
				clearInterval(interval);
			} else {
				getDayCount(start, end, true);
			}
			if (notificationShown == false) {
				notificationShown = true;
				showNotification('Session started', 'Watch via MCGI YouTube Channel', 'https://www.youtube.com/@MCGIChannel');
			}
			return;
		}

		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		if (pass || bForce) {
			if (hours != 0 || minutes != 0 || seconds != 0) {
				if (bForce == undefined) {
					getDayCount(start, end);
				}
				document.getElementById("countdown").innerHTML =
					`<div class="countdown-segment"><span class="countdown-label">Hours</span><span class="countdown-number">${hours}</span></div>` +
					`<div class="countdown-segment"><span class="countdown-label">Minutes</span><span class="countdown-number">${minutes}</span></div>` +
					`<div class="countdown-segment"><span class="countdown-label">Seconds</span><span class="countdown-number">${seconds}</span></div>` +
					`<div style="margin-top: -10px;"><span class="countdown-label">Hour(s) to go</span></div>`;
			}
		} else {
			if (days != 0 || hours != 0 || minutes != 0 || seconds != 0) {
				document.getElementById("countdown").innerHTML =
					`<div class="countdown-segment"><span class="countdown-label">Days</span><span class="countdown-number">${days}</span></div>` +
					`<div class="countdown-segment"><span class="countdown-label">Hours</span><span class="countdown-number">${hours}</span></div>` +
					`<div class="countdown-segment"><span class="countdown-label">Minutes</span><span class="countdown-number">${minutes}</span></div>` +
					`<div class="countdown-segment"><span class="countdown-label">Seconds</span><span class="countdown-number">${seconds}</span></div>` +
					`<div style="margin-top: -10px;"><span class="countdown-label">Day(s) to go</span></div>`;
			}
		}
		// console.log(cnt);
		cnt++;

		if (cnt == 59) {
			// console.info('reset ram every 60 seconds');
			cnt = 0;
			clearInterval(interval);
			interval = setInterval(function () {
				updateCountdown(end);
			}, 1000);
		}
	}

	// updateCountdown();
	var interval = setInterval(function () {
		updateCountdown(end);
	}, 1000);
}

function setDateEvent() {
	var sStringData = '05/20/2024';
	var monthsCount = countMonths(sStringData);
	// var monthsCount = 2;
	var givenDate = new Date(sStringData);
	var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
	sStringData = new Intl.DateTimeFormat('en-US', options).format(givenDate);
	// console.log(sStringData);

	if (monthsCount) {
		for (let index = 0; index < monthsCount; index++) {
			var givenDate = new Date(sStringData);
			var dateAfter28Days = addDaysToDate(givenDate, 28);
			sStringData = new Intl.DateTimeFormat('en-US', options).format(dateAfter28Days);
		}
	}
	var start = new Date(sStringData);
	var formattedDate = formatDateToFJY(start);
	// console.log(start, formattedDate);
	var dateTextContent = formattedDate;
	if (start.getMonth() != 4) {
		dateTextContent = addDotAfterThirdCharacter(formattedDate);
	}

	var now = new Date();
	var pass = now > start;
	if (pass) {
		document.getElementsByClassName('weekday')[0].textContent = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
		var formattedDate = formatDateToFJY(now);
		var dateTextContent = formattedDate;
		if (start.getMonth() != 4) {
			dateTextContent = addDotAfterThirdCharacter(formattedDate);
		}
	}

	document.getElementsByClassName('date-value')[0].textContent = dateTextContent;
	startCountdown(sStringData);
}

function showNotification(title, body, redirectUrl) {
	if (("Notification" in window) == false) {
		console.error("This browser does not support desktop notification");
		return;
	}

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
		console.error('Cannot accept Notifications, site must be secured and on HTTPS protocol.');
	}
}