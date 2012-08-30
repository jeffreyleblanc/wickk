/*
* wickk - jUi.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.jUi = j$.$extend({
		__classvars__ : {
			aType : 'jUi'
		},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(){var Q=this;
				Q.$super();	
				//-- Initialize Default Attributes
					Q.$dflt = Q.$e;						//-- Default Container	
					Q.baseBttnCls = 'button tx-icon';	//-- Default Button base class
					Q.dfltInputTxtClr = '#777';			//-- Default Input Static Text Color
					Q.dfltInputTxtClrEdit = 'red';		//-- Default Input Edit Text Color
			},
		
		//-- Utilities ------------------------------------------------//
		
			//-- Get and Set the default container
			dflt$ : function(div){var Q=this;
				if(div==undefined){ return Q.$dflt; }
				else{ Q.$dflt=$(div); }
			},
			
			//-- Casting Tool
			cast : function(to, str){
				if(to=='string')return str;
				if(to=='int') return parseFloat(str); //!-- We don't give a shit
				if(to=='float') return parseFloat(str);
				else return str;
			},
		
		//-- Ui Panels ------------------------------------------------//
		
			createUiPanel : function(panelClass, parentDiv){var Q=this;
				return Q.ele('div',null,'uiContainer '+panelClass||'',null,parentDiv||Q.$dflt);
			},
			
			createUiTitle : function(Title, panelClass, parentDiv){var Q=this;
				return Q.ele('div',null,'uiTitle '+panelClass||'',Title,parentDiv||Q.$dflt);
			},
			
		//-- Buttons ------------------------------------------------//	
		
			//-- Text Based Buttons -----------------------------//
			
				createTextButton : function(a){var Q=this;
					if(!a) return null;		
					//-- Make the button
						var tmp$ = Q.ele('span',null,a.baseClass,a.html,a.container||Q.$dflt);
						/*var tmp$ = $('<div>')
							.addClass(a.baseIcon||Q.baseBttnCls)
							.addClass( a.Icon||'' )
							.appendTo(a.container||Q.$dflt)*/
					//-- Wire up button
						if(a.onClick)
							tmp$.click(function(){a.onClick(this);});
						if(a.onDblClick)
							tmp$.dblclick( function(){ a.onDblClick(this);});
					//-- return it
						return tmp$;
				},
				
				createStateTextButton : function(a){var Q=this;
					if(!a) return null;		
					//-- Make the button
						var tmp$ = Q.ele('span',null,a.baseClass,a.html,a.container||Q.$dflt);
						/*var tmp$ = $('<div>')
							.addClass(a.baseIcon||Q.baseBttnCls)
							.appendTo(a.container||Q.$dflt);*/
					//-- Set starting icon
						tmp$.addClass( (a.tgt[a.vr])?a.tIcon:a.fIcon );
					//-- Wire up button
						tmp$.click( function(){
							//-- flip target
							a.tgt[a.vr] = ! a.tgt[a.vr];
							$(this).toggleClass(a.tClass, a.tgt[a.vr]);
							$(this).toggleClass(a.fClass, !a.tgt[a.vr]);
							//-- Call onClick
							if(a.onClick) a.onClick(this);
						});
					//-- return it
						return tmp$;
				},
			
			//-- Icon Based Buttons -----------------------------//
			
				createIconButton : function(a){var Q=this;
					if(!a) return null;		
					//-- Make the button
						var tmp$ = $('<div>')
							.addClass(a.baseIcon||Q.baseBttnCls)
							.addClass( a.Icon||'' )
							.appendTo(a.container||Q.$dflt)
					//-- Wire up button
						if(a.onClick)
							tmp$.click(function(){a.onClick(this);});
						if(a.onDblClick)
							tmp$.dblclick( function(){ a.onDblClick(this);});
					//-- return it
						return tmp$;
				},
				
				createStateIconButton : function(a){var Q=this;
					if(!a) return null;		
					//-- Make the button
						var tmp$ = $('<div>')
							.addClass(a.baseIcon||Q.baseBttnCls)
							.appendTo(a.container||Q.$dflt);
					//-- Set starting icon
						tmp$.addClass( (a.tgt[a.vr])?a.tIcon:a.fIcon );
					//-- Wire up button
						tmp$.click( function(){
							//-- flip target
							a.tgt[a.vr] = ! a.tgt[a.vr];
							$(this).toggleClass(a.tIcon, a.tgt[a.vr]);
							$(this).toggleClass(a.fIcon, !a.tgt[a.vr]);
							//-- Call onClick
							if(a.onClick) a.onClick(this);
						});
					//-- return it
						return tmp$;
				},
			
		//-- Attributes ------------------------------------------------//
		
			//-- Strings ------------------------------------------------//
				
				//-- Return pointer to the input, not its container
				createStringAttr : function(a){var Q=this;
					if(!a) return;
					var $tmpC = Q.ele('div',null,null,null,a.container||Q.$dflt);
					if(a.title){ Q.ele('div',null,'attrTitle',a.title,$tmpC); }
					return Q.ele('textarea',a.id,'msgText',null,$tmpC);
				},
				
				wireStringAttr : function($tgt, cType, a){var Q=this;
					if(!a) return;
					//-- Set and wire up the input
						$tgt.val( a.tgt.inP(a.vr) );
						$tgt.blur(function(){
							$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
							a.tgt.inP( a.vr, Q.cast(cType,$(this).val()) );
						});
						$tgt.keydown(function(e){
							if( e.which==13 ){
								$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
								a.tgt.inP( a.vr, Q.cast(cType,$(this).val()) );
							}else{
								$(this).css('color',a.editColor||Q.dfltInputTxtClrEdit);
							}
						});
				},
			
			//-- Numerical ------------------------------------------------//
			
				//-- Return pointer to the input, not its container
				createNumAttr : function(a){var Q=this;
					if(!a) return;
					var $tmpC = Q.ele('div',null,null,null,a.container||Q.$dflt);
					if(a.title){ Q.ele('div',null,'attrTitle',a.title,$tmpC); }
					return Q.ele('input',a.id,'attrInput',null,$tmpC);
				},
				
				wireNumAttr : function($tgt, cType, a){var Q=this;
					if(!a) return;
					//-- Set and wire up the input
						$tgt.val( a.tgt.inP(a.vr) );
						$tgt.blur(function(){
							$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
							a.tgt.inP( a.vr, Q.cast(cType,$(this).val()) );
						});
						$tgt.keydown(function(e){
							if( e.which==13 ){
								$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
								a.tgt.inP( a.vr, Q.cast(cType,$(this).val()) );
							}else{
								$(this).css('color',a.editColor||Q.dfltInputTxtClrEdit);
							}
						});
						Q.addNumericalIncrements($tgt, a);
				},
				
				//-- Handles numerical incrementation
				addNumericalIncrements : function( $tgt, a ){var Q=this;
					var p$ = $tgt.parent(); var inc$;
					//-- Plus and Minus
						Q.ele('span',null,'minus','-',p$).click( function(){
							$tgt.val( Q.cast('float',$tgt.val())-Q.cast('float',inc$.val())).trigger('blur'); });
						Q.ele('span',null,'plus','+',p$).click( function(){
							$tgt.val( Q.cast('float',$tgt.val())+Q.cast('float',inc$.val())).trigger('blur'); });
					//-- Make the increment
						inc$ = Q.ele('input',null,'increment',a.deltaInc||1,p$);
				
				},
				
			//-- vVec ------------------------------------------------//
			
				//-- Return pointer to the input, not its container
				createVecAttr : function(a){var Q=this;
					if(!a) return;
					var $tmpC = Q.ele('div',null,null,null,a.container||Q.$dflt);
					if(a.title){ Q.ele('div',null,'attrTitle',a.title,$tmpC); }
					$.each(['x','y','z'], function(k,v){
						Q.ele('input',v,'shortattrInput',null,$tmpC); });
					return $tmpC;
				},
				
				wireVecAttr : function($tgt, cType, a){var Q=this;
					if(!a) return;
					$.each( ['x','y','z'], function(k,v){
						var input = $tgt.find('#'+v).val( a.tgt.inP(a.vr)[v] );
						input.blur(function(){
							$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
							a.tgt.inP(a.vr)[v] = Q.cast('float',$(this).val());
						});
						input.keydown(function(e){
							if( e.which==13 ){
								$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
								a.tgt.inP(a.vr)[v] = Q.cast('float',$(this).val());
							}else{
								$(this).css('color',a.editColor||Q.dfltInputTxtClrEdit);
							}
						});
					});
				},
				
			//-- vColor ------------------------------------------------//
			
				//-- Return pointer to the input, not its container
				createColorAttr : function(a){var Q=this;
					if(!a) return;
					var $tmpC = Q.ele('div',null,null,null,a.container||Q.$dflt);
					if(a.title){ Q.ele('div',null,'attrTitle',a.title,$tmpC); }
					$.each(['r','g','b','a'], function(k,v){
						Q.ele('input',v,'veryshortattrInput',null,$tmpC); });
					return $tmpC;
				},
				
				wireColorAttr : function($tgt, cType, a){var Q=this;
					if(!a) return;
					//-- Set and wire up the input
						$.each( ['r','g','b', 'a'], function(k,v){
							var input = $tgt.find('#'+v).val( a.tgt.inP(a.vr)[v] );
							input.blur(function(){
								$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
								a.tgt.inP(a.vr)[v] = Q.cast('float',$(this).val());
								a.tgt.inP(a.vr).flatten();
							});
							input.keydown(function(e){
								if( e.which==13 ){
									$(this).css('color',a.staticColor||Q.dfltInputTxtClr);
									a.tgt.inP(a.vr)[v] = Q.cast('float',$(this).val());
									a.tgt.inP(a.vr).flatten();
								}else{
									$(this).css('color',a.editColor||Q.dfltInputTxtClrEdit);
								}
							});
						});
				},
		
			//-- Booleans ------------------------------------------------//
				
				//-- Return pointer to the input, not its container
				createBooleanAttr : function(a){var Q=this;
					if(!a) return;
					//-- Create Container
						var $tmpC = $('<div>').appendTo(a.container||Q.$dflt);
						if(a.id) $tmpC.attr('id',id)
					//-- Create Title
						if(a.title) var $title = $('<div>').addClass('attrTitle').html(a.title).appendTo($tmpC);
					//-- Create Toggles					
						var $true = Q.ele('span',null,'boolAttr','true',$tmpC);
						var $false = Q.ele('span',null,'boolAttr','false',$tmpC);
					//-- Sync and Wire toggles
						var setColor = function(){
							$true.toggleClass('boolOn',a.tgt.inP(a.vr) );
							$false.toggleClass('boolOn',!a.tgt.inP(a.vr) );
						};
						setColor();
						$true.click( function(){
							a.tgt.inP(a.vr, true);setColor();
						});
						$false.click( function(){
							a.tgt.inP(a.vr, false);setColor();
						});
					return $tmpC;
				}
			
	});
	
}).call(this);
	
	
	
	