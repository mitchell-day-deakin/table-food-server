var imageryViewModels = []; //the list of imagery providers for user to select // OSM, googlemaps etc
var terrainViewModels = []; // list of terrain providers for user to select from
let addItem = false;
let imgUrl = "";


imageryViewModels.push(new Cesium.ProviderViewModel({
    name: 'Natural Earth\u00a0II',
    iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/naturalEarthII.png'),
    tooltip: 'Natural Earth II, darkened for contrast.\nhttp://www.naturalearthdata.com/',
    creationFunction: function () {
        return new Cesium.TileMapServiceImageryProvider({
            url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
        });
    }
}));



imageryViewModels.push(new Cesium.ProviderViewModel({
    name: 'Open\u00adStreet\u00adMap',
    iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/openStreetMap.png'),
    tooltip: 'OpenStreetMap (OSM) is a collaborative project to create a free editable \
    map of the world.\nhttp://www.openstreetmap.org',
    creationFunction: function () {
        return new Cesium.OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
        });
    }
}));



terrainViewModels.push(new Cesium.ProviderViewModel({
    name: 'Townsville',
    iconUrl: Cesium.buildModuleUrl('Widgets/Images/ImageryProviders/naturalEarthII.png'),
    tooltip: 'Natural Earth II, darkened for contrast.\nhttp://www.naturalearthdata.com/',
    creationFunction: function () {
        return new Cesium.TerrainProvider({
            url: Cesium.buildModuleUrl('Assets/townsville')
        });
    }
}));



//set the initial view for the cesium camera
var extent = Cesium.Rectangle.fromDegrees(75.939, 0.35442, 195.470, -51.94);
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = extent;
Cesium.Camera.DEFAULT_VIEW_FACTOR = .5;


//CAMERA VIEWS
const locations = [
    {
        name: "aus",
        label: 'AUS',
        description: 'AUSTRALIA',
        lon: 133.0746,
        lat: -25.978,
        viewHeight: 8000000,
    }, {
        name: "swbta",
        label: 'SWBTA',
        description: 'Shoalwater Bay Training Area, QLD',
        lon: 150.36833683,
        lat: -22.6687,
        viewHeight: 150000
    }, {
        name: "tfta",
        label: 'TFTA',
        description: 'Townsville Field Training Area, QLD',
        lon: 146.2260,
        lat: -19.5467,
        viewHeight: 150000
    },  {
        name: "tville",
        label: 'Townsville',
        description: 'Townsville QLD',
        lon: 146.773425,
        lat: -19.286311,
        viewHeight: 25000
    },{
        name: "rb",
        label: "Robertson Barricks",
        description: "Roberston Barracks, NT",
        lon: 130.977126,
        lat: -12.440000,
        viewHeight: 8000
    }, {
        name: "can",
        label: "Canberra",
        description: "Canberra, ACT",
        lon: 149.1285,
        lat: -35.2854,
        viewHeight: 20000
    }, {
        name: "cfta",
        label: "Cultana",
        description: "Cultana Field Training Area, SA",
        lon: 137.650806,
        lat: -32.683643,
        viewHeight: 100000
    }, {
        name: "enoggera",
        label: "Enoggera",
        description: "Enoggera Barracks, QLD",
        lon: 152.971289,
        lat: -27.430082,
        viewHeight: 6000
    }
]

