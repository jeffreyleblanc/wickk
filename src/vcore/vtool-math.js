/*
* wickk - vtool-math.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

	//== Useful Constants ====================================//
	
		Math.TWOPI = 2*Math.PI;

		//-- When time is in millis, cos(ONEBPM*millis) will pulse at 1 bpm
		Math.ONEBPM = (2*Math.PI)/60000.0;
		
		//!-- Should we have hertz constant instead?

	//== Truncation Helpers ====================================//

		Math.roundFloat = function(fVar, d) {
			return Math.round(fVar * Math.pow(10, d)) / Math.pow(10, d);
		};
	
		//-- modulous, but for floats
		Math.fMod = function(val, mod){
			var mu = Math.floor(val/mod);
			return val - mu*mod;
		};
	
	//== Radian Helpers ====================================//
	
		//!-- This section needs consolidation and cleanup
	
		//-- Force a positive value to the range 0->TWOPI
		Math.toTWOPI = function(val){
			return Math.fMod(val,Math.TWOPI);
		};
		
		//-- Force a positive value to the range 0->TWOPI
		Math.truA = function( rad ){
			if(rad < 0 )
				rad = -1*rad;
			else
				rad = Math.TWOPI - rad;
			if( rad > Math.TWOPI )
				rad = rad - MATH.TWOPI;
			return rad;
		};
		
		Math.angeldiff = function(a1, a2){
			//-- Note we are in a system that is -PI to PI
			//-- this is the same as a1-a2
			var result = a1-a2;
			if(result > Math.PI)
				result -= 2*Math.PI;
			if( result < -1*Math.PI)
				result += 2*Math.PI;
			return result;		
		};
	
	//== Random Helpers ====================================//

		Math.randomRange = function(min,max){
			return min + (max-min)*Math.random();
		};
	
	//== Easing Functions ====================================//
	
		//-- to get 0-1: fn(t,0,1,1); ( useful: http://gizma.com/easing/ )
		//-- t: 0->1, Out: 1->0 In: 0->1
		
		Math.linearTween = function (t, b, c, d) {
			return c*t/d + b;
		};
		Math.easeInQuad = function (t, b, c, d) {
			t /= d;
			return c*t*t + b;
		};
		Math.easeOutQuad = function (t, b, c, d) {
			t /= d;
			return -c * t*(t-2) + b;
		};
		Math.easeInOutQuad = function (t, b, c, d) {
			t /= d/2;
			if (t < 1) return c/2*t*t + b;
			t--;
			return -c/2 * (t*(t-2) - 1) + b;
		};
		Math.easeInCubic = function (t, b, c, d) {
			t /= d;
			return c*t*t*t + b;
		};
		Math.easeOutCubic = function (t, b, c, d) {
			t /= d;
			t--;
			return c*(t*t*t + 1) + b;
		};
		Math.easeInOutCubic = function (t, b, c, d) {
			t /= d/2;
			if (t < 1) return c/2*t*t*t + b;
			t -= 2;
			return c/2*(t*t*t + 2) + b;
		};
		Math.easeInSine = function (t, b, c, d) {
			return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		};
		Math.easeOutSine = function (t, b, c, d) {
			return c * Math.sin(t/d * (Math.PI/2)) + b;
		};
		Math.easeInOutSine = function (t, b, c, d) {
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		};
		Math.easeInExpo = function (t, b, c, d) {
			return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
		};
		Math.easeOutExpo = function (t, b, c, d) {
			return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
		};
		Math.easeInOutExpo = function (t, b, c, d) {
			t /= d/2;
			if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
			t--;
			return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
		};
		Math.easeInCirc = function (t, b, c, d) {
			t /= d;
			return -c * (Math.sqrt(1 - t*t) - 1) + b;
		};
		Math.easeOutCirc = function (t, b, c, d) {
			t /= d;
			t--;
			return c * Math.sqrt(1 - t*t) + b;
		};
		Math.easeInOutCirc = function (t, b, c, d) {
			t /= d/2;
			if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			t -= 2;
			return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
		};
	
	//== Pulse Functions ====================================//
		//-- t: 0->1, out: 0->0
		
		Math.cosPulse = function(t){
			return 0.5 - 0.5*Math.cos(2*Math.PI * t);
		};
		
		//!-- Build a faster implementation, perhaps even storing values
		Math.gaussPulse = function(t, c){
			return Math.pow(Math.E,-1*( (t-0.5)*(t-0.5) / (2*c*c) ))
		};

