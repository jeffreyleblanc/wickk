/*
* wickk - atool-misc.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

/////////////////////////////////////////////////////////////////
// Console Functions
/////////////////////////////////////////////////////////////////

//!-- REMOVE THESE!!!

	var $cE=null;
	function C( a ){ 
		//if(!$cE)return;
		var type = $.type(a);
		if(ifin(type, ['object', 'array'])){
			Cappend($.dump(a));
		} else{
			Cappend(a);
		}
	};
	function Cappend( str ){
		//-- Print to onscreen console
		//$('<div>').addClass('divider').html('>> '+Date()).appendTo($cE); 
		//$('<pre>').html(str).appendTo($cE);
		//-- Print to debugger
		console.log(str);
	};

/////////////////////////////////////////////////////////////////
// Time functions
/////////////////////////////////////////////////////////////////

	//-- 62 base functions
		var base62alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		function b62ify( v )
		{
			v = parseInt(v); //-- Ensure is integer
			var out = '';
			while( v != 0){
				out = base62alphabet[v % 62] + out;
				v = parseInt(v/62);
			}
			return out;
		};
		
		function time62(){
			return b62ify(new Date().getTime());
		};
	
	//!-- DO PER FRAME AND KEEP GLOBALLY!!!
		var global_millis = new Date().getTime();
		var global_elapsedFrm_millis = 0;
		//-- update in loop...
		function update_millis(){
			var currMS = new Date().getTime();
			global_elapsedFrm_millis = currMS - global_millis;
			global_millis = currMS;
		};
		function millis(){
			return global_millis;
		};
		function Emillis(){
			return global_elapsedFrm_millis;
		};

/////////////////////////////////////////////////////////////////
// Regex Functions
/////////////////////////////////////////////////////////////////

	RGX = {

		// Static Patterns
		pattX  : /\d+\.\d+/g ,
		patt29 : /[2-9]\.\d+/g ,
		pattXX : /\d{2}\.\d+/g ,
		patt01 : /[^\d][0-1]\.\d+/g ,

		// forces all floats above a certain precision to a fixed precision. no rounding.
		decimalize : function( str, prcs ){
			fpatt = RegExp('\\d+(\\.\\d{1,'+ prcs.toString()+'})?');
			return str.replace( this.pattX, function(m){ return m.match(fpatt)[0] ; } );
		},

		// 	forces all floats above a certain precision to fixed precision.
		//	However, if fabs( num ) < 2.0, the precision is set to the last <num precision >
		//	non zero digits following '.' thus if prcs=3 0.001234567 -> 0.00123 and not 0.001
		decimalize0 : function( str, prcs ){
			floatpatt = RegExp('\\d+(\\.\\d{1,'+ prcs.toString()+'})?');
			floatpatt0 = RegExp('[^\\d]\\d+(\\.0*\\d{1,'+ prcs.toString()+'})?');

			str = str.replace( this.patt29, function(m){ return m.match(floatpatt)[0] ; } );
			str = str.replace( this.pattXX, function(m){ return m.match(floatpatt)[0] ; } );
			str = str.replace( this.patt01, function(m){ return m.match(floatpatt0)[0] ; } );
			return str;
		},

		// finds all "pos":{} and set precision. Used since high precision of location not always needed.
		setPos : function( str, prcs ){
			patt = /"pos":\s*\{[^/{/}]+\}/gi;
			var Q = this;
			return str.replace( patt, function(m){ return Q.decimalize(m,prcs) ; } );
		}

	};






