Ext.namespace("gmi");

gmi.ModelPanel = Ext.extend(Ext.Panel, {
		layout: 'vbox',
		title: null,
		id: null,
		currentModel: null,
		initComponent: function(){
			this.addEvents("ready");
			this.items = [{
				title:'Bediening',
				xtype: 'panel',
				layout: 'fit',
				height: 200,
				width: '100%',
				items: [{
					xtype: 'panel',
					layout: {
						type:  "vbox",
						align: "center"
					},
					defaults: {
						xtype: 'button',
						style: 'padding-top: 10px;',
						width: 80
					},
					items: [
						{
							text: 'Start',
							handler: function() {modelWindow.show();}
						},{
							text: 'Weergave',
							handler: function() {alert('In ontwikkeling');}
						},{
							text: 'Beheer',
							handler: function() {alert('In ontwikkeling');}
						}
					]
				}]
			},{
				title:'Simulaties',
				xtype: 'panel',
				layout: 'fit',
				height: 200,
				width: '100%',
				items: [] //gridpanel with archive of simulations 
			},{
				title:'Info',
				xtype: 'panel',
				layout: 'fit',
				height: 200,
				width: '100%',
				items: [] //overview of parameters for selected simulation(s)
			}];
			gmi.ModelPanel.superclass.initComponent.apply(this,arguments);
		},
		whateverfunction: function(){
		}
		
});

Ext.reg("gmi_modelpanel", gmi.ModelPanel);

