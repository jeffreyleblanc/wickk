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