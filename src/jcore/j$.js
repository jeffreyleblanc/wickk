/*
* wickk - j$.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

/*
	Wrapper for a Html Element / Jquery object
*/

;(function(){var root=this;
	
	root.j$ = aObj.$extend({
		__classvars__ : {
			aType : 'j$'
		},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(){var Q=this;
				Q.$super();
				//-- Attributes
					Q.$e = null; 				//-- Outer Jquery element
					Q.boundObj = null; 			//-- Pointer to currently attached vObj
					Q.P.pos = new vVec();		//-- Effective offset from parent
					Q.visible = true;			//-- Visibility
					Q.P.boundOffset = new vVec();
				//-- HTML5 Canvas Drawing options
					Q.ctx = null; Q.cnvs = null; Q.rndr = null;
				//-- Create the div
					Q.initializeHTML();
			},
			
			initializeHTML : function(){var Q=this;
				Q.$e = $('<div>').appendTo('#holder');
				//-- Enable mousemove pass through to Canvas
				Q.$e.mousemove( function(){
					if(Q.cnvs)
						Q.cnvs.$cnvs.trigger('mousemove');
				});
			},
		
		//-- Visibility ------------------------------------------------//
		
			hide : function(){var Q=this;
				Q.$e.hide(); Q.visible = false;
			},
			
			show : function(){var Q=this;
				Q.$e.show(); Q.visible = true;
			},
			
			toggle : function(state){var Q=this;
				Q.visible = state||!Q.visible;
				Q.$e.toggle(Q.visible);
			},
					
		//-- Setters ------------------------------------------------//
			
			setCnvs : function( cnvs ){var Q=this;
				Q.cnvs = cnvs;
				Q.ctx = (Q.cnvs)?Q.cnvs.ctx:null;
				Q.rndr = (Q.cnvs)?Q.cnvs.rndr:null;
				Q.cO.each( function(e){
					if(e.setCnvs) e.setCnvs(cnvs);
				});
			},
			
			pos : function(vec){var Q=this;
				if(vec!=undefined) Q.$e.xy(vec.addN(Q.P.pos));
			},
			
		//-- Pass through so we can add as a child to an vObj
			
			update : function(){var Q=this;
				if(Q.boundObj!=null && Q.visible){
					Q.pos( Q.boundObj.localToScreen(vVec()).addN(Q.P.boundOffset) );
				}
			},
			
			updateTree : function(){this.update();},
			renderTree : function(){this.render();},
			render : function(){},
			handleEventTree : function(){return false;},
		
		//-- bind + unbind ------------------------------------------------//
		
			bindToObj : function(obj){var Q=this;
				Q.unbind();
				if(obj) Q.boundObj = obj;
			},
		
			unbind : function(){var Q=this;
				Q.boundObj = null;
			},
			
		//-- fast builds ------------------------------------------------//
			
			ele : function(tag, id, clss, html, parent){var Q=this;
				var e = $('<'+tag+'>');
				if(id) e.attr('id',id);
				if(clss) e.addClass(clss);
				if(html){
					if(tag=='input'||tag=='textarea') e.val(html);
					else e.html(html);
				}
				return e.appendTo(parent||Q.$e);
			}
		
		
	});
	
}).call(this);
	
	
	
	
	