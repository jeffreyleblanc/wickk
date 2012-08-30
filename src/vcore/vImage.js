/*
* wickk - vImage.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.vImage = vObjBase.$extend({
		//-- Class Vars ------------------------------------------------//
			__classvars__ : {
				aType : 'vImage'
			},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(a){var Q=this;
				Q.$super();
				//-- Attributes
					Q.P.imgSrc = null;
					Q.img = new Image();
					Q.img_loaded = false;
					
					Q.P.width = 10;
					Q.P.height = 10;
			},
			
			i : function(img_src){var Q=this;
				Q.imgSrc(img_src);
				return Q;
			},
		
		//-- Image Handling -------------------------------------------//
			
			imgSrc : function(imgSrc){var Q=this;
				if(imgSrc==undefined){ return Q.P.imgSrc; }
				else{
					imgSrc = imgSrc.replace('\n','');
					if(Q.P.imgSrc==imgSrc){ return this; }
					Q.P.imgSrc = imgSrc;
					Q.img.src = imgSrc;
					Q.img_loaded = false;
					Q.img.onload = function(){
						Q.img_loaded = true;
						Q.P.width = Q.img.width;
						Q.P.height = Q.img.height;
						Q.onImageLoad();
					};
					Q.img.onerror = function(){
						Q.handleLoadError();
					};
					return this;
				}
			},
			
			onImageLoad : function(){
				C('Image Loaded!');
			},
			
			handleLoadError : function(){
				C('Image loading error');
			},
		
		//-- Render -------------------------------------------//
			
			render : function(){var Q=this;
				if(Q.img_loaded){
					Q.ctx.drawImage(Q.img,0,0, Q.P.width, Q.P.height);
				}
			},
		
		//-- Update -------------------------------------------//
			
			update : function(){
				var Q=this;
			},
		
		//-- Boundary ---------------------------------//
		
			containsPnt : function( vec ){var Q=this;
				return Q.rectHitTest(vec);
			}
			
	});
	
}).call(this);