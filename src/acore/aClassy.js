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