/*
* wickk - vVec.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;

	root.vVec = function(x, y, z){
	  if( !(this instanceof arguments.callee) ) 
	    return new arguments.callee(x, y, z); 

		this.x = x||0;
		this.y = y||0;
		this.z = z||0;
	};

	root.vVec.$class = {
		
		dot : function( v1, v2 ){
			return  v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
		},
		
		midPoint : function(v1,v2){
			return new vVec( (v1.x+v2.x)/2, (v1.y+v2.y)/2, (v1.z+v2.z/2) );
		},
		
		tangentAlong : function(v1,v2,amt){
			var tangent = v1.copy().sub(v2);
			return tangent.mult(amt||1.0);
		},
		
		project : function( base, other ){
			var mD = vVec.dot(base,other);
			var bD = vVec.dot(base,base);
			return base.copy().mult(mD/bD);
		}
	};

	root.vVec.prototype =  {

		//-- Typing ------------------------------------//
		
			type : function(){
				return 'vVec';
			},
			
			ISatype : function(){
				return true;
			},
		
		//-- Copy ------------------------------------//
		
			copy : function(){
				return new vVec(this.x, this.y, this.z);
			},
		
		//-- Setters ------------------------------------//
		
			set : function(a1, a2, a3){
				if($.atype(a1)=='vVec') return this.setV(a1);
				else if($.atype(a1)=='object') return this.setEVT(a1);
				else return this.setXYZ(a1,a2,a3);
			},
			
			setXYZ : function(x, y, z) {
				this.x = x||this.x; this.y = y||this.y; this.z = z||this.z;
				return this;
			},
			
			setV : function(vec) {
				this.x = vec.x; this.y = vec.y; this.z = vec.z;
				return this;
			},
			
			setEVT : function(e) {
				this.x = e.pageX; this.y = e.pageY;
				return this;
			},
			
			zero : function(){
				this.x = this.y = this.z = 0;
				return this;
			},
			
		//-- Equality Functions -------------------------------//
			
			equals : function( V ){//!--TEST
				var Q = this;
				return ((Q.x == V.x) && (Q.y == V.y) && (Q.z == V.z));
			},
			
			almostEquals : function(vec, tol_){//!--TEST
				var tol = tol_||0.05;
				return (distanceSquaredApart(vec) < tol*tol);
			},
		
		//-- Basic Functions -------------------------------//
		
			add : function(vec) {
				this.x += vec.x; this.y += vec.y; this.z += vec.z;
				return this;
			},
			
			addXYZ : function(x,y,z) {
				this.x += x||0;
				this.y += y||0;
				this.z += z||0;
				return this;
			},
			
			addN : function(v){
				return new vVec( this.x+v.x, this.y+v.y, this.z+v.z);
			},
			
			sub : function(vec) {
				this.x -= vec.x; this.y -= vec.y; this.z -= vec.z;
				return this;
			},
			
			subXYZ : function(x,y,z) {
				this.x -= x||0;
				this.y -= y||0;
				this.z -= z||0;
				return this;
			},
			
			subN : function(v){
				return new vVec( this.x-v.x, this.y-v.y, this.z-v.z);
			},
			
			mult : function(s){
				this.x *= s;
				this.y *= s;
				this.z *= s;
				return this;
			},
			
			multN : function(s){
				return new vVec( this.x*s, this.y*s, this.z*s);
			},
			
			div : function(s){
				this.x /= s;
				this.y /= s;
				this.z /= s;
				return this;
			},
			
			divN : function(s){
				return new vVec( this.x/s, this.y/s, this.z/s);
			},
			
			//-- per index multiplication
			scale : function(vec){
				this.x *= vec.x;
				this.y *= vec.y;
				this.z *= vec.z;
				return this;
			},
			
			scaleN : function(vec){
				return new vVec( this.x*vec.x, this.y*vec.y, this.z*vec.y);
			},
			
		//-- Length Functions -------------------------------//
			
			lngth : function(){
				return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
			},
			
			//-- Shortcut setter/getter
			l : function(lngth){
				if(!lngth)
					return this.lngth();
				else
					return this.normalize().mult(lngth);
			},
			
			lngthSquared : function(){
				return this.x*this.x + this.y*this.y + this.z*this.z;
			},
			
			//-- Shortcut setter/getter
			lSQ : function(lsq){
				if(!lsq)
					return this.lngthSquared();
				else
					return this.normalize().mult(Math.sqrt(lsq));
			},
			
			normalize : function(){
				var l = this.lngth();
				if(l==0){ l=0.00001; }
				this.x /= l; this.y /= l; this.z /= l;
				return this;
			},
			
			limit : function(lim){
				if( this.lngthSquared() > lim*lim ){
					this.normalize().mult(lim);
				}
				return this;
			},
			
			//!-- Check
			distanceApart : function(V){var Q = this;
				return Math.sqrt( (Q.x-V.x)*(Q.x-V.x) + (Q.y-V.y)*(Q.y-V.y) + (Q.z-V.z)*(Q.z-V.z) );
			},
			
			//!-- Check
			distanceSquaredApart : function(V){var Q = this;
				return ( (Q.x-V.x)*(Q.x-V.x) + (Q.y-V.y)*(Q.y-V.y) + (Q.z-V.z)*(Q.z-V.z) );
			},

		
		//-- Rotation ----------------------------------------//
			
			rot : function(rad){var Q=this;
				if(!rad){
					return Math.atan2( this.y, this.x );
				}else{
					if( $.type(rad) === 'string'){
						if(rad=='CW'){
							var hold = Q.x;
							Q.x = Q.y; Q.y = -1.0*hold;
						} else if(rad=='CCW'){
							var hold = Q.x;
							Q.x = -1.0*Q.y; Q.y = hold;
						} else if(rad=='180'){
							Q.x *= -1.0;
							Q.y *= -1.0;
						}
					}else{
						/*Q.x = Q.x*Math.cos(rad) + Q.y*Math.sin(rad);
						Q.y = -1*Q.x*Math.sin(rad) + Q.y*Math.cos(rad);*/
						var holdx = Q.x*Math.cos(rad) - Q.y*Math.sin(rad);
						Q.y = Q.x*Math.sin(rad) + Q.y*Math.cos(rad);
						Q.x = holdx;
					}
					return this;
				}
			},
			
			rotN : function(rad){var Q=this;
				return this.copy().rot(rad);
			},
			
			setPolar : function(mag, rad){
				this.x = mag * Math.cos(rad); 
				this.y = mag * Math.sin(rad);
				return this;
			},
			
			//!-- Check
			segmentRadians : function(V){
				return this.copy().sub(V).radians();
			},
			
		//-- Randomize --------------------------------------//
		
			//-- Box bounded
			randomizeBox : function(amt){
				this.x = 2*amt * (Math.random()-0.5);
				this.y = 2*amt * (Math.random()-0.5);
				return this;
			},
			
			//-- Circle bounded
			randomizeCircle : function(amt){
				return this.setPolar(amt*Math.random(), Math.random()*Math.TWOPI);
			},
		
		//-- JSON ----------------------------------------//
		
			print : function(){
				C( '| '+this.x+' |');
				C( '| '+this.y+' |');
				C( '| '+this.z+' |');
			},
			
			p : function(){
				return 'vVec( '+this.x+', '+this.y+', '+this.z+')';
			},
			
			j : function(){ //!--NEED TO ID AS AVEC
				return '{ "aType":"vVec", "x": '+this.x+' ,"y": '+this.y+', "z":'+this.z+'}';		
			},
			
			toJson : function(){
				return '{ "x": '+this.x+' ,"y": '+this.y+' }';		
			},
			
			setByJson : function(json){
				var json = makeJO(json);
				this.x = json.x;
				this.y = json.y;
			}

	}; // END PROTOTYPE

}).call(this);