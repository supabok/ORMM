/*global window, document, ormma, console	 */

/**
 * @fileOverview This sample file demonstrates a functional style usage of
 *  the ORMMA JavaScript SDK. 
 *  All Level One methods are exercised.
 *
 * @author <a href='mailto:nathan.carver@crispmedia.com'>Nathan Carver</a>
 * @version 1.0.1
 */


/* 
================================================================
DEBUGGING METHODS TO HELP WITH UNDERSTANDING AND TROUBLESHOOTING
================================================================
*/

/**
* helper function to output debugging data to the console
*
* @param {String} msg text to output
*/
function logit(msg) {
	if (typeof (console) !== 'undefined') {
		console.log((new Date()).getTime() + '-' + msg);
	}
}

/**
* helper function to generate output for all events
*
* @param {Event} evt event to get information on
*/
function reportEvent(evt) {
	var msg = 'Event fired: ' + evt;
	logit(msg);
}

/**
* stub function to highlight when ORMMA is not found
*/
function ORMMANotFound() {
	logit('ORMMA not found');
}


/*
==============================================
ORMMA-SPECIFIC METHODS FOR IN-APP PRESENTATION
==============================================
*/

/**
* called by confirmShow
* simply resizes the ad to test the ORMMA resize methods
* ad is returned to default size
*
* @see confirmShow
* @requires ormma
*/
function testOrmmaResize() {
	// get the properties needed
	var size = ormma.getSize(),
		maxSize = ormma.getMaxSize();
	
	// resize to the same size, same properties
	ormma.addEventListener('sizeChange', function () {
		logit('ad is resized by 1 pixel');
		ormma.removeEventListener('sizeChange');

	// resize to maximum size
		ormma.addEventListener('sizeChange', function () {
			logit('ad is max sized');
			ormma.removeEventListener('sizeChange');

	// back to normal
			logit('reverting to starting size');		
			ormma.resize(size.width, size.height);
		});
		ormma.resize(maxSize.width, maxSize.height);
	});
	ormma.resize(size.width-1, size.height-1);
}

/**
* triggered by ORMMAReady, clean-up after ad is shown
* starts exercizing the ormma.resize methods
*
* @see ORMMAReady
* @requires ormma
*/
function confirmShow() {
	ormma.removeEventListener('stateChange', confirmShow);
	logit('ad is no longer hidden');
	
	testOrmmaResize();

}

/**
* called by expand, calls the ormma.expand method
* 
* @see expand
* @requires ormma
* @returns {Boolean} false - so click event can stop propogating
*/
function ormmaExpand() {
	if (!window.ormmaAvail) return (false);	

	var props = ormma.getExpandProperties(),
		pos = ormma.getDefaultPosition();
		
	ormma.setExpandProperties(props);
	ormma.addEventListener('stateChange', function () {
		logit('ad is expanded');
		ormma.removeEventListener('stateChange');
	});
	ormma.expand({'x' : pos.x, 'y' : pos.y, 'width' : 300, 'height' : 300}, null);
	return (false);
}

/**
* called by collapse, calls the ormma.close method
*
* @see collapse
* @requires ormma
* @returns {Boolean} false - so click event can stop propogating
*/
function ormmaClose() {
	if (!window.ormmaAvail) return (false);	

	ormma.addEventListener('stateChange', function () {
		logit('ad is no longer expanded');
		ormma.removeEventListener('stateChange');
	});
	ormma.close();
	return (false);
}

/**
* called by hide, calls the ormma.hide method
* 
* @see hide
* @requires ormma
* @returns {Boolean} false - so click event can stop propogating
*/
function ormmaHide() {

	if (!window.ormmaAvail) return (false);

	ormma.addEventListener('stateChange', function () {
		logit('ad is hidden');
		ormma.removeEventListener('stateChange');	
	});
	ormma.hide();
	return (false);
}

/**
* called by open, calls the ormma.open method
*
* @see open 
* @requires ormma
* @returns {Boolean} false - so click event can stop propogating
*/
function ormmaOpen(url) {
	if (!window.ormmaAvail) return (true);
	
	ormma.open(url);
	return (false);
}


/*
================================
PRIMARY ENTRY POINT: ORMMA READY
================================
*/


/**
* ORMMAReady called by the SDK, initializes the ORMMA
*  event listeners and exercises other level1 properties
*  Sets global 'ormmaAvail' to true
*
* @requires ormma
*
*/
window.ormmaAvail = false;
function ORMMAReady(evt) {
	try {
		//clear any timers that have been waiting for ORMMA
		window.clearTimeout(window.ormmaWaitId);
		window.ormmaAvail = true;
	
		//show ormma confirmation to user
		document.getElementById('ormma').style.display = 'block';
		logit('ORMMA found');
	
		//check that all expected Level1 methods are available		
		var ormmaMethods = ['getSize','getMaxSize','getState','getDefaultPosition','getExpandProperties','setExpandProperties','supports','addEventListener','removeEventListener','resize','expand','open','show','close','hide'];
		var hasOrmmaMethods = [];
		for (var i = 0; i < ormmaMethods.length; i++) {
			ormmaMethod = ormmaMethods[i];
			hasOrmmaMethods[ormmaMethod] = (typeof(ormma[ormmaMethod]) === 'function');
			if (!hasOrmmaMethods[ormmaMethod]) logit ('method ' + ormmaMethod + ' not found');
		}
	
		//register the event listeners
		ormma.addEventListener('error', reportEvent);
		ormma.addEventListener('sizeChange', reportEvent);
		ormma.addEventListener('stateChange', reportEvent);
	
		//load all the level1 properties - some are unused in this example
		var screenSize = ormma.getSize(),
			maxAdSize = ormma.getMaxSize(),
			myState = ormma.getState(),
			myPosition = ormma.getDefaultPosition(),
			expandProps = ormma.getExpandProperties(),
			supportsTilt = ormma.supports('tilt');
	
		//show the ad if originally loaded by developer as hidden
		if (myState === 'hidden') {
		} else {
			ormma.hide();
		}
		ormma.addEventListener('stateChange', confirmShow);
		ormma.show(); //side-effect will exercise ormma.resize methods
		
		//identify if ormma container supports tilt
		if (supportsTilt) {
			logit('ad supports tilt');
		}
	} catch (e) {
		logit('ORMMA found, but errors encountered in ORMMAReady: ' + e);
	}
}


/*
=============================================
BASIC JAVASCRIPT METHODS FOR USER INTERACTION
=============================================
*/

/**
* triggered by user interaction, expands banner ad to panel
* attempts to call ormma.expand
*
* @returns {Boolean} false - so click event can stop propogating
*/
function expand() {
	var oEl = document.getElementById('panel');
	oEl.style.display = 'block';
	oEl = document.getElementById('banner');
	oEl.style.display = 'none';
	
	return (ormmaExpand());	
}


/**
* triggered by user interaction to close panel ad back to banner
* attempts to call ormma.close
*
* @returns {Boolean} false - so click event can stop propogating
*/
function collapse() {
	var oEl = document.getElementById('panel');
	oEl.style.display = 'none';
	oEl = document.getElementById('banner');
	oEl.style.display = 'block';
	oEl = document.getElementById('closebanner');
	oEl.style.display = 'block';

	return (ormmaClose());
}

/**
* triggered by user interaction, to hide the baner completely
* attempts to call ormma.close
*
* @returns {Boolean} false - so click event can stop propogating
*/
function hide() {
	var oEl = document.getElementById('banner');
	oEl.style.display = 'none';
	oEl = document.getElementById('closebanner');
	oEl.style.display = 'none';

	return (ormmaHide());
}

/**
* triggered by user interaction, to follow link
* attempts to call ormma.open
*
* @returns {Boolean} true to follow link, 
                     false that ORMMA already followed link
*/
function open(url) {
	return (ormmaOpen(url));
}


/*
==========================================
TIMER TO WAIT FOR ORMMA-SDK INITIALIZATION
==========================================
*/
window.ormmaWaitId = window.setTimeout(ORMMANotFound, 2000);