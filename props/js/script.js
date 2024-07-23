var intervalCount;

var currentStartDate = localStorage.getItem('currentStartDate') == null ? new Date(new Date('2024-04-22').setHours(19, 0, 0, 0)) : new Date(localStorage.getItem('currentStartDate'));
var currentEndDate = null;

var sessionCount = 0, lastSessionCount = 0, untilResetCount = 0, days = 0, hours = 0, minutes = 0, seconds = 0;
var notificationStartSoon = false, baptismDate = false, onGoing = false, startingIn = false, consoleLogShown = false, isTest = false;

var specificYoutubeChannel = mobileCheck() ? 'https://m.youtube.com/@MCGIChannel' : 'https://www.youtube.com/@MCGIChannel';
var specificFacebookChannel = mobileCheck() ? 'https://m.facebook.com/MCGI.org' : 'https://www.facebook.com/MCGI.org';
var sTuneIn = '';
var countdownUI = document.querySelectorAll("#countdown");

var setCurrentDateTime = function (sDate) {
	if (isTest) {
		var now = new Date(sDate);
	} else {
		var now = new Date();
	}
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
	// var todaysDate = setCurrentDateTime(new Date('2024-07-22')); isTest = true;
	// todaysDate = new Date(new Date(todaysDate).setHours(21, 16, 0, 0));
/* end of "for testing purposes" */

var todaysProgramStart = nextMondaySession(new Date(new Date(todaysDate).setHours(19, 0, 0, 0)));
var todaysProgramEnd = new Date(new Date(todaysProgramStart).setHours(21, 15, 0, 0));
var nextProgramStart = nextMondaySession(new Date(addDaysToDate(todaysProgramStart, 1)));

/* is morning? */
var isMorning = function (now) {
	var currHr = new Intl.DateTimeFormat('en-US', { hour: "numeric", hour12: false, timeZone: 'Asia/Manila' }).format(now);
	return now.getTime() < todaysProgramStart.getTime() && parseInt(currHr) >= 0 && parseInt(currHr) <= 17;
}
/* program just started */
var isOngoing = function (now) {
	var currHr = new Intl.DateTimeFormat('en-US', { hour: "numeric", hour12: false, timeZone: 'Asia/Manila' }).format(now);
	if (baptismDate) {
		return now.getTime() >= todaysProgramStart.getTime() && now.getTime() <= todaysProgramEnd.getTime() && (parseInt(currHr) >= 8 && parseInt(currHr) <= 12);
	} else {
		return now.getTime() >= todaysProgramStart.getTime() && now.getTime() <= todaysProgramEnd.getTime() && (parseInt(currHr) >= 19 && parseInt(currHr) <= 21);
	}
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
	lastSessionCount = sessionCount;
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

function nextMondaySession(day) {
	if (day.getDay() === 6 || day.getDay() === 0) {
		do {
			// Got to weekdays when next day is Saturday (6) or Sunday (0)
			day.setDate(day.getDate() + 1); // Move to the next day
		} while (day.getDay() === 0 || day.getDay() === 6);
	}
	return day;
}

function setTuneInStatus(fnCallBack) {
	onGoing = false;
	startingIn = false;
	var now = setCurrentDateTime(todaysDate);
	var currHr = new Intl.DateTimeFormat('en-US', { hour: "numeric", hour12: false, timeZone: 'Asia/Manila' }).format(now);
	if (parseInt(currHr) === 0) { /* when its midnight change the todaysDate value */
		todaysDate = setCurrentDateTime(todaysDate);
		now = setCurrentDateTime(todaysDate);
	}

	if (isOngoing(now)) { /* program still playing */
		sTuneIn = 'Session on going...';
		onGoing = true;
	} else { /* program not yet started or just ended */
		if (isMorning(now)) {
			sTuneIn = 'Tune-in tonight';
			if (sessionCount === 14) {
				sTuneIn = 'Last session tune-in tonight';
			} else if (sessionCount === 15) {
				sTuneIn = 'Doctrine acceptance today';
			}
		} else { /* evening */
			sTuneIn = 'Tune-in tomorrow';
			if (sessionCount === 14) {
				sTuneIn = 'Last session tune-in tomorrow';
			} else if (sessionCount === 15) {
				sTuneIn = 'Doctrine acceptance tomorrow';
			}
		}
		
		var whenProgramEnds = new Date(new Date(todaysProgramStart).setHours(21, 15, 0, 0));
		if (days == 0 && (hours >= 0 && hours <= 3) && now < whenProgramEnds && (formatDateToFJY(now) === formatDateToFJY(todaysProgramStart))) {
			// console.log(days, hours);
			sTuneIn = 'Starting in...';
			startingIn = true;
		} else {
			var isWeekend = now.getDay() === 6 || now.getDay() === 0;
			/* override when every weekends or fridays */
			if ((isWeekend || now.getDay() === 5) && ![1, 15].includes(sessionCount)) {
				// console.log(now, whenProgramEnds, now.getDay());
				if (now < whenProgramEnds) {
					var sWeekDay = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'Asia/Manila' }).format(todaysProgramStart);
					sTuneIn = 'Tune-in ' + sWeekDay;
				}
			} else if (sessionCount == 1) {
				/* override with the day 1 session */
				sTuneIn = 'Will start in...';
			}
		}
		countdownUI[0].style.display = 'block';
	}
	if (sTuneIn.length) {
		document.getElementById("session-day").innerHTML = '<strong>Day ' + sessionCount + ', ' + sTuneIn + '</strong>';
	}
	if (typeof fnCallBack == 'function') fnCallBack();
}

function setSessionEvent() {
	var monthsCount = countMonths(currentStartDate, todaysDate);
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
	// console.log(todaysDate, currentStartDate, currentEndDate, nextProgramStart);
	if (todaysDate > currentEndDate) {
		/* this means current event was finished */
		sessionCount = 0;
		var givenDate = new Date(currentEndDate);
		var dateAfter10Days = addDaysToDate(givenDate, 10);
		nextProgramStart = new Date(new Date(dateAfter10Days).setHours(19, 0, 0, 0));

		currentStartDate = nextProgramStart;
		localStorage.setItem('currentStartDate', currentStartDate);

		var dateAfter18Days = addDaysToDate(nextProgramStart, 18);
		currentEndDate = new Date(dateAfter18Days.setHours(12, 0, 0, 0));

		todaysProgramStart = currentStartDate;
		todaysProgramEnd = new Date(new Date(todaysProgramStart).setHours(21, 15, 0, 0));
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
		/* set day status */
		setTuneInStatus();
	}, 1000);
}

function updateEventCountdown() {
	var now = new Date(setCurrentDateTime(todaysDate));
	var distance = todaysProgramStart.getTime() - now.getTime();
	if (distance <= 0 && !isOngoing(now)) { /* this means program ended */
		if (sessionCount <= 14) sessionCount++;
		todaysProgramStart = nextMondaySession(new Date(addDaysToDate(todaysDate, 1)));
		/* if someone change the todaysDate in console and its greater than currentEndDate set todaysDate to currentEndDate instead */
		if (todaysProgramStart > currentEndDate) {
			todaysProgramStart = new Date(new Date(todaysProgramStart).setHours(19, 0, 0, 0));
			todaysProgramEnd = new Date(new Date(todaysProgramStart).setHours(21, 15, 0, 0));
			sessionCount = lastSessionCount;
		}
		// console.log([14, 15].includes(sessionCount), sessionCount);
		if ([14, 15].includes(sessionCount)) {
			todaysProgramStart = new Date(new Date(todaysProgramStart).setHours(8, 0, 0, 0));
			todaysProgramEnd = new Date(new Date(todaysProgramStart).setHours(12, 0, 0, 0));
			if (sessionCount === 15 && baptismDate == false) {
				baptismDate = true;
				setMassBaptism();
			}
		} else {
			todaysProgramStart = new Date(new Date(todaysProgramStart).setHours(19, 0, 0, 0));
			todaysProgramEnd = new Date(new Date(todaysProgramStart).setHours(21, 15, 0, 0));
		}
		nextProgramStart = nextMondaySession(new Date(addDaysToDate(todaysProgramStart, 1)));
		setEventDateTimeSession(todaysProgramStart);
		logEventDetails();
		// console.log(distance, new Date(now));
	}

	days = Math.floor(distance / (1000 * 60 * 60 * 24));
	hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	seconds = Math.floor((distance % (1000 * 60)) / 1000);

	// console.log(onGoing);
	if (days > 0 || hours > 0 || minutes > 0 || seconds > 0) {
		countdownUI[0].innerHTML =
			`<div class="countdown-segment"><span class="countdown-label">Days</span><span class="countdown-number days">${days}</span></div>` +
			`<div class="countdown-segment"><span class="countdown-label">Hours</span><span class="countdown-number hours">${hours}</span></div>` +
			`<div class="countdown-segment"><span class="countdown-label">Minutes</span><span class="countdown-number">${minutes}</span></div>` +
			`<div class="countdown-segment"><span class="countdown-label">Seconds</span><span class="countdown-number">${seconds}</span></div>`;
		if (onGoing) {
			countdownUI[0].style.display = 'none';
		} else if (sessionCount > 1 && startingIn == false) {
			countdownUI[0].innerHTML += `<div style="margin-top: -10px;"><span class="countdown-label">To go</span></div>`;
		}
	}

	if (notificationStartSoon == false) {
		notificationStartSoon = true;
		if (baptismDate) {
			showNotification('Mass Baptism', 'Please contact MCGI thru this website', 'https://www.mcgi.org/reach-us/');
		} else {
			if (days == 0 && hours == 0) {
				showNotification('Starting soon - Standby', 'Watch via MCGI YouTube Channel', specificYoutubeChannel);
			} else {
				if (sessionCount !== 1) {
					if (startingIn == false) {
						showNotification(sTuneIn, 'Watch via MCGI YouTube Channel', specificYoutubeChannel);
					} else {
						notificationStartSoon = false;
					}
				} else {
					if (days >= 1) {
						showNotification(sTuneIn + ' ' + days + ' day' + (days > 1 ? 's' : ''), 'Visit their YouTube Channel', specificYoutubeChannel);
					} else if (hours >= 1) {
						showNotification(sTuneIn + ' ' + hours + ' hour' + (hours > 1 ? 's' : ''), 'Watch via MCGI YouTube Channel', specificYoutubeChannel);
					}
				}
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
			updateEventCountdown();
			/* set day status */
			setTuneInStatus();
		}, 1000);
	}
}
