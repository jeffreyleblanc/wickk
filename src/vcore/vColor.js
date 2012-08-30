/*
* wickk - vColor.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.vColor = aSeed.$extend({
	
		__isPrimitive__ : true,
	
		__classvars__ : {
			mix : function(c1,c2){
				return new vColor( (c1.r+c2.r)/2, (c1.g+c2.g)/2, (c1.b+c2.b)/2, 1);
			},
			
			mixerize : function(c1,c2,a1){
				var a2 = 1.0-a1; 
				return new vColor( a1*c1.r+a2*c2.r, a1*c1.g+a2*c2.g, a1*c1.b+a2*c2.b, (c1.a+c2.a)/2);
			}
			
		},
	
		__init__: function(r, g, b, a) {
			this.atype = 'vColor';
			this.r = r||1;
			this.g = g||1;
			this.b = b||1;
			this.a = a||1;
			
			this.rgb = 'rgb(0,0,0';
			this.rgba = 'rgba(0,0,0,0)';
			this.flatten();
		},
		
		//-- Typing ------------------------------------//
		
			type : function(){
				return 'vColor';
			},
			
			ISatype : function(){
				return true;
			},
		
		//-- Copy ------------------------------------//
		
			copy : function(){
				return new vColor(this.r, this.g, this.b, this.a);
			},
		
		//-- Apply ------------------------------------//
		
			apply : function( ctx ){
				return this.rgba;
			},
			
			applyAfilter : function( ctx, filter ){
				if(filter==undefined) var filter=ctx; //!-- BAD
				return 'rgba'+this.rgb+','+(this.a*filter)+')';
			},
		
		//-- Getters/Setters ------------------------------------//
		
			//-- Utility to help 'flatten' values to a string for use with the context
			flatten : function(){
				var c = '('+parseInt(this.r)+','+parseInt(this.g)+','+parseInt(this.b);
				this.rgb = c; //!-- Note, is not closed!
				this.rgba = 'rgba'+c+','+(this.a)+')';
				return this;
			},
			
			R : function(r){
				if(r==undefined) return this.r;
				else{ this.r=r;return this.flatten();}},
			G : function(g){
				if(g==undefined) return this.g;
				else{ this.g=g;return this.flatten();}},
			B : function(b){
				if(b==undefined) return this.b;
				else{ this.b=b;return this.flatten();}},
			A : function(a){
				if(a==undefined) return this.a;
				else{ this.a=a;return this.flatten();}},
			
			RGBA : function(r,g,b,a){
				if(r==undefined) return this.rgba;
				else{
					this.r = r||1;
					this.g = g||1;
					this.b = b||1;
					this.a = a||1;
					return this.flatten();
				}
			},
			
			RGB : function(r,g,b){
				if(r==undefined) return 'rgb'+this.rgb+')';
				else{
					this.r = r||1;
					this.g = g||1;
					this.b = b||1;
					this.a = 1;
					return this.flatten();
				}
			},
			
			STR : function(str){
				//-- expect 'rgb(1,1,1)' or 'rgba(1,1,1,1)
				try{
					var rgba;
					if(str.indexOf('rgba(')==0){
						str=str.replace('rgba(','').replace(')','');
						var rgba = str.split(',');
					}else if(str.indexOf('rgb(')==0){
						str=str.replace('rgb(','').replace(')','');
						var rgba = str.split(',');
						rgba.push(1);
					}else return this;
					this.r = parseInt(rgba[0]);
					this.g = parseInt(rgba[1]);
					this.b = parseInt(rgba[2]);
					this.a = parseFloat(rgba[3]);
					
				}catch(e){}
				return this.flatten();
			},
			
			CLR : function(color){
				if(!color) return this.copy();
				else{
					this.r = color.r;
					this.g = color.g;
					this.b = color.b;
					this.a = color.a;
					return this.flatten();
				}
			},
			
		//-- Randomize ------------------------------------//
			
			randomize : function(amt){
				if(!amt) var amt=255;
				this.r = amt * Math.random();
				this.g = amt * Math.random();
				this.b = amt * Math.random();
				this.a = 1;
				return this.flatten();
			},
			
			//-- Results in a 'softer' palette
			prettyRandomize : function(){
				this.r = 255 * randomRange(0.2,1.0);
				this.g = 255 * randomRange(0.2,1.0);
				this.b = 255 * randomRange(0.2,1.0);
				this.a = randomRange(0.3,0.9);
				return this.flatten();
			},
		
		//-- JSON ----------------------------------------//
		
			print : function(){
				C( '| '+this.r+' |');
				C( '| '+this.g+' |');
				C( '| '+this.b+' |');
				C( '| '+this.a+' |');
			},
			
			j : function(){ //!--NEED TO ID AS AVEC
				return '{ "aType":"vColor", "r": '+this.r+' ,"g": '+this.g+', "b":'+this.b+','+this.a+' }';			
			},
			
			toJson : function(){
				return '{ "r": '+this.r+' ,"g": '+this.g+', "b":'+this.b+','+this.a+' }';	
			},
			
			setByJson : function(json){
				var json = makeJO(json);
				this.r = json.r;
				this.g = json.g;
				this.b = json.b;
				this.a = json.a;
			},
		
		//!-- FROM HERE DOWN IS IN DEVELOPMENT -------------------//
					
		//-- Equality Functions -------------------------------//
			
			equals : function( C ){
				var Q = this;
				return ((Q.r == C.r) && (Q.g == C.g) && (Q.b == C.b));
			},
			
			almostEquals : function(C, tol_){//!--TEST
				var tol = tol_||0.05;
				return (distanceSquaredApart(C) < tol*tol);
			},
		
		//-- Basic Functions -------------------------------//
		
			add : function(vec) {
				this.r += vec.r;
				this.g += vec.g;
				this.b += vec.b;
				return this;
			},
			
			add_xyz : function(r,g,b) {
				this.r += r||0;
				this.g += g||0;
				this.b += b||0;
				return this;
			},
			
			sub : function(vec) {
				this.r -= vec.r;
				this.g -= vec.g;
				this.b -= vec.b;
				return this;
			},
			
			mult : function(s){
				this.r *= s;
				this.g *= s;
				this.b *= s;
				return this;
			},
			
			div : function(s){ //!--TEST
				this.r /= s;
				this.g /= s;
				this.b /= s;
				return this;
			},
			
		//-- Length Functions -------------------------------//
			
			lngthSquared : function(){
				return this.r*this.r + this.g*this.g + this.b*this.b;
			},
			
			lngth : function(){
				return Math.sqrt(this.r*this.r + this.g*this.g + this.b*this.b);
			
			},
			
			distanceApart : function(V){//!--TEST
				var Q = this;
				return Math.sqrt( (Q.r-V.r)*(Q.r-V.r) + (Q.g-V.g)*(Q.g-V.g) + (Q.b-V.b)*(Q.b-V.b) );
			},
			
			distanceSquaredApart : function(V){//!--TEST
				var Q = this;
				return ( (Q.r-V.r)*(Q.r-V.r) + (Q.g-V.g)*(Q.g-V.g) + (Q.b-V.b)*(Q.b-V.b) );
			},
			
			normalize : function(){
				var l = this.lngth();
				this.r /= l; this.g /= l; this.b /= l;
				return this;
			},
			
			limit : function(lim){
				if( this.lngthSquared() > lim*lim ){
					this.normalize().mult(lim);
				}
				return this;
			}
	
	}); //End vColor Class
	
}).call(this);