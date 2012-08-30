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