/*
* wickk - vRect.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.vRect = vObj.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'vRect'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(a){var Q=this;
				Q.$super();
				//-- Attributes
					Q.P.fillcolor = new vColor(200,0,0,0.75);
					Q.P.strokecolor = new vColor(200, 0, 200, 0.5);
					Q.P.width = 50;
					Q.P.height = 50;
				//-- Meta Variables
					Q.renderStroke = false;
			
			},
			
			i : function(width, height){var Q=this;
				Q.P.width = width||25;
				Q.P.height = height||Q.P.width;
				return Q;
			},
		
		//-- Render -------------------------------------------//
			
			render : function(){var Q=this;
				Q.rndr.rect(vVec(),Q.P.width,Q.P.height,Q.P.fillcolor.RGBA());
			},
		
		//-- Update -------------------------------------------//
			
			update : function(){
				var Q=this;
			},
		
		//-- Boundary ---------------------------------//
		
			containsPnt : function( vec ){var Q=this;
				return Q.rectHitTest(vec);
			}
			
		/////////////////////////////
			
			/*updateInfoPtr : function(){ //!-- TEMPORARY!!!
				var Q=this;
				if( Q.infoPtr ){
					Q.infoPtr.pos( Q.localToScreen(vVec(0,0)).add_xyz(Q.P.radius,0) );///////
				}			
			}*/
			
			
	});
	
}).call(this);