var intervalCount;
var currentStartDate = localStorage.getItem('currentStartDate') == null ? new Date(new Date('2024-04-22').setHours(19, 0, 0, 0)) : new Date(localStorage.getItem('currentStartDate'));
var currentEndDate = null;
var sessionCount = 0, untilResetCount = 0, days = 0, hours = 0, minutes = 0, seconds;
var notificationStartSoon = false, baptismDate = false, onGoing = false, consoleLogShown = false;
var specificYoutubeChannel = 'https://m.youtube.com/@MCGIChannel';
var specificFacebookChannel = 'https://m.facebook.com/MCGI.org';
var sTuneIn = 'Tune-in tomorrow';
var setCurrentDateTime = function (sDate) {
	var now = new Date();
	var hours = now.getHours();
	var minutes = now.getMinutes();
	var seconds = now.getSeconds();
	var dDate = new Date(sDate);
	dDate.setHours(hours);
	dDate.setMinutes(minutes);
	dDate.setSeconds(seconds);
	return dDate;
}

var todaysDate = new Date();

/* start of "for testing purposes" */
	/* this current date */
	// var todaysDate = setCurrentDateTime(new Date('2024-06-28'));
	// var todaysDate = setCurrentDateTime(new Date('2024-07-15'));
	/* program time adjustments */
	// todaysDate = new Date(new Date(todaysDate).setHours(18, 0, 0, 0));
/* end of "for testing purposes" */

var todaysProgramStart = new Date(new Date(todaysDate).setHours(19, 0, 0, 0));
var todaysProgramEnd = new Date(new Date(todaysDate).setHours(21, 0, 0, 0));
var nextProgramStart = new Date(addDaysToDate(todaysProgramStart, 1));
/* is morning? */
var isMorning = function (todaysDate) {
	var currHr = new Intl.DateTimeFormat('en-US', { hour12: true, hour: "numeric", timeZone: 'Asia/Manila' }).format(todaysDate);
	return todaysDate.getTime() < todaysProgramStart.getTime() && currHr.indexOf('AM') >= 0;
}
/* program just started */
var isOngoing = function (todaysDate) {
	return todaysDate.getTime() >= todaysProgramStart.getTime() && todaysDate.getTime() <= todaysProgramEnd.getTime();
}

function logEventDetails(bClear) {
	if (bClear == undefined) bClear = true;
	if (bClear) console.clear();
	console.log("\nCurrent session start date:", currentStartDate, "\nCurrent session end date:", currentEndDate);
	console.log("\nCurrent session count:", sessionCount, "\nCurrent date:", todaysDate, "\n", "\nProgram starts:", todaysProgramStart, "\nProgram ends:", todaysProgramEnd, "\n\nNext Program starts:", nextProgramStart);
}

function setCurrentSessionCount() {
	var thisDate = new Date(currentStartDate);
	// console.log(thisDate, todaysProgramStart);
	while (thisDate <= todaysProgramStart) {
		var dayOfWeek = thisDate.getDay();
		if (dayOfWeek !== 6 && dayOfWeek !== 0) { // Exclude Saturday (6) and Sunday (0)
			sessionCount++;
		}
		thisDate.setDate(thisDate.getDate() + 1); // Move to the next day
	}
	if (sessionCount == 0) sessionCount = 1;
}

function setEventDateTimeSession(todaysDate) {
	var formattedDate = formatDateToFJY(todaysDate);
	var dateTextContent = formattedDate;
	if (todaysDate.getMonth() != 4) {
		dateTextContent = addDotAfterThirdCharacter(formattedDate);
	}

	document.getElementsByClassName("date-value")[0].textContent = dateTextContent;
	var sWeekDay = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Asia/Manila' }).format(todaysProgramStart);
	document.getElementsByClassName('weekday')[0].textContent = sWeekDay;
	var sDayTime = new Intl.DateTimeFormat('en-US', { hour12: true, hour: "numeric", timeZone: 'Asia/Manila' }).format(todaysProgramStart);
	document.querySelector(".daytime .weektime").innerHTML = sDayTime + ' PHT';
}

function setMassBaptism() {
	document.getElementsByClassName("arial-fnt")[0].innerHTML = 'MASS BAPTISM';
	document.querySelector('address .locale').innerHTML = '<span class="locale-name">MCGI Chapel</span>';
	document.getElementsByClassName('locale-address')[0].textContent = '189 MacArthur Hwy, Apalit, 2016 Pampanga';
	document.querySelector(".info-sess .sessions").style.display = 'none';
	document.querySelector(".info-sess .social-medias").style.display = 'none';
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

function setTuneInStatus(fnCallBack) {
	var isWeekend = todaysDate.getDay() === 6 || todaysDate.getDay() === 0;
	onGoing = false;

	if (isOngoing(todaysDate)) { /* program still playing */
		sTuneIn = 'Session on going...';
		onGoing = true;
	} else { /* program not yet started or just ended */
		if (isMorning(todaysDate)) {
			sTuneIn = 'Tune-in tonight';
			if (sessionCount % 14 === 0) {
				sTuneIn = 'Last session tune-in tonight';
			} else if (sessionCount % 15 === 0) {
				sTuneIn = 'Doctrine acceptance';
			}
		} else {
			if (days == 0 && hours >= 1 && hours <= 3) {
				sTuneIn = 'Tune-in later';
			} else {
				if (sessionCount % 14 === 0) {
					sTuneIn = 'Last session tune-in tomorrow';
				} else if (sessionCount % 15 === 0) {
					sTuneIn = 'Doctrine acceptance tomorrow';
				}
			}
		}
		/* override all when every weekends or fridays & the day 1 session */
		if (isWeekend || sessionCount % 5 === 0) {
			sTuneIn = 'Tune-in Monday';
		} else if (sessionCount == 1) {
			if (days == 0 && hours >= 1 && hours <= 3) {
				sTuneIn = 'Tune-in later';
			} else {
				var sWeekDay = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Asia/Manila' }).format(todaysProgramStart);
				sTuneIn = 'Starting on ' + sWeekDay;
			}
		}
	}

	document.getElementById("session-day").innerHTML = '<strong>Day ' + sessionCount + ', ' + sTuneIn + '</strong>';
	if (typeof fnCallBack == 'function') fnCallBack();
}

function setSessionEvent() {
	var monthsCount = countMonths(currentStartDate);
	if (monthsCount > 0) {
		for (let index = 0; index < monthsCount; index++) {
			var givenDate = new Date(currentStartDate);
			var dateAfter28Days = addDaysToDate(givenDate, 28);
			currentStartDate = new Date(dateAfter28Days);
		}
	}
	// console.log(monthsCount, currentStartDate, todaysDate);
	if (currentStartDate > todaysDate) {
		/* this means current event not yet finish */
		var givenDate = new Date(currentStartDate);
		var dateBefore28Days = addDaysToDate(givenDate, 28, true);
		currentStartDate = new Date(dateBefore28Days);
	}
	localStorage.setItem('currentStartDate', currentStartDate);
	
	var dEnd = new Date(currentStartDate).setDate(new Date(currentStartDate).getDate() + 18); /* calculate end date including weekends */
	currentEndDate = new Date(new Date(dEnd).setHours(12, 0, 0, 0));

	if (todaysDate > currentEndDate) {
		/* this means current event has finish */
		sessionCount = 0;
		var givenDate = new Date(currentEndDate);
		var dateAfter10Days = addDaysToDate(givenDate, 10);
		nextProgramStart = new Date(new Date(dateAfter10Days).setHours(19, 0, 0, 0));

		currentStartDate = nextProgramStart;
		localStorage.setItem('currentStartDate', currentStartDate);

		var dateAfter18Days = addDaysToDate(nextProgramStart, 18);
		currentEndDate = new Date(dateAfter18Days.setHours(12, 0, 0, 0));

		todaysProgramStart = new Date(new Date(nextProgramStart).setHours(19, 0, 0, 0));
		todaysProgramEnd = new Date(new Date(todaysProgramStart).setHours(21, 0, 0, 0));
	}

	setCurrentSessionCount();
	if (sessionCount === 15) {
		setMassBaptism();
		baptismDate = true;
		todaysProgramStart = new Date(new Date(todaysProgramStart).setHours(8, 0, 0, 0));
		todaysProgramEnd = new Date(new Date(todaysProgramStart).setHours(12, 0, 0, 0));
	}
	
	setEventDateTimeSession(todaysProgramStart);
	logEventDetails(false);

	intervalCount = setInterval(function () {
		updateEventCountdown();
	}, 1000);
}

function updateEventCountdown() {
	var now = new Date(setCurrentDateTime(todaysDate)).getTime();
	var distance = todaysProgramStart.getTime() - now;
	if (distance < 0) { /* this means program ended */
		todaysProgramStart = nextProgramStart;
		if ([14, 15].includes(sessionCount)) {
			todaysProgramStart = new Date(new Date(todaysProgramStart).setHours(8, 0, 0, 0));
			todaysProgramEnd = new Date(new Date(todaysProgramStart).setHours(12, 0, 0, 0));
		} else {
			todaysProgramStart = new Date(new Date(todaysProgramStart).setHours(19, 0, 0, 0));
			todaysProgramEnd = new Date(new Date(todaysProgramStart).setHours(21, 0, 0, 0));
		}
		nextProgramStart = nextSession(todaysProgramStart);
		if (sessionCount <= 14) {
			sessionCount++;
		} else {
			sessionCount = 1;
		}
		setEventDateTimeSession(todaysProgramStart);
		logEventDetails();
		// console.log(distance, new Date(now));
	}

	days = Math.floor(distance / (1000 * 60 * 60 * 24));
	hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	seconds = Math.floor((distance % (1000 * 60)) / 1000);
	
	// console.log(onGoing);
	if (onGoing === false) {
		if (days > 0 || hours > 0 || minutes > 0 || seconds > 0) {
			document.getElementById("countdown").innerHTML =
				`<div class="countdown-segment"><span class="countdown-label">Days</span><span class="countdown-number days">${days}</span></div>` +
				`<div class="countdown-segment"><span class="countdown-label">Hours</span><span class="countdown-number hours">${hours}</span></div>` +
				`<div class="countdown-segment"><span class="countdown-label">Minutes</span><span class="countdown-number">${minutes}</span></div>` +
				`<div class="countdown-segment"><span class="countdown-label">Seconds</span><span class="countdown-number">${seconds}</span></div>` +
				`<div style="margin-top: -10px;"><span class="countdown-label">To go</span></div>`;
		}
	}

	setTuneInStatus();
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

	// console.log(untilResetCount);
	untilResetCount++;
	if (untilResetCount == 60) {
		// console.info('reset ram every 60 seconds');
		untilResetCount = 0;
		clearInterval(intervalCount);
		intervalCount = setInterval(function () {
			setTuneInStatus(function () {
				updateEventCountdown();
			});
		}, 1000);
	}
}