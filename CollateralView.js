/**@功能描述 抵押物信息
 * @作者 ZMZ
 * @日期 2017-3-13
 */
Ext.define('bushandling.formview.CollateralView',{
	extend : 'PC.BaseView',
	alias : 'widget.collateralView',
	config : {
		width : '100%',
		height : '100%',
		style : 'background:#FFF;',
		scrollable : {
			indicators : false
		}
	},
	ids : {// 为每个组件设置id
		gage_name : 'gage_name',// 抵押品名称
		gage_type : 'gage_type',// 抵押品类型
		right_cert_no : 'right_cert_no',// 权属证号
		if_existinghome : 'if_existinghome',// 是否成品房
		right_org : 'right_org',// 权属登记机关
		eval_amt : 'eval_amt',// 银行认定金额(元)
		right_cert_type : 'right_cert_type',// 权属证件类型
		if_max_ratio : 'if_max_ratio',// 是否为最高抵押率
		bank_amt : 'bank_amt',// 最高可抵押金额(元)
		cer_date : 'cer_date',// 核保日期
		gage_loc : 'gage_loc',// 抵押品坐落位置
		gage_ratio : 'gage_ratio',// 设定抵押率(%)
		if_common_asset : 'if_common_asset',// 是否共同财产
		gage_share : 'gage_share',// 共有人名称
		if_insu : 'if_insu',// 是否有保险
		insu_type : 'insu_type',// 投保险种
		insu_amt : 'insu_amt',// 保险金额(元)
		insu_end_date : 'insu_end_date',// 保险到期日
		insu_corp : 'insu_corp',// 保险公司名称
		cer_people1 : 'cer_people1',// 核保人1
		if_cer : 'if_cer',// 是否正式抵押
		cer_people2 : 'cer_people2',// 核保人2
		house_stru : 'house_stru',// 房屋结构
		house_type : 'house_type',// 房产类型
		hou_area : 'hou_area'// 建筑面积(平方米)
	},
	afterLoad : function() {
		this.initLayout();
	},
	/** 初始化布局 */
	initLayout : function() {
		var me = this;
		this.add(Public.getTitleBar('抵押物信息', 'back-button',function(){
			var result = BaseValidate.validate(me.ids);//校验
			if(result.result){//校验成功执行保存数据到服务器
				global_frame_nav.pop();
			}else{
				NativeUI.confirm('当前页面存在必输项未输入，确认退出？',function(){
					global_frame_nav.pop();
				});
			}
		}));
		setTimeout(function() {
			me.createMainView();
		}, 100);
	},
	/** 创建主表单界面 */
	createMainView : function() {
		var me = this;
		me.add(Public.createItemTitle('抵押物信息', '5%'));
		me.createHboxPanel();
		me.createVBoxPanel();
		me.createSaveBtn();
		me.selectManageInfo('selectCollateralInfo');
	},
	/** 水平布局面板 */
	createHboxPanel : function() {
		var me = this, ids = this.ids, hbox = Ext.create('Ext.Container', {
			width : '90%',
			margin : '24px 5% 0 5%',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				defaults : {
					xtype : 'baseTextfield',
					width : '100%',
					labelWidth : '32%',
					labelCls : 'label',
					inputCls : 'input',
					style : 'margin: 5px 0;'
				},
				items: [{
						xtype : 'dataDicSelectView',
						label : '抵押品类型',
						id : ids.gage_type,
						s_field : 'collateralType',
						_changed: function(value,isFirst){
							if(isFirst){
								Ext.getCmp('gage_ratio').setValue('');
								Ext.getCmp('if_max_ratio').setValue('2');
								Ext.getCmp('eval_amt').setValue('');
								Ext.getCmp('bank_amt').setValue('');
							}
						}
					}, {
						xtype : 'dataDicSelectView',
						label : '权属证件类型',
						id : ids.right_cert_type,
						s_field : 'orIDType',
						disabled : true,
						required : false
					}, {
						label : '权属登记机关',
						maxLength : 40,
						id : ids.right_org,
						disabled : true,
						required : false
					}, {
						xtype : 'dataDicSelectView',
						label : '是否为最高抵押率',
						id : ids.if_max_ratio,
						s_field : 'composite',
						_changed : function(value,isFirst) {
							if(isFirst)me.getByGageNo();
						}
					}, {
						xtype : 'baseNumberfield',
						label : '设定抵押率(%)',
						maxLength : 16,
						id : ids.gage_ratio,
						disabled : true
					}, {
						label : '共有人名称',
						maxLength : 30,
						id : ids.gage_share,
						disabled : true,
						required : false,
						selection : [],
						listeners : {
							initialize : function(input) {
								this.element.on('tap', function(e, target,
												options, eventController) {
											if (!input.getDisabled()) {
												me.showSelectList(input);
											}
										});
								if (Adapter.alwModulus > 1.2) {
									this.setLabelWidth(Adapter
											.getAlwWidthCfg(parseFloat(this
													.getLabelWidth())
													* .9 + '%'));
								} else {
									this.setLabelWidth(Adapter
											.getAlwWidthCfg(this
													.getLabelWidth()));
								}
							}
						}
					}, {
						xtype : 'dataDicSelectView',
						label : '是否正式抵押',
						id : ids.if_cer,
						s_field : 'composite'
					}, {
						xtype : 'dataDicSelectView',
						label : '核保人2',
						id : ids.cer_people2,
						maxLength : 30,
						s_value: Bus.Utils.getManageName(),
						_changed : function(value) {
							var cer_people1 = Ext.getCmp('cer_people1');
							if (cer_people1
									&& value == cer_people1.getValue()) {
								Ext.getCmp('cer_people2').setValue('');
								NativeUI.toast('核保人2不能与核保人1相同');
							}
						}
					}, {
						xtype : 'dataDicSelectView',
						label : '房产类型',
						id : ids.house_type,
						s_field : 'propertyType'
					}, {
						xtype : 'baseNumberfield',
						label : '建筑面积(平方米)',
						maxLength : 16,
						id : ids.hou_area,
						s_value: Bus.Utils.getHouArea()
					}, {
						xtype : 'dataDicSelectView',
						label : '投保险种',
						id : ids.insu_type,
						s_field : 'insuranceCoverage',
						disabled : true,
						required : false
					}, {
						xtype: 'baseTextfield',
						label : '保险到期日',
						maxLength : 10,
						id : ids.insu_end_date,
						disabled : true,
						required : false,
						type: 'date'
					}]
			}, {
				xtype : 'spacer',
				width : '5%'
			}, {
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				defaults : {
					xtype : 'baseTextfield',
					width : '100%',
					labelWidth : '32%',
					labelCls : 'label',
					inputCls : 'input',
					style : 'margin: 5px 0;'
				},
				items : [{
							label : '抵押品名称',
							maxLength : 60,
							id : 'gage_name'
						}, {
							label : '权属证号',
							maxLength : 60,
							id : ids.right_cert_no,
							disabled : true,
							required : false
						}, {
							xtype : 'baseNumberfield',
							label : '银行认定金额(元)',
							maxLength : 16,
							id : ids.eval_amt,
							_changed : function(value) {
								me.getByGageNo();
							}
						}, {
							xtype : 'baseNumberfield',
							label : '最高可抵押金额(元)',
							maxLength : 16,
							id : ids.bank_amt,
							_changed : function(value) {
								me.getByGageNo();
							}
						}, {
							xtype : 'dataDicSelectView',
							label : '是否共同财产',
							id : ids.if_common_asset,
							s_field : 'composite',
							_changed : function(value) {// 当输入框值变化时进行相关处理
								me.ifCommonAsset(me, value);
							}
						}, {
							xtype : 'dataDicSelectView',
							label : '是否有保险',
							id : ids.if_insu,
							s_field : 'composite',
							_changed : function(value) {// 待诗哥优化取值等问题
								var disIds = ['insu_type', 'insu_amt',
										'insu_end_date', 'insu_corp'];
								var isDisabled = value == 2 || value == '';
								for (var i = 0; i < disIds.length; i++) {
									var input = Ext.getCmp(disIds[i]);
									if (input) {
										input.setDisabled(isDisabled);
										input.setRequired(!isDisabled);
										input.setValue('');
									}
								}
							}
						}, {
							xtype : 'dataDicSelectView',
							label : '核保人1',
							id : ids.cer_people1,
							maxLength : 30,
							_changed : function(value) {
								var cer_people2 = Ext.getCmp('cer_people2');
								if (cer_people2
										&& value == cer_people2.getValue()) {
									Ext.getCmp('cer_people1').setValue('');
									NativeUI.toast('核保人1不能与核保人2相同');
								}
							}
						}, {
							label : '核保日期',
							maxLength : 10,
							type : 'date',
							id : ids.cer_date
						}, {
							xtype : 'dataDicSelectView',
							label : '是否成品房',
							id : ids.if_existinghome,
							s_field : 'composite'
						}, {
							xtype : 'dataDicSelectView',
							label : '房屋结构',
							id : ids.house_stru,
							s_field : 'buildingStructure',
							s_value: Bus.Utils.getHousesTru()
						}, {
							xtype : 'baseNumberfield',
							label : '保险金额(元)',
							maxLength : 16,
							id : ids.insu_amt,
							disabled : true,
							required : false
						}, {
							label : '保险公司名称',
							maxLength : 40,
							id : ids.insu_corp,
							disabled : true,
							required : false
						}]
			}]
		});
		me.add(hbox);
	},
	/** 长输入框面板 */
	createVBoxPanel : function() {
		var me = this, ids = this.ids, vbox = Ext.create('Ext.Container', {
			width : '90%',
			margin : '0 5%',
			layout : 'vbox',
			defaults : {
				xtype : 'container',
				width : '100%',
				layout : 'hbox',
				style : 'margin: 5px 0;'
			},
			items : [{
				items : [{
							xtype : 'baseTextfield',
							flex : 1,
							maxLength : 100,
							label : '抵押品坐落位置',
							id : ids.gage_loc,
							labelCls : 'label',
							inputCls : 'input',
							labelWidth : '15.1%',
							s_value: Bus.Utils.getHouAddr()
						}, {// 定位按钮
							xtype : 'baseLocBtn',
							width : '2.9em',
							height : '2.9em',
							sourceId : 'gage_loc',// 输入框id
							title : '抵押品坐落位置',// 标题
							style : 'position:absolute;right:5%;margin:1px 3px 0 0;',
							cls : 'positionBtn'
						}]
			}]
		});
		me.add(vbox);
	},
	/** 保存按钮 */
	createSaveBtn : function() {
		var me = this, btn = Ext.create('Ext.Container', {
			width : '100%',
			height : 48,
			margin : '40px 0 100px 0',
			layout : {
				type : 'vbox',
				align : 'center',
				pack : 'center'
			},
			items : [{
				xtype : 'button',
				text : '保存',
				style : 'border: 0;border-radius: 4px;background: #d7000e;font-size: 18px;color: #ffffff;',
				pressedCls : 'button-pressed',
				height : 48,
				width : 300,
				handler : function() {
					me.saveData();
				}
			}]
		});
		me.add(btn);
	},
	/** 选择财产共有人 */
	showSelectList : function(input) {
		var me = this, view = Ext.create('Ext.Container', {
			width : 500,
			height : 450,
			modal : true,
			hideOnMaskTap : true,
			centered : true,
			style : 'background: #FFF',
			zIndex : 999,
			items : [{
				xtype : 'container',
				width : '100%',
				height : 35,
				html : '<div class="x-center" style="font-size:20px;line-height:35px;color:red">请选择共有人</div>'
			}, {
				xtype : 'list',
				width : '100%',
				height : '100%',
				cls : 'left-list',
				style : 'background: #FFF',
				disableSelection : true,
				store : {
					fields : ['s_key', 's_value', 'isSelect'],
					data : me.selection || []
				},
				itemTpl : new Ext.XTemplate(
						'<div style="padding-left: 10px;height: 45px;line-height: 45px;">',
						'<tpl if="isSelect == 0">',
						'<img src="img/circle.png" width="24px" height="24px" style="margin-right: 20px;vertical-align: middle;">',
						'<tpl else>',
						'<img src="img/checked.png" width="24px" height="24px" style="margin-right: 20px;vertical-align: middle;">',
						'</tpl>',
						'<span style="vertical-align: middle;">{s_value}</span>',
						'</div>'),
				listeners : {
					itemtap : function(list, index, target, record, e, eOpts) {
						if (record.get('isSelect') == '0') {
							record.set('isSelect', '1');
						} else if (record.get('isSelect') == '1') {
							record.set('isSelect', '0');
						}
					}
				}
			}, {
				xtype : 'container',
				width : '100%',
				docked : 'bottom',
				layout : {
					type : 'vbox',
					align : 'center'
				},
				items : [{
					xtype : 'baseButton',
					width : '50%',
					height : 45,
					text : '确认',
					margin : '10px 25%',
					handler : function() {
						var store = this.parent.parent.getAt(1).getStore(), str = [];
						store.each(function(item, index, length) {
									if (item.get('isSelect') == '1') {
										str.push(item.get('s_value'));
									}
								});
						input.setValue(str.join(','));
						this.parent.parent.hide();
					}
				}]
			}],
			listeners : {
				hide : function() {
					this.removeAll(true, true).destroy();
				}
			}
		});
		Ext.Viewport.add(view);
	},
	/** 查询客户经理信息 */
	selectManageInfo : function(callBack) {
		var me = this;
		NativeUI.showWaiting();
		BIF.selectCustMag(function(res) {
			var options = res.result, 
				manageNo = Public.userInfo.userno || '', 
				manageName = Public.userInfo.username || '';
			if (manageNo && manageName) {
				options.push({// 核保人可以为当前客户经理
					s_key : manageNo,
					s_value : manageName
				});
			}
			Ext.getCmp('cer_people1').setOptions(options);
			Ext.getCmp('cer_people2').setOptions(options);
			if (callBack)
				eval('me.' + callBack + '()')
		});
	},
	/** 查询抵押物信息 */
	selectCollateralInfo : function() {
		var me = this;
		NativeUI.showWaiting('正在查询抵押物信息');
		BIF.selectCollateralInfo({
			app_no : Bus.Utils.getApp_no()
		}, function(res) {
			var data = res.result || {};
			console.log(data[0]);
			if (typeof data != 'string') {
				me.oldResult = data[0];// 保存返回信息
				Public.setPageDatasByIds(me.ids, data[0]);// 向页面赋值
				Ext.getCmp('gage_ratio').setValue(Public.accMul(
						data[0].gage_ratio, 100));// 设定抵押率
			} else {
				me.oldResult = {};// 保存返回信息
				Ext.getCmp('cer_people1')
						.setValue(Public.userInfo.userno || '');// 核保人1
																// 默认当期客户经理
				Ext.getCmp('if_max_ratio').setValue('2');// 是否为最高抵押率
															// 默认 否
				Ext.getCmp('if_insu').setValue('2');// 是否有保险 默认否
				Ext.getCmp('if_cer').setValue('2');// 是否正式抵押 默认否
				Ext.getCmp('cer_date')
						.setValue(Public.getCurrentDate());// 核保日期
															// 默认为当前日期
				Ext.getCmp('right_cert_type').setValue(data[0].right_cert_type);//权属证件类型
				Ext.getCmp('right_cert_no').setValue(data[0].right_cert_no);//权属证号
				Ext.getCmp('right_org').setValue('不动产登记中心'); // 权属登记机关-默认不动产登记中心
				Ext.getCmp('cer_people2').setValue(Bus.Utils.getManageName());//核保人2
				Ext.getCmp('house_stru').setValue(Bus.Utils.getHousesTru());//房产结构
				Ext.getCmp('hou_area').setValue(Bus.Utils.getHouArea());//房屋面积
				Ext.getCmp('gage_loc').setValue(Bus.Utils.getHouAddr());//房屋坐落位置
			}
		});
	},
	/** 抵押物信息保存 */
	saveData : function() {
		var me = this, result = BaseValidate.validate(me.ids);
		NativeUI.showWaiting();
		if (result.result) {
			var data = Public.getPageDatasByIds(me.ids);
			data.gage_ratio = Ext.getCmp('gage_ratio').getValue() / 100;// 设定抵押率
			data.cer_people1 = Ext.getCmp('cer_people1').getText();
			data.cer_people2 = Ext.getCmp('cer_people2').getText();
			data.gage_id = me.oldResult.gage_id || '', // 担保ID
			data.tx_date = me.oldResult.tx_date || '', // 登记日期
			data.gage_sts = me.oldResult.gage_sts || '10001', // 抵质押物状态（默认初始值）
			BIF.saveCollateralInfoData(data, function(res) {
				NativeUI.toast('保存抵押物信息成功');
				global_frame_nav.pop();
			})
		} else {
			NativeUI.closeWaiting();
			NativeUI.alert(result.msg);// 弹出失败信息
		}
	},
	/** 共有财产处理 */
	ifCommonAsset : function(me, value) {
		var isDisabled = value == '' || value == 2, // 是否disabled条件
			gage_share = Ext.getCmp('gage_share');// 获取要disabled的输入框
		gage_share.setDisabled(isDisabled);// 设置是否可用
		gage_share.setRequired(!isDisabled);// 设置是否必输
		if (value == 1) {
			NativeUI.showWaiting();
			BIF.selectRepaymentInfo({
				app_no : Bus.Utils.getApp_no()
			}, function(res) {
				NativeUI.closeWaiting();
				var result = res.result, array = [];
				if (typeof result != 'string') {
					for (var i = 0; i < result.length; i++) {
						var obj = {};
						obj.s_key = result[i].id;
						obj.s_value = result[i].com_cif_name;
						obj.isSelect = '0';
						array.push(obj);
					}
					me.selection = array;
				} else {
					Ext.getCmp('if_common_asset').setValue('');
					NativeUI.toast('无共同还款人，请添加共同还款人');
					gage_share.setDisabled(true);// 设置是否可用
					gage_share.setRequired(false);// 设置是否必输
				}
			});
		}else{
			gage_share.setValue('');
		}
	},
	/** 抵质押率查询 */
	getByGageNo: function() {
		var me = this,
			input = Ext.getCmp('gage_type');
		if(!input.getValue()){
			NativeUI.toast('请选择抵押品类型');
			Ext.getCmp('if_max_ratio').setValue('2');
			return;
		}
		NativeUI.showWaiting();
		BIF.getByGageNo({
			gage_type: input.getValue()
		},function(res){
			var result = res.result, 
				gage_rate = result.gage_rate || '';
			if(gage_rate){
				var gage_ratio = Ext.getCmp('gage_ratio'),
					if_max_ratio = Ext.getCmp('if_max_ratio'),
					eval_amt = Ext.getCmp('eval_amt'),
					bank_amt = Ext.getCmp('bank_amt');
				if(if_max_ratio.getValue() == '1'){//是最高抵押率
					gage_ratio.setValue(Public.formatPercent(gage_rate));
					if(eval_amt.getValue())bank_amt.setValue(Public.accMul(gage_rate,eval_amt.getValue()));
				}else{
					if(eval_amt.getValue() && bank_amt.getValue()){
						gage_ratio.setValue(Public.accMul(bank_amt.getValue()/eval_amt.getValue(),100).toFixed(2));
					}
				}
			}else{
				input.setValue('');
				NativeUI.toast(res.result);
			}
		});
	}
});
