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