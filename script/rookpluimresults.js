	/***
		Making a window for model results
		Example from: http://api.geoext.org/1.1/examples/wms-tree.js
		
		TODO: perhaps we don't have to create an complete new window every time. Updating the source data might do..
		***/

	function rookpluimresults(processid){
		//Grid for params
		this.paramStore = new Ext.data.Store({
		  reader: new Ext.data.XmlReader({
			record: 'Output',
			fields: ['Identifier', 'Title','LiteralData']
		  })
		});
		
		this.processParams = function(response) {
			var node;
			var dq = Ext.DomQuery;
			//XML with namespaces doesn't work in EXT, so we first remove the namespaces.
			//The replace function is now only replacing 'wps' and 'ows' namespaces
			//var xml = response.responseXML;
			var string = response.responseText.replace(/wps:/gi,"");
			var string = string.replace(/ows:/gi,"");
			var xml = StringtoXML(string);
			this.paramStore.loadData(xml);
		}
		
		this.paramsColModel = new Ext.grid.ColumnModel({
			defaults: {
				width: 80,
				sortable: true
			},
			columns: [
				{id: 'Title', header: 'param', width: 150, sortable: true, dataIndex: 'Title'},
				{id: 'LiteralData', header: 'value', width: 80, sortable: true, dataIndex: 'LiteralData'}
			]
		});
		
		this.processid = processid.toString(); //TODO: make non-global
		this.loader =  new GeoExt.tree.WMSCapabilitiesLoader({
            //url: 'http://model.geodan.nl/geoserver/ows?service=wms&version=1.1.1&request=GetCapabilities',
            
            url: '/rookpluim/argoss/geoserver/'+this.processid+'/wms?request=GetCapabilities',
            layerOptions: {buffer: 0, singleTile: true, ratio: 1},
            layerParams: {'TRANSPARENT': 'TRUE'},
            // customize the createNode method to add a checkbox to nodes
            createNode: function(attr) {
                attr.checked = attr.leaf ? false : undefined;
                return GeoExt.tree.WMSCapabilitiesLoader.prototype.createNode.apply(this, [attr]);
            }
            });
		
        this.root = new Ext.tree.AsyncTreeNode({
			text: 'Model output',
			loader: this.loader
			});
	
		this.parampanel = new Ext.grid.GridPanel({
			store: this.paramStore,
			colModel: this.paramsColModel,
			title: "Parameters",
			autoHeight: true,
			width: 400
		});
		
		//Tree for model layers
		this.tree = new Ext.tree.TreePanel({
			root: this.root,
			region: 'west',
			width: 400,
			autoHeight: true,
			title: "Result layers",
			listeners: {
				// Add layers to the map when ckecked, remove when unchecked.
				// Note that this does not take care of maintaining the layer
				// order on the map.
				'checkchange': function(node, checked) { 
					if (checked === true) {
						app.mapPanel.map.addLayer(node.attributes.layer); 
					} else {
						app.mapPanel.map.removeLayer(node.attributes.layer);
					}
				}
			}
			});
		
		/***
			Handle smoke-plume results
		***/
		
		this.playaction = new GeoExt.Action({
				text: "Play",
				xtype: 'button',
				width: 150,
				height: 20,
				handler: function(){
					var recnum;
					var rec;
					recnum = this.paramStore.find("Title","Begintime UTC+0 (yyyy-mm-dd_hh:mm:ss):");
					rec = this.paramStore.getAt(recnum);
					var starttime = encodeURIComponent(rec.data.LiteralData);
					recnum = this.paramStore.find("Title","Endtime UTC+0 (yyyy-mm-dd_hh:mm:ss):");
					rec = this.paramStore.getAt(recnum);
					//var endtime = rec.data.LiteralData;
					
					layer = new OpenLayers.Layer.WMS( "Rookpluim",
						"/rookpluim/argoss/geoserver/wms", 
						{
						layers: processid+'t='+starttime+'_h=0_cv',
						transparent: "true",
						format: "image/png"} 
					);
                    
					
					app.mapPanel.map.addLayer(layer);
					
				}.createDelegate(this)
		});
		
		
		this.tabpanel = new Ext.TabPanel({
			items: [this.parampanel,this.tree],
			activeTab: 0
		});
    
		this.treeWindow = new Ext.Window({
			id: 'layerwindow'+this.processid,
			title: 'Model results for ' + this.processid,
			tbar: [this.playaction],
			items: [this.tabpanel],
			autoScroll:true,
			height: 400,
			width: 400,
			closable: true,
			closeAction: 'close',
			hideable: true,
			resizable: true,
			draggable: true,
			modal: false
			});
		
		Ext.Ajax.request({
			url:'../rookpluim/argoss/cgi-bin/pywps.cgi?service=wps&version=1.0.0&request=execute&identifier=getprocessinfo&datainputs=[processid='+processid+']',
			headers: { Authorization : auth },
			scope: this,
			success: this.processParams //continue with running status
		});
		
		
	} //End of rookpluimresults
	
