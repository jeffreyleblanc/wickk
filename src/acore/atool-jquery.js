/*
* wickk - atool-jquery - jquerykit.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

(function($){
	
	//-- Type Checking -----------------------//
	
		//!-- Fails on 5.0 -> 'int' for example
		$.atype = function(a){
			var t = $.type(a);
			if( t === 'object' ){
				if( $.isFunction(a.ISatype) ){
					return a.type();
				}}
			else if( t === 'number' ){ //!-- check how deals with 3.0 for example
				return (a % 1 == 0)? 'int':'float';
			}
			return t;
		};
		
		$.ISatype = function(a){
			var t = $.type(a);
			if( t === 'object' )
				if( $.isFunction(a.ISatype) ){
					return true;
				}
			return false;
		};
		
		$.isDerivedFrom = function(ptr,obj){
			if(!$.ISatype(ptr))return false;
			return ptr.$derivedFrom(obj);
		};
		
	//-- Utilities -----------------------//
	
		$.isDef = function(a){
			return !(a===undefined);
		};
	
		//-- Logging shortcut
		$.C = function( a ){
			if(ifin($.type(a), ['object', 'array']))
				console.log($.dump(a));
			else
				console.log(a);
		};

})(jQuery);