Ext.namespace("gxp.plugins");


gxp.plugins.Flood = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_navigation */
    ptype: "gxp_flood",
    
    /** api: config[menuText]
     *  ``String``
     *  Text for navigation menu item (i18n).
     */
    menuText: "flood",

    /** api: config[tooltip]
     *  ``String``
     *  Text for navigation action tooltip (i18n).
     */
    tooltip: "flood",

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.Flood.superclass.constructor.apply(this, arguments);
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
					Ext.getCmp('anugaprogress1').updateProgress(0, "Model is running", 1);
					
					var fromProjection = new OpenLayers.Projection("EPSG:900913");
					var toProjection = new OpenLayers.Projection("EPSG:32631");
					
					point.transform(fromProjection,toProjection);
					
					runname = 'fixed_wave';
					stage = Ext.getCmp('stage').getValue();
					tend = Ext.getCmp('field_tend').getValue();
					flux = Ext.getCmp('field_flux').getValue();
					radius = Ext.getCmp('field_radius').getValue();
					yieldstep = Ext.getCmp('yieldstep').getValue();
					tsunami = Ext.getCmp('tsunami').getValue();
					tsunami_height = Ext.getCmp('tsunami_height').getValue();
					rainfallrate = Ext.getCmp('rainfallrate').getValue();
					
					Ext.Ajax.request({
					   url: '/anuga/pywps/pywps.cgi?service=wps&version=1.0.0&request=execute&status=true&storeExecuteResponse=true&identifier=anugaRun&datainputs=[floodpointx='+ point.x + ';floodpointy='+point.y+';tsunami='+tsunami+';influx='+flux+';inflow_radius='+radius+';tend='+tend+';yieldstep='+yieldstep+';tsunami_height='+tsunami_height+';runname='+ runname+';stage='+stage+';rainfallrate='+rainfallrate+']',
					   success: anugaRunning //see Actions.js
					});
				},
				CLASS_NAME: "OpenLayers.Control.PointLoc"
    	});
    	
    	var map = this.target.mapPanel.map;
    	var control = new OpenLayers.Control.PointLoc();

        var actions = [new GeoExt.Action({
            tooltip: this.tooltip,
            text: "Flood",
            menuText: this.menuText,
            iconCls: "gxp-flood-icon",
            enableToggle: true,
            pressed: false,
            allowDepress: false,
            control: control,
            map: this.target.mapPanel.map,
            toggleGroup: this.toggleGroup})];
        return gxp.plugins.Flood.superclass.addActions.apply(this, [actions]);
    }
        
});

Ext.preg(gxp.plugins.Flood.prototype.ptype, gxp.plugins.Flood);
