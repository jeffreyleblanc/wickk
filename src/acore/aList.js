/*
* wickk - aList.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;

	root.aList = function(){
	  if( !(this instanceof arguments.callee) ) 
	    return new arguments.callee(); 

	   this.L = new Array();
	};

	root.aList.prototype =  {

		//-- Wickk methods ----------------//

			type : function() {
				return 'aList'; 
			},
			
			ISatype : function(){
				return true;
			},
			
		//-- Meta methods ----------------//
			
			size : function(){var Q=this;
				return Q.L.length;
			},
			
			//-- Dummy method //!-- Why needed?
			setpO : function(p){},
		
		//-- Add Methods ----------------//
		
			add : function( ptr ){var Q=this;
				if(!$.ISatype(ptr))return null;
				Q.L.push( ptr );
				return ptr;
			},
			
			//-- defaults to add at the end
			addAt : function( ptr, idx ){var Q=this;
				if(!$.ISatype(ptr))return null;
				if(idx>0 && idx<Q.L.length)
					Q.L.splice(i,0,ptr);
				else Q.add(ptr);
				return ptr;
			},
			
		//-- Remove Methods ----------------//
		
			rem : function( idx_ptr ){var Q=this;
				var i, found=false;
				if($.atype(idx_ptr)=='int'){
					if(idx_ptr>-1 && idx_ptr<Q.L.length)
						Q.L.splice(idx_ptr,1);
				}else{
					for(i=Q.L.length; i>-1&&!found; i--)
						if(Q.L[i]==idx_ptr){
							Q.L.splice(i,1); found=true; }
				}
				return Q;
			},
			
			clear : function(){var Q=this;
				Q.L.splice(0, Q.L.length);
				return Q;	
			},
			
		//-- Get Methods ----------------//
			
			//-- allows negative indexing
			at : function(i){var Q=this;
				if( i > -1*(Q.L.length+1) && i < Q.L.length ){
					return Q.L[ (i>-1)?i:Q.L.length+i ]
				} else return undefined;
			},
			
			find : function(ptr){var Q=this;
				if(!$.ISatype(ptr)) return null;
				//-- Look for:
				var i, found=false;
				for(i=Q.L.length; i>-1&&!found; i--)
					if(Q.L[i]==ptr){ found=true; }
				return (found)?ptr:null;
			},
			
		//-- Iterate Methods ----------------//	
			
			each : function( fn ){var Q=this;
				var i,v;
				for(i=0; i<Q.L.length; i++){v=Q.L[i];
					if(v.type()!='aList'){ //!-- time consuming?
						if(fn(i,v)==false)break;}
					else{
						v.each(fn);}
				}
				return Q;
			},
			
			each_reverse : function( fn ){var Q=this;
				var i,v;
				for(i=Q.L.length-1; i>-1; i--){v=Q.L[i];
					if(v.type()!='aList'){
						if(fn(i,v)==false)break;}
					else{
						v.each_reverse(fn);}
				}
				return Q;
			},
			
			convolute : function( fn ){var Q=this;
				for(var i=0; i<Q.L.length; i++){
					for(var j=i+1; j<Q.L.length; j++){
						fn(Q.L[i], Q.L[j], i, j);
					}
				}
				return Q;
			},
			
		//-- JSON Methods ----------------//	
		
			j : function(){var Q=this;
				var out = [];
				Q.each( function(i,v){
					out.push( v.id() ); });
				return out;
			}
	};

}).call(this);