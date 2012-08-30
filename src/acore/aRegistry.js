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