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


