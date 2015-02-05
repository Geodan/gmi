

Ext.namespace('Gmi.Control', 'Gmi.Data', 'Gmi.Params', 'Gmi.Services', 'Gmi.Services.WPS', 'Gmi.Session', 'Gmi.Settings');

var drawResult = function(sliderval){
	var map = mapPanel.map;
    var layer = mapPanel.map.getLayersByName('Brandverspreiding')[0];

    layer.features.forEach(function(d){
        var elaps = parseInt(d.attributes.elapsed_mi);
        var hour = parseInt(d.attributes.hour);
        d.style = {
            strokeColor: 'white',
            strokeWidth: 1,
            fillOpacity: 0,
            labelAlign: 'cb',
            fontFamily: "arial, monospace"
        };
        switch (d.attributes.elapsed_mi){
          case "60.0000": 
                d.style.strokeColor = '#ff0500';
                d.style.fontColor = '#ff0500';
                d.style.strokeWidth = 2;
                d.style.label = elaps.toString();
                break;
          case "120.0000": 
              d.style.strokeColor = '#ff3700';
              d.style.fontColor = '#ff3700';
              d.style.strokeWidth = 2;
              d.style.label = elaps.toString();
              break;
          case "180.0000": 
              d.style.strokeColor = '#ff5701';
              d.style.fontColor = '#ff5701';
              d.style.strokeWidth = 2;
              d.style.label = elaps.toString();
              break;
          case "240.0000": 
              d.style.strokeColor = '#ff7b01';
              d.style.fontColor = '#ff7b01';
              d.style.strokeWidth = 2;
              d.style.label = elaps.toString();
              break;
          case "300.0000": 
              d.style.strokeColor = '#ffa802';
              d.style.fontColor = '#ffa802';
              d.style.strokeWidth = 2;
              d.style.label = elaps.toString();
              break;
          case "360.0000": 
              d.style.strokeColor = '#ffdd01';
              d.style.fontColor = '#ffdd01';
              d.style.strokeWidth = 2;
              d.style.label = elaps.toString();
              break;
          default:
          	  d.style.strokeColor = 'white';
              d.style.fontColor = '#ffdd01';
              d.style.strokeWidth = 1;
              d.style.label = '';
        }
        if (elaps > sliderval) {
            d.style.label = "";
            d.style.strokeOpacity  = 0;
        }
        else {
            d.style.strokeOpacity = 1;
        }
    });
    layer.redraw();
};

var showResult = function(map,runid){
    
    var layers = map.getLayersByName('Brandverspreiding');
    var name = 'model_wildfire:result_' + runid;
    if (layers.length > 0) {
        // pas huidige resultaat aan
        //layers[0].mergeNewParams({
        //    layers: name
        //});
        map.removeLayer(layers[0]);
    }
    // voeg nieuwe resultaat toe
    var styleMap = new OpenLayers.StyleMap({
        strokeColor: 'white',
        strokeWidth: '1px',
        fillOpacity: 0,
        label: "${elapsed_mi}",
        fontFamily: "arial, monospace"
    });
    var lookup = {
      "60.0000":  {strokeWidth: '2px',strokeColor: '#ff0500'},
      "120.0000": {strokeWidth: '2px',strokeColor: '#ff3700'},
      "180.0000": {strokeWidth: '2px',strokeColor: '#ff5701'},
      "240.0000": {strokeWidth: '2px',strokeColor: '#ff7b01'},
      "300.0000": {strokeWidth: '2px',strokeColor: '#ffa802'},
      "360.0000": {strokeWidth: '2px',strokeColor: '#ffdd01'}
    };
    styleMap.addUniqueValueRules("default", "elapsed_mi", lookup);
    /*
    var layer = new OpenLayers.Layer.WMS('Brandverspreiding', 
    '/geoserver/wms?', {
        layers: name,
        transparent: true,
        format: 'image/png'
    }, {
        isBaseLayer: false,
        opacity: 0.6
    });
    */
    var wfs = new OpenLayers.Layer.Vector(
    "Brandverspreiding",
    {
        styleMap: styleMap,
        strategies: [new OpenLayers.Strategy.Fixed()]
        , projection: new OpenLayers.Projection("EPSG:900913")
        , protocol: new OpenLayers.Protocol.WFS({
            version: "1.1.0",
            url: "/geoserver/wfs?",
            featurePrefix: 'model_wildfire', //geoserver worspace name
            featureType: 'result_' + runid, //geoserver Layer Name
            //featureNS: "http://medford.opengeo.org/medford", // Edit Workspace Namespace URI
            geometryName: "wkb_geometry", // field in Feature Type details with type "Geometry",
            srsName: "EPSG:900913"
        })
    });
    map.addLayer(wfs);
    window.setTimeout(function(){drawResult(360);},1000);
};

Gmi.invalidateResultWfsGrid = function() {
    var tfs = Ext.getCmp('result-fieldset');
    if (tfs.items.length > 0) {
        tfs.items.clear();
    }
    if (! tfs.collapsed) {
        // ophalen, want fieldset al open
        Gmi.defineResultsWfsGrid();
    }
    Gmi.Session.terraingrid.store.reload();
};
    
Gmi.defineResultsWfsGrid = function() {
    var map = mapPanel.map;
    var layers = map.getLayersByName('XXBrandverspreiding');
    if (layers.length > 0) {
        var wfsLayer = layers[0];
    } else {
        // wfs kaartlaag toevoegen
        var wfsLayer = new OpenLayers.Layer.Vector("XXBrandverspreiding", {
            //rendererOptions: {
            //    zIndexing: true
            displayInLayerSwitcher: Gmi.Settings.debug, // tonen bij debug
            visibility: false, // NIET zichtbaar
            styleMap: new OpenLayers.StyleMap({
                'default': new OpenLayers.Style({
                    //display: 'none',
                    fillColor: '#aaaaaa',
                    fillOpacity: 0.2,
                    strokeColor: '#888888',
                    strokeOpacity: 0.4
                }),
                'select': new OpenLayers.Style({
                    fillColor: '#ff8800',
                    fillOpacity: 0.6,
                    strokeColor: '#ff0000',
                    strokeOpacity: 0.6,
                    strokeWidth: '3px',
                    display: 'visible'
                })
            })
        });
        // TODO: voor wfs laag alleen geselecteerde feature tonen!
        mapPanel.map.addLayer(wfsLayer);
    }
    // create feature store, binding it to the vector layer
    var landscape_id = 4557;
    var ResultFeatureRecord = new GeoExt.data.FeatureRecord.create([
        {name: 'name', type: 'string'},
        {name: 'started', type: 'date'}
    ]);
    var store = new GeoExt.data.FeatureStore({
        layer: wfsLayer,
        /*fields: [
            {name: 'landscape_name', type: 'string'},
            {name: 'started', type: 'date'}
        ],*/
        //recordType: TerrainFeatureRecord,
        reader: new GeoExt.data.FeatureReader({}, ResultFeatureRecord),
        proxy: new GeoExt.data.ProtocolProxy({
            protocol: new OpenLayers.Protocol.WFS({
                url: "/geoserver/ows",
                version: "1.1.0",
                featureType: 'farsite_results',
                featureNS: 'model_wildfire',
                srsName: 'EPSG:900913'//,
                //outputFormat: 'application/json', // richting geoserver
                //format: new OpenLayers.Format.GeoJSON() // ??
            })
        }),
        //featureFilter: new OpenLayers.Filter.Comparison({
        //        type: OpenLayers.Filter.Comparison.EQUAL_TO,
        //        property: "landscape_id",
        //        value: landscape_id
        //}),
        autoLoad: true
    });
    
    // create grid panel configured with feature store
    gridPanel = new Ext.grid.GridPanel({
        title: OpenLayers.i18n("Feature Grid"),
        //applyTo: "desc",
        region: "east",
        header: false,
        store: store,
        width: 200,
        height: 200,
        columns: [{
            header: OpenLayers.i18n("Name"),
            width: 100,
            sortable: true,
            dataIndex: "name"
        }, {
            header: OpenLayers.i18n('Time'),
            width: 100,
            sortable: true,
            xtype: 'datecolumn',
            format: Gmi.Settings.datetimeFormat,
            dataIndex: 'started'
        }],
        sm: new GeoExt.grid.FeatureSelectionModel({
            autoPanMapOnSelection: false, // we zoomen er zelf naartoe
            singleSelect: true
        })
    });

    gridPanel.store.bind(wfsLayer);
    gridPanel.getSelectionModel().bind(wfsLayer);
    gridPanel.getSelectionModel().on('rowdeselect_NIET', function (obj, rowIndex, row) {
        //console.log('rowdeselect', row.data.feature);
        /*
        Gmi.Session.fuelid = null;
        Gmi.Session.datetime = null;
        showTerrein(mapPanel.map, null);
        setBox(mapPanel.map, null);
        */
    });
    gridPanel.getSelectionModel().on('rowselect', function (obj, rowIndex, row){
        //console.log('rowselect', row.data.feature);
        
        //Someday someone will chop my hands off for this code.....
        Gmi.Session.terraingrid.store.data.items.forEach(function(d,i){ 
        	if (d.data.feature.attributes.terrein_id == row.data.feature.attributes['terrein_id']){
        		Gmi.Session.terraingrid.selModel.selectRow(i);
        	}
        }); 
        
        //var geom = row.data.feature.geometry;
        //var center = geom.getCentroid();
        //var bounds = geom.getBounds();
        //
        //// zetten van box
        //setBox(mapPanel.map, bounds);
        
        //Set the model-time as start time
        var month = row.data.feature.attributes['startmonth'];
        var day = row.data.feature.attributes['startday'];
        var starthour = zpad(row.data.feature.attributes['starthour'],4);
        var hour = starthour.substring(0,2);
        var minutes = starthour.substring(2);
        var datestring = '2014-'+ month + '-'+day+ ','+hour+':'+minutes; 
        var datetime = new Date(datestring);
        Gmi.Session.datetime = datetime;
        
        // pan to extent
        //mapPanel.map.panTo(new OpenLayers.LonLat(center.x, center.y));
        // zoom naar extent
        //var zoom = mapPanel.map.getZoomForExtent(bounds);
        //if (zoom > Gmi.Settings.maxZoomOnMoveToTerrain) {
        //    zoom = Gmi.Settings.maxZoomOnMoveToTerrain;
        //}
        //mapPanel.map.zoomToExtent(bounds);
        //mapPanel.map.moveTo(new OpenLayers.LonLat(center.x, center.y), zoom);
        
        // zetten van fuelmodel_name
        //Ext.getCmp('fuelmodel_name').setValue(row.data.feature.attributes['landscape_name']);
        // zetten van fuelid
        //Gmi.Session.fuelid = row.data.feature.attributes['landscape_id'];
        
        // zetten van model_date en model_time
        setModelDateTime(datetime);

        // terrein laag (landscape_id) zetten? makkelijker bij testen
        //showTerrein(mapPanel.map, row.data.feature.attributes['terrein_id']);
        showResult(mapPanel.map, row.data.feature.attributes['run_id']);
        var index = -1;
        
        
        
        /*
        // tijd van neerslagradar
        var map = row.data.feature.layer.map;
        var layers = map.getLayersByName(OpenLayers.i18n('KNMI Neerslagradar'));
        if (layers.length > 0) {
            var time = new Date(datetime.getTime() - datetime.getTime() % (5*60*1000)); // round to 5 minutes
            console.log('tijd afgerond voor neerslagradar', time);
            var layer = layers[0];
            layer.mergeNewParams({time: time.toISOString()});
        }
        */
    }, gridPanel);

    // create a panel and add the map panel and grid panel
    // inside it
    /*mainPanel = new Ext.Panel({
        renderTo: "mainpanel",
        layout: "border",
        height: 400,
        width: 920,
        items: [mapPanel, gridPanel]
    });*/
    return gridPanel;
};