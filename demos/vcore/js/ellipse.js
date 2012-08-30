/*
* wickk - ellipse.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.ellipse = vEllipse.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'ellipse'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(a){var Q=this;
				Q.$super();
				Q.draggable = true;
			},
			
		//-- Render -------------------------------------------//
			
			render : function(){var Q=this;
				Q.$super();
				Q.renderDebug();
			},
		
		//-- Events ---------------------------------//
		
			eventDefaults : function(){return {
				mousedown : function( evt ){var Q=this;
					C(Q.id()+' I was mousedowned!');
					Q.cnvs.inspector.attach(Q);
				}
			}}
				
	});
	
}).call(this);