Ext.namespace("gxp.plugins");

gxp.plugins.SelectArea = Ext.extend(gxp.plugins.Tool, {
    ptype: "gxp_SelectArea",
    menuText: "SelectArea",
    tooltip: "SelectArea",
    constructor: function(config) {
        gxp.plugins.SelectArea.superclass.constructor.apply(this, arguments);
    },
    destroy: function() {
        gxp.plugins.SelectArea.superclass.destroy.apply(this, arguments);
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
    				var ahnReady = function(response) {
						//Dirty trick to get a refresh of the layer
						app.mapPanel.map.getLayersByName('AHN')[0].mergeNewParams('boe:' + new Date().getTime());
						Ext.MessageBox.hide();
						var anugaCopyReady = function(response) {
							defres = Ext.getCmp('defres').getValue();
							utmzone = Ext.getCmp('utmzone').getValue();
							buildings = Ext.getCmp('buildings').getValue();
							breaklines = Ext.getCmp('breaklines').getValue();
							Ext.Ajax.request({
							   //url:'/anuga/cgi-bin/mesh.py?defres=' + defres,
							   url:'/anuga/pywps/pywps.cgi?service=wps&version=1.0.0&request=execute&identifier=makeMesh&status=true&storeExecuteResponse=true&datainputs=[defres='+defres+';utmzone='+utmzone+';buildings='+buildings+';breaklines='+breaklines+']',
							   success: wpsRunning,
							   timeout: 120000
							});
						}
						
						Ext.Ajax.request({
								url:'./php/export2anuga',
								success: anugaCopyReady
						});
						
						
					}
    				Ext.MessageBox.show({
						msg: 'Model area is being created',
						width: 300,
						wait: true,
						waitConfig: {interval: 200}
					});
					ll = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.left, bounds.bottom));
					ur = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.right, bounds.top));
					utmzone = Ext.getCmp('utmzone').getValue();
					Ext.Ajax.request({
					   url: './php/create_landscape.php?utmzone='+utmzone+'&lower=' + ll.lat + '&left=' + ll.lon + '&upper=' + ur.lat + '&right=' + ur.lon + '',
					   success: ahnReady
					   //failure: alert('Error initializing model'),
					   //headers: {
						//   'my-header': 'foo'
					   //},
					   //params: { foo: 'bar' }
					});
				},
				CLASS_NAME: "OpenLayers.Control.BoxExtent"
		});

    	
    	var SelectAreaControl = new OpenLayers.Control.BoxExtent();
    	
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
            control: SelectAreaControl,
            map: this.target.mapPanel.map,
            toggleGroup: this.toggleGroup})];
        return gxp.plugins.SelectArea.superclass.addActions.apply(this, [actions]);
    }
});
Ext.preg(gxp.plugins.SelectArea.prototype.ptype, gxp.plugins.SelectArea);
