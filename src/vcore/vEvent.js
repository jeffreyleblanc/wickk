/*
* wickk - vEvent.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;

	root.vEvent = function($je){
	  if( !(this instanceof arguments.callee) ) 
	    return new arguments.callee($je); 

		this.etype = '';		//-- Event type
		this.$je = $je||null; 	//-- Jquery event object
		this.spatial = false;	//-- Whether the event is spatial or not
		this.gpos = vVec();		//-- Canvas positon of the event
		this.lpos = vVec();		//-- Local position of the event
		this.global	= false;	//-- Whether the event is 'global'
		this.mDown = false;		//-- If the mouse is down
	};

	root.vEvent.$class = {
		// Empty;
	};

	root.vEvent.prototype =  {
		
		ISatype : function(){
			return true;
		},

		type : function(){
			return 'vEvent';
		},
		
		cleanType : function(){
			return this.etype.replace('_','');
		}

	};

}).call(this);
