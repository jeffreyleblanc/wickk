/*
* wickk - vTransform2D.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.vTransform2D = aSeed.$extend({
	
		__isPrimitive__ : true,
	
		__classvars__ : {

		},
	
		//-- Constructor ------------------------------------//
		
			__init__: function(a, b, c, d, x, y) {
				this.e = [
					[a||0, b||0, x||0],
					[c||0, d||0, y||0],
					[0, 0, 1]
				];
				return this;
			},
		
		//-- Meta ------------------------------------//

			type : function(){
				return 'vTransform2D';
			},
			
			ISatype : function(){
				return true;
			},
			
		//-- Copy ------------------------------------//
		
			copy : function(){var Q=this;
				return new vTransform2D(Q.e[0][0],Q.e[0][1],Q.e[1][0],Q.e[1][1],Q.e[0][2],Q.e[1][2]);
			},
		
		//-- Set ------------------------------------//
		
			//!-- Need set to another transform
			
			setM: function(a, b, c, d, x, y) {
				this.e[0][0] = a||0;
				this.e[0][1] = b||0;
				this.e[1][0] = c||0;
				this.e[1][1] = d||0;
				this.e[0][2] = x||0;
				this.e[1][2] = y||0;
				return this;
			},
			
			setI : function(){var Q=this;
				for(var i=0; i<Q.e.length; i++)
					for(var j=0; j<Q.e.length; j++)
						Q.e[i][j] = (i==j)?1:0;
				return this;
			},
			
			setROT: function(rad){var Q=this;
				var c = Math.cos(rad);
				var s = Math.sin(rad);
				Q.e[0][0] = c;
				Q.e[0][1] = -1*s;
				Q.e[1][0] = s;
				Q.e[1][1] = c;
				return this;
			},
			
			setSCL : function(sx, sy){var Q=this;
				Q.e[0][0] = sx;
				Q.e[0][1] = 0;
				Q.e[1][0] = 0;
				Q.e[1][1] = sy;
				return this;
			},
			
			setXY : function(vec){
				this.e[0][2] = vec.x;
				this.e[1][2] = vec.y;
				return this;
			},
			
		//-- Apply to Context ------------------------------------//
		
			applyToCTX : function( ctx ){var Q=this;
				ctx.transform(Q.e[0][0],Q.e[0][1],Q.e[1][0],Q.e[1][1],Q.e[0][2],Q.e[1][2]);
			},
		
		//-- Operations ------------------------------------//
				
			//-- this*v
			apply_v : function( v ){var Q=this;
				var tmpV = new vVec();
				tmpV.x = Q.e[0][0]*v.x + Q.e[0][1]*v.y + Q.e[0][2];
				tmpV.y = Q.e[1][0]*v.x + Q.e[1][1]*v.y + Q.e[1][2];
				tmpV.z = v.z;
				return tmpV;
			},
			
			//-- this*M
			x : function( M ){var Q=this;
				var N = new vTransform2D();
				for(var r=0; r<3; r++)
					for(var c=0; c<3; c++){
						var sum = 0;
						for(var i=0; i<3; i++){
							sum += Q.e[r][i]*M.e[i][c];
						}
						N.e[r][c] = sum;
					}
				return N;
			},
			
			//!-- what is this? applying an inverse matrix?
			apply_vi : function( v ){var Q=this;
				var tmpV = new vVec();
				var x = v.x + Q.e[0][2];
				var y = v.y + Q.e[1][2];
				//-- Not sure why here...
				tmpV.x = Q.e[0][0]*x + Q.e[0][1]*y;
				tmpV.y = Q.e[1][0]*x + Q.e[1][1]*y;
				tmpV.z = v.z;
				return tmpV;
			},
			
			//-- When using this, need to check for null return
			getInverse : function(){var Q=this;
				var d = Q.e[0][0]*Q.e[1][1]-Q.e[0][1]*Q.e[1][0]; //!-- IF d == 0???
				if(d === 0)
					return null;
				else
					return new vTransform2D(Q.e[1][1]/d, -1*Q.e[0][1]/d, -1*Q.e[1][0]/d, Q.e[0][0]/d, -1*Q.e[0][2], -1*Q.e[1][2]);
			},
		
		//-- i/o ------------------------------------//
		
			print : function(){
				var Q=this;
				for(var i=0; i<Q.e.length; i++)
					C('| '+Q.e[i][0]+','+Q.e[i][1]+','+Q.e[i][2]+' |');
			}

	});

}).call(this);