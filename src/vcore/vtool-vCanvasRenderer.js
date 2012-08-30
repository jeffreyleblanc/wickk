/*
* wickk - vtool-vCanvasKit.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	//-- Note, this is a plain Object
	
	root.vCanvasRenderer = {
	
		//== Setup ========================================//
		
			ctx : null,		//-- Canvas context refrence
			
			bindCtx : function(ctx){
				this.ctx = ctx;
				return this;
			},
			
			setDefaultFont : function(font){
				this.ctx.font = font;
				return this;
			},
		
		//== Shortcuts ========================================//

			lnTo : function( vec ){
				this.ctx.lineTo(vec.x, vec.y);
			},
			
			mvTo : function( vec ){
				this.ctx.moveTo(vec.x, vec.y);
			},
			
		//== Basic Shapes ========================================//
			
			//-- handle vColors
			
			line : function(v1,v2,color,width,cap){
				this.ctx.beginPath();
				this.ctx.moveTo(v1.x, v1.y);
				this.ctx.lineTo(v2.x, v2.y);
				this.ctx.strokeStyle = color||'rgb(0,0,0)';
				this.ctx.lineWidth = width||1;
				this.ctx.lineCap = cap||'round';
				this.ctx.stroke();
				this.ctx.closePath();
			},
			
			lineInc : function(v1,v2,color,width,cap){
				this.line(v1,v1.addN(v2),color,width,cap);
			},
	
			circle : function(center,r,fillcolor,strokecolor,width){
				this.ctx.beginPath();
				this.ctx.arc(center.x, center.y, r||10, 0, Math.TWOPI, false);
				if(fillcolor){
					this.ctx.fillStyle = fillcolor||'rgb(0,0,0)';
					this.ctx.fill(); }
				if(strokecolor){
					this.ctx.strokeStyle = strokecolor||'rgb(0,0,0)';
					this.ctx.lineWidth = width||1;
					this.ctx.stroke(); }
				this.ctx.closePath();
			},
			
			ellipse : function(center,rh,rv,fillcolor,strokecolor,width){
				if(rh==rv){
					this.circle(center,rh,fillcolor,strokecolor,width);
					return;
				}
				
				var circumference = Math.max(rh, rv);
				var scaleX = rh / circumference;
				var scaleY = rv / circumference;
				
				this.ctx.save();
				this.ctx.scale(scaleX, scaleY);
				this.ctx.beginPath();
				this.ctx.arc(center.x, center.y, circumference, 0, Math.TWOPI, false);
				if(fillcolor){
					this.ctx.fillStyle = fillcolor||'rgb(0,0,0)';
					this.ctx.fill(); }
				if(strokecolor){
					this.ctx.strokeStyle = strokecolor||'rgb(0,0,0)';
					this.ctx.lineWidth = width||1;
					this.ctx.stroke(); }
				this.ctx.closePath();
				this.ctx.restore();
			},
	
			rect : function(vec,w,h,fillcolor,strokecolor,width){
				this.ctx.beginPath();
				this.ctx.rect(vec.x, vec.y, w, h);
				if(fillcolor){
					this.ctx.fillStyle = fillcolor||'rgb(0,0,0)';
					this.ctx.fill(); }
				if(strokecolor){
					this.ctx.strokeStyle = strokecolor||'rgb(0,0,0)';
					this.ctx.lineWidth = width||1;
					this.ctx.stroke(); }
				this.ctx.closePath();
			},
			
			rectCenter : function(vec,w,h,fillcolor,strokecolor,width){
				this.ctx.beginPath();
				this.ctx.rect(vec.x-w/2, vec.y-h/2, w, h);
				if(fillcolor){
					this.ctx.fillStyle = fillcolor||'rgb(0,0,0)';
					this.ctx.fill(); }
				if(strokecolor){
					this.ctx.strokeStyle = strokecolor||'rgb(0,0,0)';
					this.ctx.lineWidth = width||1;
					this.ctx.stroke(); }
				this.ctx.closePath();
			},
			
		//== Compound Shapes ========================================//
			
			shape : function( pointList, fillcolor, strokecolor, width ){
				this.ctx.beginPath();
				var numPoints = pointList.length;
				if( numPoints<1 ) return;
				this.mvTo( pointList[0] );
				for(var i=1; i<numPoints; i++){
					this.lnTo( pointList[i] );
				}
				if(fillcolor){
					this.ctx.fillStyle = fillcolor||'rgb(0,0,0)';
					this.ctx.fill(); }
				if(strokecolor!=undefined){
					this.ctx.strokeStyle = strokecolor||'rgb(0,0,0)';
					this.ctx.lineWidth = width||1;
					this.ctx.stroke(); }
				this.ctx.closePath();
				
			}
	}
	
}).call(this);