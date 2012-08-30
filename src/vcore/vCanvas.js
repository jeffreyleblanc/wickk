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