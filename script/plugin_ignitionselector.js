Ext.namespace("gxp.plugins");


gxp.plugins.Ignitionselector = Ext.extend(gxp.plugins.Tool, {
    
    ptype: "gxp_ignitionselector",
    outputTarget: "map",

    lengthMenuText: "Length",
    areaMenuText: "Area",
    lengthTooltip: "Measure length",
    areaTooltip: "Measure area",
    measureTooltip: "Measure",
    
    addActions: function(){
    	var actions =  gxp.plugins.Ignitionselector.superclass.addActions.call(this, [{
    		tooltip: this.infoActionTip,
            iconCls: "gxp-ignite-icon",
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

		var map = this.target.mapPanel.map;
		var control;
		for (var i = 0, len = info.controls.length; i < len; i++){
			control = info.controls[i];
			control.deactivate();  // TODO: remove when http://trac.openlayers.org/ticket/2130 is closed
			control.destroy();
		}
		info.controls = [];
		
		//var pointLayer = new OpenLayers.Layer.Vector("Point Layer");
		//map.addLayers([pointLayer]);
		//var control = new OpenLayers.Control.DrawFeature(pointLayer,OpenLayers.Handler.Point);
		var control = new OpenLayers.Control();
		OpenLayers.Util.extend(control, {
				draw: function () {
					this.point = new OpenLayers.Handler.Point( control, 
						{"done": this.notice});
					this.point.activate();
				},

				notice: function (point) {

					//Ext.MessageBox.show({
					//		msg: 'Model is been run',
					//		width: 300,
					//		wait: true,
					//		waitConfig: {interval: 200}
					//});
					alert(point);
					loc = map.getLonLatFromPixel(new OpenLayers.Pixel(point));
					
					//TODO: get the x/y of the ignition point and put as RD coords in URL 
					var location = "POINT%28x,y";
					//OpenLayers.loadURL('/cgi-bin/farsite_service?id=2&coords=' + location + '%29&template=bergen.tpl&weather=%2802,24,00,0500,1500,20,28,5,5,0000%29,%2802,25,00,0500,1500,20,28,5,5,0000%29,%2802,26,00,0500,1500,20,28,5,5,0000%29,%2802,27,00,0500,1500,20,28,5,5,0000%29&wind=%2802,24,0000,20,235,00%29,%2802,25,0400,20,135,00%29,%2802,25,1200,20,235,00%29,%2802,25,1600,50,135,00%29&day=25&month=02&hour=1300&min=0&interval=1&duration=12', '', '', farsiteReady);
				}
		}); 
		map.addControl(control);
		info.controls.push(control);
		if(infoButton.pressed) {
			control.activate();
		}
		else {control.deactivate();}

        return actions;
    }
        
});

Ext.preg(gxp.plugins.Ignitionselector.prototype.ptype, gxp.plugins.Ignitionselector);

