
function zeroPad(num,count)
{
	var numZeropad = num + '';
	while(numZeropad.length < count) {
		numZeropad = "0" + numZeropad;
	}
	return numZeropad;
}

Ext.namespace("gxp.plugins");

gxp.plugins.Ignite = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_navigation */
    ptype: "gxp_ignite",
    
    /** api: config[menuText]
     *  ``String``
     *  Text for navigation menu item (i18n).
     */
    menuText: "Ignite",

    /** api: config[tooltip]
     *  ``String``
     *  Text for navigation action tooltip (i18n).
     */
    tooltip: "Ignite",

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.Ignite.superclass.constructor.apply(this, arguments);
    },

    /** api: method[addActions]
     */
    addActions: function() {
    	
    	OpenLayers.Control.PointLoc = OpenLayers.Class(OpenLayers.Control, {
    			type: OpenLayers.Control.TYPE_TOOL,
    			draw: function () {
					this.handler = new OpenLayers.Handler.Point( control, 
						{"done": this.notice});
				},

				notice: function (point) {
					Ext.MessageBox.show({
							msg: 'Model is running',
							width: 300,
							wait: true,
							waitConfig: {interval: 200}
					});
					
					var fromProjection = new OpenLayers.Projection("EPSG:900913");
					var toProjection = new OpenLayers.Projection("EPSG:28992");
					
					point.transform(fromProjection,toProjection);
					//alert(point);
					//(193255,458726
					var location = 'POINT(' + point.x + ' ' + point.y +')';
					//var location = 'POINT%28193255 458726';

					weatherStore.sort('date', 'asc');					
					var weatherData = weatherStore.getRange();

					var weatherString = '' ;
					for (var i=0;i<weatherData.length;i++) 
					{                     
						month = zeroPad(weatherData[i].data.date.getMonth() + 1,2);
						day = zeroPad(weatherData[i].data.date.getDate(),2);
						rn 	= zeroPad(weatherData[i].data.rn,2);
						am 	= zeroPad(weatherData[i].data.am,4);
						pm 	= zeroPad(weatherData[i].data.pm,4);
						tlo = zeroPad(weatherData[i].data.tlo,2);
						thi = zeroPad(weatherData[i].data.thi,2);
						hhi = zeroPad(weatherData[i].data.hhi,2);
						hlo = zeroPad(weatherData[i].data.hlo,2);
						elv = zeroPad(weatherData[i].data.elv,4);
						weatherString += '(' + month + ',' + day  + ',' + rn + ',' + am + ',' + pm +',' + tlo +',' + thi +',' + hhi +',' + hlo +',' + elv +')';
						if (i <weatherData.length -1) { weatherString += ',';} 
					}
					
					var windData = windStore.getRange();
					
					var windString = '' ;
					for (var i=0;i<windData.length;i++) 
					{                     
						month = windData[i].data.date.getMonth() + 1;
						day = windData[i].data.date.getDate();
						hour = windData[i].data.time;
						hour = hour.replace(':', '');
						hour = hour.substr(0,4);
						speed 	= zeroPad(windData[i].data.speed,2);
						dir 	= zeroPad(windData[i].data.direction,3);
						cl 		= zeroPad(windData[i].data.cl,2);
						windString += '(' + month + ',' + day  + ',' + hour + ',' + speed + ',' + dir + ',' + cl +')';
						if (i <windData.length -1) { windString += ',';} 
					}
					
					startMonth = windData[0].data.date.getMonth() + 1;
					startDay = windData[0].data.date.getDate();
					startHour = windData[0].data.time;
					startHour = startHour.replace(':','').substr(0,4);
					fuelmodel = Ext.getCmp("fuelmodel_id").getValue()
					//TODO
					name = "geodan";
					//alert(windString);
					//(02,24,0000,20,235,00),(02,25,0400,20,135,00),(02,25,1200,20,235,00),(02,25,1600,50,135,00)
					//var weatherString = '('+ startMonth + ',09,00,0500,1500,20,28,5,5,0000),('+ startMonth + ',10,00,0500,1500,20,28,5,5,0000),('+ startMonth + ',11,00,0500,1500,20,28,5,5,0000),('+ startMonth + ',12,00,0500,1500,20,28,5,5,0000)';
					Ext.Ajax.request({
					   //url: '/cgi-bin/farsite_service?id=2&coords=' + location + '&template=bergen.tpl&weather='+ weatherString +'&wind=' + windString + '&day='+startDay+'&month='+startMonth+'&hour='+startHour+'&min=00&interval=1&duration=6',
					   url: '../wildfire/pywps/pywps.cgi?service=wps&version=1.0.0&request=execute&identifier=farsiteRun&datainputs=[name='+name+';fuelmodel='+fuelmodel+';point='+location+';windstring='+windString+';weatherstring='+weatherString+';startmonth='+startMonth+';startday='+startDay+';starthour='+startHour+']',
					   success: wpsRunning,
					   timeout: 120000,
					   //failure: alert('Error running model'),
					   //headers: {
					   //	'my-header': 'foo'
					   // },
					   //params: { foo: 'bar' }
					});
					//Deactivate directly after firing
					this.deactivate();
					
				},
				CLASS_NAME: "OpenLayers.Control.PointLoc"
    	});
    	
    	var map = this.target.mapPanel.map;
    	var control = new OpenLayers.Control.PointLoc();

        var actions = [new GeoExt.Action({
            tooltip: this.tooltip,
            text: "Ignite",
            xtype: 'button',
            width: 150,
            menuText: this.menuText,
            iconCls: "gxp-ignite-icon",
            enableToggle: true,
            pressed: false,
            allowDepress: false,
            control: control,
            map: this.target.mapPanel.map,
            toggleGroup: this.toggleGroup})];
        return gxp.plugins.Ignite.superclass.addActions.apply(this, [actions]);
    }
        
});

Ext.preg(gxp.plugins.Ignite.prototype.ptype, gxp.plugins.Ignite);
