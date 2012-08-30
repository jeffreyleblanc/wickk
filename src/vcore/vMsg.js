/*
* wickk - vMsg.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.vMsg = aSeed.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'vMsg'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
		
			__init__: function(from, to, msgText, action, data){var Q=this;
				Q.$super();
				//-- Sender and receiver information
					Q.sender = from||null;		//-- Sender object
					Q.tgt = to||null;			//-- Target object
				//-- Content
					Q.msgText = msgText||'';	//-- Message text
					Q.action = action||null;	//-- Action that will be called in tgt as function(tgt)
					Q.data = data||{};			//-- Data package
				
				//-- Add to the msgList
					aSeed.CMN.msgLIST.add( Q );
					
				return Q;
			},
			
			del : function(){ var Q=this;
				aSeed.CMN.msgLIST.rem( Q );
			}
			
	});﻿
	
}).call(this);