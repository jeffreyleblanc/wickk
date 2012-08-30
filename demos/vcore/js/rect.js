/*
* wickk - rect.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.rect = vRect.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'rect'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(a){var Q=this;
				Q.$super();
				Q.draggable = true;
			},
			
		//-- Events ---------------------------------//
		
			eventDefaults : function(){return {
				mouseenter : function( evt ){var Q=this;
					C(Q.id()+' ENTER!');
				},
				
				mouseleave : function( evt ){var Q=this;
					C(Q.id()+' LEAVE!');
				},
				
				dragenter : function( evt ){var Q=this;
					C(Q.id()+' DRAG ENTER!');
				},
				
				dragleave : function( evt ){var Q=this;
					C(Q.id()+' DRAG LEAVE!');
				},
				
				mousedown : function( evt ){var Q=this;
					C(Q.id()+' I was mousedowned!');
					Q.cnvs.inspector.attach(Q);
					
					return Q;
				},
				
				mouseup : function( evt ){var Q=this;
					 C(Q.id()+' I was mouseupped!');
					 return Q;
				},
				
				
				startDrag : function(evt){var Q=this;
					C(Q.id()+' START DRAG!!!');
					return Q;
				},
				
				endDrag : function(evt){var Q=this;
					C(Q.id()+' END END END DRAG!!!');
					return Q;
				},
				
				drag : function( evt ){var Q=this;
					//C(Q.id()+' I was dragged!');
					return Q;
				},
				
			
				
				click : function( evt ){ var Q=this;
					C('clicked!');
				},
				
				dblclick : function( evt ){ var Q=this;
					C('DBLclicked!');
				},
				
				keydown : function(evt){var Q=this;
					//C(Q.id()+'keydown!');
					//C(evt.$je.which);
				},
				
				keypress : function(evt){var Q=this;
					//C(Q.id()+'keypress!');
					//C(evt.$je.which);
				}
			}},
				
			
		/////////////////////////////
			
			/*updateInfoPtr : function(){ //!-- TEMPORARY!!!
				var Q=this;
				if( Q.infoPtr ){
					Q.infoPtr.pos( Q.localToScreen(vVec(0,0)).add_xyz(Q.P.radius,0) );///////
				}			
			}*/
			
			
	});
	
}).call(this);