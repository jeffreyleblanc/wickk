/*! Wickk | copyright (2012) Jeffrey LeBlanc LLC, www.jeffreyleblanc.org | all rights reserved */
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
					this.createLineFromJson(this, jO);
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
/*! Classy - classy classes for JavaScript :copyright: (c) 2011 by Armin Ronacher. :license: BSD.
* -- Modified by Jeffrey LeBlanc LLC, www.jeffreyleblanc.org */

; (function(undefined) {
	
	//-- Internal Globals ------------------------------------------------//
		var 
		CLASSY_VERSION = '1.4.wickk',
		root = this,
		old_class = root.Class,
		disable_constructor = false;

	//-- Internal Global Fncs ------------------------------------------------//
		
		/* we check if $super is in use by a class if we can.  But first we have to
		check if the JavaScript interpreter supports that.  This also matches
		to false positives later, but that does not do any harm besides slightly
		slowing calls down. */
			var probe_super = (function() { $super(); }).toString().indexOf('$super') > 0;
			//-- this is simply a way to check on the string serialization of objects
			
			function usesSuper(obj) {
				return !probe_super || /\B\$super\b/.test(obj.toString());
			}
	
		/* helper function to set the attribute of something to a value or
		removes it if the value is undefined. */
			function setOrUnset(obj, key, value) {
				if (value === undefined)
					delete obj[key];
				else
					obj[key] = value;
			}
	
		/* gets the own property of an object */
			function getOwnProperty(obj, name) {
				return Object.prototype.hasOwnProperty.call(obj, name)
			  ? obj[name] : undefined;
			}
			//-- I assume this lets you probe and get a property from an object
	
		/* instanciate a class without calling the constructor */
			function cheapNew(cls) {
				disable_constructor = true;
				var rv = new cls;
				disable_constructor = false;
				return rv;
			}
			//-- Not really sure the purpose of this...

	
	//-- The Class ---------------------------------------------------------//

		/* the base class we export */
			var Class = function() { };
	
		/* restore the global Class name and pass it to a function.  This allows
		different versions of the classy library to be used side by side and
		in combination with other libraries. */
			Class.$noConflict = function() {
				try {
					setOrUnset(root, 'Class', old_class);
				}
				catch (e) {
					// fix for IE that does not support delete on window
					root.Class = old_class;
				}
				return Class;
			};
			//-- Ignore for the moment
			
		/* what version of classy are we using? */
			Class.$classyVersion = CLASSY_VERSION;
			
		/* extend functionality */
			Class.$extend = function(properties) {
				var super_prototype = this.prototype;
		
				/* disable constructors and instanciate prototype.  Because the
				prototype can't raise an exception when created, we are safe
				without a try/finally here. */
				var prototype = cheapNew(this);
				
				//-- Save a copy of the properties argument
				var phold = $.extend( true, {}, properties);
				
				/* copy all properties of the includes over if there are any */
				//-- Removed
				
				/* check if isPrimitive*/
				var isPrimitive = false;
				if( properties.__isPrimitive__ )
					isPrimitive = true;
		
				/* copy class vars from the superclass */
				properties.__classvars__ = properties.__classvars__ || {};
				if (prototype.__classvars__)
					for (var key in prototype.__classvars__)
						if (!properties.__classvars__[key]) { //!-- Fail on False?????
							var value = getOwnProperty(prototype.__classvars__, key);
							properties.__classvars__[key] = value;
						}
					
				//!-- Add a count and property holder to the classvars
				properties.__classvars__.$count = 0;
				if(!isPrimitive)
					properties.__classvars__.$p = phold;
				
				//-- If no primitive, create a $parent pointer
					if(!isPrimitive){
						properties.__classvars__.$parent = (root===super_prototype)?null:super_prototype;;
					}
				
				/* copy all properties over to the new prototype */
				for (var name in properties) {
					var value = getOwnProperty(properties, name);
					if (name === '__include__' || value === undefined)
						continue;
		
					//-- This just handles adding in $super calls...
					prototype[name] = ( typeof value === 'function' && usesSuper(value)) ?
					//!-- understand this syntax better (function(args){ ...})(args)
					(function(meth, name) {
						return function() {
							//!-- could this be swapping out the $super call with the actual code?
							var old_super = getOwnProperty(this, '$super');//!-- does this work because function is a class?
							this.$super = super_prototype[name];
							try {
								return meth.apply(this, arguments);//!-- ?????????????
							}
							finally {
								setOrUnset(this, '$super', old_super);//!-- this just reverts to super?
							}
						};
					})(value, name) 
					: value
				}
		
				/* dummy constructor */
				var rv = function() {
					if (disable_constructor)//!-- Not sure the role of this...
						return;
					var proper_this = (root === this) ? cheapNew(arguments.callee) : this;
					//--callee??? - the calling function ( so up the tree)
					
					//-- Set the $class pointer
					proper_this.$class = rv;//!-- MOVED FROM BELOW
					
					//-- Call __init__
					if (proper_this.__init__)
						proper_this.__init__.apply(proper_this, arguments);
					return proper_this;
				} 
		
				/* copy all class vars over of any */
				for (var key in properties.__classvars__) {
					var value = getOwnProperty(properties.__classvars__, key);
					if (value !== undefined)
						rv[key] = value;
				}
		
				/* copy prototype and constructor over, reattach $extend and
				return the class */
				rv.prototype = prototype;
				rv.constructor = rv;
				rv.$extend = Class.$extend;
				rv.$withData = Class.$withData;
				rv.$lineage = Class.$lineage(rv);
				
				return rv; //-- NOTE, we are returning the constructor
			};//-- End $extend
	
		/* instanciate with data functionality */
			//-- Removed
			
		//-- Added method which allows the merging of classes
			
			Class.$lineage = function( cls ){
				var lin = [];
				cls = (cls.$class)? cls.$class.$parent:cls.$parent;
				while( cls.__classvars__ ){
					lin.push( { aType:cls.__classvars__.aType, rv:cls } );
					cls = cls.__classvars__.$parent;
				}
				return lin;
			};
			
			//-- Currently only works with ClassDefs
			Class.$commonAncestor = function( c1, c2 ){
				//-- get both lists
					l1 = c1.$lineage; l2 = c2.$lineage;
				//-- check one against the other until find match...
					var cmn = null;
					for(var i=0; i<l1.length; i++){
						for(var j=0; j<l2.length; j++){
							if( l1[i].aType == l2[j].aType )
							{ cmn = l1[i]; break; }
						}
						if(cmn!=null)break;
					}
				return cmn;
			};
			
			//-- Currently only works with ClassDefs
			Class.$getFusePath = function( c1, c2 ){
				//-- get both lists
					l1 = c1.$lineage; l2 = c2.$lineage;
					var fuseList = [];
				//-- check one against the other until find match...
					var cmn = null;
					for(var i=0; i<l1.length; i++){
						for(var j=0; j<l2.length; j++){
							if( l1[i].aType == l2[j].aType )
							{ cmn = l1[i]; break; }
							fuseList.push( l2[j] );
						}
						if(cmn!=null)break;
						fuseList.push( l2[i] );
					}
				return fuseList;
			};
			
			Class.$fuse = function( pL, props ){
				//-- Build derived object
					var tmpC = pL[0];
					for(var i=1; i<pL.length;i++)
						tmpC = tmpC.$extend( pL[i].$p );
				//-- apply props
					if($.isDef(props))
						tmpC = tmpC.$extend(props);
					return tmpC;
			};
	
		/* export the class */
			root.Class = Class;
})();
/*! End Classy */
/*
* wickk - aRegistry.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;

	//-- Used to hold object references searchable by id
	root.aEntry = Class.$extend({
		__init__: function(idref, ptr) {
			this.idref = idref||'';
			this.ptr = ptr||null;
		}		
	});

	root.aRegistry = Class.$extend({
	
		//--------------------------------------------------//
	
			__init__: function() {
				this.Registry = new Array();
				this.count = 0; // Count of total aObj made
			},
		
		//-- Array Functions ---------------------------//
			
			clear : function(){var Q=this;
				Q.Registry.splice(0, Q.Registry.length);
			},
			
			printRegistry : function(){var Q = this;
				$.each(Q.Registry, function(k,v){
					C( v.idref+' : '+v.ptr.id() );
				});
			},
		
		//-- (De+)Registration ---------------------------//
		
			register : function(ptr){var Q=this;
				if( ! $.ISatype(ptr) ) return null;
				Q.Registry.push( new aEntry(ptr.id(), ptr) );
				Q.count += 1; // Update total count
			},
			
			registerAs : function(ptr, alias){var Q=this;
				if( ! $.ISatype(ptr) ) return null;
				Q.Registry.push( new aEntry(alias, ptr) );
			},
			
			updateId : function(old_id, new_id){var Q=this;
				var robj = null;
				$.each(Q.Registry, function(k,v){
					if( v.idref == old_id){
						robj = v; return false; //-- break loop
					}
				});
				if(robj!=null)robj.idref = new_id;
			},
			
			//-- takes either a pointer or a string id
			deregister : function(ptr_id){var Q=this;
				//-- Get string id
				if( !($.type(ptr_id) === 'string')){
					if( $.ISatype(ptr_id) ) ptr_id = ptr_id.id(); 
					else return false;
				}
				//-- try to find and remove
				var result = false;
				$.each(Q.Registry, function(k,v){
					if( v.idref == ptr_id){
						Q.Registry.remove(v); result =true;
						return false; //-- break loop
					}
				});
				return result;
			},
			
		//-- Scan Functions ---------------------------//
			
			retrieve : function(id){var Q=this;
				if(!($.type(id)==='string')) return null;
				//-- try to find and remove
				var result = null;
				$.each(Q.Registry, function(k,v){
					if( v.idref == id){
						result = v.ptr; return false; //-- break loop
					}
				});
				return result;
			},
			
			//-- Returns null OR { type: , fnc: , arg: }
			makeFilter : function( filter ){var Q=this;
				if(!$.isDef(filter))return null;
				var f = null;
				//-- Set filter type
				if($.atype(filter)=='function'){
					f= {	type:'function',
							fnc : filter,
							arg : '' };
				}
				else if($.atype(filter)=='string'){
					if(filter[0]=='#'){ 
						filter = filter.substr(1);
						f= {	type:'id',
								fnc : function(v){return(v.id()== filter);},
								arg : filter };
					}
					else if(filter[0]=='$'){ 
						filter = filter.substr(1);
						f= {	type:'type',
								fnc : function(v){return(v.type()== filter);},
								arg : filter }; 
					}
				}
				return f;
			},
			
			scan : function( filter, action ){var Q=this;
				//-- 1. Make the list
					var list = [];
				//-- 2. Make the filter
					filter = Q.makeFilter(filter);
					if( filter==null) return []; //!--
				//-- create list
					if(filter.type=='id'){
						list.push( Q.retrieve(filter.arg) );
					}else{
						$.each( Q.Registry, function(k,v){ vp=v.ptr;
							if(filter.fnc(vp)) list.push(vp);
						});
					}
				//-- 2. Apply action
					if($.isDef(action)){
						$.each( list, function(k,v){
							action(v);
						});
					}
				//-- 3. Return the list
					return list;
			},
			
			act : function( filter, action ){var Q=this;
				if(!$.isDef(filter)&&!$.isDef(action))return;
				//-- 2. Make the filter
					filter = Q.makeFilter(filter);
					if(filter==null) return;
				//-- create list
					if(filter.type=='id'){
						var tmpO = Q.retrieve(filter.arg);
						if(tmpO!=null) action(tmpO);
					}else{
						$.each( Q.Registry, function(k,v){ vp=v.ptr;
							if(filter.fnc(vp)) action(vp);
						});
					}
			}
			
	});
}).call(this);
/*
* wickk - aSeed.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.launchWickk = function(){
		root.$a = root.aSeed.CMN = new aCommon();			
	};
	
	root.aSeed = Class.$extend({
	
		//--------------------------------------------------//
	
			__classvars__ : {
				aType : 'aSeed',
				CMN : null	//-- Over ridden in setup
			},
			
			__init__: function() { },
		
		//-- Common Connection ------------------------//
		
			CMN : function(){
				return aSeed.CMN;
			},
		
		//-- Self Type ------------------------//
		
			type : function() {
				try{ return this.$class.aType; }
				catch(e) { return 'none'; } 
			},
			
			ISatype : function(){
				return true;
			},
		
		//-- Meta Type ------------------------//
		
			$parentType : function(){
				return ( $.isDef( this.$class.$parent.__classvars__ ) )?
					this.$class.$parent.__classvars__.aType.toString()
					: 'none';
			},
			
			//!-- Needs updating
			//-- input can be stringName, instance, ClassDef
			$derivedFrom : function( cls , includeself){
				if(includeself==undefined) var includeself = true;
				//-- Test against self first for string
				if( includeself && $.atype(cls)=='string'){
					if(cls==this.type()) return true;
				}
				//-- String case
				var found = false;
				$.each( this.$class.$lineage, function(k,v){
					if($.atype(cls)=='string'){
						if(cls==v.aType){ found=true; return false;}
					}
					else if($.ISatype(cls)){ //!-- use is aType...
						if(cls.type()==v.aType){ found=true; return false;}
					}
					else { //!-- assume its a Class
						try{
							if(cls.aType==v.aType){ found=true; return false;}
						} catch(e){}
					}
				});
				return found;
			}
	});
	
}).call(this);
/*
* wickk - aList.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;

	root.aList = function(){
	  if( !(this instanceof arguments.callee) ) 
	    return new arguments.callee(); 

	   this.L = new Array();
	};

	root.aList.prototype =  {

		//-- Wickk methods ----------------//

			type : function() {
				return 'aList'; 
			},
			
			ISatype : function(){
				return true;
			},
			
		//-- Meta methods ----------------//
			
			size : function(){var Q=this;
				return Q.L.length;
			},
			
			//-- Dummy method //!-- Why needed?
			setpO : function(p){},
		
		//-- Add Methods ----------------//
		
			add : function( ptr ){var Q=this;
				if(!$.ISatype(ptr))return null;
				Q.L.push( ptr );
				return ptr;
			},
			
			//-- defaults to add at the end
			addAt : function( ptr, idx ){var Q=this;
				if(!$.ISatype(ptr))return null;
				if(idx>0 && idx<Q.L.length)
					Q.L.splice(i,0,ptr);
				else Q.add(ptr);
				return ptr;
			},
			
		//-- Remove Methods ----------------//
		
			rem : function( idx_ptr ){var Q=this;
				var i, found=false;
				if($.atype(idx_ptr)=='int'){
					if(idx_ptr>-1 && idx_ptr<Q.L.length)
						Q.L.splice(idx_ptr,1);
				}else{
					for(i=Q.L.length; i>-1&&!found; i--)
						if(Q.L[i]==idx_ptr){
							Q.L.splice(i,1); found=true; }
				}
				return Q;
			},
			
			clear : function(){var Q=this;
				Q.L.splice(0, Q.L.length);
				return Q;	
			},
			
		//-- Get Methods ----------------//
			
			//-- allows negative indexing
			at : function(i){var Q=this;
				if( i > -1*(Q.L.length+1) && i < Q.L.length ){
					return Q.L[ (i>-1)?i:Q.L.length+i ]
				} else return undefined;
			},
			
			find : function(ptr){var Q=this;
				if(!$.ISatype(ptr)) return null;
				//-- Look for:
				var i, found=false;
				for(i=Q.L.length; i>-1&&!found; i--)
					if(Q.L[i]==ptr){ found=true; }
				return (found)?ptr:null;
			},
			
		//-- Iterate Methods ----------------//	
			
			each : function( fn ){var Q=this;
				var i,v;
				for(i=0; i<Q.L.length; i++){v=Q.L[i];
					if(v.type()!='aList'){ //!-- time consuming?
						if(fn(i,v)==false)break;}
					else{
						v.each(fn);}
				}
				return Q;
			},
			
			each_reverse : function( fn ){var Q=this;
				var i,v;
				for(i=Q.L.length-1; i>-1; i--){v=Q.L[i];
					if(v.type()!='aList'){
						if(fn(i,v)==false)break;}
					else{
						v.each_reverse(fn);}
				}
				return Q;
			},
			
			convolute : function( fn ){var Q=this;
				for(var i=0; i<Q.L.length; i++){
					for(var j=i+1; j<Q.L.length; j++){
						fn(Q.L[i], Q.L[j], i, j);
					}
				}
				return Q;
			},
			
		//-- JSON Methods ----------------//	
		
			j : function(){var Q=this;
				var out = [];
				Q.each( function(i,v){
					out.push( v.id() ); });
				return out;
			},

			jm : function(){var Q=this;
				var out = [];
				Q.each( function(i,v){
					out.push( v.mid ); });
				return out;
			}
	};

}).call(this);
/*
* wickk - aCommon.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;

	root.$a; //-- Assign on initialize in page
	
	root.aCommon = Class.$extend({
		//--------------------------------------------------//
		
			__classvars__ : {
				user : 'User' //!-- What's the point of this?
			},
			__init__: function(user){var Q=this;
				
				//-- Object and Message Registries
					Q.Registry = new aRegistry();
					Q.msgLIST = new aList(); //-- For use in upper cores
				
				//-- Shared Parameters
					Q.user = user||'User';
			},
		
		//-- Creation Functions ---------------------------//
		
			create : function( json, flag){var Q=this;
				if(json==undefined) return null;
            	json = makeJO(json);
            	var initFlag = flag||'recreate';
            	var TmpObj = eval('new '+json.aType+'(json,initFlag)');
            	TmpObj.link(); //!-- Note we have to explicitly call link...
            	return TmpObj;
            },
            
            //!-- Should make so not redundant with aCore.clone()
            clone : function( json, flag){var Q=this;
				if(!$.isDef(json)) return null;
            	json = makeJO(json);
            	var initFlag = flag||'clone';
            	//-- Make new Object and give it a new id
					var newO = eval('new '+json.aType+'(json,initFlag)');
					newO.setid( newO.makeid() );
				//-- Perform linking
					try{
						//-- create and link against tmpregistry from jsonHook objects
							var tmpReg = newO.genHookRegistry();
							newO.link(tmpReg);
							//!-- delete tmp reg??
						//-- link against main registry if doing full clone:
							if( initFlag=='clone' )
								newO.link();
					} catch(e) {
						C('ERR: clone linking failed in aCommon.clone()');
					}
				//-- Return the clone
				return newO;
            },
		
		//-- Registry Shortcuts ---------------------------//
		
			scan : function( filterFnc, actionFnc ){var Q=this;
				return Q.Registry.scan(filterFnc, actionFnc);
			},
			
			act : function( filterFnc, actionFnc ){var Q=this;
				return Q.Registry.act(filterFnc, actionFnc);
			},
			
			find : function( id_ ){var Q=this;
				return Q.Registry.retrieve( id_ );
			},
		
		//-- Message Functions ---------------------------//
		
			//!-- For use in upper cores
			//!-- Needs Work
			
			killMSGs : function(){ var Q=this;
				Q.msgLIST.each_reverse( function(m){
					m.tgt.hasMSG = false;
					m.fnc = function(){};
					m.del();
				});
			}		
	});
	
}).call(this);
/*
* wickk - aObj.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.aObj = aSeed.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'aObj'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
		
			// initFlag undefined, 'recreate', 'clone', 'cloneShallow'
			//!-- should cloneShallow actually be 'cloneSelfOnly' ?
		
			__init__: function(a, initFlag){var Q=this;
				Q.$super();
				if(!$.isDef(initFlag))var initFlag='';
				//-- Core Links and Parameter Containers
					Q.pO = null; 			//-- Parent O
					Q.cO = new aList(); 	//-- Children O
					Q.P = {};				//-- Mutable parameter container
					Q.U = {};				//-- aType Pointers
				//-- Generate id
					Q.id_ = null;
					if(initFlag!='recreate') Q.setid( Q.makeid() );
					Q.mid = this.CMN().Registry.count; // micro id
				//-- Update class count
					Q.$class.$count++;
				//-- Others / Meta
					Q.fromdb = false;	//-- Whether created from a database
					Q.dbPK = null;		//-- Holds database primary key
					Q.altered = false; //-- This is if altered but not yet saved
					Q.user = null;		//-- User who created
				//-- HookObject //!-- THIS SHOULD ONLY STORE LINK DATA...
					Q.jsonHook = null;
				//-- Set meta information
					Q.serializableByParent = true;
					Q.setByJson = false;
				
				//-- Call initialize
					Q.initialize((initFlag=='')?a:undefined);	
				//-- Set by arguments, if any
					if(initFlag!='' && $.isDef(a)) Q.setBy(a, initFlag);
				//-- Call the post initialization function
					Q.postInitialize();
				return Q;
			},
			
			initialize : function(){},
			
			postInitialize : function(){},
			
		//-- Initialize from Data ------------------------------------------------//
			
			//!-- Need a better name
			setBy : function(a, initFlag){var Q=this;
				if(!$.isDef(a))return;
				//-- Set flag to let downstream functions know json set
					Q.setByJson = true;
					a = makeJO(a); //-- Ensure we have an object
            	//-- If we are 'recreating', sync id
            		if(initFlag=='recreate' )
            			Q.setid(($.isDef(a.id))?a.id:Q.makeid());//-- Note Fall Back
            	//-- Iterate over P
            		Q.setP(a.P);
            	//-- Create Children
            		if($.isDef(a.children)){
						$.each( a.children, function(k,v){
							try{
								//!-- Understood to be dangerous
								var TmpObj = eval('new '+v.aType+'(v,initFlag)');
								Q.addC(TmpObj);
							} catch(e){
								C('child error in SetBy:'+Q.id());
							}
						});
					}
				//-- Set jsonHook for use by the link function
					Q.jsonHook = a;
            		return Q;	
			},
			
			link : function(reg){var Q=this;
				if( Q.jsonHook ){
					//-- use registry argument or fall back on CMN
						if(!$.isDef(reg)) var reg=Q.CMN().Registry;
					//-- NOTE: we don't link() parent/children, as that is done by addC in setBy
					//-- Link Children
						Q.cO.each( function(i,p){
							if(p!=null) p.link(reg);
						});
					//-- Link Anything in the U container and delete from container
						for( k in Q.jsonHook.U ){
							//-- Handle null
							if(Q.jsonHook.U[k]==null){
								Q.U[k] = null;
								continue;
							}
							//-- Handle single string
							else if( $.atype(Q.jsonHook.U[k]) === 'string'){
								Q.U[k] = reg.retrieve( Q.jsonHook.U[k] );
								if(Q.U[k]!=null) delete Q.jsonHook.U[k];
							}
							//-- Handle aLists //!-- NOT DISTINGUISHING WITH Plain Array
							else{
								$.each( Q.jsonHook.U[k], function(key,val){
									var tmpLink = reg.retrieve( val );
									Q.U[k].add( tmpLink );
									if(tmpLink!=null) delete Q.jsonHook.U[k][key];
								});
							}
						}
					//-- Run postLink
						Q.postLink()
				}
			},
			
			//-- Only run on a deserialization
			postLink : function(){var Q=this;
			
			},
			
			clone : function(noLinking){ var Q=this;
				//-- set proper initFlag
					var initFlag = (noLinking)?'cloneShallow':'clone';
				//-- Make new Object and give it a new id
					var newO = eval('new '+this.type()+'(this.j(),initFlag)');
					newO.setid( newO.makeid() );
				//-- Perform linking
					try{
						//-- create and link against tmpregistry from jsonHook objects
							var tmpReg = newO.genHookRegistry();
							newO.link(tmpReg);
							//!-- delete tmp reg??
						//-- link against main registry if doing full clone:
							if( initFlag=='clone' )
								newO.link();
					} catch(e) {
						C('ERR: '+this.id()+' clone linking failed');
					}
				//-- Return the clone
				return newO;
			},
			
			//!-- In theory faster to build as creating, but more confusing
			genHookRegistry : function(){ var Q=this;			
				//-- Create the new registry
					var reg = new aRegistry();
				//-- recursive register
					Q.recurseC( function(ptr){
						if($.isDef(ptr.jsonHook)){
							if( ptr.jsonHook!=null){
								if($.isDef(ptr.jsonHook.id)){
									reg.registerAs(ptr, ptr.jsonHook.id);
						}}}
					});
				return reg;
			},
			
		//-- Destructor ------------------------------------------------//

			//-- Note, will not handle non children's pointers
			
			del : function(){var Q=this;
				//-- Remove From parent:
					if( Q.pO != null ) Q.pO.remC(Q);
				//-- Remove from Main Registry
					Q.CMN().Registry.deregister(Q);
				//-- Clear Children
					Q.clearC();
			},
			
			delDeep : function(){var Q=this;
				//-- Remove From parent:
					if( Q.pO != null ) Q.pO.remC(Q);
				//-- Remove from Main Registry
					Q.CMN().Registry.deregister(Q);
				//-- Delete all Children
					Q.delAllC();
			},
		
		//-- ID Functions ------------------------------------------------//
			
			id : function(){
				return this.id_;
			},
			
			makeid : function(){var Q=this;
				if( Q.user == null) Q.user = Q.CMN().user;
				return Q.CMN().user+'-'+time62()+'+'+Q.$class.aType+'#'+Q.$class.$count;
			},
			
			//!-- Could have a clone flag?
			//!-- this would cause a duplicate record...
			setid :function(id){
				//-- if id is null, just created so do register
				var old_id = this.id_;
				var registeredYet = (old_id==null)?false:true;
				this.id_ = id;
				if(!registeredYet)
					this.CMN().Registry.register(this);
				else //-- Update id
					this.CMN().Registry.updateId(old_id, this.id());
			},
			
		//-- DB Functions ------------------------------------------------//
		
			//!-- Not yet implemented, and will likely follow backbone.js model
			
			ISfromdb : function(){var Q=this;
				return Q.fromdb;
			},
			
			SETfromdb : function(state){var Q=this;
				Q.fromdb = state;
			},
			
			saveToDB : function(){},
			updateDB : function(){},
			deleteFromDB : function(){},
		
		//-- Parent Functions ------------------------------------------------//
		
			setpO : function(ptr){var Q=this;
				Q.pO = ptr;
			},
			
			getpO : function(){var Q=this;
				return ( Q.pO )? Q.pO:null;
			},
			
			getpOid : function(){var Q=this;
				return ( Q.pO )? Q.pO.id():'null';
			},

			getpOmid : function(){var Q=this;
				return ( Q.pO )? Q.pO.mid:'null';
			},
		
		//-- Children Functions ------------------------------------------------//
		
			//-- Adding Children -------------------------//
				
				addC : function( ptr , serializable){var Q=this;
					Q.cO.add(ptr); ptr.setpO(Q);
					if(!(serializable===undefined))
						ptr.serializableByParent = serializable;
					return ptr;	
				},
			
			//-- Remove/Delete Children -------------------------//
			
				//-- removes but does not delete
				remC : function( ptr ){var Q=this;
					if(Q.cO.rem(ptr))
						ptr.setpO(null);
				},
				
				//-- removes and deletes //!-- TEST
				delC : function( ptr ){var Q=this;
					if(Q.hasC(ptr))					
						ptr.del();
				},
			
			//-- Clear Children -------------------------//
			
				clearC : function(){var Q=this;
					Q.cO.each( function(i,v){ v.pO = null;} );
					Q.cO.clear();	
				},
				
				//!-- TEST!!!!!
				delAllC : function(){var Q=this;
					Q.cO.each_reverse( function(i,v){ v.delDeep();} );
					Q.cO.clear();
				},
			
			//-- Meta -------------------------//
			
				hasC: function(ptr){var Q=this;
					return (Q.cO.find(ptr))?true:false;
				},
				
				numC : function(){var Q=this;
					return Q.cO.size();
				},
			
			//-- Iterative -------------------------//
			
				eachC : function( fnc ){
					//-- which is faster? probably not a ton of gain?
					this.cO.each( function(i,c){
						fnc(i,c); });
					/*for(var i=0; i<this.cO.L.length; i++)
						fnc(i, this.cO.L[i] );*/
				},
				
				each_reverseC : function( fnc ){
					this.cO.each_reverse( function(i,c){
						fnc(i,c); });
				},
				
				//-- Recurses down children
				recurseC : function( fnc ){
					fnc(this);
					this.cO.each( function(i,c){
						c.recurseC(fnc); });
				},
		
		//-- JSON Functions ------------------------------------------------//
		
			//-- Children -------------------------//
			
				jC : function(){var Q=this;
					return Q.cO.j();
				},
				
				jCj : function(){var Q=this;
					var out = [];
					Q.cO.each( function(i,e){
						if(e.serializableByParent){
							out.push(e.jO()); }
					});
					return out;
				},

				jCjm : function(){var Q=this;
					var out = [];
					Q.cO.each( function(i,e){
						if(e.serializableByParent){
							out.push(e.jOm()); }
					});
					return out;
				},
			
			
			//-- Links -------------------------//
			
				//!-- Check for full fitness
				jU : function(){var Q=this;
					var tmpU={};var count=0;
					for( k in Q.U ){
						if( Q.U[k] != null ){
							if( Q.U[k].type() != 'aList'){
								tmpU[k] = Q.U[k].id();
							}else{
								tmpU[k] = Q.U[k].j();
							}
						}
						else
							tmpU[k] = null;
						count++;
					}
					return tmpU;
				},

				//!-- Check for full fitness
				jUm : function(){var Q=this;
					var tmpU={};var count=0;
					for( k in Q.U ){
						if( Q.U[k] != null ){
							if( Q.U[k].type() != 'aList'){
								tmpU[k] = Q.U[k].mid;
							}else{
								tmpU[k] = Q.U[k].jm();
							}
						}
						else
							tmpU[k] = null;
						count++;
					}
					return tmpU;
				},
			
			//-- Parameters -------------------------//
			
				jP : function(){var Q=this
					return Q.P;
				},
			
			//-- Full -------------------------//
			
				jO : function(){var Q=this;
					var Uid = { timecreated:Q.timecreated, index:Q.index, user:Q.user};
					return $.extend({},{aType:Q.type(), id:Q.id()},Uid,{parent: Q.getpOid(), children:Q.jCj()}, {P:Q.jP()}, {U:Q.jU()} );
				},
				
				j : function(pretty){var Q=this;
					return JSON.stringify(Q.jO(), null, pretty||'' );
				},

				jOm : function(){var Q=this;
					//var Uid = { timecreated:Q.timecreated, index:Q.index, R:Q.user};
					//return $.extend({},{Y:Q.type(), I:Q.mid},Uid,{pO: Q.getpOmid(), cO:Q.jCjm()}, {P:Q.jP()}, {U:Q.jUm()} );

					return $.extend({},{Y:Q.type(), I:Q.mid},{pO: Q.getpOmid(), cO:Q.jCjm()}, {P:Q.jP()}, {U:Q.jUm()} );
				},

				decimalize : function( str, prcs ){
					patt = /\d+\.\d+/gi ;
					fpatt = RegExp('\\d+(\\.\\d{1,'+ prcs.toString()+'})?');
					return str.replace( patt, function(m){ return m.match(fpatt)[0] ; } );
				},
				
				jm : function(pretty){var Q=this;
					return Q.decimalize(
						JSON.stringify(Q.jOm(), null, pretty||'' ),
						5
					);
				},
			
		//-- Parameter Functions ------------------------------------------------//	
		
			setP : function(a){
				if(!a)return; var Q=this;
				var syncSrc = ($.ISatype(a))? a.P : 
					(($.atype(a)==='object')? a : 
						(($.atype(a)==='string')? $.parseJSON(a) : null ));
				if(syncSrc) sync( Q.P, syncSrc);
				return Q;
			},
			
			inP : function(name, a){var Q=this;
				if(Q.P[name]!=undefined){
					if(Q[name]!=undefined){
						if(a==undefined) return Q[name]();
						else Q[name](a);
					}else{
						if(a==undefined) return Q.P[name];
						else{
							if($.atype(Q.P[name])==='object') sync(Q.P[name],a);
							else Q.P[name] = a;
						}
					}
				} else return undefined;
			},
			
	});
}).call(this);
/*
* wickk - vtool-jquery.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

	//-- Positioning:
		$.fn.x = function(_x) {
			if(_x)
				return this.css('left',_x);
			else
				return this.offset().left;
		};
		$.fn.y = function(_y) {
			if(_y)
				return this.css('top',_y);
			else
				return this.offset().top
		};
		$.fn.xy = function(_pos) {
			if(_pos)
				return this.css( { 'left':_pos.x, 'top': _pos.y } );
			else
				return {x: this.offset().left, y: this.offset().top } 
		};
	//-- Size:
		$.fn.w = function(_w) {
			if(_w)
				return this.width(_w);
			else
				return this.width();
		};
		$.fn.h = function(_h) {
			if(_h)
				return this.height(_h);
			else
				return this.height();
		};
		$.fn.wh = function(_size) {
			if(_size){
				this.width(_size.x);
				return this.height(_size.y);
			} else {
				return {x: this.width(), y: this.height() } 
			}
		};
	//-- Position and Size Shortcuts
		$.fn.centerInWindow = function( sx, sy ) {
			var offset = {
				x: (sx || 0.5 )*($(window).w()-this.w()),
				y: (sy || 0.5 )*($(window).h()-this.h())
			};
			this.xy(offset);
		};
		
	//-- Event Handling
		(function($) {
			$.nowAndOnResize = function( fn ) {
				fn(); $(window).resize(function(){fn();});
			};
		})(jQuery);
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


/*
* wickk - vtool-vCanvasKit.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	//-- Note, this is a plain Object
	
	root.vCanvasRenderer = {
	
		//== Setup ========================================//
		
			ctx : null,		//-- Canvas context refrence
			
			bindCtx : function(ctx){
				this.ctx = ctx;
				return this;
			},
			
			setDefaultFont : function(font){
				this.ctx.font = font;
				return this;
			},
		
		//== Shortcuts ========================================//

			lnTo : function( vec ){
				this.ctx.lineTo(vec.x, vec.y);
			},
			
			mvTo : function( vec ){
				this.ctx.moveTo(vec.x, vec.y);
			},
			
		//== Basic Shapes ========================================//
			
			//-- handle vColors
			
			line : function(v1,v2,color,width,cap){
				this.ctx.beginPath();
				this.ctx.moveTo(v1.x, v1.y);
				this.ctx.lineTo(v2.x, v2.y);
				this.ctx.strokeStyle = color||'rgb(0,0,0)';
				this.ctx.lineWidth = width||1;
				this.ctx.lineCap = cap||'round';
				this.ctx.stroke();
				this.ctx.closePath();
			},
			
			lineInc : function(v1,v2,color,width,cap){
				this.line(v1,v1.addN(v2),color,width,cap);
			},
	
			circle : function(center,r,fillcolor,strokecolor,width){
				this.ctx.beginPath();
				this.ctx.arc(center.x, center.y, r||10, 0, Math.TWOPI, false);
				if(fillcolor){
					this.ctx.fillStyle = fillcolor||'rgb(0,0,0)';
					this.ctx.fill(); }
				if(strokecolor){
					this.ctx.strokeStyle = strokecolor||'rgb(0,0,0)';
					this.ctx.lineWidth = width||1;
					this.ctx.stroke(); }
				this.ctx.closePath();
			},
			
			ellipse : function(center,rh,rv,fillcolor,strokecolor,width){
				if(rh==rv){
					this.circle(center,rh,fillcolor,strokecolor,width);
					return;
				}
				
				var circumference = Math.max(rh, rv);
				var scaleX = rh / circumference;
				var scaleY = rv / circumference;
				
				this.ctx.save();
				this.ctx.scale(scaleX, scaleY);
				this.ctx.beginPath();
				this.ctx.arc(center.x, center.y, circumference, 0, Math.TWOPI, false);
				if(fillcolor){
					this.ctx.fillStyle = fillcolor||'rgb(0,0,0)';
					this.ctx.fill(); }
				if(strokecolor){
					this.ctx.strokeStyle = strokecolor||'rgb(0,0,0)';
					this.ctx.lineWidth = width||1;
					this.ctx.stroke(); }
				this.ctx.closePath();
				this.ctx.restore();
			},
	
			rect : function(vec,w,h,fillcolor,strokecolor,width){
				this.ctx.beginPath();
				this.ctx.rect(vec.x, vec.y, w, h);
				if(fillcolor){
					this.ctx.fillStyle = fillcolor||'rgb(0,0,0)';
					this.ctx.fill(); }
				if(strokecolor){
					this.ctx.strokeStyle = strokecolor||'rgb(0,0,0)';
					this.ctx.lineWidth = width||1;
					this.ctx.stroke(); }
				this.ctx.closePath();
			},
			
			rectCenter : function(vec,w,h,fillcolor,strokecolor,width){
				this.ctx.beginPath();
				this.ctx.rect(vec.x-w/2, vec.y-h/2, w, h);
				if(fillcolor){
					this.ctx.fillStyle = fillcolor||'rgb(0,0,0)';
					this.ctx.fill(); }
				if(strokecolor){
					this.ctx.strokeStyle = strokecolor||'rgb(0,0,0)';
					this.ctx.lineWidth = width||1;
					this.ctx.stroke(); }
				this.ctx.closePath();
			},
			
		//== Compound Shapes ========================================//
			
			shape : function( pointList, fillcolor, strokecolor, width ){
				this.ctx.beginPath();
				var numPoints = pointList.length;
				if( numPoints<1 ) return;
				this.mvTo( pointList[0] );
				for(var i=1; i<numPoints; i++){
					this.lnTo( pointList[i] );
				}
				if(fillcolor){
					this.ctx.fillStyle = fillcolor||'rgb(0,0,0)';
					this.ctx.fill(); }
				if(strokecolor!=undefined){
					this.ctx.strokeStyle = strokecolor||'rgb(0,0,0)';
					this.ctx.lineWidth = width||1;
					this.ctx.stroke(); }
				this.ctx.closePath();
				
			}
	}
	
}).call(this);
/*
* wickk - vVec.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;

	root.vVec = function(x, y, z){
	  if( !(this instanceof arguments.callee) ) 
	    return new arguments.callee(x, y, z); 

		this.x = x||0;
		this.y = y||0;
		this.z = z||0;
	};

	root.vVec.$class = {
		
		dot : function( v1, v2 ){
			return  v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
		},
		
		midPoint : function(v1,v2){
			return new vVec( (v1.x+v2.x)/2, (v1.y+v2.y)/2, (v1.z+v2.z/2) );
		},
		
		tangentAlong : function(v1,v2,amt){
			var tangent = v1.copy().sub(v2);
			return tangent.mult(amt||1.0);
		},
		
		project : function( base, other ){
			var mD = vVec.dot(base,other);
			var bD = vVec.dot(base,base);
			return base.copy().mult(mD/bD);
		}
	};

	root.vVec.prototype =  {

		//-- Typing ------------------------------------//
		
			type : function(){
				return 'vVec';
			},
			
			ISatype : function(){
				return true;
			},
		
		//-- Copy ------------------------------------//
		
			copy : function(){
				return new vVec(this.x, this.y, this.z);
			},
		
		//-- Setters ------------------------------------//
		
			set : function(a1, a2, a3){
				if($.atype(a1)=='vVec') return this.setV(a1);
				else if($.atype(a1)=='object') return this.setEVT(a1);
				else return this.setXYZ(a1,a2,a3);
			},
			
			setXYZ : function(x, y, z) {
				this.x = x||this.x; this.y = y||this.y; this.z = z||this.z;
				return this;
			},
			
			setV : function(vec) {
				this.x = vec.x; this.y = vec.y; this.z = vec.z;
				return this;
			},
			
			setEVT : function(e) {
				this.x = e.pageX; this.y = e.pageY;
				return this;
			},
			
			zero : function(){
				this.x = this.y = this.z = 0;
				return this;
			},
			
		//-- Equality Functions -------------------------------//
			
			equals : function( V ){//!--TEST
				var Q = this;
				return ((Q.x == V.x) && (Q.y == V.y) && (Q.z == V.z));
			},
			
			almostEquals : function(vec, tol_){//!--TEST
				var tol = tol_||0.05;
				return (distanceSquaredApart(vec) < tol*tol);
			},
		
		//-- Basic Functions -------------------------------//
		
			add : function(vec) {
				this.x += vec.x; this.y += vec.y; this.z += vec.z;
				return this;
			},
			
			addXYZ : function(x,y,z) {
				this.x += x||0;
				this.y += y||0;
				this.z += z||0;
				return this;
			},
			
			addN : function(v){
				return new vVec( this.x+v.x, this.y+v.y, this.z+v.z);
			},
			
			sub : function(vec) {
				this.x -= vec.x; this.y -= vec.y; this.z -= vec.z;
				return this;
			},
			
			subXYZ : function(x,y,z) {
				this.x -= x||0;
				this.y -= y||0;
				this.z -= z||0;
				return this;
			},
			
			subN : function(v){
				return new vVec( this.x-v.x, this.y-v.y, this.z-v.z);
			},
			
			mult : function(s){
				this.x *= s;
				this.y *= s;
				this.z *= s;
				return this;
			},
			
			multN : function(s){
				return new vVec( this.x*s, this.y*s, this.z*s);
			},
			
			div : function(s){
				this.x /= s;
				this.y /= s;
				this.z /= s;
				return this;
			},
			
			divN : function(s){
				return new vVec( this.x/s, this.y/s, this.z/s);
			},
			
			//-- per index multiplication
			scale : function(vec){
				this.x *= vec.x;
				this.y *= vec.y;
				this.z *= vec.z;
				return this;
			},
			
			scaleN : function(vec){
				return new vVec( this.x*vec.x, this.y*vec.y, this.z*vec.y);
			},
			
		//-- Length Functions -------------------------------//
			
			lngth : function(){
				return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
			},
			
			//-- Shortcut setter/getter
			l : function(lngth){
				if(!lngth)
					return this.lngth();
				else
					return this.normalize().mult(lngth);
			},
			
			lngthSquared : function(){
				return this.x*this.x + this.y*this.y + this.z*this.z;
			},
			
			//-- Shortcut setter/getter
			lSQ : function(lsq){
				if(!lsq)
					return this.lngthSquared();
				else
					return this.normalize().mult(Math.sqrt(lsq));
			},
			
			normalize : function(){
				var l = this.lngth();
				if(l==0){ l=0.00001; }
				this.x /= l; this.y /= l; this.z /= l;
				return this;
			},
			
			limit : function(lim){
				if( this.lngthSquared() > lim*lim ){
					this.normalize().mult(lim);
				}
				return this;
			},
			
			//!-- Check
			distanceApart : function(V){var Q = this;
				return Math.sqrt( (Q.x-V.x)*(Q.x-V.x) + (Q.y-V.y)*(Q.y-V.y) + (Q.z-V.z)*(Q.z-V.z) );
			},
			
			//!-- Check
			distanceSquaredApart : function(V){var Q = this;
				return ( (Q.x-V.x)*(Q.x-V.x) + (Q.y-V.y)*(Q.y-V.y) + (Q.z-V.z)*(Q.z-V.z) );
			},

		
		//-- Rotation ----------------------------------------//
			
			rot : function(rad){var Q=this;
				if(!rad){
					return Math.atan2( this.y, this.x );
				}else{
					if( $.type(rad) === 'string'){
						if(rad=='CW'){
							var hold = Q.x;
							Q.x = Q.y; Q.y = -1.0*hold;
						} else if(rad=='CCW'){
							var hold = Q.x;
							Q.x = -1.0*Q.y; Q.y = hold;
						} else if(rad=='180'){
							Q.x *= -1.0;
							Q.y *= -1.0;
						}
					}else{
						/*Q.x = Q.x*Math.cos(rad) + Q.y*Math.sin(rad);
						Q.y = -1*Q.x*Math.sin(rad) + Q.y*Math.cos(rad);*/
						var holdx = Q.x*Math.cos(rad) - Q.y*Math.sin(rad);
						Q.y = Q.x*Math.sin(rad) + Q.y*Math.cos(rad);
						Q.x = holdx;
					}
					return this;
				}
			},
			
			rotN : function(rad){var Q=this;
				return this.copy().rot(rad);
			},
			
			setPolar : function(mag, rad){
				this.x = mag * Math.cos(rad); 
				this.y = mag * Math.sin(rad);
				return this;
			},
			
			//!-- Check
			segmentRadians : function(V){
				return this.copy().sub(V).radians();
			},
			
		//-- Randomize --------------------------------------//
		
			//-- Box bounded
			randomizeBox : function(amt){
				this.x = 2*amt * (Math.random()-0.5);
				this.y = 2*amt * (Math.random()-0.5);
				return this;
			},
			
			//-- Circle bounded
			randomizeCircle : function(amt){
				return this.setPolar(amt*Math.random(), Math.random()*Math.TWOPI);
			},
		
		//-- JSON ----------------------------------------//
		
			print : function(){
				C( '| '+this.x+' |');
				C( '| '+this.y+' |');
				C( '| '+this.z+' |');
			},
			
			p : function(){
				return 'vVec( '+this.x+', '+this.y+', '+this.z+')';
			},
			
			j : function(){ //!--NEED TO ID AS AVEC
				return '{ "aType":"vVec", "x": '+this.x+' ,"y": '+this.y+', "z":'+this.z+'}';		
			},
			
			toJson : function(){
				return '{ "x": '+this.x+' ,"y": '+this.y+' }';		
			},
			
			setByJson : function(json){
				var json = makeJO(json);
				this.x = json.x;
				this.y = json.y;
			}

	}; // END PROTOTYPE

}).call(this);
/*
* wickk - vColor.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;

	root.vColor = function(r, g, b, a){
	  if( !(this instanceof arguments.callee) ) 
	    return new arguments.callee(r, g, b, a); 

		this.r = r||1;
		this.g = g||1;
		this.b = b||1;
		this.a = a||1;
		
		this.rgb = 'rgb(0,0,0';
		this.rgba = 'rgba(0,0,0,0)';
		this.flatten();
	};

	root.vColor.$class = {
		
		mix : function(c1,c2){
			return new vColor( (c1.r+c2.r)/2, (c1.g+c2.g)/2, (c1.b+c2.b)/2, 1);
		},
		
		mixerize : function(c1,c2,a1){
			var a2 = 1.0-a1; 
			return new vColor( a1*c1.r+a2*c2.r, a1*c1.g+a2*c2.g, a1*c1.b+a2*c2.b, (c1.a+c2.a)/2);
		}
	};

	root.vColor.prototype =  {

		//-- Typing ------------------------------------//
		
			type : function(){
				return 'vColor';
			},
			
			ISatype : function(){
				return true;
			},
		
		//-- Copy ------------------------------------//
		
			copy : function(){
				return new vColor(this.r, this.g, this.b, this.a);
			},
		
		//-- Apply ------------------------------------//
		
			apply : function( ctx ){
				return this.rgba;
			},
			
			applyAfilter : function( ctx, filter ){
				if(filter==undefined) var filter=ctx; //!-- BAD
				return 'rgba'+this.rgb+','+(this.a*filter)+')';
			},
		
		//-- Getters/Setters ------------------------------------//
		
			//-- Utility to help 'flatten' values to a string for use with the context
			flatten : function(){
				var c = '('+parseInt(this.r)+','+parseInt(this.g)+','+parseInt(this.b);
				this.rgb = c; //!-- Note, is not closed!
				this.rgba = 'rgba'+c+','+(this.a)+')';
				return this;
			},
			
			R : function(r){
				if(r==undefined) return this.r;
				else{ this.r=r;return this.flatten();}},
			G : function(g){
				if(g==undefined) return this.g;
				else{ this.g=g;return this.flatten();}},
			B : function(b){
				if(b==undefined) return this.b;
				else{ this.b=b;return this.flatten();}},
			A : function(a){
				if(a==undefined) return this.a;
				else{ this.a=a;return this.flatten();}},
			
			RGBA : function(r,g,b,a){
				if(r==undefined) return this.rgba;
				else{
					this.r = r||1;
					this.g = g||1;
					this.b = b||1;
					this.a = a||1;
					return this.flatten();
				}
			},
			
			RGB : function(r,g,b){
				if(r==undefined) return 'rgb'+this.rgb+')';
				else{
					this.r = r||1;
					this.g = g||1;
					this.b = b||1;
					this.a = 1;
					return this.flatten();
				}
			},
			
			STR : function(str){
				//-- expect 'rgb(1,1,1)' or 'rgba(1,1,1,1)
				try{
					var rgba;
					if(str.indexOf('rgba(')==0){
						str=str.replace('rgba(','').replace(')','');
						var rgba = str.split(',');
					}else if(str.indexOf('rgb(')==0){
						str=str.replace('rgb(','').replace(')','');
						var rgba = str.split(',');
						rgba.push(1);
					}else return this;
					this.r = parseInt(rgba[0]);
					this.g = parseInt(rgba[1]);
					this.b = parseInt(rgba[2]);
					this.a = parseFloat(rgba[3]);
					
				}catch(e){}
				return this.flatten();
			},
			
			CLR : function(color){
				if(!color) return this.copy();
				else{
					this.r = color.r;
					this.g = color.g;
					this.b = color.b;
					this.a = color.a;
					return this.flatten();
				}
			},
			
		//-- Randomize ------------------------------------//
			
			randomize : function(amt){
				if(!amt) var amt=255;
				this.r = amt * Math.random();
				this.g = amt * Math.random();
				this.b = amt * Math.random();
				this.a = 1;
				return this.flatten();
			},
			
			//-- Results in a 'softer' palette
			prettyRandomize : function(){
				this.r = 255 * randomRange(0.2,1.0);
				this.g = 255 * randomRange(0.2,1.0);
				this.b = 255 * randomRange(0.2,1.0);
				this.a = randomRange(0.3,0.9);
				return this.flatten();
			},
		
		//-- JSON ----------------------------------------//
		
			print : function(){
				C( '| '+this.r+' |');
				C( '| '+this.g+' |');
				C( '| '+this.b+' |');
				C( '| '+this.a+' |');
			},
			
			j : function(){ //!--NEED TO ID AS AVEC
				return '{ "aType":"vColor", "r": '+this.r+' ,"g": '+this.g+', "b":'+this.b+','+this.a+' }';			
			},
			
			toJson : function(){
				return '{ "r": '+this.r+' ,"g": '+this.g+', "b":'+this.b+','+this.a+' }';	
			},
			
			setByJson : function(json){
				var json = makeJO(json);
				this.r = json.r;
				this.g = json.g;
				this.b = json.b;
				this.a = json.a;
			},
		
		//!-- FROM HERE DOWN IS IN DEVELOPMENT -------------------//
					
		//-- Equality Functions -------------------------------//
			
			equals : function( C ){
				var Q = this;
				return ((Q.r == C.r) && (Q.g == C.g) && (Q.b == C.b));
			},
			
			almostEquals : function(C, tol_){//!--TEST
				var tol = tol_||0.05;
				return (distanceSquaredApart(C) < tol*tol);
			},
		
		//-- Basic Functions -------------------------------//
		
			add : function(vec) {
				this.r += vec.r;
				this.g += vec.g;
				this.b += vec.b;
				return this;
			},
			
			add_xyz : function(r,g,b) {
				this.r += r||0;
				this.g += g||0;
				this.b += b||0;
				return this;
			},
			
			sub : function(vec) {
				this.r -= vec.r;
				this.g -= vec.g;
				this.b -= vec.b;
				return this;
			},
			
			mult : function(s){
				this.r *= s;
				this.g *= s;
				this.b *= s;
				return this;
			},
			
			div : function(s){ //!--TEST
				this.r /= s;
				this.g /= s;
				this.b /= s;
				return this;
			},
			
		//-- Length Functions -------------------------------//
			
			lngthSquared : function(){
				return this.r*this.r + this.g*this.g + this.b*this.b;
			},
			
			lngth : function(){
				return Math.sqrt(this.r*this.r + this.g*this.g + this.b*this.b);
			
			},
			
			distanceApart : function(V){//!--TEST
				var Q = this;
				return Math.sqrt( (Q.r-V.r)*(Q.r-V.r) + (Q.g-V.g)*(Q.g-V.g) + (Q.b-V.b)*(Q.b-V.b) );
			},
			
			distanceSquaredApart : function(V){//!--TEST
				var Q = this;
				return ( (Q.r-V.r)*(Q.r-V.r) + (Q.g-V.g)*(Q.g-V.g) + (Q.b-V.b)*(Q.b-V.b) );
			},
			
			normalize : function(){
				var l = this.lngth();
				this.r /= l; this.g /= l; this.b /= l;
				return this;
			},
			
			limit : function(lim){
				if( this.lngthSquared() > lim*lim ){
					this.normalize().mult(lim);
				}
				return this;
			}

	}; //END PROTOTYPE

}).call(this);

/*
* wickk - vTransform2D.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;

	root.vTransform2D = function(a, b, c, d, x, y){
	  if( !(this instanceof arguments.callee) ) 
	    return new arguments.callee(a, b, c, d, x, y); 

		this.e = [
			[a||0, b||0, x||0],
			[c||0, d||0, y||0],
			[0, 0, 1]
		];
	};

	root.vTransform2D.$class = {
		// Empty
	};

	root.vTransform2D.prototype =  {

		//-- Meta ------------------------------------//

			type : function(){
				return 'vTransform2D';
			},
			
			ISatype : function(){
				return true;
			},
			
		//-- Copy ------------------------------------//
		
			copy : function(){var Q=this;
				return new vTransform2D(Q.e[0][0],Q.e[0][1],Q.e[1][0],Q.e[1][1],Q.e[0][2],Q.e[1][2]);
			},
		
		//-- Set ------------------------------------//
		
			//!-- Need set to another transform
			
			setM: function(a, b, c, d, x, y) {
				this.e[0][0] = a||0;
				this.e[0][1] = b||0;
				this.e[1][0] = c||0;
				this.e[1][1] = d||0;
				this.e[0][2] = x||0;
				this.e[1][2] = y||0;
				return this;
			},
			
			setI : function(){var Q=this;
				for(var i=0; i<Q.e.length; i++)
					for(var j=0; j<Q.e.length; j++)
						Q.e[i][j] = (i==j)?1:0;
				return this;
			},
			
			setROT: function(rad){var Q=this;
				var c = Math.cos(rad);
				var s = Math.sin(rad);
				Q.e[0][0] = c;
				Q.e[0][1] = -1*s;
				Q.e[1][0] = s;
				Q.e[1][1] = c;
				return this;
			},
			
			setSCL : function(sx, sy){var Q=this;
				Q.e[0][0] = sx;
				Q.e[0][1] = 0;
				Q.e[1][0] = 0;
				Q.e[1][1] = sy;
				return this;
			},
			
			setXY : function(vec){
				this.e[0][2] = vec.x;
				this.e[1][2] = vec.y;
				return this;
			},
			
		//-- Apply to Context ------------------------------------//
		
			applyToCTX : function( ctx ){var Q=this;
				ctx.transform(Q.e[0][0],Q.e[0][1],Q.e[1][0],Q.e[1][1],Q.e[0][2],Q.e[1][2]);
			},
		
		//-- Operations ------------------------------------//
				
			// Note the implicit usage of homogenous coordinates

			//-- this*v
			apply_v : function( v ){var Q=this;
				var tmpV = new vVec();
				tmpV.x = Q.e[0][0]*v.x + Q.e[0][1]*v.y + Q.e[0][2];
				tmpV.y = Q.e[1][0]*v.x + Q.e[1][1]*v.y + Q.e[1][2];
				tmpV.z = v.z;
				return tmpV;
			},
			
			//-- this*M
			x : function( M ){var Q=this;
				var N = new vTransform2D();
				for(var r=0; r<3; r++)
					for(var c=0; c<3; c++){
						var sum = 0;
						for(var i=0; i<3; i++){
							sum += Q.e[r][i]*M.e[i][c];
						}
						N.e[r][c] = sum;
					}
				return N;
			},
			
			//-- this'*v
			apply_as_inverse : function( v ){ var Q=this;
				var det = Q.e[0][0]*Q.e[1][1]-Q.e[0][1]*Q.e[1][0]; //!-- IF d == 0???
				if(det == 0){
					return null;
				}
				var DX = v.x - Q.e[0][2];
				var DY = v.y - Q.e[1][2];
				var tmpV = new vVec();
				det = 1.0/det;
				tmpV.x = det * ( Q.e[1][1]*DX - Q.e[0][1]*DY );
				tmpV.y = det * ( Q.e[0][0]*DY - Q.e[1][0]*DX );
				return tmpV;
			},
		
		//-- i/o ------------------------------------//
		
			print : function(){
				var Q=this;
				for(var i=0; i<Q.e.length; i++)
					C('| '+Q.e[i][0]+','+Q.e[i][1]+','+Q.e[i][2]+' |');
			}

	};// END PROTOTYPE

}).call(this);
/*
* wickk - vEvent.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;

	root.vEvent = function($je){
	  if( !(this instanceof arguments.callee) ) 
	    return new arguments.callee($je); 

		this.etype = '';		//-- Event type
		this.$je = $je||null; 	//-- Jquery event object
		this.spatial = false;	//-- Whether the event is spatial or not
		this.gpos = vVec();		//-- Canvas positon of the event
		this.lpos = vVec();		//-- Local position of the event
		this.global	= false;	//-- Whether the event is 'global'
		this.mDown = false;		//-- If the mouse is down
	};

	root.vEvent.$class = {
		// Empty;
	};

	root.vEvent.prototype =  {
		
		ISatype : function(){
			return true;
		},

		type : function(){
			return 'vEvent';
		},
		
		cleanType : function(){
			return this.etype.replace('_','');
		}

	};

}).call(this);

/*
* wickk - vObjBase.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.vObjBase = aObj.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'vObjBase',
				defaultHandlersMade: false,
				defaultHandlers : {}	//-- Set of handlers available to the class
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(){var Q=this;
				Q.$super();
				//-- Utility
					Q.ctx = null; 				//-- Drawing context
					Q.cvns = null;				//-- vCanvas object
					Q.rndr = null;				//-- Renderer Helper object
					Q.infoPtr = null; 			//-- Can point to an xInspector Instance
				//-- Position
					Q.P.pos = new vVec();
					Q.P.rot = 0;
					Q.P.scl = new vVec(1,1);
					Q.TRS = {pos:true,rot:false,scl:false};	//-- Tracks which transforms are being used
					Q.TF = new vTransform2D(); Q.TF.setI();	//-- Transform relative to parent
					Q.gTF = new vTransform2D(); Q.gTF.setI();	//-- Transform relative to global
				//-- Interaction Variables
					Q.grabPnt = new vVec();
					Q.UserControlled = false; 	//-- True when being dragged
					Q.mouseInside = false;
					Q.draggable = false;
					Q.handlers = {};
				//-- Event Timing
					Q.lastdownT = 0;	//-- Set to millis of last mousedown event
					Q.lastclickT = 0;	//-- Set to millis of last click event
					Q.clickT = 200; 	//-- Max millis between mousedowns to trigger 'click'
					Q.dblclickT = 600;	//-- Max millis between clicks to trigger 'dblclick'
					Q.clickCB = null;	//-- Holds click event timeout if dblclick time passes
					Q.lastdownPos = vVec();
					
				//-- Properties	
					Q.P.alpha = 1.0;
					Q.alphaTree = 1.0;
				//-- View
					Q.visible = true;
					
				//-- Default Handlers
					Q.attachDefaultHandlers();
			},
						
			//-- Meta --------------------------------//
			
				setCnvs : function( cnvs ){var Q=this;
					Q.cnvs = cnvs;
					Q.ctx = (Q.cnvs)?Q.cnvs.ctx:null;
					Q.rndr = (Q.cnvs)?Q.cnvs.rndr:null;
					Q.eachC( function(i,e){
						if(e.setCnvs) e.setCnvs(cnvs);
					});
				},
				
				addC : function( ptr, serializable){
					this.$super(ptr, serializable);
					try{
						ptr.setCnvs(this.cnvs);
					} catch(e) {}
				},
			
			//-- Render --------------------------------//
			
				renderTree : function(gM){var Q=this;
					if(Q.ctx==null || Q.visible==false)return;
					Q.ctx.save();
					//-- Update Transform (TRS)
						Q.TF.setI();
						Q.TF.setXY(Q.P.pos);
						if(Q.TRS.rot){ Q.TF.setROT(-Q.P.rot); }
						if(Q.TRS.scl){ Q.TF = Q.TF.x(vTransform2D().setSCL(Q.P.scl.x,Q.P.scl.y)); }
					//-- Update Global Transform	
						Q.gTF = gM.x(Q.TF);
						gM = Q.gTF.copy();
					//-- Do transform
						Q.ctx.translate(Q.P.pos.x, Q.P.pos.y);
						if(Q.TRS.rot){ Q.ctx.rotate(-1*Q.P.rot); }
						if(Q.TRS.scl){ Q.ctx.scale(Q.P.scl.x,Q.P.scl.y); }
						//!-- We aren't currently applying Q.TF.applyToCTX(Q.ctx); because of rotation mismatch
					//-- Set alphaTree and globalAlpha
						Q.alphaTree = Q.P.alpha;
						if( Q.pO )
							Q.alphaTree *= Q.pO.alphaTree;
						Q.ctx.globalAlpha = Q.alphaTree;
					//-- Render Tree
						Q.renderBefore();
						Q.render();
						Q.renderAfter();
						Q.eachC( function(i,e){
							e.renderTree(gM);
						});
						///Q.renderDebug();////////////////////
					Q.ctx.restore();
				},
				
				render : function(){},
				renderBefore : function(){}, //-- Use by vObj
				renderAfter : function(){},  //-- Use by vObj
				
				renderDebug : function(){
					var Q=this;
					//-- Draw Origin
						Q.ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
						Q.ctx.beginPath();
						Q.ctx.rect(-4,-4,8,8);
						Q.ctx.fill();
						Q.ctx.closePath();
					//-- Draw Vertical
						Q.ctx.strokeStyle = 'rgba(255, 255, 0, 0.75)';
						Q.ctx.lineWidth = 1;
						Q.ctx.beginPath();
						Q.ctx.moveTo(0,0);
						Q.ctx.lineTo(0, -10);
						Q.ctx.stroke();
						Q.ctx.closePath();
				},
				
				alpha : function(a){var Q=this;
					if(a==undefined) return Q.P.alpha;
					else Q.P.alpha = a;
				},
				
			//-- Update --------------------------------//
			
				updateTree : function(){var Q=this;
					Q.update();
					Q.eachC( function(i,e){
						e.updateTree();
					});
					Q.postUpdate();
					//-- Update Info Pointer if it is attached
					Q.updateInfoPtr();
				},
				
				postUpdate : function(){}, //-- Use by vObj
				
				update : function(){
					var Q=this;
				},
		
		//-- Geometry --------------------------------//
		
			//-- Accessors -----------------------------------//
				pos : function(vec){
					if(vec==undefined) return this.P.pos;
					else return this.P.pos.setV(vec);
				},
				rot : function(rot){
					if(rot==undefined){ return this.P.rot; }
					else{
						this.TRS.rot = true;
						this.P.rot = rot;
						return this;
					}
				},
				scl : function(scl){
					if(scl==undefined) return this.P.scl;
					else{
						this.TRS.scl = true;
						return this.P.scl.setV(scl);
					}
				},
				
			//-- Transformers -----------------------------------//
				move : function(vec){
					this.P.pos.add(vec);
				},
				rotate : function(rotation){
					this.TRS.rot = true;
					this.P.rot += rotation;//!!!-- Apply radian fixer
				},
				scale : function(scaler){
					this.TRS.scl = true;
					if($.atype(scaler)=='vVec')
						this.P.scl.scale(scaler);
					else{
						this.P.scl.mult(scaler);
					}
				},
				
			//-- Hit Testing -----------------------------------//
				
				//-- Requires vec be in Objects reference frame
				containsPnt : function( vec ){
					return false;
				},
				
				//-- Useful default hit tests, NOTE the required dimensions
				rectHitTest : function( vec ){var Q=this;
					if( vec.x >= 0 )
						if( vec.y >= 0 )
							if( vec.x < Q.P.width )
								if( vec.y < Q.P.height )
									return true;	
					return false;
				},
				circleHitTest : function( vec ){var Q=this;
					return (vec.lSQ() <= (Q.P.r*Q.P.r));
				},
				ellipseHitTest : function( vec ){var Q=this;
					return ((vec.x*vec.x)/(Q.P.ra*Q.P.ra) + (vec.y*vec.y)/(Q.P.rb*Q.P.rb) <= 1.0);
				},
				
				//-- Tolerance Hit Testing
				rectHitTestTol : function( vec, tol ){var Q=this;
					if(!tol)var tol=10.0;
						if( vec.x >= -tol )
							if( vec.y >= -tol )
								if( vec.x <= Q.P.width+tol )
									if( vec.y <= Q.P.height+tol )
										return true;	
					return false;
				},
				
			//-- Frame of Reference Translation Functions ------------------------//
				
				canvasToLocal : function(v){
					var hold =  this.gTF.apply_as_inverse( v );
					if( hold == null )
						$.C('NULL!!!');
					return hold;
				},
				
				canvasToParent : function(v){
					return (this.pO)? this.pO.canvasToLocal(v.copy()) : null;
				},
				
				localToParent : function(v){
					return this.TF.apply_v(v||vVec());
				},
				
				localToCanvas : function(v){
					return this.gTF.apply_v(v||vVec());
				},
				
				localToScreen : function(v){
					var Q=this;
					return Q.localToCanvas(v||vVec()).add(Q.cnvs.screenPos);
				},
				
				
			//-- Events --------------------------------//
			
				//-- Managing Handlers --------------------------------//
				
					hasEvent : function( type ){var Q=this;
						if($.atype(type)=='vEvent') type=type.etype;
						if(Q[type]) return true;
						if(Q.handlers[type]&&Q.handlers[type].length>0) return true;
						return false;
					},
					
					bindEvent : function( type, handler){var Q=this;
						if(Q.handlers[type]==undefined) Q.handlers[type] = Array();
						Q.handlers[type].push( handler );
					},
					
					unbindEvent : function( type, handler ){var Q=this;
						if(!Q.hasEvent(type)) return;
						if( handler!=undefined && Q.handlers[type]!=undefined){
							$.each( Q.handlers[type], function(i,h){
								if(handler==h){ Q.handlers[type].splice(i,1); return false; }
							});
						}else{
							//-- Clear all
							if(Q.handlers[type]!=undefined)
								Q.handlers[type].splice(0, Q.handlers[type].length);
						}
					},
					
					unbindAllEvents : function(){var Q=this;
						Q.handlers = {}; //!-- probably should be cleaner
					},
				
					callEvent : function( evt, type ){var Q=this;
						if(type==undefined) var type = evt.etype;
						if(!Q.hasEvent(type)) return; //!-- overkill?
						if(Q[type]) Q[type](evt);
						if(Q.handlers[type]&&Q.handlers[type].length>0){
							$.each(Q.handlers[type], function(i,h){
								h.call(Q,evt);
							});
						}
					},
					
					attachDefaultHandlers : function(){var Q=this;
						//-- If default handlers have not already been loaded, do it
						if(!Q.$class.defaultHandlersMade && Q.eventDefaults){
							Q.$class.defaultHandlers = Q.eventDefaults();
							Q.$class.defaultHandlersMade = true;
						}
						//-- Bind the default handlers
						$.each( Q.$class.defaultHandlers, function(k,f){
							Q.bindEvent(k,f);
						});
					},
				
				//-- Event Depth Checking --------------------------------//
				
					//-- Note that the children are iterated over in reverse of render order
					handleEventTree : function(evt){var Q=this;
						var handled = false;
						Q.cO.each_reverse( function(i,v){
							handled = v.handleEventTree(evt);
							return (handled)?false:true; //-- if false will force exit from loop
						});
						if( !(handled==false || handled==null) ) return handled;
						return Q.handleEvent(evt);
					},
					
					handleEvent : function(evt, force){var Q=this;
						if(Q.hasEvent(evt)){
							if(evt.spatial){
								evt.lpos = Q.canvasToLocal(evt.gpos);
								if( Q.containsPnt(evt.lpos) || force){
									Q.callEvent(evt);
									return true;
								}else{
									//-- Here we check on previously true states
									if( evt.etype == 'testForFocus' && Q.cnvs.eventRouter.focus == Q ){
										Q.cnvs.eventRouter.focus = null;
										Q.handleFocusLeaves(evt);
									}
								}
							}else{
								Q.callEvent(evt);
							}
						} else return false;
					},
					
					//-- Root Event Handlers:
					
						_mousedown : function( evt ){var Q=this;
							Q.lastdownT = millis(); //-- Logs time
							Q.lastdownPos.setV(evt.gpos);
							if(Q.draggable){					
								Q.grabPnt.setV( Q.localToParent(evt.lpos).sub(Q.P.pos));
								if(Q.cnvs.eventRouter.dragFocus == null){
									Q.UserControlled = true;
									Q.callEvent(evt,'startDrag');
									Q.cnvs.eventRouter.dragFocus = Q;
								}
							}
							Q.callEvent(evt,'mousedown');
						},
						
						_mouseup : function(evt){var Q=this;
							Q.callEvent(evt,'mouseup');
							if(Q.cnvs.eventRouter.dragFocus == Q){
								Q.UserControlled = false;
								Q.callEvent(evt,'endDrag');
								Q.cnvs.eventRouter.dragFocus = null;
							}
							Q.handleClicking(evt);
						},
						
						//!-- Recently Added...
						_mousemove : function(evt){var Q=this;
							Q.callEvent(evt,'mousemove');
						},
						
						handleClicking : function(evt){var Q=this;
							clearTimeout(Q.clickCB);
							if(millis() - Q.lastdownT < Q.clickT){//-- within click range
								if( Q.lastdownPos.subN( evt.gpos ).lngthSquared() > 100) return;
								if(Q.hasEvent('dblclick')){
									if( millis() - Q.lastClickT < Q.dblclickT){
										Q.callEvent(evt,'dblclick');
									} else {
										//-- set timeout in case dblclick doesn't happen
											Q.lastClickT = millis();
											if(Q.hasEvent('click')){
												Q.clickCB = setTimeout( function(){
													Q.callEvent(evt,'click');
												}, Q.clickT);
											}
									}
								}else{
									Q.callEvent(evt,'click');
								}
							}
						},
						
						_keydown : function(evt){var Q=this;
							Q.callEvent(evt,'keydown');
						},
						
						_keyup : function(evt){var Q=this;
							Q.callEvent(evt,'keyup');
						},
						
						_keypress : function(evt){var Q=this;
							Q.callEvent(evt,'keypress');
						},
				
					//-- Interpreted Event Handlers:
				
						testForFocus : function( evt ){var Q=this; //mouseover
							if(Q.mouseInside == false){
								//-- Save that mouse is now inside
									Q.mouseInside = true;
								//-- If there are enter handlers, fire them
									if(evt.mDown){
										Q.callEvent(evt,'dragenter');
									}else{
										Q.callEvent(evt,'mouseenter');
									}
								//-- Handle global registration
									if(Q.cnvs.eventRouter.focus!=null && Q.cnvs.eventRouter.focus!=Q){
										Q.cnvs.eventRouter.focus.handleFocusLeaves(evt);
									}
									Q.cnvs.eventRouter.focus = Q;
							}
						},
						
						handleFocusLeaves : function(evt){var Q=this;
							Q.mouseInside = false;
							if(!evt.mDown){
								Q.callEvent(evt,'mouseleave');
							}else{
								Q.callEvent(evt,'dragleave');
							}
						},
						
						_drag : function( evt ){var Q=this;
							if(!Q.draggable) return;
							Q.P.pos.setV( Q.localToParent(evt.lpos).sub(Q.grabPnt) );
							Q.callEvent(evt,'drag');
						},
				
			//-- Info Pointer ---------------------------------//
		
				attachToInfoPtr : function(){var Q=this;
					Q.cnvs.inspector.pos( Q.localToCanvas(Q.offsetInfoPtr()) );
					Q.cnvs.inspector.attach(Q);	
				},
			
				//-- Called in updateTree
				updateInfoPtr : function(){var Q=this;
					if( Q.infoPtr ){
						Q.infoPtr.pos( Q.localToCanvas(Q.offsetInfoPtr()) );
					}			
				},
				
				offsetInfoPtr : function(){ //-- Override if needed
					return vVec(0,0);
				}
			
	});
	
}).call(this);
/*
* wickk - vObj.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.vObj = vObjBase.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'vObj'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(){var Q=this;
				Q.$super();
				//-- Messaging
					Q.msgBox = new Array();	//-- Holds inserted vMsg
					Q.msgHandlers = {};		//-- Holds message handler functions
					Q.msgWall = {}; 		//-- Writable 'wall'
				//-- Update Functions
					Q.fList = new Array();	//-- Holds update task functions
				//-- Render Functions	
					Q.rList = new Array();	//-- Holds render task functions
				//-- Fading utilities
					Q.fadeOn = false;
					Q.fadeTgt = 1.0;
					Q.fadeDiff = 0;
					Q.fadeStartVal = 0;
					Q.fadeStartTime = 0;
					Q.fadeDuration = 0;
					Q.fadeFnc = 'linearTween';
			},
			
		//-- Render --------------------------------//
			
			renderBefore : function(){var Q=this;
				Q.runR();
			},
			
			renderMsgWall : function(){ var Q=this;
				//-- dump msgWall
					Q.ctx.fillStyle = 'white';
					Q.ctx.fillText($.dump(Q.msgWall), 0, 0);
			},
			
		//-- Render Functions --------------------------------//
			
			runR : function(){var Q=this;
				if(Q.rList.length==0)return;
				$.each(Q.rList, function(k,v){
					try{if( v.f(Q,v.dat||null) ) Q.remR( v )
					}catch(e){}
				});
			},
			
			addR : function( fnc, data ){var Q=this;
				Q.rList.push({
					dat: data||{},
					f: fnc });
			},
			
			remR : function( fptr ){var Q=this;
				if($.atype(fptr)=='function'){
					$.each(Q.rList, function(k,v){
						if( v.f==fptr) fptr=v; return false;//--break
					});
				}else{
					Q.rList.remove(fptr);
				}
			},
		
		//-- Update --------------------------------//
		
			postUpdate : function(){var Q=this;
				//-- Process inbox
				Q.processMsgBox();
				//-- Handle fade
				if(Q.fadeOn)Q.handleFade();
				//-- Run update functions
				Q.runA();
			},
			
			update : function(){},
			
		//-- Fade --------------------------------//
					
			fade : function(target, ms, tween){ var Q=this;
				Q.fadeOn = true;
				Q.fadeTgt = target||0;
				Q.fadeDiff = Q.fadeTgt-Q.alpha();
				Q.fadeStartVal = Q.alpha();
				Q.fadeStartTime = millis();
				Q.fadeDuration = ms||1000;
				Q.fadeFnc = tween||'linearTween';
			},
			
			handleFade : function(){var Q=this;
				if( Math.abs( Q.alpha() - Q.fadeTgt ) < 0.01){
					Q.alpha( Q.fadeTgt ); Q.fadeOn = false;
				} else {
					var scaler = (millis()-Q.fadeStartTime) / Q.fadeDuration;
					scaler = Math[Q.fadeFnc](scaler, 0, 1, 1);
					Q.alpha( Q.fadeStartVal + Q.fadeDiff*scaler );
					//-- Check for overrun
					if( Q.fadeDiff>0 && Q.alpha() > Q.fadeTgt ) Q.alpha( Q.fadeTgt );
					else if( Q.fadeDiff<0 && Q.alpha() < Q.fadeTgt ) Q.alpha( Q.fadeTgt );
				}
			},
			
		//-- Update Functions --------------------------------//
			
			runA : function(){var Q=this;
				if(Q.fList.length==0)return;
				$.each(Q.fList, function(k,v){
					try{ if( v.f(Q,v.dat||null) ) Q.remA( v );
					} catch(e){};
				});
			},
			
			addA : function( fnc, data ){var Q=this;
				Q.fList.push({
					dat: data||{},
					f: fnc });
			},
			
			remA : function( fptr ){var Q=this;
				if($.atype(fptr)=='function'){
					$.each(Q.fList, function(k,v){
						if( v.f==fptr) fptr=v; return false;//--break
					});
				}else{
					Q.fList.remove(fptr);
				}
			},
		
		//-- Messaging --------------------------------//
		
			addMsgHandler : function(msgText, handler){
				Q.msgHandlers[msgText] = handler;
			},
			
			removeMsgHandler : function(msgText){
				if(Q.msgHandlers[msgText]) delete Q.msgHandlers[msgText];
			},
			
			insertMsg : function(msg){ var Q=this;
				Q.msgBox.push(msg);
				msg.tgt = Q;//-- Attach to the message
			},
			
			processMsgBox : function(){var Q=this;
				while( Q.msgBox.length>0 ){var M = Q.msgBox.pop();
					//-- Look for message handler
						if(Q.msgHandlers[M.msgText]!=undefined){
							Q.msgHandlers[M.msgText].call(Q,M); }
					//-- If the M has a action, call it
						if(M.action){
							M.action.call(M,Q); }
					//-- Delete the Message
						M.del();
				}
			},
			
		//-- Message Wall --------------------------------//
		
			mWadd : function( m ){ var Q=this;
				Q.msgWall[m] = 1;
			},
			mWhas : function( m ){ var Q=this;
				return (Q.msgWall[m]!=undefined)? true:false
			},
			mWclear : function( m ){ var Q=this;
				Q.msgWall={};
			}
			
	});
	
}).call(this);
/*
* wickk - vCanvas.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.vCanvas = aObj.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'vCanvas'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(){var Q=this;
				Q.$super();
				//-- Utility
					Q.$cnvs = null;		//-- $ canvas element pointer
					Q.ctx = null;		//-- Drawing context pointer
					Q.rndr = null;		//-- Render Helper instance
				//-- Canvas Properties
					Q.P.width = 0;
					Q.P.height = 0;
					Q.screenPos = new vVec(); //-- Position of canvas in the html document
				
				//-- Event Router
					Q.eventRouter = null;	 //-- Handles Events
				
				//-- Frames Per Second Calculation Variables
					Q.fps = 0
					Q.fpslastUpdate = 0;
					Q.fpsFilter = 50;		//-- Smooths calculation
					Q.framecount = 0;
				
				//-- Alpha //!-- Note it would be better if this extended vObjBase...
					Q.alpha = 1.0;		//-- alpha for the canvas
					Q.alphaTree = 1.0;	//-- root alphaTree
					
				//-- Inspector
					Q.inspector = null;
					
			},
			
		//-- Attach to Canvas Element ------------------------------------------------//
			
			attachToCanvas : function($canvasPtr){var Q=this;
			 	//-- Save html element pointer and get drawing context
			 		Q.$cnvs = $canvasPtr;
					Q.ctx = Q.$cnvs[0].getContext('2d');
				//-- Attach vCanvasRender
					Q.rndr = vCanvasRenderer.bindCtx( Q.ctx );
			 	//-- Sync size and position with the element
			 		Q.P.width = Q.$cnvs.w();
					Q.P.height = Q.$cnvs.h();
					Q.screenPos.setV(Q.$cnvs.xy());
					//-- Create window resize callback to deal with movement
						$(window).resize(function() {
							Q.screenPos.setV(Q.$cnvs.xy());
						});
			 	//-- Make the eventRouter
					Q.eventRouter = new vEventRouter();
					Q.eventRouter.cnvs = Q;
					Q.eventRouter.ctx = Q.ctx;
					Q.eventRouter.rndr = Q.rndr;
					Q.eventRouter.registerForEvents( Q.$cnvs );
				//-- register to hide mouse
					Q.$cnvs.mouseleave( function(){ Q.mouseOverCanvas=false; });
					Q.$cnvs.mouseenter( function(){ Q.mouseOverCanvas=true; });
        		//--Update any children to set their canvas and ctx pointers
					Q.eachC( function(i,e){
						e.setCnvs( Q );
					});
				//-- build and add inspector
					Q.inspector = new jInspector();
        			Q.addC(Q.inspector);
            },
			
		//-- Run Loop --------------------------------//
		
			loopstep : function(){var Q=this;
				//-- Clear the canvas
					Q.renderRefresh();
				//-- Interact, Update, Render
					Q.eventRouter.processEvtQ();
					Q.updateTree();
					Q.renderTree();
				//-- update frame info
					Q.calculateFps();
				//-- Update the global time
					update_millis();
			},
			
		//-- Fps --------------------------------//
		
			calculateFps : function(){var Q=this;
				var currFps =1000/(millis()-Q.fpslastUpdate);
				Q.fps += (currFps-Q.fps)/Q.fpsFilter; //-- Smooths fps
				Q.fpslastUpdate = millis();
				Q.framecount++;
			},
			
			//-- Attach to a html div to update it with fps calculation every second
            attachToFps : function( $fps ){var Q=this;
            	//!-- Should stop any previous interval functions...
            	setInterval(function(){
					$fps.html( Q.fps.toFixed(1) + "fps" );
				}, 1000);
			},
            
		//-- Overload addC ----------------------------//
		
			addC : function( ptr ){			
				this.$super(ptr);
				ptr.setCnvs( this );
			},
		
		//-- Render --------------------------------//
		
			renderTree : function(){var Q=this;
				Q.render();
				var gM = new vTransform2D().setI();
				Q.eachC( function(i,e){
					e.renderTree(gM); 
				});
				Q.renderTop();	
			},
			
			render : function(){},
			
			renderTop : function(){var Q=this;
				if(Q.mouseOverCanvas){
					Q.renderMouse();
				}
			},
			
			renderMouse : function(){var Q=this;
				Q.rndr.circle(Q.eventRouter.mPos,3,'red');
			},
			
			renderRefresh : function(){var Q=this;
				Q.ctx.clearRect(0,0,Q.P.width,Q.P.height);
				//!-- test, render backcolor				
				Q.rndr.rect(vVec(),Q.P.width,Q.P.height,'rgb(150,150,150)');
				
			},
		
		//-- Update --------------------------------//
		
			updateTree : function(){var Q=this;
				Q.update();
				Q.eachC( function(i,e){
					e.updateTree();
				});
			},
			
			update : function(){
				
			},
			
		//-- Geometry --------------------------------//
		
			canvasToLocal : function( e){
				return e;
			}
			
	});
	
}).call(this);
/*
* wickk - vEventRouter.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.vEventRouter = aObj.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'vEventRouter'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(){var Q=this;
				Q.$super();
				//-- Utility
					Q.$cnvs = null;
					Q.cnvs = null;		//-- vCanvas element pointer
					Q.ctx = null;		//-- Drawing context pointer
					Q.rndr = null;		//-- Render Helper instance
				
				//-- Event Utilities
					Q.evtQ = Array();			//-- Holds events
					Q.mDown = false;			//-- Registers if mouse is 'down'
					Q.mPos = vVec();			//-- Holds mouse position ( in canvas space )
					Q.mouseOverCanvas = true;	//-- If mouse is over the canvas
					Q.focus = null;				//-- This is the object in current 'focus'
					Q.dragFocus = null;			//-- This is the object currently being dragged
				
			},
			
		//-- Attach to Application Events ------------------------------------------------//
			
			registerForEvents : function($cnvs){var Q=this;
				Q.$cnvs = $cnvs;
			 	//-- Register for events from jquery
					$.each( ['mousedown', 'mouseup', 'mousemove'], function(k,v){
						Q.$cnvs.bind(v, function(e){
							e.pageX -= Q.cnvs.screenPos.x; e.pageY -= Q.cnvs.screenPos.y;
							Q.evtQ.push(e);
						});
					});
					$.each( ['touchstart', 'touchend', 'touchmove'], function(k,v){
						Q.$cnvs.bind(v, function(e){
							e.preventDefault();
							if(e.type!='touchend'){
								e.pageX = e.originalEvent.touches[0].pageX - Q.cnvs.screenPos.x;
								e.pageY = e.originalEvent.touches[0].pageY - Q.cnvs.screenPos.y;
							}
							Q.evtQ.push(e);
						});
					});
					$.each( ['keydown', 'keyup', 'keypress'], function(k,v){
						$(document).bind(v, function(e){
							e.pageX -= Q.cnvs.screenPos.x; e.pageY -= Q.cnvs.screenPos.y;
							Q.evtQ.push(e);
						});
					});
            },
            
        //-- Client Accessors --------------------------------//
            
            //!-- should clean up
			setDragFocus : function( ptr ){var Q=this;
				Q.cnvs.eventRouter.focus = ptr;		
				Q.cnvs.eventRouter.dragFocus = ptr;
				var e = {pageX:Q.mPos.x, pageY:Q.mPos.y};
				Q.injectEvent( e, 'startDrag', ptr ); //!-- need to make fake evt
			},
			
		//-- Handle Root Events From Jquery --------------------------------//
			
			//-- Event Queue Processor
			processEvtQ : function(){var Q=this;
				while( Q.evtQ.length!= 0 ){
					var e = Q.evtQ.pop();
					if( Q['_'+e.type] != undefined ){
						Q['_'+e.type](e);
					}
				}
			},
			
			//-- Event helper function
			injectEvent : function(e, type, tgt){var Q=this;
				//-- Set up event
					var evt = Q.packageEvent(e, type);
				//-- Inject the event
					if(!tgt){
						Q.cnvs.eachC( function(i,v){
							return v.handleEventTree(evt);
						});
					}else{
						tgt.handleEvent(evt, true);
					}
			},
			
			packageEvent : function(e, type){var Q=this;
				var evt = new vEvent(e);
				evt.etype = type;
				evt.mDown = Q.mDown;
				if(type!='_keydown'&&type!='_keydown'&&type!='_keypress')
					evt.spatial = true;
				evt.gpos.setXYZ(e.pageX, e.pageY);
				return evt;
			},
			
			//-- Root Events
							
				_mousedown : function(e){var Q=this;
					Q.mDown = true;
					Q.injectEvent(e,'_mousedown');
				},
			
				_mouseup : function(e){var Q=this;
					Q.mDown = false;
					//-- We ensure a mouseup is sent to the dragFocus
					//-- This is because it may not be under the current mouse position
					if(Q.dragFocus != null){
						Q.injectEvent(e, '_mouseup', Q.dragFocus);
						Q.dragFocus = null;
					}else{
						Q.injectEvent(e,'_mouseup');
					}
				},
				
				_mousemove : function(e){var Q=this;
					Q.mPos.setEVT(e);
					Q.injectEvent(e,'_mousemove');
					//-- retest focus
					this.testForFocus();
				},
				
				//-- Touch events pass through to relevant mouse event (for now)
				_touchstart : function(e){ this._mousedown(e); },
				_touchend : function(e){ this._mouseup(e); },
				_touchmove : function(e){ this._mousemove(e); },
				
				//-- Basic Key events
				_keydown : function(e){var Q=this;
					Q.injectEvent(e,'_keydown');
				},
				_keyup : function(e){var Q=this;
					Q.injectEvent(e,'_keyup');
				},
				_keypress : function(e){var Q=this;
					Q.injectEvent(e,'_keypress');
				},
			
			//-- Interpreted Events
			
				testForFocus : function(){ var Q=this;
					if(Q.dragFocus == null){
						var e = {pageX:Q.mPos.x, pageY:Q.mPos.y};
						Q.injectEvent(e,'testForFocus');
					}else{
						Q._drag();
					}
				},
				
				_drag : function(){ var Q=this;
					//-- Because drag is artificially created, we must simulate pageX/Y
					var e = {pageX:Q.mPos.x, pageY:Q.mPos.y};
					if(Q.dragFocus != null){
						this.injectEvent(e,'_drag', Q.dragFocus);
					}
				}
			
	});
	
}).call(this);
/*
* wickk - vRect.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.vRect = vObj.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'vRect'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(a){var Q=this;
				Q.$super();
				//-- Attributes
					Q.P.fillcolor = new vColor(200,0,0,0.75);
					Q.P.strokecolor = new vColor(200, 0, 200, 0.5);
					Q.P.width = 50;
					Q.P.height = 50;
				//-- Meta Variables
					Q.renderStroke = false;
			
			},
			
			i : function(width, height){var Q=this;
				Q.P.width = width||25;
				Q.P.height = height||Q.P.width;
				return Q;
			},
		
		//-- Render -------------------------------------------//
			
			render : function(){var Q=this;
				Q.rndr.rect(vVec(),Q.P.width,Q.P.height,Q.P.fillcolor.RGBA());
			},
		
		//-- Update -------------------------------------------//
			
			update : function(){
				var Q=this;
			},
		
		//-- Boundary ---------------------------------//
		
			containsPnt : function( vec ){var Q=this;
				return Q.rectHitTest(vec);
			}
			
		/////////////////////////////
			
			/*updateInfoPtr : function(){ //!-- TEMPORARY!!!
				var Q=this;
				if( Q.infoPtr ){
					Q.infoPtr.pos( Q.localToScreen(vVec(0,0)).add_xyz(Q.P.radius,0) );///////
				}			
			}*/
			
			
	});
	
}).call(this);
/*
* wickk - vEllipse.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.vEllipse = vObj.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'vEllipse'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(a){var Q=this;
				Q.$super();
				
				//-- Attributes
					Q.P.fillcolor = new vColor(200,200,0,0.75);
					Q.P.strokecolor = new vColor(200,0,200,0.75);
					Q.P.ra = 25;
					Q.P.rb = 25;
				//-- Meta Variables
					Q.renderStroke = false;
			},
			
			i : function(ra, rb){var Q=this;
				Q.P.ra = ra||25;
				Q.P.rb = rb||Q.P.ra;
				return Q;
			},
			
		//-- Render -------------------------------------------//
			
			render : function(){var Q=this;
				Q.rndr.ellipse(vVec(),Q.P.ra,Q.P.rb,Q.P.fillcolor.RGBA());
				//Q.renderDebug();
			},
		
		//-- Update -------------------------------------------//
			
			update : function(){
				var Q=this;
			},

		//-- Boundary ---------------------------------//
		
			containsPnt : function( vec ){var Q=this;					
				return Q.ellipseHitTest(vec);
			}
			
		/////////////////////////////
			
			/*updateInfoPtr : function(){ //!-- TEMPORARY!!!
				var Q=this;
				if( Q.infoPtr ){
					Q.infoPtr.pos( Q.localToScreen(aVec(0,0)).add_xyz(Q.P.radius,0) );///////
				}			
			}*/
	
	});
	
}).call(this);
/*
* wickk - vImage.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.vImage = vObjBase.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'vImage'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(a){var Q=this;
				Q.$super();
				//-- Attributes
					Q.P.imgSrc = null;
					Q.img = new Image();
					Q.img_loaded = false;
					
					Q.P.width = 10;
					Q.P.height = 10;
			},
			
			i : function(img_src){var Q=this;
				Q.imgSrc(img_src);
				return Q;
			},
		
		//-- Image Handling -------------------------------------------//
			
			imgSrc : function(imgSrc){var Q=this;
				if(imgSrc==undefined){ return Q.P.imgSrc; }
				else{
					imgSrc = imgSrc.replace('\n','');
					if(Q.P.imgSrc==imgSrc){ return this; }
					Q.P.imgSrc = imgSrc;
					Q.img.src = imgSrc;
					Q.img_loaded = false;
					Q.img.onload = function(){
						Q.img_loaded = true;
						Q.P.width = Q.img.width;
						Q.P.height = Q.img.height;
						Q.onImageLoad();
					};
					Q.img.onerror = function(){
						Q.handleLoadError();
					};
					return this;
				}
			},
			
			onImageLoad : function(){
				C('Image Loaded!');
			},
			
			handleLoadError : function(){
				C('Image loading error');
			},
		
		//-- Render -------------------------------------------//
			
			render : function(){var Q=this;
				if(Q.img_loaded){
					Q.ctx.drawImage(Q.img,0,0, Q.P.width, Q.P.height);
				}
			},
		
		//-- Update -------------------------------------------//
			
			update : function(){
				var Q=this;
			},
		
		//-- Boundary ---------------------------------//
		
			containsPnt : function( vec ){var Q=this;
				return Q.rectHitTest(vec);
			}
			
	});
	
}).call(this);
/*
* wickk - vTextBox.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.vTextBox = vObj.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'vTextBox'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(){var Q=this;
				Q.$super();
				//-- Content
					Q.P.text = 'Hello World!';
				//-- Font
					Q.font = null; //!-- make this private and call flatten in postInitialize()
					Q.P.fontName = 'sans-serif';
					Q.P.fontSize = 12;
					Q.P.fontMetric = 'px';
					Q.P.fontColor = new vColor();
				//-- Dimensions
					Q.P.width = 0;
					Q.P.height = 0;		
			},
			
			postInitialize : function(){var Q=this;
				Q.flattenFont();
				Q.text(Q.P.text);
			},
			
			i : function(text){var Q=this;
				Q.text(text,false);
				return Q;
			},
			
			//-- We tie into setting the Canvas
			setCnvs : function( cnvs ){var Q=this;
				Q.$super(cnvs);
				Q.calculateDimensions();
			},
		
		//-- Text getter/setters -------------------------------------------//
		
			text : function(text, process){var Q=this;
				if(text==undefined){ return Q.P.text; }
				else{ 
					Q.P.text=text;
					Q.calculateDimensions();
				}
			},

		//-- Metrics -------------------------------------------//
		
			calculateDimensions : function(){var Q=this;
				//-- Handle Width:
					if(!Q.ctx)return;
					//-- Setup context font for testing:
						Q.ctx.save();
						Q.applyFont();
					//-- do it:
						var metrics = Q.ctx.measureText(Q.P.text);
						Q.P.width = metrics.width;
					//-- Clean up
						Q.ctx.restore();
				//-- Handle Height //!-- Naive approach
					Q.P.height = Q.P.fontSize;
			},
		
		//-- Font getter/setters -------------------------------------------//
			
			//-- Always 'flatten' font components to one applicable string
			flattenFont : function(){var Q=this;
				Q.font = Q.P.fontSize+Q.P.fontMetric+' '+Q.P.fontName;
				//-- Recalculate
				Q.calculateDimensions()
			},
		
			applyFont : function(){var Q=this;
				if(Q.font) Q.ctx.font = Q.font;
			},
		
			fontName : function(f){var Q=this;
				if(f==undefined){ return Q.P.fontName; }
				else{ Q.P.fontName=f;  Q.flattenFont(); }
			},
			fontSize : function(s){var Q=this;
				if(s==undefined){ return Q.P.fontSize; }
				else{ Q.P.fontSize=s; Q.flattenFont(); }
			},
			fontMetric : function(s){var Q=this;
				if(s==undefined){ return Q.P.fontMetric; }
				else{ Q.P.fontMetric=s; Q.flattenFont(); }
			},
		
		//-- Render -------------------------------------------//
			
			render : function(){var Q=this;
				Q.applyFont();
				Q.ctx.fillStyle = Q.P.fontColor.RGBA();
				Q.ctx.fillText(Q.P.text,0,0);
			},
		
		//-- Update -------------------------------------------//
			
			update : function(){
				var Q=this;
			},
		
		//-- Boundary ---------------------------------//
		
			containsPnt : function( vec ){var Q=this;
				if( vec.x >= 0 )
					if( vec.y >= 0 )
						if( vec.x < Q.P.width )
							if( vec.y < Q.P.height )
								return true;	
				return false;
			}
		
	});
	
}).call(this);
/*
* wickk - j$.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

/*
	Wrapper for a Html Element / Jquery object
*/

;(function(){var root=this;
	
	root.j$ = aObj.$extend({
		__classvars__ : {
			aType : 'j$'
		},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(){var Q=this;
				Q.$super();
				//-- Attributes
					Q.$e = null; 				//-- Outer Jquery element
					Q.boundObj = null; 			//-- Pointer to currently attached vObj
					Q.P.pos = new vVec();		//-- Effective offset from parent
					Q.visible = true;			//-- Visibility
					Q.P.boundOffset = new vVec();
				//-- HTML5 Canvas Drawing options
					Q.ctx = null; Q.cnvs = null; Q.rndr = null;
				//-- Create the div
					Q.initializeHTML();
			},
			
			initializeHTML : function(){var Q=this;
				Q.$e = $('<div>').appendTo('#holder');
				//-- Enable mousemove pass through to Canvas
				Q.$e.mousemove( function(){
					if(Q.cnvs)
						Q.cnvs.$cnvs.trigger('mousemove');
				});
			},
		
		//-- Visibility ------------------------------------------------//
		
			hide : function(){var Q=this;
				Q.$e.hide(); Q.visible = false;
			},
			
			show : function(){var Q=this;
				Q.$e.show(); Q.visible = true;
			},
			
			toggle : function(state){var Q=this;
				Q.visible = state||!Q.visible;
				Q.$e.toggle(Q.visible);
			},
					
		//-- Setters ------------------------------------------------//
			
			setCnvs : function( cnvs ){var Q=this;
				Q.cnvs = cnvs;
				Q.ctx = (Q.cnvs)?Q.cnvs.ctx:null;
				Q.rndr = (Q.cnvs)?Q.cnvs.rndr:null;
				Q.cO.each( function(e){
					if(e.setCnvs) e.setCnvs(cnvs);
				});
			},
			
			pos : function(vec){var Q=this;
				if(vec!=undefined) Q.$e.xy(vec.addN(Q.P.pos));
			},
			
		//-- Pass through so we can add as a child to an vObj
			
			update : function(){var Q=this;
				if(Q.boundObj!=null && Q.visible){
					Q.pos( Q.boundObj.localToScreen(vVec()).addN(Q.P.boundOffset) );
				}
			},
			
			updateTree : function(){this.update();},
			renderTree : function(){this.render();},
			render : function(){},
			handleEventTree : function(){return false;},
		
		//-- bind + unbind ------------------------------------------------//
		
			bindToObj : function(obj){var Q=this;
				Q.unbind();
				if(obj) Q.boundObj = obj;
			},
		
			unbind : function(){var Q=this;
				Q.boundObj = null;
			},
			
		//-- fast builds ------------------------------------------------//
			
			ele : function(tag, id, clss, html, parent){var Q=this;
				var e = $('<'+tag+'>');
				if(id) e.attr('id',id);
				if(clss) e.addClass(clss);
				if(html){
					if(tag=='input'||tag=='textarea') e.val(html);
					else e.html(html);
				}
				return e.appendTo(parent||Q.$e);
			}
		
		
	});
	
}).call(this);
	
	
	
	
	
/*
* wickk - jUi.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.jUi = j$.$extend({
		__classvars__ : {
			aType : 'jUi'
		},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(){var Q=this;
				Q.$super();	
				//-- Initialize Default Attributes
					Q.$dflt = Q.$e;						//-- Default Container	
					Q.baseBttnCls = 'button wickk-icon';	//-- Default Button base class
					Q.dfltInputTxtClr = '#777';			//-- Default Input Static Text Color
					Q.dfltInputTxtClrEdit = 'red';		//-- Default Input Edit Text Color
			},
		
		//-- Utilities ------------------------------------------------//
		
			//-- Get and Set the default container
			dflt$ : function(div){var Q=this;
				if(div==undefined){ return Q.$dflt; }
				else{ Q.$dflt=$(div); }
			},
			
			//-- Casting Tool
			cast : function(to, str){
				if(to=='string')return str;
				if(to=='int') return parseFloat(str); //!-- We don't give a shit
				if(to=='float') return parseFloat(str);
				else return str;
			},
		
		//-- Ui Panels ------------------------------------------------//
		
			createUiPanel : function(panelClass, parentDiv){var Q=this;
				return Q.ele('div',null,'uiContainer '+panelClass||'',null,parentDiv||Q.$dflt);
			},
			
			createUiTitle : function(Title, panelClass, parentDiv){var Q=this;
				return Q.ele('div',null,'uiTitle '+panelClass||'',Title,parentDiv||Q.$dflt);
			},
			
		//-- Buttons ------------------------------------------------//	
		
			//-- Text Based Buttons -----------------------------//
			
				createTextButton : function(a){var Q=this;
					if(!a) return null;		
					//-- Make the button
						var tmp$ = Q.ele('span',null,a.baseClass,a.html,a.container||Q.$dflt);
						/*var tmp$ = $('<div>')
							.addClass(a.baseIcon||Q.baseBttnCls)
							.addClass( a.Icon||'' )
							.appendTo(a.container||Q.$dflt)*/
					//-- Wire up button
						if(a.onClick)
							tmp$.click(function(){a.onClick(this);});
						if(a.onDblClick)
							tmp$.dblclick( function(){ a.onDblClick(this);});
					//-- return it
						return tmp$;
				},
				
				createStateTextButton : function(a){var Q=this;
					if(!a) return null;		
					//-- Make the button
						var tmp$ = Q.ele('span',null,a.baseClass,a.html,a.container||Q.$dflt);
						/*var tmp$ = $('<div>')
							.addClass(a.baseIcon||Q.baseBttnCls)
							.appendTo(a.container||Q.$dflt);*/
					//-- Set starting icon
						tmp$.addClass( (a.tgt[a.vr])?a.tIcon:a.fIcon );
					//-- Wire up button
						tmp$.click( function(){
							//-- flip target
							a.tgt[a.vr] = ! a.tgt[a.vr];
							$(this).toggleClass(a.tClass, a.tgt[a.vr]);
							$(this).toggleClass(a.fClass, !a.tgt[a.vr]);
							//-- Call onClick
							if(a.onClick) a.onClick(this);
						});
					//-- return it
						return tmp$;
				},
			
			//-- Icon Based Buttons -----------------------------//
			
				createIconButton : function(a){var Q=this;
					if(!a) return null;		
					//-- Make the button
						var tmp$ = $('<div>')
							.addClass(a.baseIcon||Q.baseBttnCls)
							.addClass( a.Icon||'' )
							.appendTo(a.container||Q.$dflt)
					//-- Wire up button
						if(a.onClick)
							tmp$.click(function(){a.onClick(this);});
						if(a.onDblClick)
							tmp$.dblclick( function(){ a.onDblClick(this);});
					//-- return it
						return tmp$;
				},
				
				createStateIconButton : function(a){var Q=this;
					if(!a) return null;		
					//-- Make the button
						var tmp$ = $('<div>')
							.addClass(a.baseIcon||Q.baseBttnCls)
							.appendTo(a.container||Q.$dflt);
					//-- Set starting icon
						tmp$.addClass( (a.tgt[a.vr])?a.tIcon:a.fIcon );
					//-- Wire up button
						tmp$.click( function(){
							//-- flip target
							a.tgt[a.vr] = ! a.tgt[a.vr];
							$(this).toggleClass(a.tIcon, a.tgt[a.vr]);
							$(this).toggleClass(a.fIcon, !a.tgt[a.vr]);
							//-- Call onClick
							if(a.onClick) a.onClick(this);
						});
					//-- return it
						return tmp$;
				},
			
		//-- Attributes ------------------------------------------------//
		
			//-- Strings ------------------------------------------------//
				
				//-- Return pointer to the input, not its container
				createStringAttr : function(a){var Q=this;
					if(!a) return;
					var $tmpC = Q.ele('div',null,null,null,a.container||Q.$dflt);
					if(a.title){ Q.ele('div',null,'attrTitle',a.title,$tmpC); }
					return Q.ele('textarea',a.id,'msgText',null,$tmpC);
				},
				
				wireStringAttr : function($tgt, cType, a){var Q=this;
					if(!a) return;
					//-- Set and wire up the input
						$tgt.val( a.tgt.inP(a.vr) );
						$tgt.blur(function(){
							$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
							a.tgt.inP( a.vr, Q.cast(cType,$(this).val()) );
						});
						$tgt.keydown(function(e){
							if( e.which==13 ){
								$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
								a.tgt.inP( a.vr, Q.cast(cType,$(this).val()) );
							}else{
								$(this).css('color',a.editColor||Q.dfltInputTxtClrEdit);
							}
						});
				},
			
			//-- Numerical ------------------------------------------------//
			
				//-- Return pointer to the input, not its container
				createNumAttr : function(a){var Q=this;
					if(!a) return;
					var $tmpC = Q.ele('div',null,null,null,a.container||Q.$dflt);
					if(a.title){ Q.ele('div',null,'attrTitle',a.title,$tmpC); }
					return Q.ele('input',a.id,'attrInput',null,$tmpC);
				},
				
				wireNumAttr : function($tgt, cType, a){var Q=this;
					if(!a) return;
					//-- Set and wire up the input
						$tgt.val( a.tgt.inP(a.vr) );
						$tgt.blur(function(){
							$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
							a.tgt.inP( a.vr, Q.cast(cType,$(this).val()) );
						});
						$tgt.keydown(function(e){
							if( e.which==13 ){
								$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
								a.tgt.inP( a.vr, Q.cast(cType,$(this).val()) );
							}else{
								$(this).css('color',a.editColor||Q.dfltInputTxtClrEdit);
							}
						});
						Q.addNumericalIncrements($tgt, a);
				},
				
				//-- Handles numerical incrementation
				addNumericalIncrements : function( $tgt, a ){var Q=this;
					var p$ = $tgt.parent(); var inc$;
					//-- Plus and Minus
						Q.ele('span',null,'minus','-',p$).click( function(){
							$tgt.val( Q.cast('float',$tgt.val())-Q.cast('float',inc$.val())).trigger('blur'); });
						Q.ele('span',null,'plus','+',p$).click( function(){
							$tgt.val( Q.cast('float',$tgt.val())+Q.cast('float',inc$.val())).trigger('blur'); });
					//-- Make the increment
						inc$ = Q.ele('input',null,'increment',a.deltaInc||1,p$);
				
				},
				
			//-- vVec ------------------------------------------------//
			
				//-- Return pointer to the input, not its container
				createVecAttr : function(a){var Q=this;
					if(!a) return;
					var $tmpC = Q.ele('div',null,null,null,a.container||Q.$dflt);
					if(a.title){ Q.ele('div',null,'attrTitle',a.title,$tmpC); }
					$.each(['x','y','z'], function(k,v){
						Q.ele('input',v,'shortattrInput',null,$tmpC); });
					return $tmpC;
				},
				
				wireVecAttr : function($tgt, cType, a){var Q=this;
					if(!a) return;
					$.each( ['x','y','z'], function(k,v){
						var input = $tgt.find('#'+v).val( a.tgt.inP(a.vr)[v] );
						input.blur(function(){
							$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
							a.tgt.inP(a.vr)[v] = Q.cast('float',$(this).val());
						});
						input.keydown(function(e){
							if( e.which==13 ){
								$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
								a.tgt.inP(a.vr)[v] = Q.cast('float',$(this).val());
							}else{
								$(this).css('color',a.editColor||Q.dfltInputTxtClrEdit);
							}
						});
					});
				},
				
			//-- vColor ------------------------------------------------//
			
				//-- Return pointer to the input, not its container
				createColorAttr : function(a){var Q=this;
					if(!a) return;
					var $tmpC = Q.ele('div',null,null,null,a.container||Q.$dflt);
					if(a.title){ Q.ele('div',null,'attrTitle',a.title,$tmpC); }
					$.each(['r','g','b','a'], function(k,v){
						Q.ele('input',v,'veryshortattrInput',null,$tmpC); });
					return $tmpC;
				},
				
				wireColorAttr : function($tgt, cType, a){var Q=this;
					if(!a) return;
					//-- Set and wire up the input
						$.each( ['r','g','b', 'a'], function(k,v){
							var input = $tgt.find('#'+v).val( a.tgt.inP(a.vr)[v] );
							input.blur(function(){
								$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
								a.tgt.inP(a.vr)[v] = Q.cast('float',$(this).val());
								a.tgt.inP(a.vr).flatten();
							});
							input.keydown(function(e){
								if( e.which==13 ){
									$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
									a.tgt.inP(a.vr)[v] = Q.cast('float',$(this).val());
									a.tgt.inP(a.vr).flatten();
								}else{
									$(this).css('color',a.editColor||Q.dfltInputTxtClrEdit);
								}
							});
						});
				},
		
			//-- Booleans ------------------------------------------------//
				
				//-- Return pointer to the input, not its container
				createBooleanAttr : function(a){var Q=this;
					if(!a) return;
					//-- Create Container
						var $tmpC = $('<div>').appendTo(a.container||Q.$dflt);
						if(a.id) $tmpC.attr('id',id)
					//-- Create Title
						if(a.title) var $title = $('<div>').addClass('attrTitle').html(a.title).appendTo($tmpC);
					//-- Create Toggles					
						var $true = Q.ele('span',null,'boolAttr','true',$tmpC);
						var $false = Q.ele('span',null,'boolAttr','false',$tmpC);
					//-- Sync and Wire toggles
						var setColor = function(){
							$true.toggleClass('boolOn',a.tgt.inP(a.vr) );
							$false.toggleClass('boolOn',!a.tgt.inP(a.vr) );
						};
						setColor();
						$true.click( function(){
							a.tgt.inP(a.vr, true);setColor();
						});
						$false.click( function(){
							a.tgt.inP(a.vr, false);setColor();
						});
					return $tmpC;
				}
			
	});
	
}).call(this);
	
	
	
	
/*
* wickk - jInspector.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.jInspector = jUi.$extend({
		__classvars__ : {
			aType : 'jInspector'
		},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(){var Q=this;
				Q.$super();
				//-- Links
					Q.tgt = null; 				//-- Pointer to currently attached aObj
					Q.ref_tgt = null;			//-- Pointer to reference aObj
					Q.tgtScreenPos = vVec();	//-- Holds tgts Screen Reference
				//-- Property copy/apply options
					Q.immediateApply = false;
				//-- Set if pinned or not
					Q.pinned = true;
				//-- HTML5 Canvas Drawing options
					Q.renderOverlayMask = true;
					Q.tgtFlagColor = 'rgba(0,255,0,0.75)';
					Q.ref_tgtFlagColor = 'rgba(0,0,255,0.75)';
				
				//-- Build it
					Q.$e.addClass('jInspector');
					Q.buildUiPanels();
					Q.buildButtons();
					Q.hide();
			},
		
		//-- Build ------------------------------------------------//
			
			buildUiPanels : function(){var Q=this;
				Q.dflt$(Q.$e);
				Q.createUiTitle('CURRENT TARGET');
				Q.$idPanel = Q.createUiPanel('attrPanel');
					Q.$id = $('<div>').addClass('idString').appendTo(Q.$idPanel);
				Q.createUiTitle('GRAPH ( Q.pO + Q.cO )');
				Q.$parentPanel = Q.createUiPanel('attrPanel');
					Q.$parent = $('<div>').addClass('idStringLink').appendTo(Q.$parentPanel);
				Q.$childrenPanel = Q.createUiPanel('attrPanel');
				Q.createUiTitle('LINKS ( Q.U )');
				Q.$linksPanel = Q.createUiPanel('attrPanel');
				Q.createUiTitle('ATTRIBUTES ( Q.P )');
				Q.$buttonPanel = Q.createUiPanel('buttonPanel');
				Q.$attrPanel = Q.createUiPanel('attrPanel');
			},
			
			buildButtons : function(){var Q=this;
				//-- Make Buttons
					Q.dflt$(Q.$buttonPanel);
					Q.createTextButton({
						html : 'P > [ ]',
						baseClass : 'textButton',
						onClick: function(){if(Q.tgt!=null) Q.ref_tgt = Q.tgt;}
						});
					Q.createTextButton({
						html : '[ ] > P',
						baseClass : 'textButton',
						onClick: function(){ Q.applyRefToTgt();}
						});
					Q.createStateTextButton({
						html : '[ ] >> P',
						baseClass : 'textButton', 
						tClass : 'textButtonRed', fClass : 'textButton',
						tgt:Q, vr:'immediateApply'
						});
			},
			
		//-- Utilties ------------------------------------------------//
			
			toggle : function(state){var Q=this;
				Q.$super(state);
				Q.renderOverlayMask = Q.visible;
			},
			
			update : function(){var Q=this;
				Q.$super();
				if(Q.visible && Q.renderOverlayMask)
					Q.renderOverlay();
			},
			
			pos : function(vec){var Q=this;
				Q.tgtScreenPos.setV(vec);
				if(!Q.pinned) Q.$super(vec);
			},
			
			applyRefToTgt : function(){var Q=this;
				if(Q.tgt==null||Q.ref_tgt==null) return;
				if( $.atype(Q.tgt) == $.atype(Q.ref_tgt) ){
					//!-- NEED TO IGNORE POS, ROT, SCALE
					var p = $.extend({}, Q.ref_tgt.P); //!-- We're copying here, perhaps more efficient manner
					//!-- Ignore position information here...
					$.each( ['pos','rot','scl'], function(k,v){
						if(v in p) delete p[v];
					});
					Q.tgt.setP(p);
				}
			},
		
		//-- Render ------------------------------------------------//
		
			//-- These are called in update()
		
			renderOverlay : function(){var Q=this;
				if(Q.ctx == null || Q.tgt == null) return;
				//-- We need to update this and not rely on the object itself
				//Q.tgtScreenPos.setV( Q.tgt.offsetInfoPtr() );
				Q.renderCross(Q.tgtScreenPos, Q.tgtFlagColor);
				if(Q.ref_tgt != null)
					Q.renderCross(
						Q.ref_tgt.localToCanvas(Q.ref_tgt.offsetInfoPtr()),
						Q.ref_tgtFlagColor
					);
			},
			
			renderCross : function(vec,color){var Q=this;
				Q.ctx.beginPath();
					Q.ctx.fillStyle = color||'rgba(0,255,0,0.5)';
					var f = 10, w = 4, l = 15;
					Q.ctx.rect(vec.x-w/2, vec.y-(f+l), w, l);
					Q.ctx.rect(vec.x+f, vec.y-w/2, l, w);
					Q.ctx.rect(vec.x-w/2, vec.y+(f), w, l);
					Q.ctx.rect(vec.x-(f+l), vec.y-w/2, l, w);
					Q.ctx.fill();
				Q.ctx.closePath();
			},
		
		//-- Attach + Detatch ------------------------------------------------//
			
			attach : function(obj){var Q=this;
				Q.detach(); if(!obj)return;
				//-- Bind to the target
					Q.tgt = obj; obj.infoPtr = Q;
					gP = obj; //!-- Sets Global Pointer
				//-- Check for immediate apply
					if(Q.immediateApply) Q.applyRefToTgt();
				//-- Set ID
					Q.$id.html( Q.tgt.id() );
				//-- Scene Graph Panel
					Q.buildSceneGraphPanel(Q.tgt);
					Q.buildLinksPanel(Q.tgt);
					Q.buildAttrPanel(Q.tgt);
			},
			
			detach : function(){var Q=this;
				if(Q.tgt!=null){
					Q.tgt.infoPtr = null;
					Q.tgt = null;}
			},
			
		//-- Build Scene Graph Access Panel ------------------------------------------------//
		
			buildSceneGraphPanel : function(obj){var Q=this;
				//-- Set Parent:
					Q.$parent.html('pO: '+obj.getpOid() ).click(function(){
						Q.attach( obj.pO );
					});
				//-- Set Children
					Q.$childrenPanel.empty();
					if(obj.numC()>0){
						obj.eachC(function(i,c){
							Q.ele('div',null,'idStringLink','cO['+i+']: '+c.id(),Q.$childrenPanel)
								.click(function(){ Q.attach( c ); });
						});
					}else{
						Q.ele('div',null,'noChildren','no children',Q.$childrenPanel);
					}
			},
			
		//-- Build Links Access Panel ------------------------------------------------//
		
			buildLinksPanel : function(obj){var Q=this;
				Q.$linksPanel.empty();
				if(obj.U==undefined) return;
				var count = 0;
				$.each( obj.U, function( k, v){
					if(obj.U[k] == null ){
						Q.ele('div',null,'noChildren',k+': null',Q.$linksPanel); }
					else if($.atype(obj.U[k])=='aList'){
						if(obj.U[k].size()>0){
							obj.U[k].each(function(i,v){
								if(v!=null){
									Q.ele('div',null,'idStringLink',k+'['+i+']: '+v.id(),Q.$linksPanel)
										.click(function(){ Q.attach( v ); });
								}else{
									Q.ele('div',null,'noChildren',k+'['+i+']: null',Q.$linksPanel);
								}
							});
						}else{
							Q.ele('div',null,'noChildren',k+': []',Q.$linksPanel);
						}
					}else{
						var v = obj.U[k];
						Q.ele('div',null,'idStringLink',k+': '+v.id(),Q.$linksPanel)
							.click(function(){ Q.attach( v ); });
					}
					count++;
				});
				if(count==0)
					Q.ele('div',null,'noChildren','no links',Q.$linksPanel);
			},
			
		//-- Build Attribute Edit Panel ------------------------------------------------//
				
			addAttr : function(OBJ, attrName, attrVal, attrRange){var Q=this;
				//if( attrName == 'pos' || attrName == 'scl' || attrName == 'rot' ) return;
				
				if(!OBJ || !$.isDef(attrName) || !$.isDef(attrVal))return;
				if(!attrRange)var attrRange={};
				switch( $.type(attrVal) ){
					case 'boolean':
						Q.createBooleanAttr({
							title:attrName,tgt:OBJ,vr: attrName,
						});
						break;
					case 'string':
						var $attr = Q.createStringAttr({title:attrName});
						Q.wireStringAttr($attr,$.atype(attrVal),{
							tgt:OBJ,vr:attrName,deltaInc:attrRange.step||1});
						break;
					case 'number':
						var $attr = Q.createNumAttr({title:attrName});
						Q.wireNumAttr($attr,$.atype(attrVal),{
							tgt:OBJ,vr:attrName,deltaInc:attrRange.step||1});
						break;
					case 'object':
						if( $.atype(attrVal) == 'vVec'){
							var $attr = Q.createVecAttr({title:attrName});
							Q.wireVecAttr($attr,$.atype(attrVal),{
								tgt:OBJ,vr:attrName,deltaInc:attrRange.step||1});
						}
						else if( $.atype(attrVal) == 'vColor'){
							var $attr = Q.createColorAttr({title:attrName});
							Q.wireColorAttr($attr,$.atype(attrVal),{
								tgt:OBJ,vr:attrName,deltaInc:attrRange.step||1});
						}
						break;
				};
			},
			
			//-- Used if target has no $class.admin
			buildAttrPanel : function(OBJ){var Q=this;
				//-- Clear the Attribute Panel 
					Q.$attrPanel.empty();
				//-- Populate the Table
					Q.dflt$(Q.$attrPanel);
					$.each( OBJ.P, function(attrName,attrVal){
						Q.addAttr(OBJ, attrName, attrVal);
					});
			}
	});
	
}).call(this);
	
	
	
	
	
