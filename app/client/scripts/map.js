/**
 * Map factory function
 *@param container      id of container for map
 *@param projContainer  id of container that displays coordinate
 */
function Map(container, projContainer) {
    //Map VARIABLES
    container //the id of the div to attach cesium to
    let viewer = null;
    let scene = null;
    let camera = null;
    let mode; //what mode the map is in - adding entities, navigating map etc
    let projection;//Maps current projection: mgrs, utm, latlon
    let coord; //Coord object //{lat, lon, utm: {zoneNumber, zoneLetter, easting, northing}, mgrs: {zoneNumber, zoneLetter, id100k, easting, northing, mgrsString}}
    let gis = GIS(); //used to convert between utm, mgrs and latlon
    let clickPos = null; //this tracks where the LEFT_DOWN
    //dom elements
    let mapContainer = document.getElementById(container);
    let coordDisplay = document.getElementById(projContainer); //container to display the coords in



    //ENUMS
    //the different modes of the map
    const MODES = {
        EDIT: "edit",
        NAVIGATE: "navigate",
        ADD: "add",
        LINE: "line",
        RULER: "ruler",
        AREA: "area"
    }

    //different map projections
    const PROJ = {
        LATLON: "latlon",
        UTM: "utm",
        MGRS: "mgrs"
    }
    //set the default map projection and mode
    projection = PROJ.MGRS;
    mode = MODES.NAVIGATE;



    /** 
     * This converts x and y positions within the map container to lat and lon values
     * @param {int} x horizontal pixels in the cesium container 
     * @param {int} y vertical pixels in the cesium container
     * @return {latlon} object literal {error, data:{lat, lon}}
     */
    let screenXYtoLatLon = (x, y) => {
        if (viewer == null) { return { error: true, msg: "Viewer not created" } };
        let ellipsoid = viewer.scene.globe.ellipsoid;
        let position = viewer.camera.pickEllipsoid(new Cesium.Cartesian3(x, y), ellipsoid);
        var pos = ellipsoid.cartesianToCartographic(position);
        let lon = Cesium.Math.toDegrees(pos.longitude);
        let lat = Cesium.Math.toDegrees(pos.latitude);
        let height = pos.height
        let error = position ? false : true;
        return { error, data: { position, lat, lon, height } };
    }

   /*  var terrainProvider = new Cesium.CesiumTerrainProvider({
        url: '../data/terrain/townsville'
      }); */
    //VIEWER
    //creates the viewer and attaches to the container
    viewer = new Cesium.Viewer(container, {
        imageryProviderViewModels: imageryViewModels,
        //terrainProviderViewModels: terrainViewModels,
        /* terrainProvider: new Cesium.CesiumTerrainProvider({
            url: 'https://api.maptiler.com/tiles/terrain-quantized-mesh/?key=GrAanijXqZVRNS6ziHW6' // get your own key at https://cloud.maptiler.com/
          }), */
        //terrainProvider,
        homeButton: false,
        searchButton: false,
        geocoder: false,
        navigationHelpButton: false,
        shadows: true,
        shouldAnimate: true,
        mapMode2D: Cesium.MapMode2D.ROTATE,
        sceneModePicker: true
    });

    //handles the double click event on a widget/entity
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.globe.enableLighting = true;

    //returns viewer obj
    let getViewer = () => {
        if (viewer != null) {
            return { error: false, viewer }
        } else {
            return { error: true, msg: "The viewer is not created" }
        }
    }

    let setCameraPos = (pos) => {
        camera = pos
    }

    let getCameraPos = () => { return camera }

    function setCameraView(pos, previousMode) {
        //pos = (pos && pos.length == 2 ) ? pos : {lon: 175.8047, lat:-39.4413, height: 1000};
        let pitch = previousMode == 2 ? -0.8 : 0
        let lat = previousMode == 2 ? pos.lat - 0.05 : pos.lat
        camera = { lat, lon: pos.lon, height: pos.height };
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(pos.lon, lat, pos.height),
            orientation: {
                heading: 0.0,
                pitch,
                roll: 0
            }
        })
    }

    let resetCameraOrientation = () => {
        viewer.camera.setView({
            orientation: {
                heading: 0
            }
        })
    }


    /**
     * Adds a map image to the Map
     * @param {string} url  url to the imagery to add to viewer
     * @param {array} pos  [west, south, east, north] extents of image on map in decimal degrees
     */
    let addMapImg = async (url, pos) => {
        let img  = viewer.scene.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
            url: `${serverIp}/${url}`,
            rectangle: Cesium.Rectangle.fromDegrees(pos[0], pos[1], pos[2], pos[3])
        }));
        console.log(img)
        img.imageryProvider.readyPromise.then(_=>{
            return true;
        })
    }

    /**
     * 
     * @param {[{url, pos}]} mapImages array of map images {url, pos}
     */

    let addMapImages = async (mapImages) => {
        loadingPage("block");
        //if the qde only has 1 object in the map.img value
        if (!Array.isArray(mapImages)) {
            await addMapImg(mapImages.url, mapImages.pos)
            loadingPage("none");
            return;
        }
        //if array then push all to the map
        let promises = [];
        mapImages.forEach(img => {
            let promise = addMapImg(img.url, img.pos);
            promises.push(promise);
        })
        Promise.all(promises).then(_=>{
            loadingPage("none");
            return;
        })
    }



    //scene for map
    scene = viewer.scene;
    scene.mode = Cesium.SceneMode.SCENE2D;

    //listener, executes on map morph completion
    scene.morphComplete.addEventListener(e => {
        if (e._previousMode != 2) {
            scene.camera
        }
        let { lat, lon, height } = camera;
        setCameraView({ lat, lon, height }, e._previousMode)
        updateTerrain();
        //let { lat, lon, height } = current.tewt.qdes[current.qde].map.camera
        //map.setCameraView({ lat, lon, height })
    })


    //MAP MODE
    /**
     * The modes are used to identify the maps current mode
     * for the dragDrop and mouse click events
     * i.e adding entity to map, navigating map, measuring
     * @param {string} value    a value from MODES enum
     */
    let setMode = (value) => { mode = value }
    let getMode = () => { return mode }




    //MAP PROJECTION AND COORD
    /**
     * The projection variable defines what projection the map is using
     * this then determines the display values from the coord
     * @param {string} proj     a value from the PROJ enum
     */
    let setProj = () => {
        let proj = document.getElementById("proj-type").value
        console.log(proj)
        projection = proj;
        displayCoords()
    }

    /**
     * @return {string} value from PROJ enum
     */
    let getProj = () => projection;

    /**
     * Displays the coords variable in the DOM element coordDisplay
     * Creates a string based on maps current projection value -> which is one of the PROJ enum values
     */
    let displayCoords = () => {
        let coordString;
        switch (projection) {
            case PROJ.MGRS:
                coordString = coord.mgrs.mgrsString;
                break;
            case PROJ.UTM:
                let { utm } = coord;
                coordString = `${utm.zoneNumber + utm.zoneLetter} ${utm.easting} ${utm.northing}`
                break;
            case PROJ.LATLON:
            default:
                coordString = `${coord.lat}, ${coord.lon}`
                break;
        }
        coordDisplay.innerHTML = coordString;
    }

    /**
     *
     * @param {object} pos either {lat, lon} or {mgrsString} or {utm:{northing, easting, zoneLetter, zoneNumber}}
     * @param {string} type a value from PROJ enum
     * @return {object} {utm, mgrs: {mgrsString}, lat, lon}
     */
    let getCoord = (pos, type) => {
        let result = {}
        switch (type) {
            case PROJ.MGRS:
                result.utm = gis.MGRStoUTM(pos.mgrsString);
                result.mgrs = gis.UTMtoMGRS(result.utm);
                let { lat, lon } = gis.UTMtoLL(result.utm);
                result.lat = lat;
                result.lon = lon;
                break;
            case PROJ.UTM:
                break;
            case PROJ.LATLON:
            default:
                result.utm = gis.LLtoUTM(pos);
                result.mgrs = gis.UTMtoMGRS(result.utm);
                result.lat = pos.lat;
                result.lon = pos.lon
                break;
        }
        console
        return result;
    }

    let getCoordsArray = (posArray, type) => {
        let coords = [];
        posArray.forEach(pos => {
            coords.push(getCoord(pos, type));
        })
        return coords;
    }


    let setCoord = (pos, type) => {
        coord = getCoord(pos, type)
        displayCoords()
    }


    //LISTENERS
    mapContainer.addEventListener("drop", async (e) => {
        e.preventDefault();
        console.log(" map drop event")
        console.log(e.dataTransfer.getData('text'))
        let reply;
        console.log(viewer.camera.getMagnitude())
        let viewportOffset = viewer.container.getBoundingClientRect();
        // these are relative to the viewport, i.e. the window
        let top = viewportOffset.top;
        let left = viewportOffset.left;
        //check to make sure it wasn't a mobile touch
        if (e.touches) { return };
        //don't add item if the map is in line or ruler mode
        if (getMode() == MODES.LINE || getMode() == MODES.RULER) { return };
        let { url, name, type } = JSON.parse(e.dataTransfer.getData('text'));
        reply = map.screenXYtoLatLon(e.clientX - left, e.clientY - top);
        if (reply.error) return reply;
        let rotation = map.getViewer().viewer.camera.heading*-1; //THIS WILL PUT THE GRAPHICS FACING THE WAY OF THE CAMERA
        console.log("Rotatiton:", rotation);
        let result = await mapEntities.create(reply.data, url, name, type, rotation);
        if (!result.error) {
            openMapMenu("itemsEdit")
        }
    })

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        event.preventDefault();
        return true;
    }

    function checkDrag(down, up){
        const pixelAmount = 50; //threshold change before declaring a drag/move
        if(down.x % up.x > 100 || down.y % up.y > 100) return true;
        return false;
    }


    //creates the handler used to handle screen click and touch events
    let handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);

    //handles the left click event
    handler.setInputAction(click => {

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    //handles the left double click event
    handler.setInputAction(click => {

    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

    handler.setInputAction(leftDown=>{
        clickPos = leftDown.position;
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)


    //use the mouse up to 
    handler.setInputAction(clickRelease => {
        let reply = screenXYtoLatLon(clickRelease.position.x, clickRelease.position.y);
        setCoord({ lat: reply.data.lat, lon: reply.data.lon }, PROJ.LATLON)
        switch (mode) {
            case MODES.NAVIGATE:
            case MODES.EDIT:
                let pickedObject = scene.pick(clickRelease.position);
                console.log(scene)
                if (Cesium.defined(pickedObject)) {
                    if(pickedObject.id._export.group == "system") {openMapMenu("mapItems"); break};
                    mapEntities.setCurrent(pickedObject.id._id);
                    openMapMenu("itemsEdit")
                } else {
                    if(checkDrag(clickPos, clickRelease.position)) break;
                    mapEntities.emptyCurrent();
                    openMapMenu("mapItems")
                    mode = MODES.NAVIGATE;
                }
                break
            case MODES.LINE:
                if(checkDrag(clickPos, clickRelease.position)) break;
                mapEntities.Line.addPt(reply.data)
                break;
            case MODES.RULER:
                if(checkDrag(clickPos, clickRelease.position)) break;
                mapEntities.Ruler.addPt(reply.data)
                break;
            case MODES.AREA:
                if(checkDrag(clickPos, clickRelease.position)) break;
                mapEntities.Area.addPt(reply.data)
                break;
            case MODES.ADD:
                if(checkDrag(clickPos, clickRelease.position)) break;
                let icon = mapEntities.loadIcon()
                let rotation = map.getViewer().viewer.camera.heading*-1; //THIS WILL PUT THE GRAPHICS FACING THE WAY OF THE CAMERA
                console.log("Rotatiton:", rotation);
                mapEntities.create(reply.data, icon.url, icon.name, icon.type, rotation);
                setMode(MODES.EDIT)
                updateTerrain();
                break;
        }
        
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    //implement this to stop event firing when adding icon to canvas
    //touchend cancels add entity functionality by canceling the edit menu popup
    //mapContainer.addEventListener("touchend", function (evt) { if (mode == MODES.ADD) { evt.preventDefault() } });

    mapContainer.addEventListener("touchend", function (evt) {
        console.log(evt.path[0])
        let canvas = document.getElementsByTagName("canvas")[0];
        if (evt.path[0] == canvas) {
            evt.preventDefault();
        }
    });


    function updateImagery(){

    }

    function updateTerrain(){
        let height = undefined;
        let heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
        //let clampGround = true;
        //if(viewer.baseLayerPicker.viewModel.selectedTerrain.name == "Cesium World Terrain" && viewer.scene.mode == Cesium.SceneMode.SCENE3D){
        //if(viewer.baseLayerPicker.viewModel.selectedTerrain.name == "WGS84 Ellipsoid" && viewer.scene.mode == Cesium.SceneMode.SCENE2D){
        if(viewer.baseLayerPicker.viewModel.selectedTerrain.name == "WGS84 Ellipsoid"){
        //if(viewer.baseLayerPicker.viewModel.selectedTerrain.name == "Cesium World Terrain"){
            //height = 'undefined';
            //alert("2d and ellipsoid")
            height = 0.5;
            heightReference = Cesium.HeightReference.NONE;
        }
        let entitiesArray = mapEntities.getAll()._entities._array;
        entitiesArray.forEach(entity=>{
            if(entity.rectangle){
                entity.rectangle.height = height;
                //entity.rectangle.clampToGround = clampGround;
            }
            if(entity.billboard){
                entity.billboard.heightReference = heightReference;
            }
            if(entity.polygon){
                //entity.polygon.heightReference = heightReference;
                entity.polygon.height = height == 0.5 ? 0.2 : height;
            }
        })
    }


    // Update when imagery changes.
    Cesium.knockout.getObservable(viewer.baseLayerPicker.viewModel,
        'selectedImagery').subscribe(updateTerrain);

    // Update when terrain changes.
    Cesium.knockout.getObservable(viewer.baseLayerPicker.viewModel,
        'selectedTerrain').subscribe(updateTerrain);


    return {
        MODES,
        PROJ,
        gis,
        mapContainer,
        getViewer,
        setCameraPos,
        getCameraPos,
        setCameraView,
        resetCameraOrientation,
        addMapImg,
        addMapImages,
        getMode,
        setMode,
        setProj,
        getProj,
        screenXYtoLatLon,
        displayCoords,
        setCoord,
        getCoord,
        getCoordsArray,
        dragEnter,
        dragOver
        //dragDrop
    }
}


//SELECT BOXES FOR ENTITIES and LOCATIONS
function createViewSelector() {
    let selectBox = document.getElementById("selections");
    let options = `<option value="" >LOCATIONS</option>`;
    locations.forEach((loc) => {
        options += `<option title="${loc.description}" value="${loc.name}">${loc.label}</option>`
    })
    selectBox.innerHTML = options;
}

/**
 * Creates <options> list using MapEntities for entitySelect <select> DOM element
 */
function createEntitySelector() {
    let selectBox = document.getElementById("entitySelect");
    let options = `<option value="" >ENTITIES</option>`;
    let entities = mapEntities.getAllFromCurrentLayer();
    for (d in entities) {
        options += `<option title="NAME: ${entities[d].export.name}\nID: ${entities[d].id}" value="${entities[d].id}">${entities[d].export.name}</option>`
    }
    //if(entities._children){
    /*  for(entity of entities.base._children){
             console.log(entity)
             options += `<option title="NAME: ${entity.export.name}\nID: ${entity.id}" value="${entity.id}">${entity.export.name}</option>`
     } */
    selectBox.innerHTML = options;
    //}

}

// looks through locations array and changes view to selected view from dropdown select.
function viewChange() {
    let lon, lat, height;
    let selLoc = document.getElementById("selections");
    let x = selLoc.value;
    map.getViewer().trackedEntity = undefined;
    locations.forEach((loc) => {
        if (x == loc.name) {
            lon = loc.lon;
            lat = loc.lat;
            height = loc.viewHeight;
        }
    })
    map.getViewer().viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, height)
    })
    setTimeout(() => selLoc.selectedIndex = 0, 2000)
}
/**
 * Gets the current value from the entitySelect <select>
 * Moves camera to entity, and sets entity as currentEntity
 */
function entitySelect() {
    let selEntity = document.getElementById("entitySelect");
    //let entities = mapEntities.getAll();
    //console.log("Select box: ", entities)
    //let entity = entities[selEntity.value]
    map.getViewer().viewer.trackedEntity = undefined;
    mapEntities.select(selEntity.value)
    //map.getViewer().viewer.selectedEntity = entity;
    map.getViewer().viewer.flyTo(mapEntities.getCurrent()).then(() => { })
    //mapEntities.setCurrent(selEntity.value)
    openMapMenu("itemsEdit")
    setTimeout(() => selEntity.selectedIndex = 0, 2000)
}

/**
 * Takes in two points and measures the distance using UTM calculations
 * @param {Coord} pt1 an object literal {umt, lat, lon, mgrs}
 * @param {Coord} pt2 an object literal {umt, lat, lon, mgrs}
 * @return {Object} with {distance, andgle:{mils, radians, degrees}
 */
let vectorUsingUtm = (pt1, pt2) => {
    let xDiff = pt2.utm.easting - pt1.utm.easting;
    let yDiff = pt2.utm.northing - pt1.utm.northing;
    let distance = Math.round(Math.sqrt((xDiff * xDiff) + (yDiff * yDiff)))
    let rad = Math.atan(xDiff / yDiff);
    if (rad < 0) {
        rad *= -1 //removes any negative angle output
    }

    if (yDiff < 0) {
        rad = Math.PI - rad;
    }
    if (xDiff < 0) {
        rad = 2 * Math.PI - rad;
    }
    let deg = Math.round(map.gis.radToDeg(rad))
    let mils = Math.round(map.gis.radToMils(rad))
    return { distance, angle: { deg, rad, mils } }
}

/**
 * Takes in two points and measures the distance using Lat and Lon calculations
 * @param {Coord} pt1 an object literal {umt, lat, lon, mgrs}
 * @param {Coord} pt2 an object literal {umt, lat, lon, mgrs}
 * @return {Object} with {distance, andgle:{mils, radians, degrees}
 */
let vectorUsingLatLon = (pt1, pt2) => {
    console.log(pt1, pt2)
    let lat1 = map.gis.degToRad(pt1.lat);
    let lon1 = map.gis.degToRad(pt1.lon);
    let lat2 = map.gis.degToRad(pt2.lat);
    let lon2 = map.gis.degToRad(pt2.lon);
    const R = 6371e3;
    let dLat = (pt2.lat - pt1.lat) * Math.PI / 180;
    let dLon = (pt2.lon - pt1.lon) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = Math.round(R * c); //metres
    //workout angle
    const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    const rad = Math.atan2(y, x);
    console.log(rad)
    let mils = Math.round(map.gis.radToMils(rad))
    const deg = Math.round((rad * 180 / Math.PI + 360) % 360); // in degrees
    return { distance: d, angle: { deg, mils, rad } }

}



//@param pt1 and pt2 = {Easting, Northing, Zone} type utm coords
let distanceAndAngle = (pt1, pt2) => {
    let vector = {};
    if (pt1.utm.zoneNumber != pt2.utm.zoneNumber) {
        vector = vectorUsingLatLon(pt1, pt2)
        vector.projCalc = map.PROJ.LATLON;
    } else {
        vector = vectorUsingUtm(pt1, pt2);
        vector.projCalc = map.PROJ.UTM;
    }
    return vector;

}


//cesiumMap.addEventListener("touchend", function (evt) { evt.preventDefault()});


//ALL THE EVENT LISTENERS
//CESIUM MAP DIV EVENT LISTENERS
//mouse listeners
/* cesiumMap.addEventListener("mouseup", function (evt) { });
cesiumMap.addEventListener("mouseover", function (evt) { });
cesiumMap.addEventListener("mouseout", function (evt) { });
cesiumMap.addEventListener("mousemove", function (evt) { });
cesiumMap.addEventListener("click", function (evt) {
    if (evt.touches) {
        console.log("Touches")
        return;
    }
    switch (map.getMode()) {
        case map.MODES.LINE:
            var ellipsoid = viewer.scene.globe.ellipsoid;
            var position = viewer.camera.pickEllipsoid(new Cesium.Cartesian3(evt.clientX, evt.clientY - 30), ellipsoid);
            var pos = ellipsoid.cartesianToCartographic(position);
            map.lineArrayAdd([Cesium.Math.toDegrees(pos.longitude), Cesium.Math.toDegrees(pos.latitude)]);
            return
        case map.MODES.ADD:
            dragDrop(evt, selectedIcon.url, selectedIcon.name);
            map.setMode(map.modes.NAVIGATE)
            return
        case map.MODES.MEASURE:
            {
                let pos = screenXYtoLatLon(evt.clientX, evt.clientY, viewer)
                map.measure.mapClick(pos);
                return;
            }
    }

});

//touch device listeners
cesiumMap.addEventListener("touchstart", function (evt) {
    switch (map.getMode()) {
        case map.MODES.ADD:
            dragDropTouch(evt, selectedIcon.url, selectedIcon.name, selectedIcon.type);
            map.setMode(map.MODES.NAVIGATE)
            break;
        case map.modes.MEASURE:
            let pos = screenXYtoLatLon(evt.touches[0].clientX, evt.touches[0].clientY, viewer)
            map.measure.mapClick(pos);
            break; 
    }
    //startDragOffset.x = evt.touches[0].clientX - translatePos.x;
}, { passive: true });


cesiumMap.addEventListener("touchmove", function (evt) { }); */

//listen for touch start on mapMenuIcons
//touch screen dragDrop functionality
let menuIcons = document.querySelectorAll(".dragImg");
let selectedIcon = { url: "", name: "Map Icon", type: "billboard" }
menuIcons.forEach(icon => {
    icon.addEventListener("touchend", function (evt) {
        console.log("adding item to map")
        let mode = map.getMode()
        if (mode == map.MODES.LINE || mode == map.MODES.RULER) {
            return
        }
        let url = new URL(icon.src);
        let pathname = url.pathname.replace(/\/android_asset/gi, '');
        pathname = "."+pathname;
        map.setMode(map.MODES.ADD);
        mapEntities.storeIcon(icon.getAttribute("alt"), pathname, icon.getAttribute("type"))
        mobileAddItem = true;
        rl = icon.src
    })
})

function dragStart(evt) {
    let url = new URL(evt.target.src);
    let pathname = url.pathname.replace(/\/android_asset/gi, '');
    pathname = "."+pathname;
    //let pathname = url.pathname.substr(1); //removes the preceeding "/" character from url
    evt
        .dataTransfer
        //.setData("text/plain", JSON.stringify({ url: evt.target.src, name: evt.toElement.alt, type: evt.target.getAttribute("type") }))
        .setData("text/plain", JSON.stringify({ url: pathname, name: evt.target.alt, type: evt.target.getAttribute("type") }))
}

function finishLine() {
    document.getElementById("lineFinishPopup").style.display = "none";
    map.setMode(map.MODES.NAVIGATE);
    createLineMenu("Line", "", map.getLineArray());
}

function openMapMenu(id) {
    let openMenu = document.getElementById(id);
    //this is for admin map, as it doesnt have edit menu.
    if (!openMenu) return;
    let menus = document.querySelectorAll(".mapMenus")
    for (i = 0; i < menus.length; i++) {
        menus[i].style.display = "none"
    }
    openMenu.style.display = "block";
}

function hideMapMenus() {
    let menus = document.querySelectorAll(".mapMenus")
    for (i = 0; i < menus.length; i++) {
        menus[i].style.display = "none"
    }
}



function MenuIcons() {
    let selected = {
        url,
        name,

    }


    return {

    }
}



