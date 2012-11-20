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
		pattX  : /\d+\.\d+/gi ,
		patt29 : /[2-9]\.\d+/gi ,
		pattXX : /\d{2}\.\d+/gi ,
		patt01 : /[^\d][0-1]\.\d+/gi ,

		decimalize : function( str, prcs ){
			fpatt = RegExp('\\d+(\\.\\d{1,'+ prcs.toString()+'})?');
			return str.replace( this.pattX, function(m){ return m.match(fpatt)[0] ; } );
		},

		decimalize0 : function( str, prcs ){
			floatpatt = RegExp('\\d+(\\.\\d{1,'+ prcs.toString()+'})?');
			floatpatt0 = RegExp('[^\\d]\\d+(\\.0*\\d{1,'+ prcs.toString()+'})?');

			str = str.replace( this.patt29, function(m){ return m.match(floatpatt)[0] ; } );
			str = str.replace( this.pattXX, function(m){ return m.match(floatpatt)[0] ; } );
			str = str.replace( this.patt01, function(m){ return m.match(floatpatt0)[0] ; } );
			return str;
		},

		findObj : function( str ){
			patt = /\{[^/{/}]+\}/gi;
			return str.match( patt );
		},

		findPos : function( str ){
			patt = /"pos":\{[^/{/}]+\}/gi;
			return str.match( patt );
		},

		setPos : function( str, prcs ){
			patt = /"pos":\{[^/{/}]+\}/gi;
			var Q = this;
			return str.replace( patt, function(m){ return Q.decimalize(m,prcs) ; } );
		},

		minify : function ( str ){
			str = this.setPos( str, 1 );
			str = this.decimalize0( str, 3 );

			var dict = R.genTypes( str );
			for ( var key in dict ){
				var val = dict[key].toString()
				fpatt2 = RegExp(key, "g");
				str = str.replace(fpatt2,val);
			}
			var keysjson = JSON.stringify(dict, null, '' );
			return '{"K":'+keysjson+',"O":'+str+'}';
		},

		decompressToObj : function(str){
			// Now, instead, can we find and pull out the keys?
			patt = /"K":\{[^/{/}]+\},/gi;
			var k;
			var str = str.replace(patt,function(m){k=m.replace('"K":','').replace('},','}');return '';} );
			// Apply k to o
			dict = JSON.parse(k)
			for ( var key in dict ){
				var val = dict[key].toString()
				fpatt2 = RegExp(val, "g");
				str = str.replace(fpatt2,key);
			}

			// parse the packet:
			obj = JSON.parse( str );
			return obj['O'];
		},

		// Type
		genTypes : function( str ){

			var patt = /"Y":"(\w+?)"/gi;
			var l = str.match(patt);
			var dict = {};
			for(var i=0; i<l.length; i++){
				dict[ l[i].replace('"Y":','').replace(/"/ig,'') ] = 'a';
			}
			
			var count = 0;
			for (var key in dict) {
			   dict[key] = ( count += 1 );
			}

			return dict;
		}

	};






