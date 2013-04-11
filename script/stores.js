/********** 
	Reusables
**********/


var numfield = new Ext.form.NumberField({  // rules about editing
	allowBlank: false,
	maxLength: 3
});

// A new DataWriter component.
var writer = new Ext.data.JsonWriter({
	 encode: true,
	 writeAllFields: false
});

// A selectionbox component
var sm = new Ext.grid.CheckboxSelectionModel({
	listeners: {
		selectionchange: function(sm) {}
	}

});

/******
	Terrein runs store
*****/

var modelresults = new Array();

var ProcessIdReader = new Ext.data.ArrayReader(
	{id:'run'}, 
	[
        'run',
        'name',
    ]);

var processStore = new Ext.data.Store({                                      
    reader: ProcessIdReader,
    sortInfo: { field: "run", direction: "DESC" },
    reloadme: function() {
    	Ext.Ajax.request({
			//TODO
			url:'/wildfire/pywps/pywps.cgi?service=wps&version=1.0.0&request=execute&identifier=getTerreinen&datainputs=',
			//headers: { Authorization : auth },
			success: terreinReady
		});
    }    
});


var processColModel = new Ext.grid.ColumnModel({
	defaults: {
		width: 80,
		sortable: true
	},
	columns: [
		{id: 'name', header: 'Name', width: 80, sortable: true, dataIndex: 'name'},
		{id: 'run', header: 'Run id', width: 40, sortable: true, dataIndex: 'run'},
		{
			xtype: 'actioncolumn',
			width: 50,
			items: [{
				icon: '/rookpluim/images/icons/silk/icons/add.png',  // Use a URL in the icon config
				tooltip: 'Add to map',
				handler: function(grid, rowIndex, colIndex) {
					var rec = processStore.getAt(rowIndex);
					var processid = rec.get('run');
					
					//add terrein to map
					var source = app.layerSources["spatial"];
					source.store.reload();
					//TODO: this needs to become a listener for the store reload done instead of timeout
					setTimeout(function(){
						var record = source.createLayerRecord({
							name: "model_wildfire:terrein_"+processid,
							source: "spatial",
							group: "wildfire",
							opacity: 0.3,
							cached: false,
							title: "Terrein " + processid
						});
						app.mapPanel.layers.add(record);
					},2000);
					
					//- set correct terrein id in interface
					Ext.getCmp('terrein_id').setValue(processid);
					
				}
			}]
		}
	]
}); 

var processGrid = new Ext.grid.GridPanel({
		store: processStore,
		//title: "Processes",
		colModel: processColModel,
		height: 400
});



/**********
	Data actions.
	Are being attached to datagrids
**********/

var dataActions = new Array();

dataActions["opslaan"] = new GeoExt.Action({
		/**********
			Open window for calculating new values
		**********/
		text: "Wijzigingen opslaan",
		handler: function(){
			landuse2fuelDataStore.save();
		}
});	



var windStore = new Ext.data.Store({
		id: 'windStore',
		autoSave: false,
		writer: new Ext.data.JsonWriter({
				writeAllFields: true,
				encode: true
		}),
		sortInfo: { field: "time", direction: "ASC" },
		reader: new Ext.data.JsonReader({
			// metadata configuration options:
			idProperty: 'id',
			root: 'results',
			totalProperty: 'total',
			messageProperty: 'message',
			succesProperty: 'success',
			fields:
			[
				{name: 'project', type: 'int'},
				'id',
				//{name: 'datetime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
				{name: 'date', type: 'date', dateFormat: 'Y-m-d'},
				{name: 'time', type: 'time', timeFormat: 'H:i'},
				{name: 'speed', type: 'int'},
				{name: 'direction', type: 'int'},
				{name: 'cl', type: 'int'}
			]}
		),
		proxy: new Ext.data.HttpProxy({
			api:{                  
				read: 	'/wildfire/php/hub_data.php?tablename=windsettings&task=READ',
				update: '/wildfire/php/hub_data.php?tablename=windsettings&task=UPDATE',
				destroy: '/wildfire/php/hub_data.php?tablename=windsettings&task=DESTROY',
				create: '/wildfire/php/hub_data.php?tablename=windsettings&task=CREATE'
			}
		})
		
});


var windColumnModel = new Ext.grid.ColumnModel({
	 defaults: {
            sortable: true // columns are not sortable by default           
   },
   columns:	[
   	 {
			header: 'Date',
			editable: true,
			dataIndex: 'date', 
			width: 10,
			xtype: 'datecolumn',
			editor: new Ext.form.DateField({  // rules about editing
				format: 'Y-m-d',
				allowBlank: false,
				maxLength: 10
			})
		},{
			header: 'Time',
			editable: true,
			dataIndex: 'time', 
			width: 10,
			editor: new Ext.form.TimeField({  // rules about editing
				allowBlank: false,
				maxLength: 10
			})
		},{
			header: 'Speed',
			dataIndex: 'speed',
			editable: true,
			width: 10,
			editor: new Ext.form.NumberField({  // rules about editing
				allowBlank: false,
				maxLength: 3
			})
		},{	
			header: 'Dir',
			dataIndex: 'direction',
			editable: true,
			width: 10,
			editor: new Ext.form.NumberField({  // rules about editing
				allowBlank: false,
				maxLength: 3
			})
		},{	
			header: 'CL',
			dataIndex: 'cl',
			editable: true,
			width: 10,
			editor: new Ext.form.NumberField({  // rules about editing
				allowBlank: false,
				maxLength: 3
			})
		}
		]
});
var windGrid = new Ext.grid.EditorGridPanel({
		id: 'windgrid',
		title: 'Wind characteristics',
		store: windStore,
		cm: windColumnModel,
		height: 200,
		clicksToEdit:1,
		enableColLock:false,
		loadMask: true,
		viewConfig: {
				 forceFit: true
		},
		listeners: {
        },
		tbar: [{    
			text: 'Add Record',
            handler: function(){
                // access the Record constructor through the grid's store
                
                var newRec = windStore.recordType;
                var p = new newRec({
                		time: "12:00",
                		direction: "0",
                		speed: "20"
                		
                });
                windGrid.stopEditing();
                windStore.insert(0, p);
                windStore.save();
                windStore.reload();
                windGrid.startEditing(0, 0);
            }
		},{
			text: 'Delete records',
			handler: function(){
				//delete records
				var selected = windGrid.getSelectionModel().getSelectedCell();

				Ext.MessageBox.confirm(
					'Confirm delete',
					'Are you sure?',
					function(btn) {
						if (btn == 'yes') {
							var recordToDelete = windStore.getAt(selected[0]);
							windStore.remove(recordToDelete);
							windStore.save();
							windStore.reload();
						}
					}
				);
			}
		},{
			text: "Wijzigingen opslaan",
			handler: function(){
				windStore.save();
				windStore.reload();
			}
		}]
});

/*********************
	weather store
*********************/
var weatherStore = new Ext.data.Store({
		id: 'weatherStore',
		autoSave: false,
		writer: new Ext.data.JsonWriter({
				writeAllFields: true,
				encode: true
		}),
		reader: new Ext.data.JsonReader({
			// metadata configuration options:
			idProperty: 'id',
			root: 'results',
			totalProperty: 'total',
			messageProperty: 'message',
			succesProperty: 'success',
			fields:[
				{name: 'project', type: 'int'},
				'id',
				{name: 'date', type: 'date', dateFormat: 'Y-m-d'},
				{name: 'rn', 	type: 'int'},  
				{name: 'am', 	type: 'int'},  
				{name: 'pm', 	type: 'int'},  
				{name: 'tlo', 	type: 'int'}, 
				{name: 'thi', 	type: 'int'}, 
				{name: 'hhi', 	type: 'int'}, 
				{name: 'hlo', 	type: 'int'}, 
				{name: 'elv', 	type: 'int'} 
			]}
			//)
		),
		proxy: new Ext.data.HttpProxy({
			api:{                  
				read: 	'/wildfire/php/hub_data.php?tablename=weathersettings&task=READ',
				update: '/wildfire/php/hub_data.php?tablename=weathersettings&task=UPDATE',
				destroy: '/wildfire/php/hub_data.php?tablename=weathersettings&task=DESTROY',
				create: '/wildfire/php/hub_data.php?tablename=weathersettings&task=CREATE'
			}
		}),
		
});


var weatherColumnModel = new Ext.grid.ColumnModel({
	 defaults: {
            sortable: true // columns are not sortable by default           
   },
   columns:	[
   	 {
			header: 'Date',
			editable: true,
			dataIndex: 'date', 
			width: 10,
			xtype: 'datecolumn',
			editor: new Ext.form.DateField({  // rules about editing
				format: 'Y-m-d',
				allowBlank: false,
				maxLength: 10
			})
		},{
			header: 'RN',
			dataIndex: 'rn',
			editable: true,
			width: 10,
			editor: new Ext.form.NumberField({  // rules about editing
				allowBlank: false,
				maxLength: 2
			})
		},{	
			header: 'AM',
			dataIndex: 'am',
			editable: true,
			width: 10,
			editor: new Ext.form.NumberField({  // rules about editing
				allowBlank: false,
				maxLength: 4
			})
		},{	
			header: 'PM',
			dataIndex: 'pm',
			editable: true,
			width: 10,
			editor: new Ext.form.NumberField({  // rules about editing
				allowBlank: false,
				maxLength: 4
			})
		},{	
			header: 'TLo',
			dataIndex: 'tlo',
			editable: true,
			width: 10,
			editor: new Ext.form.NumberField({  // rules about editing
				allowBlank: false,
				maxLength: 2
			})
		},{	
			header: 'THi',
			dataIndex: 'thi',
			editable: true,
			width: 10,
			editor: new Ext.form.NumberField({  // rules about editing
				allowBlank: false,
				maxLength: 2
			})
		},{	
			header: 'HHi',
			dataIndex: 'hhi',
			editable: true,
			width: 10,
			editor: new Ext.form.NumberField({  // rules about editing
				allowBlank: false,
				maxLength: 2
			})
		},{	
			header: 'HLo',
			dataIndex: 'hlo',
			editable: true,
			width: 10,
			editor: new Ext.form.NumberField({  // rules about editing
				allowBlank: false,
				maxLength: 2
			})
		},{	
			header: 'ELV',
			dataIndex: 'elv',
			editable: true,
			width: 10,
			editor: new Ext.form.NumberField({  // rules about editing
				allowBlank: false,
				maxLength: 4
			})
		}
		]
});
var weatherGrid = new Ext.grid.EditorGridPanel({
		id: 'weathergrid',
		title: 'Weather characteristics',
		store: weatherStore,
		cm: weatherColumnModel,
		height: 200,
		clicksToEdit:1,
		enableColLock:false,
		loadMask: true,
		viewConfig: {
				 forceFit: true
		},
		listeners: {
        },
		tbar: [{    
			text: 'Add Record',
            handler: function(){
                // access the Record constructor through the grid's store
                
                var newRec = weatherStore.recordType;
                var p = new newRec({
                		rn: "0",
                		am: "0"
                });
                weatherGrid.stopEditing();
                weatherStore.insert(0, p);
                weatherStore.save();
                weatherStore.reload();
                weatherGrid.startEditing(0, 0);
            }
		},{
			text: 'Delete records',
			handler: function(){
				//delete records
				var selected = weatherGrid.getSelectionModel().getSelectedCell();

				Ext.MessageBox.confirm(
					'Confirm delete',
					'Are you sure?',
					function(btn) {
						if (btn == 'yes') {
							var recordToDelete = weatherStore.getAt(selected[0]);
							weatherStore.remove(recordToDelete);
							weatherStore.save();
							weatherStore.reload();
						}
					}
				);
			}
		},{
			text: "Wijzigingen opslaan",
			handler: function(){
				weatherStore.save();
				weatherStore.reload();
			}
		}]
});
/*********************
	landuse2fuel store
*********************/

// create reusable renderer
Ext.util.Format.comboRenderer = function(combo){
    return function(value){
        var record = combo.findRecord(combo.valueField, value);
        return record ? record.get(combo.displayField) : combo.valueNotFoundText;
    }
}

var fuelTypeCombo = new Ext.form.ComboBox({
	typeAhead: true,
    triggerAction: 'all',
    lazyRender:true,
    store: new Ext.data.JsonStore({
		// store configs
		autoDestroy: true,
		autoLoad: true,
		url: '/wildfire/php/get_fuelmodels.php',
		storeId: 'myStore',
		// reader configs
		root: 'results',
		idProperty: 'fuel_id',
		fields: ['fuel_id','description', 'carrier']
	}),
    valueField:'fuel_id',
    displayField:'description',
    mode:'remote'
    // rest of config
});

dataActions["landuse_add"] = new GeoExt.Action({
		/**********
			Add a record to the current grid
		**********/
		//TT: werkt nu alleen maar voor intensiteitengrid
		text: "Toevoegen",
		handler: function(){
			// access the Record constructor through the grid's store
			var newRec = landuse2fuelGrid.getStore().recordType; 
			var p = new newRec({});
			landuse2fuelGrid.stopEditing();
			landuse2fuelDataStore.insert(0, p);
			landuse2fuelGrid.startEditing(0, 0);
		}
});

var landuse2fuelDataStore = new Ext.data.Store({
	id: 'LandUse2Fuel',
	autoLoad: true,
	autoSave: false,
	writer: new Ext.data.JsonWriter({
			writeAllFields: true,
			encode: true
	}),
	sortInfo: { field: "landuse_id", direction: "ASC" },
	reader: new Ext.data.JsonReader({   
		// we tell the datastore where to get his data from
		root: 'results',
		remoteSort: true,
		totalProperty: 'total',
		successProperty: 'succes',
		idProperty: 'id',
		fields:
		[
			'id',
			{name: 'landuse_id'		,type:'int', 	mapping: 'landuse_id'},
			{name: 'landuse_name'	,type:'string', mapping: 'landuse_name'},
			{name: 'fuel_id'		,type:'int', 	mapping: 'fuel_id'	}
		]}
	),
	proxy: new Ext.data.HttpProxy({
			api:{                  
				read: 	'/wildfire/php/hub_data.php?tablename=landuse2fuel&task=READ',
				update: '/wildfire/php/hub_data.php?tablename=landuse2fuel&task=UPDATE',
				destroy: '/wildfire/php/hub_data.php?tablename=landuse2fuel&task=DESTROY',
				create: '/wildfire/php/hub_data.php?tablename=landuse2fuel&task=CREATE'
			}
	})

});

var landuse2fuelColumnModel = new Ext.grid.ColumnModel({
	 defaults: {
            sortable: true // columns are not sortable by default           
   },
   columns:	[
   	{
			header: 'id',
			width: 4,
			dataIndex: 'landuse_id',
			editor: new Ext.form.NumberField({  // rules about editing
				allowBlank: false,
				maxLength: 20
			})
		},{	
			header: 'Landuse',
			width: 10,
			dataIndex: 'landuse_name',
			editor: new Ext.form.TextField({  // rules about editing
					allowBlank: false,
					maxLength: 20,
					maskRe: /([a-zA-Z0-9\s]+)$/   // alphanumeric + spaces allowed
				})
		},{	
			header: 'Fueltype',
			width: 30,
			dataIndex: 'fuel_id',
			editor: fuelTypeCombo,
			renderer: Ext.util.Format.comboRenderer(fuelTypeCombo) // pass combo instance to reusable renderer
		}
	]
});

var landuse2fuelGrid = new Ext.grid.EditorGridPanel({
		id: 'landuse2fuel',
		//title: 'Conversie landuse naar fueltype',
		store: landuse2fuelDataStore,
		cm: landuse2fuelColumnModel,
		height: 200,
		clicksToEdit:1,
		enableColLock:false,
		loadMask: true,
		viewConfig: {
				 forceFit: true
		},
		tbar: [{    
			text: 'Add Record',
            handler: function(){
                // access the Record constructor through the grid's store
                var newRec = landuse2fuelDataStore.recordType;
                var p = new newRec({
                		landuse_id: 0,
                		landuse_name: 'new',
                });
                landuse2fuelGrid.stopEditing();
                landuse2fuelDataStore.insert(0, p);
                landuse2fuelDataStore.save();
                landuse2fuelDataStore.reload();
                landuse2fuelGrid.startEditing(0, 0);
            }
		},{
			text: 'Delete records',
			handler: function(){
				//delete records
				var selected = landuse2fuelGrid.getSelectionModel().getSelectedCell();

				Ext.MessageBox.confirm(
					'Confirm delete',
					'Are you sure?',
					function(btn) {
						if (btn == 'yes') {
							var recordToDelete = landuse2fuelDataStore.getAt(selected[0]);
							landuse2fuelDataStore.remove(recordToDelete);
							landuse2fuelDataStore.save();
							landuse2fuelDataStore.reload();
						}
					}
				);
			}
		},{
			text: "Wijzigingen opslaan",
			handler: function(){
				landuse2fuelDataStore.save();
				landuse2fuelDataStore.reload();
			}
		}]
		
});

