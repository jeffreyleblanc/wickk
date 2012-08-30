/*
* wickk - img.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.img = vImage.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'img'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(){var Q=this;
				Q.$super();
				Q.draggable = true;
			}
		
	});
	
}).call(this);