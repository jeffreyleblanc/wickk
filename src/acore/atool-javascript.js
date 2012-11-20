/*
* wickk - atool-javascript.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

/////////////////////////////////////////////////////////////////
// Javascript Object Utilities
/////////////////////////////////////////////////////////////////

	function ifin(e, L){
		for(i in L)
			if(e==L[i]) return true;
		return false;
	};

	// Prototype Extensions -----------------------
	
		//!-- Error in IE8, because no indexOf function
		Array.prototype.remove = function(e) {
			var t, _ref;
			if ((t = this.indexOf(e)) > -1) {
				return ([].splice.apply(this, [t, t - t + 1].concat(_ref = [])), _ref);
			}
		};
		
		Array.prototype.last = function() {
			return this[ this.length-1 ];
		};
	
	// UTILS --------------------------------------
		function makeJO( arg ){
			if (arg == null)
				return null;
			else {
				if (typeof arg == "string") {
					return $.parseJSON(arg);
				}
				else
					return arg
			}
		};

		// Special to handle cases within Wickk Serialized objects
		function makeWJO( arg ){
			if (arg == null)
				return null;
			else {
				if (typeof arg == "string") {
					return $.parseJSON(arg);
				}
				else
					return arg
			}
		};
				
	//here we only match the existing properties
		function sync( tgt, src){
			for(var k in tgt){
				if( k in src ){
					if( $.type(tgt[k]) === 'object' ) //!-- Array as well...
						sync(tgt[k], src[k]);
					else
						tgt[k] = src[k];
				}				
			}
		};
		
	//-- Because Jquery not working!
		function isEmpty(map) {
			for(var key in map) {
				if (map.hasOwnProperty(key)) {
					return false;
				}
				return true;
			}
		};

