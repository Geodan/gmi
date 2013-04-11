var forms = new Array();

forms["fueldata"] = new Ext.form.FormPanel({
		//title: "Brandstofdata",
		items: [{
			fieldLabel: 'Naam',
			xtype: 'textfield',
			name: 'fuelmodel_name',
			value: '',
			id: 'fuelmodel_name',
			width: 40
		}]
});


forms["terreinForm2"] = new Ext.form.FormPanel({
		//title: "Terrein ID",
		//height: 20,
		padding: 2,
		defaultType: 'numberfield',
		items: [{
			fieldLabel: 'Terrein ID',
			name: 'terrein_id',
			disabled: true,
			value: '1',
			id: 'terrein_id',
			width: 40
		}]
});

forms["fuelmodelForm2"] = new Ext.form.FormPanel({
		//title: "Terrein ID",
		//height: 20,
		padding: 2,
		defaultType: 'numberfield',
		items: [{
			fieldLabel: 'Current fuelmodel:',
			name: 'fuelmodel_id',
			disabled: true,
			value: '1',
			id: 'fuelmodel_id',
			width: 40
		},{
			fieldLabel: 'Fuelmodel name',
			xtype: 'textfield',
			name: 'fuelmodel_name',
			value: '',
			id: 'fuelmodel_name',
			width: 40
		}]
});

var anugaForm1 = new Ext.form.FormPanel({
    // configs for FormPanel
    title: 'Flood params',
    //width: 100, 
    height: 200,
    padding: 10,
    defaultType: 'numberfield',
    items: [{
        fieldLabel: 'Flux (m3/s)',
        name: 'flux',
        value: '120',
        id: 'field_flux',
        width: 40
    },{
        fieldLabel: 'Radius (m)',
        name: 'radius',
        value: '30',
        id: 'field_radius',
        width: 40
    },{
        fieldLabel: 'Yieldstep (mins)',
        name: 'yieldstep',
        value: '10',
        id: 'yieldstep',
        width: 40
    },{
        fieldLabel: 'Tsunami',
        xtype: 'checkbox',
        name: 'tsunami',
        value: false,
        id: 'tsunami',
        width: 40
    },{
        fieldLabel: 'Tsunami height (m)',
        name: 'tsunami_height',
        value: '15',
        id: 'tsunami_height',
        width: 40
    },{
    	fieldLabel: 'Tmax (mins)',
        name: 'tend',
        value: '600',
        id: 'field_tend',
        width: 40
    }]
});

var anugaForm2 = new Ext.form.FormPanel({
    // configs for FormPanel
    title: 'Model params',
    //width: 100, 
    height: 100,
    padding: 10,
    defaultType: 'numberfield',
    items: [{
    	fieldLabel: 'Resolution (m2)',
        name: 'defres',
        value: '200',
        id: 'defres',
        width: 40
    }]
});
