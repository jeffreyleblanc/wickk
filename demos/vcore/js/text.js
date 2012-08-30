/*
* wickk - text.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.text = vTextBox.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'text'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(){var Q=this;
				Q.$super();
				Q.draggable = true;
			}
		
	});
	
}).call(this);