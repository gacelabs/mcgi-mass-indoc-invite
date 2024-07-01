var intervalCount;
var currentStartDate = localStorage.getItem('currentStartDate') == null ? new Date(new Date('2024-04-22').setHours(19, 0, 0, 0)) : new Date(localStorage.getItem('currentStartDate'));
var currentEndDate = null;
var sessionCount = 0, untilResetCount = 0;
var notificationStartSoon = false, baptismDate = false, onGoing = false;
var specificYoutubeChannel = 'https://m.youtube.com/@MCGIChannel';
var specificFacebookChannel = 'https://m.facebook.com/MCGI.org';
var sTuneIn = 'Tune-in tomorrow';
var setCurrentDateTime = function (sDate) {
	var now = new Date();
	var hours = now.getHours();
	var minutes = now.getMinutes();
	var seconds = now.getSeconds();
	sDate.setHours(hours);
	sDate.setMinutes(minutes);
	sDate.setSeconds(seconds);
	return sDate;
}

var todaysDate = new Date();

/* start of "for testing purposes" */
	/* this current date */
	// var todaysDate = setCurrentDateTime(new Date('2024-06-28'));
	// var todaysDate = setCurrentDateTime(new Date('2024-07-04'));
	/* program time adjustments */
	// todaysDate = new Date(new Date(todaysDate).setHours(22, 0, 0, 0));
/* end of "for testing purposes" */

var todaysProgramStart = new Date(new Date(todaysDate).setHours(19, 0, 0, 0));
var todaysProgramEnd = new Date(new Date(todaysDate).setHours(21, 0, 0, 0));
var nextProgramStart = new Date(new Date(todaysProgramStart).getTime() + 1 * 24 * 60 * 60 * 1000);
/* is morning? */
var isMorning = function (todaysDate) {
	return todaysDate.getTime() < todaysProgramStart.getTime();
}
/* program just started */
var isOngoing = function (todaysDate) {
	return todaysDate.getTime() >= todaysProgramStart.getTime() && todaysDate.getTime() <= todaysProgramEnd.getTime();
}

function setCurrentSessionCount() {
	sessionCount = 0;
	var thisDate = new Date(currentStartDate);
	while (thisDate <= todaysProgramStart) {
		var dayOfWeek = thisDate.getDay();
		if (dayOfWeek !== 6 && dayOfWeek !== 0) { // Exclude Saturday (6) and Sunday (0)
			sessionCount++;
		}
		thisDate.setDate(thisDate.getDate() + 1); // Move to the next day
	}
}

function setEventDateTimeSession(todaysDate) {
	setCurrentSessionCount();
	var formattedDate = formatDateToFJY(todaysDate);
	var dateTextContent = formattedDate;
	if (todaysDate.getMonth() != 4) {
		dateTextContent = addDotAfterThirdCharacter(formattedDate);
	}

	document.getElementsByClassName("date-value")[0].textContent = dateTextContent;
	var sWeekDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(todaysDate);
	document.getElementsByClassName('weekday')[0].textContent = sWeekDay;
}

function setMassBaptism() {
	document.getElementsByClassName("arial-fnt")[0].innerHTML = 'MASS BAPTISM';
	document.querySelector('address .locale').innerHTML = '<span class="locale-name">MCGI Chapel</span>';
	document.getElementsByClassName('locale-address')[0].textContent = '189 MacArthur Hwy, Apalit, 2016 Pampanga';
	document.querySelector(".info-sess .sessions").style.display = 'none';
	document.querySelector(".info-sess .social-medias").style.display = 'none';
	document.querySelector(".daytime .weektime").innerHTML = '8 AM PHT';
}

function nextSession(day) {
	if (day.getDay() === 6 || day.getDay() === 0) {
		// Got to weekdays when next day is Saturday (6) or Sunday (0)
		do {
			day.setDate(day.getDate() + 1); // Move to the next day
		} while (day.getDay() === 0 || day.getDay() === 6);
	}
	return day;
}

function setTuneInStatus(callBack) {
	var isWeekend = todaysDate.getDay() === 6 || todaysDate.getDay() === 0;
	onGoing = false;
	var dayCount = sessionCount;

	if (isOngoing(todaysDate)) {
		sTuneIn = 'Session on going...';
		onGoing = true;
	} else { /* not yet started */
		if (isMorning(todaysDate)) {
			if (sessionCount % 14 === 0) {
				sTuneIn = 'Last session tune-in tonight';
			} else if (sessionCount % 15 === 0) { /* last session day */
				sTuneIn = 'Doctrine Acceptance';
			} else {
				sTuneIn = 'Tune-in tonight';
			}
		} else { /* either weekends, fridays or weekday */
			if (sessionCount % 14 === 0) {
				todaysProgramStart = new Date(new Date(nextProgramStart).setHours(8, 0, 0, 0));
				todaysProgramEnd = new Date(new Date(nextProgramStart).setHours(12, 0, 0, 0));
				dayCount = dayCount + 1;
				setMassBaptism();
				sTuneIn += ' morning';
			} else {
				if (isWeekend || sessionCount % 5 === 0) { /* every weekends or fridays */
					sTuneIn = 'Tune-in Monday';
				}
				nextProgramStart = nextSession(new Date(nextProgramStart));
				todaysProgramStart = new Date(new Date(nextProgramStart).setHours(19, 0, 0, 0));
				todaysProgramEnd = new Date(new Date(nextProgramStart).setHours(21, 0, 0, 0));
			}

			console.clear();
			console.log("\nCurrent session start date:", currentStartDate, "\nCurrent session end date:", currentEndDate);
			console.log("\nCurrent session count:", sessionCount, "\nCurrent date:", todaysDate, "\n", "\nProgram starts:", todaysProgramStart, "\nProgram ends:", todaysProgramEnd, "\n\nTomorrow Program starts:", nextProgramStart);

			setEventDateTimeSession(nextProgramStart);
			clearInterval(intervalCount);
			intervalCount = setInterval(function () {
				updateEventCountdown();
			}, 1000);
		}
	}
	
	document.getElementById("session-day").innerHTML = '<strong>Day ' + dayCount + ', ' + sTuneIn + '</strong>';
	callBack();
}

function setSessionEvent() {
	var monthsCount = countMonths(currentStartDate);
	// console.log(currentStartDate);
	if (monthsCount > 0) {
		for (let index = 1; index < monthsCount; index++) {
			var givenDate = new Date(currentStartDate);
			var dateAfter28Days = addDaysToDate(givenDate, 28);
			currentStartDate = new Date(dateAfter28Days);
		}
		localStorage.setItem('currentStartDate', currentStartDate);
	}

	var dEnd = (new Date(currentStartDate).setDate(new Date(currentStartDate).getDate() + 18)); // calculate end date including weekends
	currentEndDate = new Date(new Date(dEnd).setHours(12, 0, 0, 0));
	// console.log(monthsCount, currentStartDate, currentEndDate, todaysDate);
	setEventDateTimeSession(todaysDate);

	if (sessionCount % 15 === 0) {
		// mass baptist day at 8am
		baptismDate = true;
		setMassBaptism();
		todaysProgramStart = new Date(new Date(todaysProgramStart).setHours(8, 0, 0, 0));
		todaysProgramEnd = new Date(new Date(todaysProgramEnd).setHours(12, 0, 0, 0));
		var givenDate = new Date(nextProgramStart);
		var dateAfter10Days = addDaysToDate(givenDate, 10);
		nextProgramStart = new Date(dateAfter10Days);
	} else {
		if (sessionCount % 14 === 0) {
			nextProgramStart = new Date(new Date(nextProgramStart).setHours(8, 0, 0, 0));
		}
		nextProgramStart = nextSession(new Date(nextProgramStart));
	}

	console.log("\nCurrent session start date:", currentStartDate, "\nCurrent session end date:", currentEndDate);
	console.log("\nCurrent session count:", sessionCount, "\nCurrent date:", todaysDate, "\n", "\nProgram starts:", todaysProgramStart, "\nProgram ends:", todaysProgramEnd, "\n\nTomorrow Program starts:", nextProgramStart);

	if (notificationStartSoon == false) {
		notificationStartSoon = true;
		if (baptismDate) {
			showNotification('Mass Baptism', 'Please contact MCGI thru this website', 'https://www.mcgi.org/reach-us/');
		} else {
			if (days == 0 && hours == 0) {
				showNotification('Starting soon - Standby', 'Watch via MCGI YouTube Channel', specificYoutubeChannel);
			} else {
				showNotification(sTuneIn, 'Watch via MCGI YouTube Channel', specificYoutubeChannel);
			}
		}
	}
	
	intervalCount = setInterval(function () {
		setTuneInStatus(function () {
			updateEventCountdown();
		});
	}, 1000);
}

function updateEventCountdown() {
	todaysDate = setCurrentDateTime(todaysDate);
	var now = new Date(todaysDate).getTime();
	var distance = todaysProgramStart.getTime() - now;
	// console.log(distance, new Date(now), start);

	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	
	if (onGoing == false) {
		if (days != 0 || hours != 0 || minutes != 0 || seconds != 0) {
			document.getElementById("countdown").innerHTML =
				`<div class="countdown-segment"><span class="countdown-label">Days</span><span class="countdown-number days">${days}</span></div>` +
				`<div class="countdown-segment"><span class="countdown-label">Hours</span><span class="countdown-number hours">${hours}</span></div>` +
				`<div class="countdown-segment"><span class="countdown-label">Minutes</span><span class="countdown-number">${minutes}</span></div>` +
				`<div class="countdown-segment"><span class="countdown-label">Seconds</span><span class="countdown-number">${seconds}</span></div>` +
				`<div style="margin-top: -10px;"><span class="countdown-label">To go</span></div>`;
		}
	}

	// console.log(untilResetCount);
	untilResetCount++;
	if (untilResetCount == 60) {
		console.info('reset ram every 60 seconds');
		untilResetCount = 0;
		clearInterval(intervalCount);
		intervalCount = setInterval(function () {
			setTuneInStatus(function () {
				updateEventCountdown();
			});
		}, 1000);
	}
}