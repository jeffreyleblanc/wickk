/*
* wickk - vTextBox.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.vTextBox = vObj.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'vTextBox'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(){var Q=this;
				Q.$super();
				//-- Content
					Q.P.text = 'Hello World!';
				//-- Font
					Q.font = null; //!-- make this private and call flatten in postInitialize()
					Q.P.fontName = 'sans-serif';
					Q.P.fontSize = 12;
					Q.P.fontMetric = 'px';
					Q.P.fontColor = new vColor();
				//-- Dimensions
					Q.P.width = 0;
					Q.P.height = 0;		
			},
			
			postInitialize : function(){var Q=this;
				Q.flattenFont();
				Q.text(Q.P.text);
			},
			
			i : function(text){var Q=this;
				Q.text(text,false);
				return Q;
			},
			
			//-- We tie into setting the Canvas
			setCnvs : function( cnvs ){var Q=this;
				Q.$super(cnvs);
				Q.calculateDimensions();
			},
		
		//-- Text getter/setters -------------------------------------------//
		
			text : function(text, process){var Q=this;
				if(text==undefined){ return Q.P.text; }
				else{ 
					Q.P.text=text;
					Q.calculateDimensions();
				}
			},

		//-- Metrics -------------------------------------------//
		
			calculateDimensions : function(){var Q=this;
				//-- Handle Width:
					if(!Q.ctx)return;
					//-- Setup context font for testing:
						Q.ctx.save();
						Q.applyFont();
					//-- do it:
						var metrics = Q.ctx.measureText(Q.P.text);
						Q.P.width = metrics.width;
					//-- Clean up
						Q.ctx.restore();
				//-- Handle Height //!-- Naive approach
					Q.P.height = Q.P.fontSize;
			},
		
		//-- Font getter/setters -------------------------------------------//
			
			//-- Always 'flatten' font components to one applicable string
			flattenFont : function(){var Q=this;
				Q.font = Q.P.fontSize+Q.P.fontMetric+' '+Q.P.fontName;
				//-- Recalculate
				Q.calculateDimensions()
			},
		
			applyFont : function(){var Q=this;
				if(Q.font) Q.ctx.font = Q.font;
			},
		
			fontName : function(f){var Q=this;
				if(f==undefined){ return Q.P.fontName; }
				else{ Q.P.fontName=f;  Q.flattenFont(); }
			},
			fontSize : function(s){var Q=this;
				if(s==undefined){ return Q.P.fontSize; }
				else{ Q.P.fontSize=s; Q.flattenFont(); }
			},
			fontMetric : function(s){var Q=this;
				if(s==undefined){ return Q.P.fontMetric; }
				else{ Q.P.fontMetric=s; Q.flattenFont(); }
			},
		
		//-- Render -------------------------------------------//
			
			render : function(){var Q=this;
				Q.applyFont();
				Q.ctx.fillStyle = Q.P.fontColor.RGBA();
				Q.ctx.fillText(Q.P.text,0,0);
			},
		
		//-- Update -------------------------------------------//
			
			update : function(){
				var Q=this;
			},
		
		//-- Boundary ---------------------------------//
		
			containsPnt : function( vec ){var Q=this;
				if( vec.x >= 0 )
					if( vec.y >= 0 )
						if( vec.x < Q.P.width )
							if( vec.y < Q.P.height )
								return true;	
				return false;
			}
		
	});
	
}).call(this);