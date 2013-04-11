Ext.namespace("gxp.plugins");
   
gxp.plugins.AreaSelector = Ext.extend(gxp.plugins.Tool, {
    ptype: "gxp_areaselector",
    outputTarget: "map",
    infoActionTip: "Get Feature Info",
    addActions: function() {
            
        var actions = gxp.plugins.AreaSelector.superclass.addActions.call(this, [{
            tooltip: this.infoActionTip,
            iconCls: "gxp-areaselect-icon",
            toggleGroup: this.toggleGroup,
            enableToggle: true,
            allowDepress: true,
            toggleHandler: function(button, pressed) {
                for (var i = 0, len = info.controls.length; i < len; i++){
                    if (pressed) {
                        info.controls[i].activate();

                    } else {
                        info.controls[i].deactivate();

                    }
                }
             }
        }]);
        var infoButton = this.actions[0].items[0];

        var info = {controls: []};
        var updateInfo = function() {

            OpenLayers.Control.BoxExtent = OpenLayers.Class(OpenLayers.Control, {
            	type: OpenLayers.Control.TYPE_TOOL,
    			draw: function () {
					this.handler = new OpenLayers.Handler.Box( this, 
						{"done": this.notice});
					//this.handler.activate();
				},
    			notice: function (bounds) {
					ll = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.left, bounds.bottom));
					ur = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.right, bounds.top));
					OpenLayers.loadURL('./php/create_landscape.php?lower=' + ll.lat + '&left=' + ll.lon + '&upper=' + ur.lat + '&right=' + ur.lon + '', '', '', landscapeReady);
					Ext.MessageBox.show({
						msg: 'Landscape file is being generated',
						width: 300,
						wait: true,
						waitConfig: {interval: 200}
					});
				},
				CLASS_NAME: "OpenLayers.Control.BoxExtent"
			});
    	
			var control = new OpenLayers.Control.BoxExtent();

            for (var i = 0, len = info.controls.length; i < len; i++){
                control = info.controls[i];
                control.deactivate();  // TODO: remove when http://trac.openlayers.org/ticket/2130 is closed
                control.destroy();
            }

            info.controls = [];
                
			//Voeg control toe
			
			
			var map = this.target.mapPanel.map;
			
			map.addControl(control);
			info.controls.push(control);
			if(infoButton.pressed) {
				control.activate();
			}
        };
        this.target.mapPanel.layers.on("update", updateInfo, this);
        return actions;
    }

  
    
});

Ext.preg(gxp.plugins.AreaSelector.prototype.ptype, gxp.plugins.AreaSelector);
