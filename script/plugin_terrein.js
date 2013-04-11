Ext.namespace("gxp.plugins");

gxp.plugins.Terrein = Ext.extend(gxp.plugins.Tool, {
    ptype: "gxp_terrein",
    menuText: "Terrein",
    tooltip: "Terrein",
    constructor: function(config) {
        gxp.plugins.Terrein.superclass.constructor.apply(this, arguments);
    },
    destroy: function() {
        gxp.plugins.Terrein.superclass.destroy.apply(this, arguments);
    },
    addActions: function() {
    	var map = this.target.mapPanel.map;
        OpenLayers.Control.BoxExtent = OpenLayers.Class(OpenLayers.Control, {
            	type: OpenLayers.Control.TYPE_TOOL,
    			draw: function () {
					this.handler = new OpenLayers.Handler.Box( this, 
						{"done": this.notice});
					//this.handler.activate();
				},
    			notice: function (bounds) {
    				Ext.MessageBox.show({
						msg: 'Model area is being created',
						width: 300,
						wait: true,
						waitConfig: {interval: 200}
					});
					ll = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.left, bounds.bottom));
					ur = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.right, bounds.top));
					//OpenLayers.loadURL('./php/create_landscape.php?lower=' + ll.lat + '&left=' + ll.lon + '&upper=' + ur.lat + '&right=' + ur.lon + '', '', '', landscapeReady);
					name = "test";
					Ext.Ajax.request({
					   //url: './php/create_subset_terrein.php?lower=' + ll.lat + '&left=' + ll.lon + '&upper=' + ur.lat + '&right=' + ur.lon + '',
					   url: '../wildfire/pywps/pywps.cgi?service=wps&version=1.0.0&request=execute&identifier=makeSubset&datainputs=[lower='+ll.lat+';left='+ll.lon+';upper='+ur.lat+';right='+ur.lon+';name='+name+']',
					   success: wpsRunning
					   //failure: alert('Error initializing model'),
					   //headers: {
						//   'my-header': 'foo'
					   //},
					   //params: { foo: 'bar' }
					});
					this.deactivate();
				},
				CLASS_NAME: "OpenLayers.Control.BoxExtent"
			});

    	
    		var terreinControl = new OpenLayers.Control.BoxExtent();
    	
    		var actions = [new GeoExt.Action({
				tooltip: this.tooltip,
				text: "Select area",
				xtype: 'button',
				width: 150,
				menuText: this.menuText,
				iconCls: "gxp-areaselect-icon",
				enableToggle: true,
				pressed: false,
				allowDepress: true,
				control: terreinControl,
				map: this.target.mapPanel.map,
				toggleGroup: this.toggleGroup})];
			return gxp.plugins.Terrein.superclass.addActions.apply(this, [actions]);
    	}
});
Ext.preg(gxp.plugins.Terrein.prototype.ptype, gxp.plugins.Terrein);
