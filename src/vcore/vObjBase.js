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