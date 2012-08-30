/*
* wickk - vtool-jquery.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

	//-- Positioning:
		$.fn.x = function(_x) {
			if(_x)
				return this.css('left',_x);
			else
				return this.offset().left;
		};
		$.fn.y = function(_y) {
			if(_y)
				return this.css('top',_y);
			else
				return this.offset().top
		};
		$.fn.xy = function(_pos) {
			if(_pos)
				return this.css( { 'left':_pos.x, 'top': _pos.y } );
			else
				return {x: this.offset().left, y: this.offset().top } 
		};
	//-- Size:
		$.fn.w = function(_w) {
			if(_w)
				return this.width(_w);
			else
				return this.width();
		};
		$.fn.h = function(_h) {
			if(_h)
				return this.height(_h);
			else
				return this.height();
		};
		$.fn.wh = function(_size) {
			if(_size){
				this.width(_size.x);
				return this.height(_size.y);
			} else {
				return {x: this.width(), y: this.height() } 
			}
		};
	//-- Position and Size Shortcuts
		$.fn.centerInWindow = function( sx, sy ) {
			var offset = {
				x: (sx || 0.5 )*($(window).w()-this.w()),
				y: (sy || 0.5 )*($(window).h()-this.h())
			};
			this.xy(offset);
		};
		
	//-- Event Handling
		(function($) {
			$.nowAndOnResize = function( fn ) {
				fn(); $(window).resize(function(){fn();});
			};
		})(jQuery);