/*
* wickk - vEllipse.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.vEllipse = vObj.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'vEllipse'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(a){var Q=this;
				Q.$super();
				
				//-- Attributes
					Q.P.fillcolor = new vColor(200,200,0,0.75);
					Q.P.strokecolor = new vColor(200,0,200,0.75);
					Q.P.ra = 25;
					Q.P.rb = 25;
				//-- Meta Variables
					Q.renderStroke = false;
			},
			
			i : function(ra, rb){var Q=this;
				Q.P.ra = ra||25;
				Q.P.rb = rb||Q.P.ra;
				return Q;
			},
			
		//-- Render -------------------------------------------//
			
			render : function(){var Q=this;
				Q.rndr.ellipse(vVec(),Q.P.ra,Q.P.rb,Q.P.fillcolor.RGBA());
				//Q.renderDebug();
			},
		
		//-- Update -------------------------------------------//
			
			update : function(){
				var Q=this;
			},

		//-- Boundary ---------------------------------//
		
			containsPnt : function( vec ){var Q=this;					
				return Q.ellipseHitTest(vec);
			}
			
		/////////////////////////////
			
			/*updateInfoPtr : function(){ //!-- TEMPORARY!!!
				var Q=this;
				if( Q.infoPtr ){
					Q.infoPtr.pos( Q.localToScreen(aVec(0,0)).add_xyz(Q.P.radius,0) );///////
				}			
			}*/
	
	});
	
}).call(this);