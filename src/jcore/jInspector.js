/*
* wickk - jInspector.js
* copyright 2012 by Jeffrey LeBlanc LLC. 
*/

;(function(){var root=this;
	
	root.jInspector = jUi.$extend({
		__classvars__ : {
			aType : 'jInspector'
		},
		
		//-- Constructor & Destructor ------------------------------------------------//
			
			initialize : function(){var Q=this;
				Q.$super();
				//-- Links
					Q.tgt = null; 				//-- Pointer to currently attached aObj
					Q.ref_tgt = null;			//-- Pointer to reference aObj
					Q.tgtScreenPos = vVec();	//-- Holds tgts Screen Reference
				//-- Property copy/apply options
					Q.immediateApply = false;
				//-- Set if pinned or not
					Q.pinned = true;
				//-- HTML5 Canvas Drawing options
					Q.renderOverlayMask = true;
					Q.tgtFlagColor = 'rgba(0,255,0,0.75)';
					Q.ref_tgtFlagColor = 'rgba(0,0,255,0.75)';
				
				//-- Build it
					Q.$e.addClass('jInspector');
					Q.buildUiPanels();
					Q.buildButtons();
					Q.hide();
			},
		
		//-- Build ------------------------------------------------//
			
			buildUiPanels : function(){var Q=this;
				Q.dflt$(Q.$e);
				Q.createUiTitle('CURRENT TARGET');
				Q.$idPanel = Q.createUiPanel('attrPanel');
					Q.$id = $('<div>').addClass('idString').appendTo(Q.$idPanel);
				Q.createUiTitle('GRAPH ( Q.pO + Q.cO )');
				Q.$parentPanel = Q.createUiPanel('attrPanel');
					Q.$parent = $('<div>').addClass('idStringLink').appendTo(Q.$parentPanel);
				Q.$childrenPanel = Q.createUiPanel('attrPanel');
				Q.createUiTitle('LINKS ( Q.U )');
				Q.$linksPanel = Q.createUiPanel('attrPanel');
				Q.createUiTitle('ATTRIBUTES ( Q.P )');
				Q.$buttonPanel = Q.createUiPanel('buttonPanel');
				Q.$attrPanel = Q.createUiPanel('attrPanel');
			},
			
			buildButtons : function(){var Q=this;
				//-- Make Buttons
					Q.dflt$(Q.$buttonPanel);
					Q.createTextButton({
						html : 'P > [ ]',
						baseClass : 'textButton',
						onClick: function(){if(Q.tgt!=null) Q.ref_tgt = Q.tgt;}
						});
					Q.createTextButton({
						html : '[ ] > P',
						baseClass : 'textButton',
						onClick: function(){ Q.applyRefToTgt();}
						});
					Q.createStateTextButton({
						html : '[ ] >> P',
						baseClass : 'textButton', 
						tClass : 'textButtonRed', fClass : 'textButton',
						tgt:Q, vr:'immediateApply'
						});
			},
			
		//-- Utilties ------------------------------------------------//
			
			toggle : function(state){var Q=this;
				Q.$super(state);
				Q.renderOverlayMask = Q.visible;
			},
			
			update : function(){var Q=this;
				Q.$super();
				if(Q.visible && Q.renderOverlayMask)
					Q.renderOverlay();
			},
			
			pos : function(vec){var Q=this;
				Q.tgtScreenPos.setV(vec);
				if(!Q.pinned) Q.$super(vec);
			},
			
			applyRefToTgt : function(){var Q=this;
				if(Q.tgt==null||Q.ref_tgt==null) return;
				if( $.atype(Q.tgt) == $.atype(Q.ref_tgt) ){
					//!-- NEED TO IGNORE POS, ROT, SCALE
					var p = $.extend({}, Q.ref_tgt.P); //!-- We're copying here, perhaps more efficient manner
					//!-- Ignore position information here...
					$.each( ['pos','rot','scl'], function(k,v){
						if(v in p) delete p[v];
					});
					Q.tgt.setP(p);
				}
			},
		
		//-- Render ------------------------------------------------//
		
			//-- These are called in update()
		
			renderOverlay : function(){var Q=this;
				if(Q.ctx == null || Q.tgt == null) return;
				//-- We need to update this and not rely on the object itself
				//Q.tgtScreenPos.setV( Q.tgt.offsetInfoPtr() );
				Q.renderCross(Q.tgtScreenPos, Q.tgtFlagColor);
				if(Q.ref_tgt != null)
					Q.renderCross(
						Q.ref_tgt.localToCanvas(Q.ref_tgt.offsetInfoPtr()),
						Q.ref_tgtFlagColor
					);
			},
			
			renderCross : function(vec,color){var Q=this;
				Q.ctx.beginPath();
					Q.ctx.fillStyle = color||'rgba(0,255,0,0.5)';
					var f = 10, w = 4, l = 15;
					Q.ctx.rect(vec.x-w/2, vec.y-(f+l), w, l);
					Q.ctx.rect(vec.x+f, vec.y-w/2, l, w);
					Q.ctx.rect(vec.x-w/2, vec.y+(f), w, l);
					Q.ctx.rect(vec.x-(f+l), vec.y-w/2, l, w);
					Q.ctx.fill();
				Q.ctx.closePath();
			},
		
		//-- Attach + Detatch ------------------------------------------------//
			
			attach : function(obj){var Q=this;
				Q.detach(); if(!obj)return;
				//-- Bind to the target
					Q.tgt = obj; obj.infoPtr = Q;
					gP = obj; //!-- Sets Global Pointer
				//-- Check for immediate apply
					if(Q.immediateApply) Q.applyRefToTgt();
				//-- Set ID
					Q.$id.html( Q.tgt.id() );
				//-- Scene Graph Panel
					Q.buildSceneGraphPanel(Q.tgt);
					Q.buildLinksPanel(Q.tgt);
					Q.buildAttrPanel(Q.tgt);
			},
			
			detach : function(){var Q=this;
				if(Q.tgt!=null){
					Q.tgt.infoPtr = null;
					Q.tgt = null;}
			},
			
		//-- Build Scene Graph Access Panel ------------------------------------------------//
		
			buildSceneGraphPanel : function(obj){var Q=this;
				//-- Set Parent:
					Q.$parent.html('pO: '+obj.getpOid() ).click(function(){
						Q.attach( obj.pO );
					});
				//-- Set Children
					Q.$childrenPanel.empty();
					if(obj.numC()>0){
						obj.eachC(function(i,c){
							Q.ele('div',null,'idStringLink','cO['+i+']: '+c.id(),Q.$childrenPanel)
								.click(function(){ Q.attach( c ); });
						});
					}else{
						Q.ele('div',null,'noChildren','no children',Q.$childrenPanel);
					}
			},
			
		//-- Build Links Access Panel ------------------------------------------------//
		
			buildLinksPanel : function(obj){var Q=this;
				Q.$linksPanel.empty();
				if(obj.U==undefined) return;
				var count = 0;
				$.each( obj.U, function( k, v){
					if(obj.U[k] == null ){
						Q.ele('div',null,'noChildren',k+': null',Q.$linksPanel); }
					else if($.atype(obj.U[k])=='aList'){
						if(obj.U[k].size()>0){
							obj.U[k].each(function(i,v){
								if(v!=null){
									Q.ele('div',null,'idStringLink',k+'['+i+']: '+v.id(),Q.$linksPanel)
										.click(function(){ Q.attach( v ); });
								}else{
									Q.ele('div',null,'noChildren',k+'['+i+']: null',Q.$linksPanel);
								}
							});
						}else{
							Q.ele('div',null,'noChildren',k+': []',Q.$linksPanel);
						}
					}else{
						var v = obj.U[k];
						Q.ele('div',null,'idStringLink',k+': '+v.id(),Q.$linksPanel)
							.click(function(){ Q.attach( v ); });
					}
					count++;
				});
				if(count==0)
					Q.ele('div',null,'noChildren','no links',Q.$linksPanel);
			},
			
		//-- Build Attribute Edit Panel ------------------------------------------------//
				
			addAttr : function(OBJ, attrName, attrVal, attrRange){var Q=this;
				//if( attrName == 'pos' || attrName == 'scl' || attrName == 'rot' ) return;
				
				if(!OBJ || !$.isDef(attrName) || !$.isDef(attrVal))return;
				if(!attrRange)var attrRange={};
				switch( $.type(attrVal) ){
					case 'boolean':
						Q.createBooleanAttr({
							title:attrName,tgt:OBJ,vr: attrName,
						});
						break;
					case 'string':
						var $attr = Q.createStringAttr({title:attrName});
						Q.wireStringAttr($attr,$.atype(attrVal),{
							tgt:OBJ,vr:attrName,deltaInc:attrRange.step||1});
						break;
					case 'number':
						var $attr = Q.createNumAttr({title:attrName});
						Q.wireNumAttr($attr,$.atype(attrVal),{
							tgt:OBJ,vr:attrName,deltaInc:attrRange.step||1});
						break;
					case 'object':
						if( $.atype(attrVal) == 'vVec'){
							var $attr = Q.createVecAttr({title:attrName});
							Q.wireVecAttr($attr,$.atype(attrVal),{
								tgt:OBJ,vr:attrName,deltaInc:attrRange.step||1});
						}
						else if( $.atype(attrVal) == 'vColor'){
							var $attr = Q.createColorAttr({title:attrName});
							Q.wireColorAttr($attr,$.atype(attrVal),{
								tgt:OBJ,vr:attrName,deltaInc:attrRange.step||1});
						}
						break;
				};
			},
			
			//-- Used if target has no $class.admin
			buildAttrPanel : function(OBJ){var Q=this;
				//-- Clear the Attribute Panel 
					Q.$attrPanel.empty();
				//-- Populate the Table
					Q.dflt$(Q.$attrPanel);
					$.each( OBJ.P, function(attrName,attrVal){
						Q.addAttr(OBJ, attrName, attrVal);
					});
			}
	});
	
}).call(this);
	
	
	
	
	