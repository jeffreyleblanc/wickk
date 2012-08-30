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