var fueldataPanel = new Ext.Panel({
		title: 'Brandstofdata',
		id: 'fueldataPanel',
		
		items: [
			forms["fueldata"]
		]
});

var weatherPanel = new Ext.Panel({
		title: 'Weerdata',
		id: 'weatherPanel',
		
		items: [
		
		]
});

var initialPanel = new Ext.Panel({
		title: 'Beginsituatie',
		id: 'initialPanel',
		
		items: [
		
		]
});

var overviewPanel = new Ext.form.FormPanel({
		title: 'Overzicht',
		id: 'overviewPanel',
		items: [
			
		]
});

var modelWindow = new Ext.Window({
		id: 'modelWindow',
		title: 'Simulatie',
		closable: false,
		closeAction: 'hide',
		hideable: true,
		resizable: true,
		draggable: true,
		width: '40%',
		height: '400',
		plain: true,
		layout: 'fit',
		modal: false,
		items:
			new Ext.TabPanel({
				autoTabs:true,
				activeTab:0,
				deferredRender:false,
				border:false,
				items:[
					fueldataPanel,
					weatherPanel,
					initialPanel
				]
                })
        ,
		buttons:[
		{
			text: 'Annuleren', 
			handler: function()	{ modelWindow.hide(); }
		},{
			text: 'Start', 
			disabled: true,
			handler: function()	{ alert('Niet in gebruiik'); }
		}]
});
//modelWindow.show();
