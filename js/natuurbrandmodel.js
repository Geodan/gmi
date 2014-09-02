/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

// settings
Ext.namespace('Gmi.Control', 'Gmi.Data', 'Gmi.Params', 'Gmi.Services', 'Gmi.Services.WPS', 'Gmi.Session', 'Gmi.Settings');

Gmi.Settings.debug = false; //(location.host === 'brand.localhost'); // alleen lokaal default aan 

// params in url
Gmi.Params = Gmi.Params || {};
if (location.search !== '') {
  var search = location.search.substr(1); // remove ?
  var params = search.split('&');
  for (var i = 0; i < params.length; i++) {
    var pos = params[i].indexOf('=');
    if (pos < 0) {
        Gmi.Params[params[i]] = null;
    } else {
        var key = params[i].substr(0, pos);
        var value = params[i].substr(pos + 1);
        Gmi.Params[key] = value;

        if (key === 'debug') {
            Gmi.Settings.debug = (value === 'true');
        }
    }
  }
};

Gmi.Control.SessionHistory = OpenLayers.Class(OpenLayers.Control.NavigationHistory, {
    
    initialize: function(options) {
        OpenLayers.Control.NavigationHistory.prototype.initialize.apply(this, [options]);
    },
    
    destroy: function() {
        OpenLayers.Control.NavigationHistory.prototype.destroy.apply(this);
    },
    
    getState: function() {
        var state = OpenLayers.Control.NavigationHistory.prototype.getState.apply(this);
        
        // todo: extend state
        
        return state;
    },

    restore: function(state) {
        OpenLayers.Control.NavigationHistory.prototype.restore.apply(this, arguments);
    },

    CLASS_NAME: "Gmi.Control.SessionHistory"
});

Gmi.Version = '0.1';

Gmi.Settings.openLayers_imgPath = 'img/';
if (location.host === 'brand.localhost') {
    Gmi.Settings.openLayers_proxyHost = 'proxy.php?url=';
} else {
    Gmi.Settings.openLayers_proxyHost = 'cgi-bin/proxy.cgi?url=';
}

Gmi.userDefaults = localStorage['userDefaults'];
if (typeof Gmi.userDefaults === 'undefined') {
    Gmi.userDefaults = {
        station: 275 // Deelen
    };
} else {
    Gmi.userDefaults = JSON.parse(Gmi.userDefaults);
};

Gmi.Settings.maxArea = 10000 * 10000; // m2; 10 bij 10 km, 100 km2
Gmi.Settings.tijd_afronding_minuten = 5;
Gmi.Settings.operationalMode = 1;
Gmi.Settings.dateFormat = 'Y-m-d';
Gmi.Settings.datetimeFormat = 'Y-m-d H:i';
Gmi.Settings.decimalSeparator = '.'; // werkt niet met ,
Gmi.Settings.maxZoomOnMoveToTerrain = 14; // 14 = 1:34K
Gmi.Settings.weatherDaysBefore = 6;
Gmi.Settings.weatherDefaults = {station: Gmi.userDefaults.station, tmin: 15, tmax: 30, hmin: 50, hmax: 100, precipitation: 0, speed: 3.3, direction: 225, cloudiness: 0};
Gmi.Settings.windHours = 6;

Gmi.Session.userid = '0';

OpenLayers.imgPath = Gmi.Settings.openLayers_imgPath;
OpenLayers.ProxyHost = Gmi.Settings.openLayers_proxyHost;

// translations
OpenLayers.Util.applyDefaults(OpenLayers.Lang['nl'], {
    "${perc}% completed": "Voortgang ${perc}%",
    "All weather data will be cleared. Are you sure?": "Alle opgeslagen weergegevens zullen worden verwijderd. Doorgaan?",
    "Area ${area}": "Oppervlakte ${area}",
    "Area ${area} is too large; the maximum is ${max}": "Een oppervlakte van ${area} is te groot; maximaal ${max} is toegestaan.",
    "Change": "Wijzigen",
    "Change zoom": "Zoom wijzigen",
    "Clear weather data": "Verwijderen weerdata",
    "Click here to download the shapefile": "Klik hier om een shapefile te downloaden",
    "Close": "Sluiten",
    "Cloudiness (%)": "Bewolking (%)",
    "Create landscape file on the base of currently selected region": "Bepaal hoeveelheid brandstof op basis van huidige gebied",
    "Custom data": "Eigen gegevens",
    "Date": "Datum",
    "Date & time": "Datum & tijd",
    "Direction (&deg;)": "Richting (&deg;)",
    "Distance: ${distance} ${units}": "Afstand: ${distance} ${units}",
    "Draw a fire line first": "Geen vuurfront getekend",
    "Draw fire line": "Teken vuurfront",
    "Draw new fire line": "Teken nieuw vuurfront",
    "Edit": "Wijzigen",
    "Edit feature": "Wijzig feature",
    "Edit the land use": "Wijzig landgebruik",
    "Execution": "Uitvoering",
    "Export shape file": "Exporteer shapefile",
    "Feature Grid": "Grid",
    "Fire location": "Locatie van brand",
    "Fuel list": "Brandstoflijst",
    "Fuel model is undefined.": "Het terrein is niet opgeslagen.",
    "Initializing...": "Initialiseren",
    "Is modified?": "Gewijzigd?",
    "Last segment: ${distance} ${units}": "Laatste stuk: ${distance} ${units}",
    "Layers": "Kaartlagen",
    "Measure distances in map": "Bepaal afstanden in kaart",
    "Modify existing fire line": "Wijzig huidige vuurfront",
    "Name": "Naam",
    "Name of fire": "Naam van brand",
    "Name of terrain": "Naam van terrein",
    "Navigate in map": "Navigeer in kaart",
    "Not implemented yet": "Deze functie is nog niet geïmplementeerd.",    
    "Please wait": "Even wachten",
    "Preparing fuel model": "Bepalen van brandstof", //makelcp
    "Preparing terrain": "Uitsnijden terrein", // makesubset
    "Region is undefined.": "Er is geen gebied geselecteerd",
    "Restore next extent": "Herstel volgende kaartbeeld",
    "Restore previous extent": "Herstel vorige kaartbeeld",
    "Running fire model": "Uitvoeren van natuurbrandmodel", // startrun
    "Save": "Opslaan",
    "Saved terrains": "Opgeslagen terreinen",
    "Scale line": "Schaalbalk",
    "Select area": "Selecteer oppervlakte",
    "Select region": "Selecteer gebied",
    "Select region first": "Selecteer eerst een gebied", 
    "Select region by dragging a rectangle in the map": "Selecteer gebied door het trekken van een rechthoek",
    "Set weather data": "Weergegevens",
    "Show translations": "Toon vertalingen",
    "Simulation model": "Simulatiemodel",
    "Speed (m/s)": "Snelheid (m/s)",
    "Start run": "Start model",
    "Station": "Station",
    "Step 1 - Location": "Stap 1 - Locatie",
    "Step 2 - Inputs": "Stap 2 - Invoergegevens",
    "Step 3 - Run model": "Stap 3 - Model",
    "Step 4 - Results": "Stap 4 - Resultaat",
    "Terrain": "Terrein",
    "Terrein ID": "Terrein ID",
    "Time": "Tijd",
    "Topography": "Topografie",
    "Warning": "Waarschuwing",
    "Weather": "Weer",
    "Weather characteristics": "Weergegevens",
    "Weather data": "Weer data",
    "Weather settings": "Weer instellingen",
    "Weather station": "Weerstation",
    "WFS process error: ${msg}": "Fout bij uitvoering model: ${msg}",
    "Wild fire layer is missing": "Brandverspreidingslaag is nog niet berekend",
    "Wildfire modeling": "Simulatie van natuurbranden",
    "Wind": "Wind",
    "Wind characteristics": "Windgegevens",
    "save succeeded": "Succesvol opgeslagen",
    "todo": "Te doen",
    "untitled": "geen titel"
});

OpenLayers.Util.applyDefaults(OpenLayers.Lang['nl'], {
    
    "${layerName} is now the active layer.": "Kaartlaag '${layerName}' is nu actief",
    
    "Description": "Beschrijving",
    
    "Ignite": "Aansteken",
    
    "Information": "Informatie",
    
    "No terrain selected": "Geen terrein beschikbaar",
    
    "Too large": "Te groot",
    
    "Weather": 'Weer'
});

OpenLayers.Util.applyDefaults(OpenLayers.Lang['fr'], {
    "Change zoom": "",
    "Close": "",
    "Cloudiness (%)": "",
    "Create landscape file on the base of currently selected region": "",
    "Custom data": "",
    "Date": "",
    "Date & time": "",
    "Direction (&deg;)": "",
    "Draw fire line": "",
    "Draw new fire line": "",
    "Edit": "",
    "Edit the land use": "",
    "Execution": "",
    "Fire location": "",
    "Is modified?": "",
    "Layers": "",
    "Measure distances in map": "",
    "Modify existing fire line": "",
    "Name": "",
    "Name of fire": "",
    "Name of terrain": "",
    "Navigate in map": "",
    "Restore next extent": "",
    "Restore previous extent": "",
    "Save": "",
    "Saved terrains": "",
    "Scale line": "",
    "Select area": "",
    "Select region": "",
    "Select region by dragging a rectangle in the map": "",
    "Set weather data": "",
    "Simulation model": "",
    "Speed (m/s)": "",
    "Start run": "",
    "Station": "",
    "Step 1 - Location": "",
    "Step 2 - Inputs": "",
    "Step 3 - Run model": "",
    "Terrain": "",
    "Terrein ID": "",
    "Time": "",
    "Weather": "",
    "Weather characteristics": "",
    "Weather data": "",
    "Weather settings": "",
    "Weather station": "",
    "Wildfire modeling": "",
    "Wind": "",
    "Wind characteristics": "",
    "untitled": "sans titre"
});

Gmi.Data.translations = {};
Gmi.Data.addTranslation = function(key) {
    var locale = OpenLayers.Lang.getCode();
    var value = '';
    if (OpenLayers.Lang[locale]) {
        value = OpenLayers.Lang[locale][key];
        if (! value) {
            value = '';
        }
    }
    Gmi.Data.translations[key] = value;
};
OpenLayers.orig_i18n = OpenLayers.i18n;
OpenLayers.i18n = function() {
    Gmi.Data.addTranslation(arguments[0]);
    return OpenLayers.orig_i18n.apply(window, arguments);
};
Gmi.Data.showTranslations = function() {
    
    function sortOnKeys(dict) {

        var sorted = [];
        for(var key in dict) {
            sorted[sorted.length] = key;
        }
        sorted.sort();

        var tempDict = {};
        for (var i = 0; i < sorted.length; i++) {
            tempDict[sorted[i]] = dict[sorted[i]];
        }
        return tempDict;
    }

    var code = "OpenLayers.Util.applyDefaults(OpenLayers.Lang['" + OpenLayers.Lang.getCode() + "'], "
      + JSON.stringify(sortOnKeys(Gmi.Data.translations), null, 4) + ");\n"
      ;
    alert(code);
};

function translateDom() {
    // vertaalbare teksten in dom moeten class i18n hebben
    var code = OpenLayers.Lang.getCode();
    var dictionary = OpenLayers.Lang[code];
    if (code !== 'en' && dictionary !== 'undefined') {
        var els = Ext.DomQuery.select('.i18n');
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            Gmi.Data.addTranslation(el.innerHTML);
            if (typeof dictionary[el.innerHTML] !== 'undefined') {
                el.innerHTML = dictionary[el.innerHTML];
            }
        }
    }
};

// data

Gmi.Data.fuels = {
  "count": 58,
  "types": {
    "1": "GR1 | Short grass",
    "2": "GR2 | Timber grass and understory",
    "3": "GR3 | Tall grass",
    "4": "SH4 | Chaparral",
    "5": "SH5 | Brush",
    "6": "SH6 | Dormant brush",
    "7": "SH7 | Southern rough",
    "8": "TL8 | Compact timber litter",
    "9": "TL9 | Hardwoord litter",
    "10": "TU10 | Timber litter and understory",
    "11": "SB11 | Light slash",
    "12": "SB12 | Medium slash",
    "13": "SB13 | Heavy slash",
    "91": "NB91 | Urban\/suburban",
    "92": "NB92 | Snow\/Ice",
    "93": "NB93 | Agricultural field",
    "98": "NB98 | Open water",
    "99": "NB99 | Bear ground",
    "101": "GR101 | Short, sparse dry climate grass",
    "102": "GR102 | Low load dry climate grass",
    "103": "GR103 | Low load very coarse humid climate grass",
    "104": "GR104 | Moderate load dry climate grass",
    "105": "GR105 | Low load humid climate grass",
    "106": "GR106 | Moderate load humid climate grass",
    "107": "GR107 | High load dry climate grass",
    "108": "GR108 | High load very coarse humid climate grass",
    "109": "GR109 | Very high load humid climate grass",
    "121": "GS121 | Low load dry climate grass-shrub",
    "122": "GS122 | Moderate load dry climate grass-shrub",
    "123": "GS123 | Moderate load humid climate grass-shrub",
    "124": "GS124 | High load humid climate grass-shrub",
    "141": "SH141 | Low load dry climate shrub",
    "142": "SH142 | Moderate load dry climate shrub",
    "143": "SH143 | Moderate load humid climate shrub",
    "144": "SH144 | Low load humid climate timber shrub",
    "145": "SH145 | High load dry climate shrub",
    "146": "SH146 | Low load humid climate shrub",
    "147": "SH147 | Very high load dry climate shrub",
    "148": "SH148 | High load humid climate shrub",
    "149": "SH149 | Very high load humid climate shrub",
    "161": "TU161 | Ligh load dry climate timber-grass-shrub",
    "162": "TU162 | Moderate load humid climate timber-shrub",
    "163": "TU163 | Moderate load humid climate timber-grass-shrub",
    "164": "TU164 | Dwarf conifer with understory",
    "165": "TU165 | Very high load dry climate timber-shrub",
    "181": "TL181 | Low load compact conifer litter",
    "182": "TL182 | Low load broadleaf litter",
    "183": "TL183 | Moderate load conifer litter",
    "184": "TL184 | Small downed logs",
    "185": "TL185 | High load conifer litter",
    "186": "TL186 | Moderate load broadleaf litter",
    "187": "TL187 | Large downed logs",
    "188": "TL188 | Long-needle litter",
    "189": "TL189 | Very high load broadleaf litter",
    "201": "SB201 | Low load activity fuel",
    "202": "SB202 | Moderate load activ. fuel or low load blowdown",
    "203": "SB203 | High load activ. fuel or mod. load blowdown",
    "204": "SB204 | High load blowdown"
  },
  colors: {
    "106": "#C25283", // heide paars?
    "162": "#00FF00"  // bos groen
  }
};

Gmi.Data.Stations = [
    [0, OpenLayers.i18n('Custom data')],
    [260, 'De Bilt'],
    [275, 'Deelen'],
    [283, 'Hupsel'],
    [375, 'Volkel']
];

// Models
Gmi.Services.WPS = {
    
    url: '/geoserver/ows?',
    
    request: function(options) {
        var config = Ext.extend({
            url: '/geoserver/ows?',
            params: {
                service: 'WPS',
                version: '1.1.0',
                request: 'execute',
                identifier: 'py:wildfire_makesubset',
                datainputs: combineParams({
                    userid: Gmi.Session.userid,
                    name: 'test',
                    left: bounds.left,
                    lower: bounds.bottom,
                    right: bounds.right,
                    upper: bounds.top
                }, ';'),
                RawDataOutput: 'string',
                mimeType: 'application/json'
            }
        }, options);
        Ext.Ajax.Request(config);
    }
};

// klimaatgegevens

var WeatherRecord = new Ext.data.Record.create([
    { name: 'station', type: 'int'},
    { name: 'date', type: 'date'},
    { name: 'precipitation', type: 'float'},
    { name: 'wind', type: 'float'},
    { name: 'windrichting', type: 'int'},
    { name: 'hour1', type: 'int'},
    { name: 'hour2', type: 'int'},
    { name: 'tmin', type: 'float'},
    { name: 'tmax', type: 'float'},
    { name: 'hmin', type: 'float'}, // max. 99 in model
    { name: 'hmax', type: 'float'}, // max. 99 in farsite model
    { name: 'isModified', type: 'int'} // 0/1
]);

var WindRecord = new Ext.data.Record.create([
    { name: 'station', type: 'int'},
    { name: 'date', type: 'date'},
    { name: 'time', type: 'time', timeFormat: 'H:i'}, // hhmm
    { name: 'speed', type: 'float'}, // km/h farsite, km/s gebruiker
    { name: 'direction', type: 'float'}, // degrees
    { name: 'cloudiness', type: 'float'}, // percentage
    { name: 'isModified', type: 'int'}
]);

var TerrainFeatureRecord = new GeoExt.data.FeatureRecord.create([
    {name: 'landscape_name', type: 'string'},
    {name: 'started', type: 'date'}
]);

function stringToFloat(s) {
    var f = parseFloat(s);
    if (isNaN(f)) {
        f = 0.0;
    }
    return f;
};

function parseWeatherData(data, start_ymd, end_ymd) {

    // splits data in regels en verwijder commentaar en lege regels
    // Uitgangspunt: datum is oplopend gesorteerd
    var dict = {};
    var lines = data.split('\n').filter(function(line){return line.length > 0 && !line.startsWith('#');});
    for (var i = 0; i < lines.length; i++) {
        var tokens = lines[i].split(/[,\s]+/g).filter(function(token){return token.length > 0;});
        //console.log(tokens);

        //last_ymd = tokens[1];
        var d_ymd = tokens[1];
        dict[d_ymd] = {
            station: tokens[0],
            date: Date.parseDate(d_ymd, 'Ymd'), // convert yyyymmdd to date?
            tmin: parseFloat(tokens[2])/10,
            hour1: parseInt(tokens[3]),
            tmax: parseFloat(tokens[4])/10,
            hour2: parseInt(tokens[5]),
            hmin: parseFloat(tokens[6]),
            hmax: parseFloat(tokens[8]),
            precipitation: Math.max(0, stringToFloat(tokens[10])) / 10,
            wind: stringToFloat(tokens[11])/10,
            windrichting: parseFloat(tokens[12]),
            isModified: 0
        };
    }
    var d = Date.parseDate(start_ymd, 'Ymd');
    var end_d_valueOf = Date.parseDate(end_ymd, 'Ymd').valueOf();
    var prev_d_ymd = d.dateFormat('Ymd');
    d.increment(1); // 1ste dag overslaan
    while (d.valueOf() <= end_d_valueOf) {
        d_ymd = d.dateFormat('Ymd');
        if (!dict[d_ymd] && dict[prev_d_ymd]) {
            dict[d_ymd] = OpenLayers.Util.applyDefaults({date: Date.parseDate(d_ymd, 'Ymd'), isModified: 1}, dict[prev_d_ymd]);
            console.log('stationgegevens kopie van dag ervoor', dict[d_ymd]);
        }
        
        prev_d_ymd = d_ymd;
        d.increment(1);
    }
    
    /*var start_ymdi = parseInt(start_ymd);
    var end_ymdi = parseInt(end_ymd);
    for (var ymdi = start_ymdi + 1; ymdi <= end_ymdi; ymdi++) {
        var ymd = ymdi.toString();
        if (!dict[ymd] && dict[(ymdi-1).toString()]) {
            dict[ymd] = OpenLayers.Util.applyDefaults({date: Date.parseDate(ymd, 'Ymd'), isModified: 1}, dict[(ymdi-1).toString()]);
            console.log('stationgegevens kopie van dag ervoor', dict[ymd]);
        }
    }*/
    var records = [];
    for (var d_ymd in dict) {
        records.push(dict[d_ymd]);
    }
    return records;
};

function requestWeatherData(station, start_ymd, end_ymd) {
    // NB: proxy nodig voor direct ophalen
    console.log('requestWeatherData', station, start_ymd, end_ymd);
    
    //Ext.Ajax.request({
    var vars = 'TN:TNH:TX:TXH:UN:UNH:UX:UXH:RH:FHVEC:DDVEC'; // Minimum temperatuur, uur, maximum temp, uur, Minimale relatieve vochtigheid, uur, max rel vocht, uur, etmaalsom neerslag, vectorgem. windsnelheid (0.1 m/s), Vectorgemiddelde windrichting in graden
    var request = OpenLayers.Request.GET({
        url: 'http://www.knmi.nl/klimatologie/daggegevens/getdata_dag.cgi',
        async: false, // synchroon opvragen
        params: {
            stns: station,
            vars: vars, // station,datum, ...
            start: start_ymd,
            end: end_ymd
        },
        success: function(response) {
            //var data = response.responseText; // bij OpenLayers request
            // niks, want synchroon
        },
        failure: function(xhr) {
            console.log('request failure', arguments);
        }
    });
    var data = [];
    if (request.status == 200) {
        data = parseWeatherData(request.responseText, start_ymd, end_ymd);
    } else {
        alert(OpenLayers.i18n("Failure: ${msg} (status ${status})", {status: request.status, msg: request.responseText}));
    }
    /*
    var last_data = data[data.length - 1];
    var today = new Date();
    if (last_data.date.dateFormat('Ymd') < end_ymd && end_ymd == today.dateFormat('Ymd')) {
        data.push(OpenLayers.Util.applyDefaults({date: Date.parseDate(end_ymd, 'Ymd')}, last_data));
    }
    */
    return data;
};

function storeWeatherData(station, data) {
    var key = station + '_station';
    var value = localStorage[key];
    if (value) {
        value = JSON.parse(value); // meest onderscheidend vooraan
    } else {
        value = {};
    }
    for (var i = 0; i < data.length; i++) {
        // element van data array opslaan in dict met yyyymmdd als key
        value[data[i].date.dateFormat('Ymd')] = data[i];
    }
    localStorage[key] = JSON.stringify(value);
};

function storeWindData(station, data) {
    //console.log('todo: save winddata', dataset);
    var key = station + '_wind';
    var value = localStorage[key];
    if (value) {
        value = JSON.parse(value); // meest onderscheidend vooraan
    } else {
        value = {};
    }
    for (var i = 0; i < data.length; i++) {
        // element van data array opslaan in dict met yyyymmdd als key
        value[data[i].date.dateFormat('YmdHi')] = data[i];
    }
    localStorage[key] = JSON.stringify(value);
};

function weatherDataToRecords(end_ymd, objs) {

    var records = [];

    var last_ymd = '00000000';
    var last_obj = {};
    for (var i = 0; i < objs.length; i++) {
        var obj = objs[i];
        var d_ymd = obj.date.dateFormat('Ymd');
        if (d_ymd > last_ymd) {
            last_ymd = d_ymd;
            last_obj = obj;
        }
        records.push(new WeatherRecord(obj, d_ymd));
    }
    if (records.length > 0 && end_ymd !== last_ymd) {
        // voeg laatste record toe met zelfde gegevens behalve datum
        records.push(new WeatherRecord(OpenLayers.Util.applyDefaults({date: Date.parseDate(end_ymd, 'Ymd'), isModified: 1}, last_obj), end_ymd));
    }
    return records;
};

function windDataToRecords(end_ymd, objs) {

    var records = [];

    var last_ymd = '000000000000';
    var last_obj = {};
    for (var i = 0; i < objs.length; i++) {
        var obj = objs[i];
        var d_ymd = obj.date.dateFormat('YmdHi');
        if (d_ymd > last_ymd) {
            last_ymd = d_ymd;
            last_obj = obj;
        }
        records.push(new WindRecord(obj, d_ymd));
    }
    if (records.length > 0 && end_ymd !== last_ymd) {
        // voeg laatste record toe met zelfde gegevens behalve datum
        records.push(new WindRecord(OpenLayers.Util.applyDefaults({date: Date.parseDate(end_ymd, 'YmdHi'), isModified: 1}, last_obj), end_ymd));
    }
    return records;
};

function getClimateData(station) {

    //var today = Ext.util.Format.date(new Date(), 'Ymd');
    var end = Ext.getCmp('model_date').getValue();
    var end_ymd = end.dateFormat('Ymd');
    
    var start = new Date(end);
    start.increment( -Gmi.Settings.weatherDaysBefore );
    var start_ymd = start.dateFormat('Ymd');
    
    // al in sessie aanwezig?
    //Gmi.Data
    
    // read from local storage
    var data = [];
    var key = station + '_station';
    var station_data = localStorage[key];
    if (station_data) {
        station_data = JSON.parse(station_data); // meest onderscheidend vooraan
        var count_missing_days = parseInt(end_ymd) - parseInt(start_ymd) + 1;
        var count_modified_days_before_today = 0;
        var today = new Date().clearTime();
        var today_ymd = today.dateFormat('Ymd');
        if (station_data[start_ymd]) {
            // ok, al aanwezig
            var d = Date.parseDate(start_ymd, 'Ymd');
            var last_d = Date.parseDate(end_ymd, 'Ymd');
            while (d.getTime() <= last_d.getTime()) {
                var d_ymd = d.dateFormat('Ymd');
                if (station_data[d_ymd]) {
                    // date omzetten van string naar object
                    station_data[d_ymd]['date'] = new Date(station_data[d_ymd]['date']);
                    
                    data.push(station_data[d_ymd]);
                    
                    if (station > 0 && station_data[d_ymd]['date'].valueOf() < today.valueOf() && station_data[d_ymd]['isModified'] === 1) {
                        count_modified_days_before_today += 1;
                    }
                    count_missing_days -= 1;
                } else {
                    //break;
                    // day is missing in localstorage
                }
                d.increment( +1 );
            }
            if (count_modified_days_before_today === 0 && (count_missing_days === 0 || (count_missing_days === 1 && last_d.dateFormat('Ymd') == today_ymd))) {
                // geen gewijzigde dagen voor vandaag bij bestaand station 
                // EN (geen ontbrekende dagen OF alleen vandaag ontbreekt)
                console.log('all climate data from local storage', data);
                return weatherDataToRecords(end_ymd, data);
            }
        }
    }
    
    // probeer in te lezen
    if (station === 0) {
        // bouw array van weather data voor eigen gegevens
        data = [];
        // data voor eigen locatie, dus van start tot eind verzinnen
        var d = Date.parseDate(start_ymd, 'Ymd');
        var last_d = Date.parseDate(end_ymd, 'Ymd');
        while (d <= last_d) {
            var d_ymd = d.dateFormat('Ymd');
            data.push({
                station: station,
                date: Date.parseDate(d_ymd, 'Ymd'), // convert yyyymmdd to date?
                tmin: Gmi.Settings.weatherDefaults.tmin,
                hour1: 5,
                tmax: Gmi.Settings.weatherDefaults.tmax,
                hour2: 14,
                hmin: Gmi.Settings.weatherDefaults.hmin,
                hmax: Gmi.Settings.weatherDefaults.hmax,
                precipitation: Gmi.Settings.weatherDefaults.precipitation,
                wind: 0,
                windrichting: 0,
                isModified: 1
            });
            d.increment( +1 );
        }
    } else {
        // request array of weather data
        var station_data = requestWeatherData(station, start_ymd, end_ymd);
        // merge nieuwe station_data met data indien station_data NIET modified is
        for (var i = 0; i < station_data.length; i++) {
            if (station_data[i].isModified) {
                // kan eigenlijk alleen voor laatste dag (als kopie toegevoegde dag); kopieren dag uit data
                for (var j = 0; j < data.length; j++) {
                    if (station_data[i].date.dateFormat('Ymd') === data[j].date.dateFormat('Ymd')) {
                        station_data[i] = data[j];
                        break;
                    }
                }
            }
        }
        data = station_data;
    }
    
    storeWeatherData(station, data);
    
    return weatherDataToRecords(end_ymd, data);
};

function getWindData(station) {
    var model_datetime = getModelDateTime();
    
    // wind uit laatste dag van climate data als initiele waarde
    // of (voorlopig) gewoon gemiddelde waarde
    
    var start = new Date(model_datetime);
    start.setMinutes(0); start.setSeconds(0); start.setMilliseconds(0);
    var start_ymd = start.dateFormat('YmdHi');

    var end = new Date(start);
    end.increment(Gmi.Settings.windHours/24);
    var end_ymd = end.dateFormat('YmdHi');
    
    // read from local storage
    var key = station + '_wind';
    var station_data = localStorage[key];
    if (station_data) {
        station_data = JSON.parse(station_data); // meest onderscheidend vooraan
        /*
        var count_missing_hours = Gmi.Settings.windHours + 1;
        //var count_modified_days_before_today = 0;
        var today = new Date().clearTime();
        var today_ymd = today.dateFormat('Ymd');
        if (station_data[start_ymd]) {
            // ok, al aanwezig
            var d = Date.parseDate(start_ymd, 'YmdHi');
            var last_d = Date.parseDate(end_ymd, 'YmdHi');
            while (d.getTime() <= last_d.getTime()) {
                var d_ymd = d.dateFormat('YmdHi');
                if (station_data[d_ymd]) {
                    // date omzetten van string naar object
                    station_data[d_ymd]['date'] = new Date(station_data[d_ymd]['date']);
                    
                    data.push(station_data[d_ymd]);
                    
                    //if (station > 0 && station_data[d_ymd]['date'].valueOf() < today.valueOf() && station_data[d_ymd]['isModified'] === 1) {
                    //    count_modified_days_before_today += 1;
                    //}
                } else {
                    //break;
                }
                count_missing_hours -= 1;
                d.increment( +1/24 );
            }
            if (count_modified_days_before_today === 0 && (count_missing_days === 0 || (count_missing_days === 1 && last_d.dateFormat('Ymd') == today_ymd))) {
                // geen gewijzigde dagen voor vandaag bij bestaand station 
                // EN (geen ontbrekende dagen OF alleen vandaag ontbreekt)
                console.log('all wind data from local storage', data);
                return windDataToRecords(end_ymd, data);
            }
        }*/
    } else {
        station_data = {};
    }
        
    //var records = [];
    var data = [];
    var id = start.dateFormat('YmdHi');
    data.push(station_data[id] ? station_data[id] : {
        station: station,
        date: start,
        time: zpad(start.getHours(), 2) + ':00',
        speed: Gmi.Settings.weatherDefaults.speed,
        direction: Gmi.Settings.weatherDefaults.direction,
        cloudiness: Gmi.Settings.weatherDefaults.cloudiness,
        isModified: 0 // default not modified for wind
    });
    // extra uren
    for (var i = 1; i <= Gmi.Settings.windHours; i++) {
        var next = new Date(start);
        next.increment(i/24);
        id = next.dateFormat('YmdHi');
        data.push(station_data[id] ? station_data[id] : {
            station: station,
            date: next,
            time: zpad(next.getHours(), 2) + ':00',
            speed: Gmi.Settings.weatherDefaults.speed,
            direction: Gmi.Settings.weatherDefaults.direction,
            cloudiness: Gmi.Settings.weatherDefaults.cloudiness,
            isModified: 0 // default not modified for wind
        });
    }
    
    for (var i = 0; i < data.length; i++) {
        if (typeof data[i].date == 'string') {
            data[i].date = new Date(data[i].date);
        }
    }

    storeWindData(station, data);
    
    return windDataToRecords(end_ymd, data);
    //return records;
};

Gmi.makeSubset = function() {
    // kaart variabele beschikbaar maken
    var map = mapPanel.map;
    // laag achterhalen
    var layers = map.getLayersByName('_boxes_');
    if (layers.length > 0) {
        // rechthoek achterhalen
        //var bounds = layers[0].getDataExtent(); // gaat fout omdat deze functie marker.lonlat gebruikt en deze hier null
        var bounds = layers[0].markers.length > 0 ? layers[0].markers[0].bounds : null;
        if (!bounds || !bounds.left) {
            alert(OpenLayers.i18n('Select region first'));
        } else {
            // select region knop deactiveren
            var btn_select_region = Ext.getCmp('btn_select_region');
            if (btn_select_region.pressed) {
                btn_select_region.control.box.deactivate();
                map.removeControl(btn_select_region.control);
                btn_select_region.doToggle();
            }
            Gmi.Session.box = bounds;

            var run_params = {
                    service: 'WPS',
                    version: '1.1.0',
                    request: 'execute',
                    identifier: 'py:wildfire_makesubset',
                    datainputs: combineParams({
                        userid: Gmi.Session.userid,
                        name: 'test',
                        left: bounds.left,
                        lower: bounds.bottom,
                        right: bounds.right,
                        upper: bounds.top
                    }, ';'),
                    RawDataOutput: 'string',
                    mimeType: 'application/json'
                };
            if (Gmi.Settings.debug) {
                if (! confirm(OpenLayers.i18n('Subset parameters: \n\n${params}', {params: JSON.stringify(run_params, null, 2)}))) {
                    return;
                }
            }

            // makesubset process aanroepen
            startProgress(OpenLayers.i18n('Preparing terrain'));
            Ext.Ajax.request({
                url: '/geoserver/ows?', 
                params: run_params,
                extraParams: {
                    count: 0
                },
                on_finished: function(out_params) {
                    // reset van fuelmodel_name
                    Ext.getCmp('fuelmodel_name').setValue(OpenLayers.i18n('untitled'));
                    // reset van fuelid
                    Gmi.Session.fuelid = null;
                    
                    // TODO: laagnaam terugkrijgen van model
                    out_params.subset_name = 'model_wildfire:terrein_' + out_params.runid;
                    // toon terrein laag
                    showTerrein(map, out_params.runid, out_params.subset_name);
               },
               success: wpsSuccessCallback,
               failure: wpsFailureCallback
            });
        }
    }
} // make subset
;

Gmi.makeSubsetCorine = function() {
    // kaart variabele beschikbaar maken
    var map = mapPanel.map;
    // laag achterhalen
    var layers = map.getLayersByName('_boxes_');
    if (layers.length > 0) {
        // rechthoek achterhalen
        //var bounds = layers[0].getDataExtent(); // gaat fout omdat deze functie marker.lonlat gebruikt en deze hier null
        var bounds = layers[0].markers.length > 0 ? layers[0].markers[0].bounds : null;
        if (!bounds || !bounds.left) {
            alert(OpenLayers.i18n('Select region first'));
        } else {
            // select region knop deactiveren
            var btn_select_region = Ext.getCmp('btn_select_region');
            if (btn_select_region.pressed) {
                btn_select_region.control.box.deactivate();
                map.removeControl(btn_select_region.control);
                btn_select_region.doToggle();
            }
            Gmi.Session.box = bounds;

            var run_params = {
                    service: 'WPS',
                    version: '1.1.0',
                    request: 'execute',
                    identifier: 'py:wildfire_makesubset_corine',
                    datainputs: combineParams({
                        userid: Gmi.Session.userid,
                        name: 'test',
                        left: bounds.left,
                        lower: bounds.bottom,
                        right: bounds.right,
                        upper: bounds.top
                    }, ';'),
                    RawDataOutput: 'string',
                    mimeType: 'application/json'
                };
            if (Gmi.Settings.debug) {
                if (! confirm(OpenLayers.i18n('Subset parameters: \n\n${params}', {params: JSON.stringify(run_params, null, 2)}))) {
                    return;
                }
            }

            // makesubset process aanroepen
            startProgress(OpenLayers.i18n('Preparing terrain'));
            Ext.Ajax.request({
                url: '/geoserver/ows?', 
                params: run_params,
                extraParams: {
                    count: 0
                },
                on_finished: function(out_params) {
                    // reset van fuelmodel_name
                    Ext.getCmp('fuelmodel_name').setValue(OpenLayers.i18n('untitled'));
                    // reset van fuelid
                    Gmi.Session.fuelid = null;
                    
                    // TODO: laagnaam terugkrijgen van model
                    out_params.subset_name = 'model_wildfire:terrein_' + out_params.runid;
                    // toon terrein laag
                    showTerrein(map, out_params.runid, out_params.subset_name);
               },
               success: wpsSuccessCallback,
               failure: wpsFailureCallback
            });
        }
    }
} // make subset corine
;

var weatherColumnModel = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true, // columns are not sortable by default
        width: 100,
        align: 'right',
        format: '000.0',
        editable: true,
        xtype: 'numbercolumn'
    },
    columns: [
    {
        header: 'Station',
        dataIndex: 'station',
        hidden: true,
        format: '000'
        /*{
        editor: new Ext.form.DateField({  // rules about editing
                format: 'Y-m-d',
                allowBlank: false,
                maxLength: 10
        })*/
    }, {
        header: 'Date',
        dataIndex: 'date',
        width: 100,
        align: 'right',
        format: Gmi.Settings.dateFormat,
        xtype: 'datecolumn'
    }, {
        header: 'Tmin (°C)',
        format: '00.0',
        editable: true,
        editor: new Ext.form.NumberField({  // rules about editing
            allowBlank: false,
            decimalSeparator: Gmi.Settings.decimalSeparator,
            minValue: 0,
            maxValue: 50,
            maxLength: 4
        }),
        dataIndex: 'tmin'
    }, {
        header: 'Tmax (°C)',
        format: '00.0',
        editable: true,
        editor: new Ext.form.NumberField({  // rules about editing
            allowBlank: false,
            minValue: 0,
            maxValue: 50,
            decimalSeparator: Gmi.Settings.decimalSeparator,
            maxLength: 4
        }),
        dataIndex: 'tmax'
    }, {
        header: 'RVmin (%)',
        format: '000',
        editable: true,
        editor: new Ext.form.NumberField({  // rules about editing
            allowBlank: false,
            maxLength: 3,
            minValue: 0,
            maxValue: 100
        }),
        dataIndex: 'hmin'
    }, {
        header: 'RVmax (%)',
        format: '000',
        editable: true,
        editor: new Ext.form.NumberField({  // rules about editing
            allowBlank: false,
            maxLength: 3,
            minValue: 0,
            maxValue: 100
        }),
        dataIndex: 'hmax'
    }, {
        header: 'Rainfall',
        format: '000.0',
        editable: true,
        editor: new Ext.form.NumberField({  // rules about editing
            allowBlank: false,
            maxLength: 5,
            decimalSeparator: Gmi.Settings.decimalSeparator,
            minValue: 0,
            maxValue: 100
        }),
        dataIndex: 'precipitation'
    }, {
        header: 'Wind',
        format: '000.0',
        editable: true,
        hidden: true,
        editor: new Ext.form.NumberField({  // rules about editing
            allowBlank: false,
            decimalSeparator: Gmi.Settings.decimalSeparator,
            maxLength: 5,
            minValue: 0
        }),
        dataIndex: 'wind'
    }, {
        header: 'Windrichting',
        format: '000',
        editable: true,
        hidden: true,
        editor: new Ext.form.NumberField({  // rules about editing
            allowBlank: false,
            maxLength: 3,
            minValue: 0,
            maxValue: 360
        }),
        dataIndex: 'windrichting'
    }, {
        header: OpenLayers.i18n('Is modified?'),
        format: '0',
        editable: false,
        hidden: !Gmi.Settings.debug, // verbergen tenzij debug
        editor: new Ext.form.NumberField({  // rules about editing
            allowBlank: false,
            maxLength: 1,
            minValue: 0,
            maxValue: 1
        }),
        dataIndex: 'isModified'
    }]
});

var windColumnModel = new Ext.grid.ColumnModel({
    defaults: {
        sortable: true, // columns are not sortable by default
        width: 100,
        align: 'right'
        //xtype: 'numbercolumn'
    },
    columns: [
    {
        header: OpenLayers.i18n('Station'),
        dataIndex: 'station',
        hidden: true,
        format: '000'
        /*{
        editable: true,
        editor: new Ext.form.DateField({  // rules about editing
                format: 'Y-m-d',
                allowBlank: false,
                maxLength: 10
        })*/
    }, {
        header: OpenLayers.i18n('Date'),
        dataIndex: 'date',
        width: 100,
        align: 'right',
        format: Gmi.Settings.dateFormat,
        xtype: 'datecolumn'
    }, {
        header: OpenLayers.i18n('Time'),
        dataIndex: 'time',
        format: 'H:i',
        align: 'right',
        editable: false //, forceSelection: true,
        //editor: new Ext.form.TimeField({  // rules about editing
        //    allowBlank: false,
        //    maxLength: 6
        //})//,
        //xtype: 'datecolumn'
    }, {
        header: OpenLayers.i18n('Speed (m/s)'),
        format: '00.0',
        editable: true,
        editor: new Ext.form.NumberField({  // rules about editing
            allowBlank: false,
            decimalSeparator: Gmi.Settings.decimalSeparator,
            minValue: 0,
            maxLength: 4
        }),
        dataIndex: 'speed',
        xtype: 'numbercolumn'
    }, {
        header: OpenLayers.i18n('Direction (&deg;)'),
        format: '000',
        editable: true,
        editor: new Ext.form.NumberField({  // rules about editing
            allowBlank: false,
            maxLength: 3,
            minValue: 0,
            maxValue: 360
        }),
        dataIndex: 'direction',
        xtype: 'numbercolumn'
    }, {
        header: OpenLayers.i18n('Cloudiness (%)'),
        format: '000',
        editable: true,
        editor: new Ext.form.NumberField({  // rules about editing
            allowBlank: false,
            maxLength: 3,
            minValue: 0,
            maxValue: 100
        }),
        dataIndex: 'cloudiness',
        xtype: 'numbercolumn'
    }, {
        header: OpenLayers.i18n('Is modified?'),
        format: '0',
        editable: false,
        hidden: !Gmi.Settings.debug, // verbergen tenzij debug
        editor: new Ext.form.NumberField({  // rules about editing
            allowBlank: false,
            maxLength: 1,
            minValue: 0,
            maxValue: 1
        }),
        dataIndex: 'isModified'
    }]
});

Ext.data.LocalStorageWriter = Ext.extend(Ext.data.DataWriter, {
    /**
     * @cfg {Boolean} encode <p><tt>true</tt> to {@link Ext.util.JSON#encode JSON encode} the
     * {@link Ext.data.DataWriter#toHash hashed data} into a standard HTTP parameter named after this
     * Reader's <code>meta.root</code> property which, by default is imported from the associated Reader. Defaults to <tt>true</tt>.</p>
     * <p>If set to <code>false</code>, the hashed data is {@link Ext.util.JSON#encode JSON encoded}, along with
     * the associated {@link Ext.data.Store}'s {@link Ext.data.Store#baseParams baseParams}, into the POST body.</p>
     * <p>When using {@link Ext.data.DirectProxy}, set this to <tt>false</tt> since Ext.Direct.JsonProvider will perform
     * its own json-encoding.  In addition, if you're using {@link Ext.data.HttpProxy}, setting to <tt>false</tt>
     * will cause HttpProxy to transmit data using the <b>jsonData</b> configuration-params of {@link Ext.Ajax#request}
     * instead of <b>params</b>.</p>
     * <p>When using a {@link Ext.data.Store#restful} Store, some serverside frameworks are
     * tuned to expect data through the jsonData mechanism.  In those cases, one will want to set <b>encode: <tt>false</tt></b>, as in
     * let the lower-level connection object (eg: Ext.Ajax) do the encoding.</p>
     */
    encode : true,
    
    /**
     * @cfg {Boolean} encodeDelete False to send only the id to the server on delete, true to encode it in an object
     * literal, eg: <pre><code>
{id: 1}
 * </code></pre> Defaults to <tt>false</tt>
     */
    encodeDelete: false,
    
    constructor : function(config) {
        Ext.data.LocalStorageWriter.superclass.constructor.call(this, config);
    },

    /**
     * <p>This method should not need to be called by application code, however it may be useful on occasion to
     * override it, or augment it with an {@link Function#createInterceptor interceptor} or {@link Function#createSequence sequence}.</p>
     * <p>The provided implementation encodes the serialized data representing the Store's modified Records into the Ajax request's
     * <code>params</code> according to the <code>{@link #encode}</code> setting.</p>
     * @param {Object} Ajax request params object to write into.
     * @param {Object} baseParams as defined by {@link Ext.data.Store#baseParams}.  The baseParms must be encoded by the extending class, eg: {@link Ext.data.JsonWriter}, {@link Ext.data.XmlWriter}.
     * @param {Object/Object[]} data Data object representing the serialized modified records from the Store. May be either a single object,
     * or an Array of objects - user implementations must handle both cases.
     *
    render : function(params, baseParams, data) {
        if (this.encode === true) {
            // Encode here now.
            Ext.apply(params, baseParams);
            params[this.meta.root] = Ext.encode(data);
        } else {
            // defer encoding for some other layer, probably in {@link Ext.Ajax#request}.  Place everything into "jsonData" key.
            var jdata = Ext.apply({}, baseParams);
            jdata[this.meta.root] = data;
            params.jsonData = jdata;
        }
    },*/
    
    /**
     * Implements abstract Ext.data.DataWriter#createRecord
     * @protected
     * @param {Ext.data.Record} rec
     * @return {Object}
     */
    createRecord : function(rec) {
       console.log('createRecord', rec);
       return this.toHash(rec);
    },
    
    /**
     * Implements abstract Ext.data.DataWriter#updateRecord
     * @protected
     * @param {Ext.data.Record} rec
     * @return {Object}
     */
    updateRecord : function(rec) {
        console.log('updateRecord', rec);
        Ext.apply(this, {
            meta: {
                idProperty: 'id'
            }
        });
        if (rec instanceof WeatherRecord) {
            storeWeatherData(rec.data.station, [rec.data]);
        } else if (rec instanceof WindRecord) {
            storeWindData(rec.data.station, [rec.data]);
        } else {
            alert('Interne fout: onbekend record type')
        }
        return this.toHash(rec);
    },
    
    /**
     * Implements abstract Ext.data.DataWriter#destroyRecord
     * @protected
     * @param {Ext.data.Record} rec
     * @return {Object}
     */
    destroyRecord : function(rec){
        if (this.encodeDelete){
            var data = {};
            data[this.meta.idProperty] = rec.id;
            return data;
        } else {
            return rec.id;
        }
    }
});

var weatherStore = new Ext.data.Store({
    id: 'weatherStore',
    autoSave: false,
    recordType: WeatherRecord,
    sortInfo: { field: "date", direction: "DESC" },
//    proxy: {
//        request: function() {} //Ext.emptyFn
//    },
    reader: {
        idProperty: 'id',
        root: 'results',
        readRecords: function() {
            if (weatherStore.modified.length > 0) {
                // eerst opslaan store indien er gewijzigde records zijn
                console.log('modified', weatherStore.modified);
                var dataset = [];
                for (var i = 0; i < weatherStore.modified.length; i++) {
                    dataset.push(weatherStore.modified[i].data);
                }
                for (var i = 0; i < dataset.length; i++) {
                    dataset[i].isModified = 1;
                }
                storeWeatherData(dataset[0].station, dataset);
                //weatherStore.save();
            }
            
            var station = Ext.getCmp('weatherstation'); // naam zit in .lastSelectionText
            var records = getClimateData(station.value);
            if (records) {
                weatherGrid.setTitle(OpenLayers.i18n('Weather characteristics - ${name}', {name: station.lastSelectionText}));
            }
            return {
                records: records
            };
        }
    },
    writer: new Ext.data.LocalStorageWriter({
        //encode: true,
        //idProperty: 'id',
        //root: 'results',
        /*writeAllFields: false,
        updateRecord: function(rec) {
            console.log('updateRecord', rec); // data in rec.data, id in rec.id, rec.dirty?
            storeWeatherData(rec.data.station, [rec.data]);
            return this.toHash(rec);
        }*/
    })
});
weatherStore.proxy = {request: Ext.emptyFn}; // hack om save() goed te laten gaan

var windStore = new Ext.data.Store({
    id: 'windStore',
    autoSave: false,
    recordType: WindRecord,
    sortInfo: { field: 'date', direction: 'ASC' },
    reader: {
        idProperty: 'id',
        root: 'results',
        readRecords: function() {
            if (windStore.modified.length > 0) {
                // eerst opslaan store indien er gewijzigde records zijn
                console.log('modified', windStore.modified);
                var dataset = [];
                for (var i = 0; i < windStore.modified.length; i++) {
                    dataset.push(windStore.modified[i].data);
                }
                for (var i = 0; i < dataset.length; i++) {
                    dataset[i].isModified = 1;
                }
                storeWindData(dataset[0].station, dataset);
            }
            
            var station = Ext.getCmp('weatherstation');
            var records = getWindData(station.value);
            return {
                records: records
            };
        }
    },
    writer: new Ext.data.LocalStorageWriter({//new Ext.data.JsonWriter({
        //encode: true,
        //writeAllFields: false
    })
});
windStore.proxy = {request: Ext.emptyFn}; // hack om save() goed te laten gaan

var weatherGrid = new Ext.grid.EditorGridPanel({
    id: 'weathergrid',
    title: OpenLayers.i18n('Weather characteristics'),
    header: false,
    store: weatherStore,
    clicksToEdit: 1,
    viewConfig: {
        forceFit: true
    },
    cm: weatherColumnModel
});

var windGrid = new Ext.grid.EditorGridPanel({
    id: 'windgrid',
    title: OpenLayers.i18n('Wind characteristics'),
    header: false,
    loadMask: true,
    store: windStore,
    clicksToEdit: 1,
    viewConfig: {
        forceFit: true
    },
    cm: windColumnModel
});

var weathersettingsWindow = new Ext.Window({
    id: 'weathersettingsWindow',
    title: OpenLayers.i18n("Weather settings"),
    width: 600,
    height: 400,
    closable: true,
    closeAction: 'hide',
    autoScroll: true,
    hideable: true,
    resizable: true,
    draggable: true,
    modal: true,
    //width: '40%',
    //height: '600',
    plain: true,
    //layout: 'vbox', // fit grid in window
    //modal: false,
    defaults: {
        //height: '50%'
    },
    items: [
        new Ext.form.ComboBox({
            id: 'weatherstation2',
            fieldLabel: OpenLayers.i18n('Weather station'),
            name: 'station',
            typeAhead: true,
            triggerAction: 'all',
            lazyRender: true,
            anchor: '100%',
            //align: 'right',
            region: 'north',
            mode: 'local',
            value: Gmi.Settings.weatherDefaults.station, // default: Deelen
            forceSelection: true, editable: false,
            store: new Ext.data.ArrayStore({
                id: 0,
                fields: [
                    'id',
                    'naam'
                ],
                data: Gmi.Data.Stations
            }),
            valueField: 'id',
            displayField: 'naam',
            listeners: {
                'select': function(combobox, event) {
                    Ext.getCmp('weatherstation').setValue(event.data.id);
                    weatherStore.loadData();
                    windStore.loadData();
                    console.log('select weather station', arguments);
                    
                    // update user defaults
                    Gmi.updateUserDefaults({station: event.data.id});
                }
            }
        }),
        new Ext.TabPanel({
            renderTo: Ext.getBody(),
            activeTab: 0,
            region: 'center',
            //height: 400,
            //align: 'stretch',
            defaults: {
                height: 300
            },
            items: [{
                title: OpenLayers.i18n('Weather'),
                layout: 'fit', // fit grid in window
                items: [weatherGrid]
            }, {
                title: OpenLayers.i18n('Wind'),
                layout: 'fit', // fit grid in window
                items: [windGrid]
            }]
        })
        //weatherGrid, 
        //windGrid
    ],
    buttons:[{
        text: OpenLayers.i18n('Close'), 
        handler: function() {
            weathersettingsWindow.hide();
        }
    }],
    listeners: {
        'hide': function(self, event) {
            if (weatherStore.modified.length > 0) {
                weatherStore.save();
            }
            if (windStore.modified.length > 0) {
                windStore.save();
            }
        }
    }
});
weathersettingsWindow.hide();

Gmi.getSortedStoreData = function(store) {
    var data = store.getRange().sort(function(a,b){
        return a.data['date'].valueOf() - b.data['date'].valueOf();
    });
    return data;
};

Gmi.checkDateInStoreData = function(store, dates) {
    var data = Gmi.getSortedStoreData(store);
    if (data.length > 0) {
    	
        if (!dates) {
            dates = getModelDateTime();
        }
        if (dates instanceof Date) {
            dates = [dates];
        }
        //console.assert(dates instanceof Array, '');
        for (var i = 0; i < dates.length; i++) {
            if (dates[i].valueOf() < data[0].data.date.valueOf()
            || dates[i].valueOf() > data[data.length-1].data.date.valueOf()) {
                return false;
            }
        }
    } else {
        // niets te controleren
    }
    return true;
};

Gmi.checkModelDatesInStores = function() {
    var model_date = Ext.getCmp('model_date').getValue();
    if (!Gmi.checkDateInStoreData(weatherStore, [model_date, new Date(model_date).increment(-Gmi.Settings.weatherDaysBefore)])) {
        // forceer opnieuw opvragen
        weatherStore.clearData();
        console.log('model_date valt buiten data range voor weatherStore');
    }
    var model_datetime = getModelDateTime();
    if (!Gmi.checkDateInStoreData(windStore, [model_datetime, new Date(model_datetime).increment(Gmi.Settings.windHours/24)])) {
        // forceer opnieuw opvragen
        windStore.clearData();
        console.log('model_date valt buiten data range voor windStore');
    }
};

function showClimateData() {
    // todo: controleer dat de weergegevens voor de model tijd geldig zijn
    Gmi.checkModelDatesInStores();

    weathersettingsWindow.show();
    
    if (weatherStore.getRange().length === 0) {
        weatherStore.loadData();
    }
    if (windStore.getRange().length === 0) {
        windStore.loadData();
    }
    
    weatherGrid.startEditing(0, 0);
    windGrid.startEditing(0, 0);
};

// overig

            function not_implemented() {
                Ext.Msg.show({
                    title: OpenLayers.i18n('Information'),
                    msg: OpenLayers.i18n("Not implemented yet"),
                    width: 400,
                    height: 400,
                    buttons: Ext.MessageBox.OK
                });
            }
            ;

/* vertaling: html, javascript, extjs, openlayers (teksten in OpenLayers.Lang), geoext (teksten in GeoExt.Lang.dict)
*/

var mapPanel, tree;
var status;
/*
function online() {
//status.setAttribute("class", "online");
status.innerHTML = "Online";
}

function offline() {
//status.setAttribute("class", "offline");
status.innerHTML = "Offline";
}
*/

// define Ext.onReady(fn, scope, options)
Ext.onReady(function() {
    var win;
    
    // dom is geladen en kan dus vertaald worden
    translateDom();
    
    // maak tooltips mogelijk
    Ext.QuickTips.init();
    
/*    status = document.getElementById('online-or-offline');

    if (navigator.onLine) {
        online();
    } else {
        offline();
    }

    window.addEventListener('online', online, false);
    window.addEventListener('offline', offline, false);
*/
    Gmi.defineTerrainWfsGrid = function() {
        var map = mapPanel.map;
        var layers = map.getLayersByName('wfs_vector_landscapes');
        if (layers.length > 0) {
            var wfsLayer = layers[0];
        } else {
            // wfs kaartlaag toevoegen
            var wfsLayer = new OpenLayers.Layer.Vector("wfs_vector_landscapes", {
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
        var store = new GeoExt.data.FeatureStore({
            layer: wfsLayer,
            /*fields: [
                {name: 'landscape_name', type: 'string'},
                {name: 'started', type: 'date'}
            ],*/
            //recordType: TerrainFeatureRecord,
            reader: new GeoExt.data.FeatureReader({}, TerrainFeatureRecord),
            proxy: new GeoExt.data.ProtocolProxy({
                protocol: new OpenLayers.Protocol.WFS({
                    url: "/geoserver/ows",
                    version: "1.1.0",
                    featureType: 'landscapes',
                    featureNS: 'model_wildfire',
                    srsName: 'EPSG:900913'//,
                    //outputFormat: 'application/json', // richting geoserver
                    //format: new OpenLayers.Format.GeoJSON() // ??
                })
            }),
            autoLoad: true
        });
        console.log('Store', store);
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
                dataIndex: "landscape_name"
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
            console.log('rowdeselect', row.data.feature);
            
            Gmi.Session.fuelid = null;
            Gmi.Session.datetime = null;
            showTerrein(mapPanel.map, null);
            setBox(mapPanel.map, null);
        });
        gridPanel.getSelectionModel().on('rowselect', function (obj, rowIndex, row){
            console.log('rowselect', row.data.feature);
            var geom = row.data.feature.geometry;
            var center = geom.getCentroid();
            var bounds = geom.getBounds();

            // zetten van box
            setBox(mapPanel.map, bounds);

            var datetime = new Date(row.data.feature.attributes['started']);
            Gmi.Session.datetime = datetime;

            // pan to extent
            //mapPanel.map.panTo(new OpenLayers.LonLat(center.x, center.y));
            // zoom naar extent
            var zoom = mapPanel.map.getZoomForExtent(bounds);
            if (zoom > Gmi.Settings.maxZoomOnMoveToTerrain) {
                zoom = Gmi.Settings.maxZoomOnMoveToTerrain;
            }
            //mapPanel.map.zoomToExtent(bounds);
            mapPanel.map.moveTo(new OpenLayers.LonLat(center.x, center.y), zoom);

            // zetten van fuelmodel_name
            Ext.getCmp('fuelmodel_name').setValue(row.data.feature.attributes['landscape_name']);
            // zetten van fuelid
            Gmi.Session.fuelid = row.data.feature.attributes['landscape_id'];

            // zetten van model_date en model_time
            setModelDateTime(datetime);

            // terrein laag (landscape_id) zetten? makkelijker bij testen
            showTerrein(mapPanel.map, row.data.feature.attributes['terrein_id']);

            // tijd van neerslagradar
            var map = row.data.feature.layer.map;
            var layers = map.getLayersByName(OpenLayers.i18n('KNMI Neerslagradar'));
            if (layers.length > 0) {
                var time = new Date(datetime.getTime() - datetime.getTime() % (5*60*1000)); // round to 5 minutes
                console.log('tijd afgerond voor neerslagradar', time);
                var layer = layers[0];
                layer.mergeNewParams({time: time.toISOString()});
            }
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
    
    Gmi.invalidateTerrainWfsGrid = function() {
        var tfs = Ext.getCmp('subset-fieldset');
        if (tfs.items.length > 0) {
            tfs.items.clear();
        }
        if (! tfs.collapsed) {
            // ophalen, want fieldset al open
            Gmi.defineTerrainWfsGrid();
        }
    };
            
    // create a vector layer for drawing
    var wildfire_layer = new OpenLayers.Layer.Vector('Wildfire lines', {
        displayInLayerSwitcher: Gmi.Settings.debug, // tonen bij debug
        styleMap: new OpenLayers.StyleMap({
            temporary: OpenLayers.Util.applyDefaults({
                    pointRadius: 5,
                    strokeWidth: 3,
                    strokeOpacity: 1,
                    //strokeDashstyle: "dash",
                    strokeColor: "#ff0000"
                }, OpenLayers.Feature.Vector.style.temporary),
            'default': OpenLayers.Util.applyDefaults({
                    pointRadius: 5,
                    strokeWidth: 3,
                    strokeColor: '#ff0000'
                }, OpenLayers.Feature.Vector.style['default']),
            select: OpenLayers.Util.applyDefaults({
                    pointRadius: 5,
                    strokeWidth: 3
                }, OpenLayers.Feature.Vector.style.select)
        }),
        eventListeners: {
            beforefeatureadded: function(event) {
                // remove other features
                event.object.removeAllFeatures();
                return true;
            },
            featureadded: function(event) {
                // event = type, element, feature, object (layer)
                console.log('featureadded', event.feature);
            },
            scope: wildfire_layer
        }
    });
    
    var measureControl = new OpenLayers.Control.Measure( OpenLayers.Handler.Path, {
        immediate: true,
        geodesic: true,
	persist: true,
        displayClass: 'olControlMeasure',
        title: OpenLayers.i18n('Measure distances in map'),
        handlerOptions: {
            layerOptions: {
                styleMap: new OpenLayers.StyleMap({
                    "default": new OpenLayers.Style(null, {
                        rules: [new OpenLayers.Rule({
                            symbolizer: {
                                "Point": {
                                    pointRadius: 4,
                                    graphicName: "square",
                                    fillColor: "white",
                                    fillOpacity: 1,
                                    strokeWidth: 1,
                                    strokeOpacity: 1,
                                    strokeColor: "#333333"
                                },
                                "Line": {
                                    strokeWidth: 3,
                                    strokeOpacity: 1,
                                    strokeColor: "#666666",
                                    strokeDashstyle: "dash"
                                },
                                "Polygon": {
                                    strokeWidth: 2,
                                    strokeOpacity: 1,
                                    strokeColor: "#666666",
                                    fillColor: "white",
                                    fillOpacity: 0.3
                                }
                            }
                        })]
                    })
                })
            }
        }
    });

    measureControl.getCustomLength = function(evt, onlySum) {
    
        var idx = evt.geometry.components.length;

        if (idx < 2)
            return '';

        //$('#map-size').html(ui.size.width + 'x' + ui.size.height)
        //.css({ left: Math.floor(ui.size.width/2) + 'px', top: Math.floor(ui.size.height/2) + 'px' }); 

        var str = '';
        if (idx >= 2) { // || onlySum) {
            str = OpenLayers.i18n('Distance: ${distance} ${units}', {
                distance: evt.units === 'km' ? evt.measure.toFixed(3) : evt.measure.toFixed(1), 
                units: evt.units
            });
            //str += 'Total: ' + (evt.units === 'km' ? evt.measure.toFixed(3) : evt.measure.toFixed(1)) + ' ' + evt.units;// + '&nbsp;&nbsp;&nbsp;';
        }

        if (!onlySum && idx > 2) {
            // bepaal ook lengte van laatste segment
            var geom = new OpenLayers.Geometry.LineString([
                evt.geometry.components[idx - 2],
                evt.geometry.components[idx - 1]
            ]);
            var lastLengthArr = this.getBestLength(geom);

            /*if (str.length === 0) {
                str = OpenLayers.i18n('Distance: ${distance} ${units}', {
                    distance: evt.units === 'km' ? evt.measure.toFixed(3) : evt.measure.toFixed(1), 
                    units: evt.units
                });
            } else*/ {
                str += '<br/>' + OpenLayers.i18n('Last segment: ${distance} ${units}', {
                    distance: (lastLengthArr[1] === 'km' ?  lastLengthArr[0].toFixed(3) : lastLengthArr[0].toFixed(1)), 
                    units: lastLengthArr[1]
                });
            }
        }

        return str;
    };

    //map.addControl(measureControl); 

    // Update content in .foo div   
    measureControl.events.on({
        'deactivate': function(evt) {
            console.log('deactivate', evt);
            measureTip.hide();
        },
        'measure': function(evt) {
            //$('.foo').html();
            console.log('measure', evt);
            var distanceMsg = measureControl.getCustomLength(evt, true);
            measureTip.show(distanceMsg);
            console.log('afstand', distanceMsg);
        },
        'measurepartial': function(evt) {
            //$('.foo').html(measureControl.getCustomLength(evt, false));
            console.log('measurepartial', evt);
            var distanceMsg = measureControl.getCustomLength(evt, false);
            measureTip.show(distanceMsg);
            console.log('afstand', distanceMsg);
        }
    });

    // OpenLayers' EditingToolbar internally creates a Navigation control, we
    // want a TouchNavigation control here so we create our own editing toolbar
    var toolbar = new OpenLayers.Control.Panel({
        displayClass: 'olControlEditingToolbar',
        activateControl: function(c) {
            console.log('activate control', c);
            if (c.CLASS_NAME === 'OpenLayers.Control.ModifyFeature') {
                if (c.layer.features.length > 0) {
                    c.selectFeature(c.layer.features[0]);
                }
            }
            return OpenLayers.Control.Panel.prototype.activateControl.apply(this, [c]);
        }
    });
    toolbar.addControls([
        // this control is just there to be able to deactivate the drawing
        // tools
        new OpenLayers.Control({
            displayClass: 'olControlNavigation',
            title: OpenLayers.i18n('Navigate in map')
        }),
        measureControl,
        new OpenLayers.Control.ModifyFeature(wildfire_layer, {
            vertexRenderIntent: 'temporary',
            displayClass: 'olControlModifyFeature',
            title: OpenLayers.i18n('Modify existing fire line')
        }),
        /*new OpenLayers.Control.DrawFeature(wildfire_layer, OpenLayers.Handler.Point, {
            displayClass: 'olControlDrawFeaturePoint'
        }),*/
        new OpenLayers.Control.DrawFeature(wildfire_layer, OpenLayers.Handler.Path, {
            displayClass: 'olControlDrawFeaturePath',
            title: OpenLayers.i18n('Draw new fire line')
        })/*,
        new OpenLayers.Control.DrawFeature(wildfire_layer, OpenLayers.Handler.Polygon, {
            displayClass: 'olControlDrawFeaturePolygon'
        })*/
    ]);

    // van geoext example tree.html
    var nav, hist, panel, map_controls;
    map_controls = [                
        new OpenLayers.Control.Navigation({
            dragPanOptions: {
                enableKinetic: true
            }
        }),
        new OpenLayers.Control.Zoom({title: OpenLayers.i18n('Change zoom')}),
        new OpenLayers.Control.ScaleLine({bottomOutUnits: '', bottomInUnits: '', title: OpenLayers.i18n('Scale line'), geodesic: true}),
        //new OpenLayers.Control.Permalink(), // todo: uitzoeken werking geoext met permalink
        toolbar
    ];
    map_controls.push(nav = new OpenLayers.Control.NavigationHistory({
        //displayClass: 'olControlCustomToolbar'
        previousOptions: {
            title: OpenLayers.i18n('Restore previous extent')
        },
        nextOptions: {
            title: OpenLayers.i18n('Restore next extent')
        }
    }));
    if (false) {
        map_controls.push(
            hist = new Gmi.Control.SessionHistory({
            //displayClass: 'olControlCustomToolbar'
            previousOptions: {
                title: OpenLayers.i18n('Restore previous session')
            },
            nextOptions: {
                title: OpenLayers.i18n('Restore next session')
            }
        }));
    }
    var mapOptions = {
    	allOverlays: false, 
        displayProjection: 'EPSG:4326',
        projection: new OpenLayers.Projection('EPSG:900913'),
        units: "meters",
        controls: map_controls,
        // volgende toegevoegd ivm openlayers/geowebcache probleem
        resolutions: [156543.03390625, 78271.516953125, 39135.7584765625, 19567.87923828125, 9783.939619140625, 4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.29858214169740677, 0.14929107084870338, 0.07464553542435169, 0.037322767712175846, 0.018661383856087923, 0.009330691928043961, 0.004665345964021981, 0.0023326729820109904, 0.0011663364910054952, 5.831682455027476E-4, 2.915841227513738E-4, 1.457920613756869E-4],
        maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
        theme: null
    };
    mapPanel = new GeoExt.MapPanel({
        border: true,
        region: "center",
        // we do not want all overlays, to try the OverlayLayerContainer
        map: new OpenLayers.Map(mapOptions),
        center: new OpenLayers.LonLat(5.946197509765718, 52.20750576821061).transform('EPSG:4326', 'EPSG:900913'), //[146.1569825, -41.6109735],
        zoom: 10,
        layers: [
            /*new OpenLayers.Layer.WMS("Global Imagery",
                "http://maps.opengeo.org/geowebcache/service/wms", {
                    layers: "bluemarble"
                }, {
                    isBaseLayer: true,
                    buffer: 0,
                    visibility: true
                }
            ),*/
            new OpenLayers.Layer(OpenLayers.i18n('Geen achtergrondlaag'), {isBaseLayer: true}),
            new OpenLayers.Layer.OSM(),
            /*new OpenLayers.Layer.WMS('Water', '/geoserver/wms?', {
                    layers: 'nl_data:waterdeel_vlak',
                    format: 'image/png',
                    transparent: true
                }, {
                    isBaseLayer: false,
                    visibility: false,
                    //maxExtent: OpenLayers.Bounds.fromString('361124.418941,6573545.115699,806881.242096,7095449.313188'),
                    transitionEffect: 'resize'
                }),*/
            new OpenLayers.Layer.WMS(OpenLayers.i18n('Topography'), '/geoserver/wms?', {
                    layers: 'nl_data:terrein',
                    format: 'image/png',
                    transparent: true,
                    tiled:true
                }, {
                    isBaseLayer: true,
                    visibility: false,
                    //maxExtent geeft problemen bij het gebruiken van de geoWebCache van geoserver
                    //maxExtent: OpenLayers.Bounds.fromString('361124.418941,6573545.115699,806881.242096,7095449.313188'),
                    transitionEffect: 'resize'
                }),
            new OpenLayers.Layer.WMS(OpenLayers.i18n('KNMI Neerslagradar'), 'http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?', {
                    layers: 'RADNL_OPER_R___25PCPRR_L3_COLOR',
                    transparent: true,
                    format: 'image/png'
                }, {
                    visibility: false,
                    opacity: 0.6,
                    singleTile: true,
                    transitionEffect: 'resize',
                    legend: {
                        //url: "http://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?SERVICE=WMS&&version=1.1.1&service=WMS&request=GetLegendGraphic&layer=RADNL_OPER_R___25PCPRR_L3_COLOR&format=image/png&STYLE=default&WIDTH=100"
                        url: 'img/NeerslagradarLegend.png'
                    }
                }),
            wildfire_layer,
            new OpenLayers.Layer.Boxes('_boxes_', {
                displayInLayerSwitcher: Gmi.Settings.debug // tonen bij debug
            })
            /*,
            new OpenLayers.Layer.WMS("Tasmania Roads",
                "http://demo.opengeo.org/geoserver/wms", {
                    layers: "topp:tasmania_roads",
                    transparent: true,
                    format: "image/gif"
                }, {
                    isBaseLayer: false,
                    buffer: 0
                }
            )*/
        ]
    });
    var panel = new OpenLayers.Control.Panel({
        //div: document.getElementById("panel")
        displayClass: 'olControlCustomToolbar'
    });
    var ctb_controls = [];
    if (hist) {
        ctb_controls.push(hist.next);
        ctb_controls.push(hist.previous);
    }
    if (nav) {
        ctb_controls.push(nav.next);
        ctb_controls.push(nav.previous);
    }
    panel.addControls(ctb_controls);
    mapPanel.map.addControl(panel);
    
    // create our own layer node UI class, using the TreeNodeUIEventMixin
    var LayerNodeUI = Ext.extend(
        GeoExt.tree.LayerNodeUI, 
        new GeoExt.tree.TreeNodeUIEventMixin()
    );
    
    var treeConfig = [{
        nodeType: "gx_baselayercontainer",
        expanded: true
    }, {
        nodeType: "gx_overlaylayercontainer",
        expanded: true,
        // render the nodes inside this container with a radio button,
        // and assign them the group "foo".
        loader: {
            baseAttrs: {
                radioGroup: "foo",
                uiProvider: "layernodeui"
            }
        }
    }/*, {
        nodeType: "gx_layer",
        layer: "Tasmania (Group Layer)",
        isLeaf: false,
        // create subnodes for the layers in the LAYERS param. If we assign
        // a loader to a LayerNode and do not provide a loader class, a
        // LayerParamLoader will be assumed.
        loader: {
            param: "LAYERS"
        }
    }*/];
    
    var tree_btns = [];
    if (Gmi.Settings.debug) {
        /*
            contentEl: document.getElementById('show-btn'),
            text: OpenLayers.i18n("Ignite"),
            handler: function() {
                not_implemented();
                //treeConfigWin.show();
                //Ext.getCmp("treeconfig").setValue(treeConfig);
            }
        }, * {
            text: OpenLayers.i18n('Wfs Grid'),
            handler: Gmi.defineTerrainWfsGrid
        }*/
        tree_btns.push({
            text: OpenLayers.i18n('Show translations'),
            handler: Gmi.Data.showTranslations
        });
        tree_btns.push({
            text: OpenLayers.i18n('Clear weather data'),
            handler: function() {
                if (confirm(OpenLayers.i18n('All weather data will be cleared. Are you sure?'))) {
                    localStorage.clear();
                    weatherStore.clearData();
                    windStore.clearData();
                }
            }
        });
    }
    
    // create the tree with the configuration from above
    tree = new Ext.tree.TreePanel({
        border: true,
        region: "west",
        title: OpenLayers.i18n("Layers"),
        width: 240,
        split: true,
        collapsible: true,
        collapseMode: "mini",
        autoScroll: true,
        plugins: [
            /*new GeoExt.plugins.TreeNodeRadioButton({
                listeners: {
                    "radiochange": function(node) {
                        alert(OpenLayers.i18n("${layerName} is now the active layer.", {layerName: node.text}));
                    }
                }
            }),*/ /*{ // plus
                ptype: "gx_treenodecomponent"
            } /* */
        ],
        loader: new Ext.tree.TreeLoader({
            // applyLoader has to be set to false to not interfere with loaders
            // of nodes further down the tree hierarchy
            applyLoader: false,
            uiProviders: {
                "layernodeui": LayerNodeUI
            }
        }),
        root: {
            nodeType: "async",
            /* of niet async van begin *
            nodeType: "gx_layercontainer",
            /*loader: {
                baseAttrs: {
                    uiProvider: "layernodeui"//custom_ui"
                },
                createNode: function(attr) {
                    // add a WMS legend to each node created
                    attr.component = {
                        xtype: "gx_wmslegend",
                        layerRecord: mapPanel.layers.getByLayer(attr.layer),
                        showTitle: false,
                        // custom class for css positioning
                        // see tree-legend.html
                        cls: "legend"
                    }
                    return GeoExt.tree.LayerLoader.prototype.createNode.call(this, attr);
                },
                load: function() { // blijkbaar nodig indien niet async
                    console.log('load', arguments);
                }
            }, /* tot einde hier */
            // the children property of an Ext.tree.AsyncTreeNode is used to
            // provide an initial set of layer nodes. We use the treeConfig
            // from above, that we created with OpenLayers.Format.JSON.write.
            //children: Ext.decode(treeConfig)
            // Don't use the line above in your application. Instead, use
            children: treeConfig
        },
        listeners: {
            'click': function(node, event) {
                if (jQuery(event.target).hasClass('gx-tree-layer-icon') || jQuery(event.target).hasClass('gx-tree-baselayer-icon')) {
                    // toggle legendgraphic
                    console.log('toggle legendgraphic', node);
                    var legendGraphicUrl = null;
                    if (jQuery('.g-legendgraphic', event.target.parentNode.parentNode).length >= 1) {
                        jQuery('.g-legendgraphic', event.target.parentNode.parentNode).remove();
                    } else if (node.layer.legend && node.layer.legend.url) {
                        legendGraphicUrl = node.layer.legend.url;
                    } else if (node.layer.CLASS_NAME === 'OpenLayers.Layer.WMS') {
                        legendGraphicUrl = node.layer.url + 'SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=' + node.layer.params.LAYERS;
                    }
                    if (legendGraphicUrl) {
                        jQuery(event.target.parentNode.parentNode).append('<div class="g-legendgraphic"><img src="' + legendGraphicUrl + '"></img></div>');
                    }
                }
                //console.log('click', event.target);
            },
            "radiochange": function(node){
                alert(OpenLayers.i18n("${layerName} is now the active layer.", {layerName: node.layer.name}));
            }
        },
        rootVisible: false,
        lines: false,
        bbar: tree_btns,
        bbarCfg: {
            //cls: 'x-panel-bbar',  // Default class not applied if Custom element specified
            //html: 'Message'
            //xtype: 'container',
            layout: 'fit', //anchor',
            defaults: {anchor: '100%'}//{anchor: '0'}
            //,defaultType: 'toolbar'
        }
    });
    
    var modelPanel = new Ext.Panel({
            title: OpenLayers.i18n("Simulation model"),
            contentEl: document.getElementById('model'),
            region: "east",
            bodyStyle: {"padding": "0px"},
            collapsible: true,
            collapseMode: "mini",
            autoScroll: true,
            split: true,
            width: 250,
            layout: 'auto',
            items: [
    new Ext.form.FormPanel({
	title: OpenLayers.i18n("Step 1 - Location"),
	//html: "Create conversion parameters and select area in the map by dragging a box around it. This will be the models boundary.",
	id: "farsitepanel1",
        collapsible: true,
	labelWidth: 40,
	labelAlign: 'left',
        monitorValid: true, // 
	layout: {
            type:  "form",
            align: "center"
	},
	defaults: {
            style: 'margin: 5px'
	},
	items: [
	/*	{
			xtype:'fieldset',
			id: 'fieldset_conversie',
			title: 'Conversie',
			defaults: {
				width: 150,
			},
			items: [
				actions["landuse2fuel"]
			]
		},{
			xtype: 'fieldset',
			id: 'fieldset_nieuwbestaand',
			title: 'Nieuw of bestaand',
			defaults: {
				width: 150,
			},
			items: [
				actions["newfuelmodel"],
				actions["existingfuelmodel"]
			]
		},*/
                {
                    xtype: 'fieldset',
                    title: OpenLayers.i18n('Select area'),
                    defaults: {
                        width: 'inherited'
                    },
                    items: [
                        {
                            xtype: "panel", //need this to put plugin-terrein in 
                            defaults: {width: 150, style: 'margin: 0px;'},
                            id: "terreinpanel1", 
                            border: false
                        }, {
                            xtype: 'numberfield',
                            id: 'terrein_id',
                            name: 'terrein_id',
                            fieldLabel: OpenLayers.i18n('Terrein ID'),
                            width: 40,
                            disabled: true,
                            hidden: true,
                            value: '0'
                        },
                        new Ext.Button({
                            text: OpenLayers.i18n("Select region"),
                            //xtype: 'button',
                            id: 'btn_select_region',
                            enableToggle: true,
                            tooltip: OpenLayers.i18n("Select region by dragging a rectangle in the map"),
                            handler: function(b, e) {
                                console.log('select region handler', b.pressed);
                                var map = mapPanel.map;
                                if (b.pressed) {
                                    var control = new OpenLayers.Control();
                                    b.control = control;
                                    OpenLayers.Util.extend(control, {
                                        draw: function () {
                                            // this Handler.Box will intercept the shift-mousedown
                                            // before Control.MouseDefault gets to see it
                                            var this_box = new OpenLayers.Handler.Box( control, {
                                                    "done": this.notice
                                                    //{"move": function(){ console.log('move')}}, // voor .Drag
                                                }, {
                                                    //keyMaskX: OpenLayers.Handler.MOD_SHIFT,
                                                    moveBox: function(xy) {
                                                        OpenLayers.Handler.Box.prototype.moveBox.apply(this_box, [xy]);
                                                        
                                                        var start = this_box.dragHandler.start;
                                                        var top = Math.min(start.y, xy.y);
                                                        var bottom = Math.max(start.y, xy.y);
                                                        var left = Math.min(start.x, xy.x);
                                                        var right = Math.max(start.x, xy.x);
                                                        bounds = new OpenLayers.Bounds(left, bottom, right, top);
                                                        var ll = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.left, bounds.bottom)); 
                                                        // upper-right
                                                        var ur = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.right, bounds.top)); 

                                                        var bounds = new OpenLayers.Bounds(
                                                            ll.lon.toFixed(0), // left
                                                            ll.lat.toFixed(0), // bottom
                                                            ur.lon.toFixed(0), // right
                                                            ur.lat.toFixed(0) // top
                                                        );
                                                        var geom = bounds.toGeometry();
                                                        var area = geom.getArea(); // or getGeodesicArea('EPSG:900913')
                                                        console.log('moveBox', bounds, area, area > Gmi.Settings.maxArea ? 'TOO LARGE' : '');
                                                        measureTip.show(area > Gmi.Settings.maxArea ? OpenLayers.i18n('Too large') : OpenLayers.i18n('Area ${area}', {area: areaWithUnit(area)}))
                                                    }/*,
                                                    endBox: function(end) {
                                                        OpenLayers.Handler.Box.prototype.endBox.apply(this_box, [end]);
                                                        console.log('endBox', this_box, end);
                                                    }*/
                                                }
                                            );
                                            this.box = this_box;
                                            this.box.activate();
                                        },

                                        notice: function (bounds) {
                                            // lower-left
                                            var ll = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.left, bounds.bottom)); 
                                            // upper-right
                                            var ur = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.right, bounds.top)); 

                                            var bounds = new OpenLayers.Bounds(
                                                ll.lon.toFixed(0), // left
                                                ll.lat.toFixed(0), // bottom
                                                ur.lon.toFixed(0), // right
                                                ur.lat.toFixed(0) // top
                                            );
                                            var geom = bounds.toGeometry();
                                            var area = geom.getArea(); // or getGeodesicArea('EPSG:900913')
                                            if (area > Gmi.Settings.maxArea) {
                                                // TODO: in km2 zou leesbaarder zijn
                                                alert(OpenLayers.i18n('Area ${area} is too large; the maximum is ${max}', {
                                                    max: areaWithUnit(Gmi.Settings.maxArea), 
                                                    area: areaWithUnit(area)
                                                }));
                                                //return;
                                            } else {
                                                console.log('area', area);

                                                setBox(map, bounds);
                                                
                                                // select region control deactiveren
                                                b.control.box.deactivate();
                                                map.removeControl(b.control);
                                                b.doToggle(); // en knop uitzetten
                                                
                                                // automatisch make subset
                                                Gmi.makeSubset();
                                            }
                                        }
                                    });
                                    mapPanel.map.addControl(control);
                                } else {
                                    // disable regio kiezen, maar laat gebied zichtbaar
                                    b.control.box.deactivate();
                                    map.removeControl(b.control);
                                }
                            },
                            cls: 'g-actie-knop'
                        }),
                        new Ext.Button({
                            text: OpenLayers.i18n("Select corine region"),
                            //xtype: 'button',
                            id: 'btn_select_corine_region',
                            enableToggle: true,
                            tooltip: OpenLayers.i18n("Select region by dragging a rectangle in the map"),
                            handler: function(b, e) {
                                console.log('select region handler', b.pressed);
                                var map = mapPanel.map;
                                if (b.pressed) {
                                    var control = new OpenLayers.Control();
                                    b.control = control;
                                    OpenLayers.Util.extend(control, {
                                        draw: function () {
                                            // this Handler.Box will intercept the shift-mousedown
                                            // before Control.MouseDefault gets to see it
                                            var this_box = new OpenLayers.Handler.Box( control, {
                                                    "done": this.notice
                                                    //{"move": function(){ console.log('move')}}, // voor .Drag
                                                }, {
                                                    //keyMaskX: OpenLayers.Handler.MOD_SHIFT,
                                                    moveBox: function(xy) {
                                                        OpenLayers.Handler.Box.prototype.moveBox.apply(this_box, [xy]);
                                                        
                                                        var start = this_box.dragHandler.start;
                                                        var top = Math.min(start.y, xy.y);
                                                        var bottom = Math.max(start.y, xy.y);
                                                        var left = Math.min(start.x, xy.x);
                                                        var right = Math.max(start.x, xy.x);
                                                        bounds = new OpenLayers.Bounds(left, bottom, right, top);
                                                        var ll = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.left, bounds.bottom)); 
                                                        // upper-right
                                                        var ur = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.right, bounds.top)); 

                                                        var bounds = new OpenLayers.Bounds(
                                                            ll.lon.toFixed(0), // left
                                                            ll.lat.toFixed(0), // bottom
                                                            ur.lon.toFixed(0), // right
                                                            ur.lat.toFixed(0) // top
                                                        );
                                                        var geom = bounds.toGeometry();
                                                        var area = geom.getArea(); // or getGeodesicArea('EPSG:900913')
                                                        console.log('moveBox', bounds, area, area > Gmi.Settings.maxArea ? 'TOO LARGE' : '');
                                                        measureTip.show(area > Gmi.Settings.maxArea ? OpenLayers.i18n('Too large') : OpenLayers.i18n('Area ${area}', {area: areaWithUnit(area)}))
                                                    }/*,
                                                    endBox: function(end) {
                                                        OpenLayers.Handler.Box.prototype.endBox.apply(this_box, [end]);
                                                        console.log('endBox', this_box, end);
                                                    }*/
                                                }
                                            );
                                            this.box = this_box;
                                            this.box.activate();
                                        },

                                        notice: function (bounds) {
                                            // lower-left
                                            var ll = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.left, bounds.bottom)); 
                                            // upper-right
                                            var ur = map.getLonLatFromPixel(new OpenLayers.Pixel(bounds.right, bounds.top)); 

                                            var bounds = new OpenLayers.Bounds(
                                                ll.lon.toFixed(0), // left
                                                ll.lat.toFixed(0), // bottom
                                                ur.lon.toFixed(0), // right
                                                ur.lat.toFixed(0) // top
                                            );
                                            var geom = bounds.toGeometry();
                                            var area = geom.getArea(); // or getGeodesicArea('EPSG:900913')
                                            if (area > Gmi.Settings.maxArea) {
                                                // TODO: in km2 zou leesbaarder zijn
                                                alert(OpenLayers.i18n('Area ${area} is too large; the maximum is ${max}', {
                                                    max: areaWithUnit(Gmi.Settings.maxArea), 
                                                    area: areaWithUnit(area)
                                                }));
                                                //return;
                                            } else {
                                                console.log('area', area);

                                                setBox(map, bounds);
                                                
                                                // select region control deactiveren
                                                b.control.box.deactivate();
                                                map.removeControl(b.control);
                                                b.doToggle(); // en knop uitzetten
                                                
                                                // automatisch make subset
                                                Gmi.makeSubsetCorine();
                                            }
                                        }
                                    });
                                    mapPanel.map.addControl(control);
                                } else {
                                    // disable regio kiezen, maar laat gebied zichtbaar
                                    b.control.box.deactivate();
                                    map.removeControl(b.control);
                                }
                            },
                            cls: 'g-actie-knop'
                        }),/*
                        new Ext.Button({
                            text: OpenLayers.i18n('Make subset'),
                            cls: 'g-actie-knop',
                            handler: Gmi.makeSubset
                        })*/
                    ]
                }, { /*
			xtype: 'fieldset',
			title: 'Bewerk terrein',
			defaults: {
				width: 150,
			},
			items: [
				{
					xtype: "panel", //need this to put edit-tool in 
					defaults: {width: 150, style: 'margin: 0px;'},
					id: "terreineditpanel1",
                            border: false
                        }
                        ]
                }, { */
                        xtype: 'fieldset',
                        title: OpenLayers.i18n('Terrain'),
                        defaults: {
                            width: 'inherited'
                        },
                        items: [
                            new Ext.Button({
                                text: OpenLayers.i18n('Edit'),
                                id: 'btn_edit_terrain',
                                formBind: true, // If form validation fails disable the button
                                //xtype: 'button',
                                enableToggle: true,
                                tooltip: OpenLayers.i18n('Edit the land use'),
                                handler: function(b, e) {
                                    var map = mapPanel.map;
                                    if (b.pressed) {
                                        // start editen
                                        if (!start_edit_subset(map)) {
                                            b.doToggle(); // niet gelukt, dus knop weer uitzetten
                                        }
                                    } else {
                                        // stop editen
                                        stop_edit_subset(map);
                                    }
                                },
                                cls: 'g-actie-knop'
                            }),
                            {
                                fieldLabel: OpenLayers.i18n('Name'),
                                xtype: 'textfield',
                                id: 'fuelmodel_name',
                                name: 'fuelmodel_name',
                                tooltip: OpenLayers.i18n('Name of terrain'),
                                anchor: '100%',
                                width: 120,
                                align: 'right',
                                //allowBlank: false, // must be filled in!
                                value: OpenLayers.i18n('untitled')
                                //style: 'padding: 0px;'
                            },
                            new Ext.Button({
                                text: OpenLayers.i18n("Save"),
                                formBind: true, // If form validation fails disable the button
                                //xtype: 'button',
                                tooltip: OpenLayers.i18n("Create landscape file on the base of currently selected region"),
                                handler: function() {
                                    // stop editing subset
                                    var map = mapPanel.map;
                                    stop_edit_subset(map);
                                    
                                    var terreinid = Gmi.Session.terreinid; //Ext.getCmp("terrein_id").getValue();
                                    var landscapename = Ext.getCmp("fuelmodel_name").getValue();
                                    if (! terreinid) {
                                        alert(OpenLayers.i18n('Landscape file cannot be prepared yet.'));
                                    } else {
                                        // maak landschap ('lcp') voor model aan
                                        startProgress(OpenLayers.i18n('Preparing fuel model'));
                                        Ext.Ajax.request({
                                            url: '/geoserver/ows?',
                                            params: {
                                                service: 'WPS',
                                                version: '1.1.0',
                                                request: 'execute',
                                                identifier: 'py:wildfire_makelcp',
                                                datainputs: combineParams({
                                                    userid: Gmi.Session.userid,
                                                    terreinid: terreinid,
                                                    landscapename: landscapename
                                                }, ';'),
                                                RawDataOutput: 'string',
                                                mimeType: 'application/json'
                                            },
                                            extraParams: {
                                                count: 0
                                            },
                                            on_finished: function(out_params) {
                                                // bewaar id van fuelmodel
                                                Gmi.Session.fuelid = out_params.runid;
                                                
                                                // lijst verversen
                                                Gmi.invalidateTerrainWfsGrid();
                                            },
                                            success: wpsSuccessCallback,
                                            failure: wpsFailureCallback
                                        });
                                    }
                                },
                                cls: 'g-actie-knop'
                            })
                        ]
                    }
                    ]
                }),
                new Ext.form.FormPanel({
                    title: OpenLayers.i18n('Step 2 - Inputs'),
                    collapsible: true,
                    defaults: {
                        style: 'margin: 5px'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            id: 'subset-fieldset',
                            title: OpenLayers.i18n('Saved terrains'),
                            defaults: {
                                width: 'inherited'
                            },
                            collapsible: true,
                            collapsed: true,
                            items: [
                                //gridPanel // wfs grid panel
                            ],
                            listeners: {
                                'beforeexpand': function(comp, event) {
                                    if (comp.items.length == 0) {
                                        var wfsGrid = Gmi.defineTerrainWfsGrid();
                                        comp.add( wfsGrid );
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'fieldset',
                            title: OpenLayers.i18n('Date & time'),
                            defaults: {
                                width: 'inherited'
                            },
                            items: [
                                {
                                    xtype: 'datefield',
                                    id: 'model_date',
                                    fieldLabel: OpenLayers.i18n('Date'),
                                    anchor: '100%',
                                    format: Gmi.Settings.dateFormat,
                                    forceSelection: true, editable: false
                                },
                                {
                                    xtype: 'timefield',
                                    id: 'model_time',
                                    fieldLabel: OpenLayers.i18n("Time"),
                                    anchor: '100%',
                                    forceSelection: true, editable: false,
                                    //minValue   : '09:00',
                                    //maxValue   : '18:00',
                                    increment: Gmi.Settings.tijd_afronding_minuten,
                                    format: 'H:i'
                                    //,value: '14:00'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: OpenLayers.i18n('Weather data'),
                            defaults: {
                                width: 'inherited'
                            },
                            items: [
                                new Ext.form.ComboBox({
                                    id: 'weatherstation',
                                    fieldLabel: OpenLayers.i18n('Weather station'),
                                    name: 'station',
                                    typeAhead: true,
                                    triggerAction: 'all',
                                    lazyRender: true,
                                    anchor: '100%',
                                    align: 'right',
                                    mode: 'local',
                                    value: Gmi.Settings.weatherDefaults.station, // default: Deelen
                                    forceSelection: true, editable: false,
                                    store: new Ext.data.ArrayStore({
                                        id: 0,
                                        fields: [
                                            'id',
                                            'naam'
                                        ],
                                        data: Gmi.Data.Stations
                                    }),
                                    valueField: 'id',
                                    displayField: 'naam',
                                    listeners: {
                                        'select': function(combobox, event) {
                                            // koppelen aan andere lijst
                                            var station_id = combobox.getValue();
                                            Ext.getCmp('weatherstation2').setValue(station_id);
                                            
                                            // refresh data
                                            weatherStore.clearData();
                                            windStore.clearData();
                                            
                                            // update user defaults
                                            Gmi.updateUserDefaults({station: station_id});
                                        }
                                    }
                                }),
                                new Ext.Button({
                                    text: OpenLayers.i18n('Set weather data'),
                                    handler: showClimateData,
                                    cls: 'g-actie-knop'
                                })
                            ]
                        }
                    ]
                }),
                new Ext.form.FormPanel({
                    title: OpenLayers.i18n('Step 3 - Run model'),
                    collapsible: true,
                    defaults: {
                        style: 'margin: 5px'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            title: OpenLayers.i18n('Fire location'),
                            defaults: {
                                width: 'inherited'
                            },
                            items: [
                                new Ext.Button({
                                    text: OpenLayers.i18n('Draw fire line'),
                                    handler: drawFireLine,
                                    cls: 'g-actie-knop'
                                })
                            ]
                        }, {
                            xtype: 'fieldset',
                            title: OpenLayers.i18n('Execution'),
                            defaults: {
                                width: 'inherited'
                            },
                            items: [{
                                    fieldLabel: OpenLayers.i18n('Name'),
                                    xtype: 'textfield',
                                    id: 'fire_name',
                                    name: 'fire_name',
                                    tooltip: OpenLayers.i18n('Name of fire'),
                                    anchor: '100%',
                                    width: 120,
                                    align: 'right',
                                    //allowBlank: false, // must be filled in!
                                    value: OpenLayers.i18n('untitled')
                                    //style: 'padding: 0px;'
                                },
                                new Ext.Button({
                                    text: OpenLayers.i18n('Start run'),
                                    handler: startModelRun,
                                    cls: 'g-actie-knop'
                                })
                            ]
                        }
                    ]
                }),
                new Ext.form.FormPanel({
                    title: OpenLayers.i18n('Step 4 - Results'),
                    collapsible: true,
                    defaults: {
                        style: 'margin: 5px'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            title: OpenLayers.i18n('Output'),
                            defaults: {
                                width: 'inherited'
                            },
                            items: [
                                new Ext.Button({
                                    text: OpenLayers.i18n('Download'),
                                    handler: function() {
                                        var layers = mapPanel.map.getLayersByName(OpenLayers.i18n('Brandverspreiding'));
                                        if (layers.length == 0) {
                                            Ext.MessageBox.show({
                                                msg: OpenLayers.i18n('Wild fire layer is missing'),
                                                width: 300,
                                                title: OpenLayers.i18n('Warning')
                                            });
                                        } else {
                                            var url = '/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=' +
                                                layers[0].params['LAYERS'] + '&maxFeatures=1000&outputFormat=SHAPE-ZIP';
                                        
                                            Ext.MessageBox.show({
                                                //msg: '<a target="_blank" href="' + url + '">' + OpenLayers.i18n('Click here to download the shapefile') + '</a>',
                                                msg: '<a href="#" onclick="javascript:Gmi.downloadOnClick(\'' + url + '\')">' + OpenLayers.i18n('Click here to download the shapefile') + '</a>',
                                                width: 300,
                                                title: OpenLayers.i18n('Export shape file')
                                            });
                                        }
                                    },
                                    cls: 'g-actie-knop'
                                })
                            ]
                        }
                    ]
                })]
            });
    var viewportItems = [mapPanel, tree, modelPanel];
    
    new Ext.Viewport({
        layout: "fit",
        hideBorders: true,
        items: {
            layout: "border",
            deferredRender: false,
            items: viewportItems
        }
    });
    
    // toevoegen van stappen aan rechterkant (simPanel)
 
    var button = Ext.get('show-btn');

    if (button) button.on('click', function() {
        // create the window on the first click and reuse on subsequent clicks
        if (!win) {
            win = new Ext.Window({
                applyTo: 'hello-win',
                title: OpenLayers.i18n('Simulation'), // of hier of in div met class x-window-header
                layout: 'fit',
                width: 500,
                height: 300,
                closeAction: 'hide', // NB anders slechts 1x bruikbaar
                plain: true,
                modal: true,
                items: new Ext.TabPanel({
                    //applyTo: 'hello-tabs',
                    renderTo: Ext.get('hello-win'),
                    //autoTabs: true,
                    activeTab: 0,
                    deferredRender: false,
                    border: false,
                    items: [{
                            xtype: 'form',
                            title: OpenLayers.i18n('Gebied'), // 1ste tab
                            defaults: {
                                width: 150
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: OpenLayers.i18n('Naam gebied')
                                },
                                {
                                    xtype: 'button',
                                    fieldLabel: OpenLayers.i18n('Selecteer gebied'),
                                    handler: not_implemented
                                },
                                {
                                    xtype: 'combo',
                                    fieldLabel: OpenLayers.i18n('Choose version'),
                                    store: ['3.0', '2.0', '1.0']
                                },
                                {
                                    xtype: 'button',
                                    fieldLabel: OpenLayers.i18n('Opslaan')
                                }
                            ]
                        }, {
                            xtype: 'form',
                            title: OpenLayers.i18n('Weersomstandigheden'), // 2de tab
                            defaults: {
                                width: 150
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: OpenLayers.i18n('Name')
                                },
                                {
                                    xtype: 'checkbox',
                                    fieldLabel: OpenLayers.i18n('Do you love Ext?')
                                },
                                {
                                    xtype: 'combo',
                                    fieldLabel: OpenLayers.i18n('Choose version'),
                                    store: ['3.0', '2.0', '1.0']
                                }
                            ]
                        }, {
                            xtype: 'form',
                            title: OpenLayers.i18n('Tijd'), // 3de tab
                            items: [
                                {
                                    xtype: 'datefield',
                                    fieldLabel: OpenLayers.i18n('Start time'),
                                    width: 'auto',
                                    format: Gmi.Settings.dateFormat
                                }
                                , {
                                    xtype: 'datefield',
                                    fieldLabel: OpenLayers.i18n('End time'),
                                    width: 'auto',
                                    format: Gmi.Settings.dateFormat
                                }
                            ]
                        }
                    ]
                }),
                buttons: [{
                        text: 'Help',
                        handler: not_implemented
                    }, {
                        text: 'Annuleren',
                        disabled: true
                    }, {
                        text: 'Start',
                        handler: not_implemented,
                        handlerX: function() {
                            win.hide();
                        }
                    }]
            });
        }
        win.show(this);
    });


    // tijd task
    var prev_minutes = -1;
    var task = {
        run: function() {
            if (Gmi.Session.datetime) {
                return;
            }
        
            var today = new Date();
            var h=today.getHours();
            var m=today.getMinutes();
            var m_floor = Math.floor(m/Gmi.Settings.tijd_afronding_minuten)*Gmi.Settings.tijd_afronding_minuten;
            if (m_floor !== prev_minutes) {
                // set date (todo: alleen indien veranderd)
                Ext.getCmp('model_date').setValue(today);
                // tijd in formulier aanpassen
                console.log(today.toLocaleTimeString());
                Ext.getCmp('model_time').setValue( zpad(h, 2) + ':' + zpad(m_floor, 2) );
                prev_minutes = m_floor;
            }
        },
        interval: 15000 // every 15 seconds
    };
    var runner = new Ext.util.TaskRunner();
    runner.start(task);
    
    // navigate control aanzetten; of ophalen via displayClass = olControlEditingToolbar
    toolbar.activateControl(toolbar.controls[0]);
    
    // begin achtergrondlaag
    var baseClass = null;
    if (window.Geodan) {
        // online -> osm
        baseClass = 'OpenLayers.Layer.OSM';
    } else {
        // offline -> topo
        baseClass = 'OpenLayers.Layer.WMS';
    }
    if (baseClass) {
        var baseLayers = mapPanel.map.getLayersBy('isBaseLayer', true);
        for (var i = 0; i < baseLayers.length; i++) {
            if (baseLayers[i].CLASS_NAME == baseClass) {
                mapPanel.map.setBaseLayer(baseLayers[i]);
                break;
            }
        }
    }
});

function zpad(i, width) {
    var s = Math.round(i) + '';
    while (s.length < width) {
        s = '0' + s;
    }
    return s;
};

function setModelDateTime(datetime) {
    Ext.getCmp('model_date').setValue(datetime);
    var h = datetime.getHours();
    var m = datetime.getMinutes();
    var time = zpad(h, 2) + zpad(m, 2); // ':' niet nodig?
    Ext.getCmp('model_time').setValue(time);
};

function getModelDateTime() {
    var model_date = Ext.getCmp('model_date').getValue();
    var model_time = Ext.getCmp('model_time').getValue();
    model_date.setHours(model_time.split(':')[0]);
    model_date.setMinutes(model_time.split(':')[1]);
    return model_date;
};

function setBox(map, bounds) {
    var layers = map.getLayersByName('_boxes_');
    if (layers.length > 0) {
        // layer leegmaken
        layers[0].clearMarkers();
        if (bounds) {
            // nieuwe toevoegen
            var box = new OpenLayers.Marker.Box(bounds);
            layers[0].addMarker(box);
            // in sessie zetten
        }
        Gmi.Session.box = bounds;
    }
};

function showTerrein(map, terrein_id, layer_name) {
    // bewaar runid als terreinid
    Gmi.Session.terreinid = terrein_id;
    var layers = map.getLayersByName('Terrein');
    if (! terrein_id) {
        // verwijdere oude terreinen
        for (var i = layers.length - 1; i >= 0; i--) {
            map.removeLayer(layers[i]);
        }
        return;
    }
    
    // voeg nieuwe terrein toe als WMS
    if (! layer_name) {
        layer_name = 'model_wildfire:terrein_' + terrein_id;
    }
    if (layers.length > 0) {
        layers[0].mergeNewParams({
            layers: layer_name
        });
    } else {
        var layer = new OpenLayers.Layer.WMS('Terrein', 
        '/geoserver/wms?', {
            layers: layer_name,
            transparent: true,
            format: 'image/png'
        }, {
            isBaseLayer: false,
            opacity: 0.6,
            legend: {
                //url: "/geoserver/wms?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" + layer_name
                url: 'img/TerrainLegend.png'
            }
        });
        map.addLayer(layer);
   }
};

function weatherStoreAsString() {
    //weatherStore.sort('date', 'asc'); // niet veranderen
    
    //var weatherData = weatherStore.getRange();
    // weergegevens sorteren op datum
    var weatherData = Gmi.getSortedStoreData(weatherStore);
                // weather: (month,day,precip,hour1,hour2,tlo,thi,hhi,hlo,elv), etc (6 dagen)
                //weatherstring: '(05,12,00,0500,1500,15,32,60,15,0000),(05,13,00,0500,1500,15,32,50,10,0000),(05,14,00,0500,1500,15,32,50,11,0000),(05,15,00,0500,1500,15,32,60,10,0000),(05,16,00,0500,1500,15,32,50,10,0000),(05,17,00,0500,1500,15,32,50,10,0000)', 

    var weatherString = '';
    //var model_start = getModelDateTime();
    var lastDate = null;
    var lastDataValues;
    var month, day, rn, am, pm, tlo, thi, hhi, hlo, elv;
    for (var i = 0; i < weatherData.length; i++) {
        weatherData[i].data.hour1 = 500;
        weatherData[i].data.hour2 = 1500; // eis: hour1 < hour2
        weatherData[i].data.precipitation = 0;
        
        lastDate = new Date(weatherData[i].data.date); // clone!
        
        month = zpad(lastDate.getMonth() + 1, 2);
        day = zpad(lastDate.getDate(), 2);
        rn = zpad(weatherData[i].data.precipitation, 2);
        am = zpad(weatherData[i].data.hour1, 4);
        pm = zpad(weatherData[i].data.hour2, 4);
        tlo = zpad(weatherData[i].data.tmin, 2); // todo: afronden
        thi = zpad(weatherData[i].data.tmax, 2);
        hhi = zpad(Math.min(99, weatherData[i].data.hmax), 2); // max 99 voor farsite
        hlo = zpad(Math.min(99, weatherData[i].data.hmin), 2); // max 99 voor farsite
        elv = '0000';
        lastDataValues = rn + ',' 
            + am + ',' + pm +',' + tlo +',' + thi +',' + hhi +',' + hlo +',' + elv;
        weatherString += '(' + month + ',' + day  + ',' + lastDataValues +')';
        if (i < weatherData.length - 1) { 
            weatherString += ',';
        }
    }
    if (lastDate) {
        // EIS: elke dag data; ook data nodig voor model tijd + 6
        var modelDate = getModelDateTime();
        while (modelDate.valueOf() > lastDate.valueOf()) {
            // voor elke dag gegevens toevoegen als laatste dataString
            lastDate.increment( +1 );

            month = zpad(lastDate.getMonth() + 1, 2);
            day = zpad(lastDate.getDate(), 2);
            weatherString += ',(' + month + ',' + day + ',' + lastDataValues + ')'; 
        }
    }
    console.log('weatherString', weatherString);
    return weatherString;
};

function windStoreAsString() {
                // wind: (month,day,hour,speed,dir,cl), etc (6 uren)
                //windstring: '(5,16,1508,00,180,10),(5,16,1608,00,180,10),(5,16,1708,00,180,10),(5,16,1808,00,180,10),(5,16,1908,00,180,10),(5,17,2008,00,180,10)', 
    //windStore.sort('date', 'asc');
    var windData = Gmi.getSortedStoreData(windStore);

    var windString = '';
    var month, day, speed, dir, cl, hhmm;
    var last_date = null;
    if (windData.length > 0) {
        last_date = new Date(windData[0].data.date);
        last_date.increment(+1);
    }
    var lastDataValues;
    for (var i = 0; i < windData.length; i++) {
        month = windData[i].data.date.getMonth() + 1;
        day = windData[i].data.date.getDate();
        var h_m = windData[i].data.time.split(':');
        hhmm = zpad(h_m[0], 2) + zpad(h_m[1], 2);
        //hour = windData[i].data.time;
        //hour = hour.replace(':', '');
        //hour = hour.substr(0, 4);
        speed = zpad(windData[i].data.speed * 3.6, 2); // van m/s naar km/h
        dir = zpad(windData[i].data.direction, 3);
        cl = zpad(Math.min(99, windData[i].data.cloudiness), 2);
        lastDataValues = speed + ',' + dir + ',' + cl;
        //windString += '(' + month + ',' + day + ',' + hhmm + ',' + lastDataValues +')';
        windString += '(' + windData[i].data.date.dateFormat('m,d,Hi') + ',' + lastDataValues + ')';
        if (i < windData.length - 1) {
            windString += ',';
        }
    }
    if (last_date) {
        windString += ',(' + last_date.dateFormat('m,d,Hi') + ',' + lastDataValues + ')';
    }
    console.log('windString', windString);
    return windString;
};

function drawFireLine() {
    // drawfeature knop activeren
    var map = mapPanel.map;

    var toolbar = map.getControlsBy('displayClass', 'olControlEditingToolbar');
    if (toolbar.length > 0) {
        //var controls = map.getControlsByClass(OpenLayers.Control.DrawFeature);
        var controls = toolbar[0].getControlsByClass('OpenLayers.Control.DrawFeature');
        if (controls.length > 0) {
            //controls[0].activate();
            toolbar[0].activateControl(controls[0]);
        }
    }
};

function startModelRun() {
    
    var map = mapPanel.map;
    if (! map) {
        alert(OpenLayers.i18n('Interne fout: map is undefined.')); // internal
        return;
    }
    
    // TODO: vuurfront uitlezen ipv middelpunt van box
    if (! Gmi.Session.box) {
        alert(OpenLayers.i18n('Region is undefined.')); // [Make subset]
        return;
    }
    
    if (! Gmi.Session.fuelid) {
        alert(OpenLayers.i18n('Fuel model is undefined.')); // [Save]
        return;
    }
    
    var t = map.getLayersByName('Wildfire lines');
    if (t.length === 0) {
        alert(OpenLayers.i18n('Interne fout: geen vectorlaag voor vuurlijnen'));
        return;
    }
    var wildfire_layer = t[0];
    if (wildfire_layer.features.length === 0) {
        alert(OpenLayers.i18n('Draw a fire line first'));
        return;
    }
    var geom = wildfire_layer.features[0].geometry.clone();
    for (var i = 0; i < geom.components.length; i++) {
        geom.components[i].transform('EPSG:900913', 'EPSG:28992');
    }
    var wkt = geom.toString(); // rd geometry
    console.log('fire line', wkt);
    //return;
/*    
    var rdbox = Gmi.Session.box.clone().transform('EPSG:900913', 'EPSG:28992');
    var center = rdbox.getCenterLonLat();
    //var p = new OpenLayers.Geometry.Point(center.lon, center.lat);
    var geom = new OpenLayers.Geometry.LineString([new OpenLayers.Geometry.Point(center.lon - 1, center.lat - 1), new OpenLayers.Geometry.Point(center.lon + 1, center.lat + 1)]);
    var wkt = geom.toString();
    //var wkt = 'LINESTRING(' + center.lon +' ' + center.lat + ', ' + center.lon +' ' + center.lat + ')';
*/
    Gmi.checkModelDatesInStores();
    
    // weather/wind data
    var station = Ext.getCmp('weatherstation').getValue();
    var weatherString = weatherStoreAsString();
    if (weatherString === '') {
        // weergegevens ophalen
        weatherStore.loadData();
        weatherString = weatherStoreAsString(); // opnieuw
    }
    
    var windString = windStoreAsString();
    if (windString === '') {
        // windgegevens ophalen
        windStore.loadData();
        windString = windStoreAsString(); // opnieuw
    }

    // tijd
    var hhmm = Ext.getCmp('model_time').value.replace(':', '');
    if (! hhmm) {
        alert(OpenLayers.i18n('Tijd onbekend'));
        return;
    }
    var model_datetime = getModelDateTime();
    var fire_name = Ext.getCmp('fire_name').getValue();
    
    var run_params = {
        service: 'WPS',
        version: '1.1.0',
        request: 'execute',
        identifier: 'py:wildfire_startRun',
        datainputs: combineParams({
            userid: Gmi.Session.userid,
            name: fire_name, // naam van brand
            fuelmodel: Gmi.Session.fuelid, // runid van fuelmodel (resultaat van makelcp)
            geom: wkt, // wkt LINESTRING(x y, ...) RD projectie
            // wind: (month,day,hour,speed,dir,cl), etc (6 uren)
            windstring: windString,
            // windstring=(5,16,1508,00,180,10),(5,16,1608,00,180,10),(5,16,1708,00,180,10),(5,16,1808,00,180,10),(5,16,1908,00,180,10),(5,16,2008,00,180,10);
            // weather: (month,day,precip,hour1,hour2,tlo,thi,hhi,hlo,elv), etc (6 dagen)
            weatherstring: weatherString,
            // weatherstring=(05,12,00,0500,1500,15,32,60,15,0000),(05,13,00,0500,1500,15,32,50,10,0000),(05,14,00,0500,1500,15,32,50,11,0000),(05,15,00,0500,1500,15,32,60,10,0000),(05,16,00,0500,1500,15,32,50,10,0000),(05,17,00,0500,1500,15,32,50,10,0000);
            // startmonth=05;startday=16;starthour=1508;
            startmonth: zpad(model_datetime.getMonth() + 1, 2), // 0-padded; month geeft 0..11
            startday: zpad(model_datetime.getDate(), 2), // 0-padded, laatste dag van weather/wind-string
            starthour: hhmm // hhmm
        }, ';'),
        RawDataOutput: 'string',
        mimeType: 'application/json'
    };
    console.log('run params', run_params);
    if (Gmi.Settings.debug) {
        if (! confirm(OpenLayers.i18n('Model parameters: \n\n${params}', {params: JSON.stringify(run_params, null, 2)}))) {
            return;
        }
    }
    
    // startRun process aanroepen
    // Let op: 
    startProgress(OpenLayers.i18n('Running fire model'));
    Ext.Ajax.request({
        url: '/geoserver/ows?', 
        params: run_params,
        extraParams: {
            count: 0
        },
        on_finished: function(out_params) {
            // toevoegen van kaartlaag met naam als model_wildfire:result_1769
            // bewaar runid als terreinid
            Gmi.Session.fireid = out_params.runid;
            // verwijdere oude terreinen
            var layers = map.getLayersByName('Brandverspreiding');
            var name = 'model_wildfire:result_' + out_params.runid;
            if (layers.length > 0) {
                // pas huidige resultaat aan
                layers[0].mergeNewParams({
                    layers: name
                });
            } else {
                // voeg nieuwe resultaat toe
                var layer = new OpenLayers.Layer.WMS('Brandverspreiding', 
                '/geoserver/wms?', {
                    layers: name,
                    transparent: true,
                    format: 'image/png'
                }, {
                    isBaseLayer: false,
                    opacity: 0.6
                });
                map.addLayer(layer);
           }
       },
       success: wpsSuccessCallback,
       failure: wpsFailureCallback
    });
};

var wpsFailureCallback = function(response, options) {
    stopProgress();
    alert(OpenLayers.i18n('WPS failure'));
};

var wpsSuccessCallback = function(response, options) {
    console.log('wpsSuccessCallback response', response, options);
    
    var params = JSON.parse(response.responseText);
    var activerunid = params.runid;
    // statussen: scheduled, running, error, finished
    if (params.status === 'scheduled') {
        var runner = new Ext.util.TaskRunner();
        var count = options.extraParams.count + 1;
        // bij een 'scheduled' process moet voortgang gecontroleerd worden
        var task = {
            interval: 1000, // 1 seconde
            run: function() {
                count = count + 1;
                //Ext.fly('clock').update(new Date().format('g:i:s A'));
                Ext.Ajax.request({
                    url:'/geoserver/ows?',//service=WPS&request=execute&version=1.0.0&identifier=py:checkModelStatus&datainputs=runid='+activerunid+';&RawDataOutput=string=mimeType="application/json"',
                    params: {
                        service: 'WPS',
                        version: '1.1.0',
                        request: 'execute',
                        identifier: 'py:checkModelStatus',
                        RawDataOutput: 'string',
                        mimeType: 'application/json',
                        datainputs: combineParams({
                            runid: activerunid
                        }, ';')
                    },
                    extraParams: {
                        count: count
                    },
                    success: function(check_response, c_options) {
                        var params = {};
                        //console.log(check_response);
                        try {
                            var text = check_response.responseText; //.replace('\n', '\\n');
                            params = JSON.parse(text);
                        } catch (err) {
                            params.status = 'error';
                            params.lastmessage = check_response.responseText;
                        }
                        if (params.status === 'error') {
                            runner.stop(task); 
                            stopProgress();
                            console.log('wfs taak ging fout', params);
                            alert(OpenLayers.i18n('WFS process error: ${msg}', {msg: params.lastmessage}));
                        } else if (params.percentage == 100) {
                            runner.stop(task); 
                            stopProgress();
                            console.log('wfs taak is klaar', params);
                            if (options.on_finished) {
                                options.on_finished(params);
                            } else {
                                alert(OpenLayers.i18n('Process is ready; results are ignored'));
                            }
                        } else if (c_options.extraParams.count >= 120) {
                            runner.stop(task);
                            stopProgress();
                            console.log('wfs taak duurde te lang', params);
                            alert(OpenLayers.i18n('Process takes too long; aborted'));
                        } else {
                            updateProgress(c_options.extraParams.count, params.percentage);
                            console.log('voortgang', c_options.extraParams.count, params);
                        }
                    },
                    failure: function() {
                        stopProgress();
                        runner.stop(task);
                        console.log('WFS process failure', arguments);
                        alert(OpenLayers.i18n('WFS process failure'));
                    }
                });
            }
        };
        runner.start(task);
    } else if (params.status === 'finished') {
        stopProgress();
        // direct resultaat, dus on_finished
        if (options.on_finished) {
            options.on_finished(params);
        }
    } else if (params.status === 'error') {
        // fout
        stopProgress();
        alert(OpenLayers.i18n('WFS process error: ${msg}', {msg: params.lastmessage}));
    } else {
        stopProgress();
        // onbekende veld
        alert(OpenLayers.i18n('Internal error: unknown return status'));
    }
};

function startProgress(message) {
    Ext.MessageBox.show({
        title: OpenLayers.i18n('Please wait'),
        msg: message,
        progressText: OpenLayers.i18n('Initializing...'),
        width: 300,
        
        //progress: true,
        wait: true,
        waitConfig: {interval: 200},
        
        closable: false
        //,animEl: 'mb6'
    });
};

function updateProgress(i, perc) {
    Ext.MessageBox.updateProgress(i, OpenLayers.i18n('${perc}% completed',{perc: Math.round(perc)}));
};

function stopProgress() {
    Ext.MessageBox.hide();
};

Gmi.downloadOnClick = function(url) {
    Ext.MessageBox.hide();
    window.open(url);
};

Gmi.updateUserDefaults = function(obj) {
    var defaults = localStorage['userDefaults'];
    if (!defaults) {
        defaults = '{}';
    }
    defaults = JSON.parse(defaults);
    OpenLayers.Util.extend(defaults, obj);
    localStorage['userDefaults'] = JSON.stringify(defaults);
    return defaults;
};

function combineParams(o, sep) {
    if (!sep) {
        sep = ';';
    }
    var s = '';
    for (var key in o) {
        s += key + '=' + o[key] + sep;
    }
    return s;
};

function areaWithUnit(a) {
    var area_units = { 'km²': 6, 'ha': 4, 'are': 2, 'm²': 0 };
    var a10pow = Math.log(a)/Math.LN10;
    var unit = null;
    for (unit in area_units) {
        if (area_units[unit] < a10pow) {
            a10pow -= area_units[unit];
            break;
        }
    }
    return Math.pow(10, a10pow).toPrecision(3) + ' ' + unit;
};

function lengthWithUnit(a) {
    var length_units = { 'km': 3, 'm': 0 };
    var a10pow = Math.log(a)/Math.LN10;
    var unit = null;
    for (unit in length_units) {
        if (length_units[unit] < a10pow) {
            a10pow -= length_units[unit];
            break;
        }
    }
    return Math.pow(10, a10pow).toPrecision(3) + ' ' + unit;
};

var measureTip = {
    
    show: function(str) {
        var el = document.getElementById('measure-tip');
        if (! el) {
            if (jQuery) {
                jQuery('body').append('<div id="measure-tip" style="border: solid; background-color: white; position: absolute; top: 300px; z-index: 1020; padding: 4px;"></div>');
                el = document.getElementById('measure-tip');
            } else {
                el = document.createElement('div');
                el.id = 'measure-tip';
                el.style.border = 'solid';
                el.style.backgroundColor = 'white';
                el.style.position = 'absolute';
                el.style.height = '20px';
                el.style.width = '300px';
                el.style.left = '500px';
                el.style.top = '300px';
                document.getElementsByTagName('body')[0].appendChild(el);
            }
        } else {
            // bestaat al, zichtbaar maken
            el.style.display = 'inline';
        }
        if (str) {
            el.innerHTML = str;
            // breedte bepalen en centreren
            jQuery(el).offset({top: 0, left: (jQuery(window).width() - jQuery(el).width())/2});
        }
    },
    
    hide: function() {
        var el = document.getElementById('measure-tip');
        if (el) {
            if (jQuery) {
                jQuery('#measure-tip').remove();
            } else {
                el.style.display = 'none';
            }
        }
    }
};

function start_edit_subset(map) {
    //alert('start edit');
    var layers = map.getLayersByName('Terrein');
    if (layers.length !== 1) {
        alert(OpenLayers.i18n('No terrain selected'));
        return false;
    }
    var layer = layers[0];
    
    /*
    var select = new OpenLayers.Layer.Vector("Selection", {styleMap: 
        new OpenLayers.Style(OpenLayers.Feature.Vector.style["select"])
    });
    var hover = new OpenLayers.Layer.Vector("Hover");
    map.addLayers([hover, select]);

    var control = new OpenLayers.Control.GetFeature({
        protocol: OpenLayers.Protocol.WFS.fromWMSLayer(layer),
        box: true,
        hover: true,
        multipleKey: "shiftKey",
        toggleKey: "ctrlKey"
    });
    control.events.register("featureselected", this, function(e) {
        select.addFeatures([e.feature]);
    });
    control.events.register("featureunselected", this, function(e) {
        select.removeFeatures([e.feature]);
    });
    control.events.register("hoverfeature", this, function(e) {
        hover.addFeatures([e.feature]);
    });
    control.events.register("outfeature", this, function(e) {
        hover.removeFeatures([e.feature]);
    });
    map.addControl(control);
    control.activate();
    */
    
    var styleMap = new OpenLayers.StyleMap({
        "default": new OpenLayers.Style(OpenLayers.Util.applyDefaults({
            cursor: 'pointer',
            title: '${fuelLabel}',
            graphicTitle: '${fuelLabel}',
            fillColor: '${fillColor}'
        }, OpenLayers.Feature.Vector.style["default"]), {
            context: {
                fuelLabel: function(feature) {
                    return feature.attributes['fuel_id'];
                },
                fillColor: function(feature) {
                    if (Gmi.Data.fuels.colors[feature.attributes['fuel_id']]) {
                        return Gmi.Data.fuels.colors[feature.attributes['fuel_id']];
                    }
                    return '#ee9900';
                }
            }
        }),
        "select": new OpenLayers.Style(OpenLayers.Util.applyDefaults({
            cursor: 'pointer',
            title: '${fuelLabel}',
            graphicTitle: '${fuelLabel}'
        }, OpenLayers.Feature.Vector.style["select"]), {
            context: {
                fuelLabel: function(feature) {
                    return feature.attributes['fuel_id'];
                }
            }
        })
    });

    var popup, wfs_layer, control;
    
    var saveStrategy = new OpenLayers.Strategy.Save({
        // If true, features will be saved immediately after being added to the layer
        // and with each modification or deletion.  If auto is a number, features
        // will be saved on an interval provided by the value (in seconds).
        auto: true
    });
    saveStrategy.events.register('fail', saveStrategy, function(evt) {
        alert(OpenLayers.i18n('save failed'));
    });
    saveStrategy.events.register('success', saveStrategy, function(evt) {
        if (popup) {
            popup.close();
        }
        control.unselectAll();
        //alert(OpenLayers.i18n('save succeeded'));
    });

    function createPopup(feature) {
        
        var fuel_html = Gmi.Data.fuels.types[feature.attributes.fuel_id];
        
        if (popup) {
            popup.close();
            popup = null;
        }
        if (! popup) {
            
            var fuel_data = [];
            for (var fuel_id in Gmi.Data.fuels.types) {
                fuel_data.push([fuel_id, Gmi.Data.fuels.types[fuel_id]]);
            }
            
            popup = new GeoExt.Popup({
                title: OpenLayers.i18n('Edit feature'),
                id: 'wfs_popup',
                location: feature,
                map: map,
                width: 300,
                //anchored: true,
                html: fuel_html,
                maximizable: false,
                collapsible: false,
                layout: 'fit',
                items: [
                    new Ext.form.ComboBox({
                        id: 'wfs_fuel_list',
                        fieldLabel: OpenLayers.i18n('Fuel list'),
                        name: 'wfs_fuel_list',
                        typeAhead: true,
                        triggerAction: 'all',
                        lazyRender: true,
                        //width: 280,
                        anchor: '100%',
                        align: 'right',
                        mode: 'local',
                        value: feature.attributes.fuel_id,
                        forceSelection: true, editable: false,
                        store: new Ext.data.ArrayStore({
                            id: 0,
                            fields: [
                                'id',
                                'naam'
                            ],
                            data: fuel_data
                        }),
                        valueField: 'id',
                        displayField: 'naam',
                        listeners: {
                            'select': function() {
                                    //not_implemented();
                                    console.log('select fuel_list')
                                }
                        }
                    }),
                    new Ext.Button({
                        text: OpenLayers.i18n("Change"),
                        //xtype: 'button',
                        id: 'btn_save_wfs',
                        tooltip: OpenLayers.i18n("todo"),
                        handler: function(b, e) {
                            feature.attributes.fuel_id = Ext.getCmp('wfs_fuel_list').getValue();
                            console.log('todo: fuel_id wordt ', feature.attributes.fuel_id);
                            feature.state = OpenLayers.State.UPDATE;
                            feature.layer.events.triggerEvent('featuremodified', {feature: feature});
                            feature.layer.events.triggerEvent("afterfeaturemodified", {
                                feature: feature,
                                modified: true
                            });
                        }
                    })
                ]
            });
            // unselect feature when the popup
            // is closed
            popup.on({
                close: function() {
                    console.log('close popup');
                    popup = null;
                    /*var vectorLayer = this.feature.layer;
                    if (OpenLayers.Util.indexOf(vectorLayer.selectedFeatures,
                                               this.feature) > -1) {
                        selectCtrl.unselect(this.feature);
                    }*/
                }
            });
        }
        /*popup.add({
            xtype: 'box',
            autoEl: {
                html: fuel_html
            }
        });*/
        
        // reset the popup's location
        //popup.location = feature;
        
        //popup.doLayout();
        
        // since the popup is anchored, calling show will move popup to this location
        popup.show();
    };

    wfs_layer = new OpenLayers.Layer.Vector("Terrein (WFS)", {
        //minScale: 15000000,
        strategies: [new OpenLayers.Strategy.Fixed(), saveStrategy],
        projection: new OpenLayers.Projection('EPSG:4326'), // verschillend van kaart
        protocol: new OpenLayers.Protocol.WFS({
            url: "/geoserver/ows",
            version: "1.1.0",
            geometryName: 'geom',
            srsName: 'EPSG:4326', // default
            featureType: layer.params.LAYERS.split(':')[1],
            featureNS: 'model_wildfire'
        }),
        styleMap: styleMap,
        eventListeners: {
            featureselected: function(evt) {
                console.log('feature selected', evt.feature);
                createPopup(evt.feature);
            }
        },
        displayInLayerSwitcher: Gmi.Settings.debug // alleen in layerswitcher bij debug
    });
    map.addLayer(wfs_layer);
    
    //var control = new OpenLayers.Control.ModifyFeature(wfs_layer);
    //var controls = map.getControlsByClass('OpenLayers.Control.ModifyFeature');
    control = new OpenLayers.Control.SelectFeature(wfs_layer, {
        hover: false,
        multiple: false,
        //clickout: true,
        //highlightOnly: true,
        //renderIntent: "temporary"/*
        renderers: OpenLayers.Layer.Vector.prototype.renderers
        /*eventListeners: {
            beforefeaturehighlighted: info ,
            featurehighlighted: info ,
            featureunhighlighted: info 
        }*/
    });
    map.addControl(control);
    control.activate();
    
    //controls[0].layers.push(wfs_layer);
    //controls[0].activate();
    return true;
};

function stop_edit_subset(map) {
    
    // knop uitzetten?
    var btn = Ext.getCmp('btn_edit_terrain');
    if (btn.pressed) {
        btn.doToggle();
    }
    
    var layers = map.getLayersByName('Terrein (WFS)');
    if (layers.length === 0) {
        return;
    }
    
    var wfs_layer = layers[0];
    var controls = map.getControlsByClass('OpenLayers.Control.SelectFeature');
    for (var i = 0; i < controls.length; i++) {
        if (controls[i].layer === wfs_layer) {
            map.removeControl(controls[i]);
            console.log('wfs control removed');
        }
    }
    map.removeLayer(wfs_layer);
    console.log('wfs layer removed');
};
