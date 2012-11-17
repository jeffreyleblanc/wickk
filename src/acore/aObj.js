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

				// match only { ... }
				// patt = /\{[^/{/}]+\}/gi
				
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