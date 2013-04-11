Ext.namespace("gxp.plugins");

var begDate;
var endDate;

gxp.plugins.Smoke = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_navigation */
    ptype: "gxp_smoke",
    
    /** api: config[menuText]
     *  ``String``
     *  Text for navigation menu item (i18n).
     */
    menuText: "smoke",

    /** api: config[tooltip]
     *  ``String``
     *  Text for navigation action tooltip (i18n).
     */
    tooltip: "smoke",

    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.Smoke.superclass.constructor.apply(this, arguments);
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
					
					var fromProjection = new OpenLayers.Projection("EPSG:900913");
					var toProjection = new OpenLayers.Projection("EPSG:32631");
					
					point.transform(fromProjection,toProjection);
					var x = point.x / 1000;
					var y = point.y / 1000;
					
					titlecase=Ext.getCmp('titlecase').getValue();
					//TODO: at the moment fixed at 32631
					//epsg=Ext.getCmp('epsg').getValue();
					epsg=32631;
					begdate=Ext.getCmp('begdate').getValue();
					begYear=begdate.getFullYear();
					begMonth=begdate.getMonth()+1;
					begDay=begdate.getDate();
					begtime=Ext.getCmp('begtime').getValue();
					enddate=Ext.getCmp('enddate').getValue();
					endYear=enddate.getFullYear();
					endMonth=enddate.getMonth()+1;
					endDay=enddate.getDate();
					endtime=Ext.getCmp('endtime').getValue();
					
					begDate = ''+begYear+'-'+begMonth+'-'+begDay+'_'+begtime+':00';
					endDate = ''+endYear+'-'+endMonth+'-'+endDay+'_'+endtime+':00';
					species=Ext.getCmp('species').getValue();
					emission=Ext.getCmp('emission').getValue();
					surface=Ext.getCmp('surface').getValue();
					stackheight=Ext.getCmp('stackheight').getValue();
					temperature=Ext.getCmp('temperature').getValue();
					typeoffire = "area";
					typeofleak = null;
					timesteps = null;
					gridsize = Ext.getCmp('gridsize').getValue();;
					validateonly = null;

					 
					
					
					Ext.Ajax.request({
					   url: '../rookpluim/argoss/cgi-bin/pywps.cgi?service=wps&version=1.0.0&request=execute&identifier=startcalpuffv4&datainputs=[userid='+ currentUser + ';titlecase='+titlecase+';epsg='+epsg+';xcrd='+x+';ycrd='+y +';begtime='+begDate+';endtime='+endDate+';species='+species+';emission='+emission+';surface='+surface+';stackheight='+stackheight+';temperature='+temperature+';typeoffire='+typeoffire+';gridsize='+gridsize+']',
					   method: 'GET',
					   headers: { Authorization : auth },
					   success: rookpluimStarted //see Actions.js
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
            id: "smokebutton",
            text: "Smoke",
            menuText: this.menuText,
            iconCls: "gxp-smoke-icon",
            enableToggle: true,
            pressed: false,
            allowDepress: true,
            control: control,
            map: this.target.mapPanel.map,
            toggleGroup: this.toggleGroup})];
        return gxp.plugins.Smoke.superclass.addActions.apply(this, [actions]);
    }
        
});

Ext.preg(gxp.plugins.Smoke.prototype.ptype, gxp.plugins.Smoke);
