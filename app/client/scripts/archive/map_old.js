let cesiumMap = document.getElementById("cesiumMap");


let Map = (viewer) => {
    //Map Global Variables, enums
    let currentEntity = null;
    let lineArray = [];
    let measure = undefined;
    let entities = {}
    //this is where the qde defined entities will be defined

    //enum for material types
    let lineMat = c => {
        return {
            DASHED: new Cesium.PolylineDashMaterialProperty({ color: Cesium.Color.fromCssColorString(c) }),
            SOLID: Cesium.Color.fromCssColorString(c),
            ARROW: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.fromCssColorString(c))
        }
    }
    //ENUM for checking map mode
    //currently creating line, measuring, navigating, editing or adding entity
    const modes = {
        EDIT: "edit",
        MEASURE: "measure",
        NAVIGATE: "navigate",
        ADD: "add",
        LINE: "line"
    }
    //set default map MODE
    let MODE = modes.NAVIGATE;

    const proj = {
        GEOCENTRIC: "wgs84",
        UTM: "utm",
        MGRS: "mgrs"
    }
    let PROJ = proj.MGRS;


    //sets the Map MODE
    let setMode = (mode) => {
        MODE = mode;
    }

    //gets the Map MODE
    let getMode = () => { return MODE };


    //creates if for entities
    function createId(preId) {
        let validId = false;
        let counter = 0;
        let id;
        while (!validId) {
            if (!(`${preId}_${counter}` in entities)) {
                id = `${preId}_${counter}`
                validId = true;
                return id;
            } else {
                counter++;
                if (counter > 10000) {
                    return 'id_1a';
                }
            }
        }
    }


    //add any map images
    let addMapImg = (url, pos) => {
        viewer.scene.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
            url: `${url}`,
            rectangle: Cesium.Rectangle.fromDegrees(pos[0], pos[1], pos[2], pos[3])
        }));
    }



    //PROJECTION AND MEASURING TOOLS

    function setProj(proj) {
        PROJ = proj;
    }

    function getProj() { return PROJ };

    function convertCoords(i, outProj) {
        switch (outProj) {
            case proj.MGRS:
                return UTMLatLng().convertLatLonToMGRS(i.lat, i.lon, 1, i.precision)
            case proj.UTM:
                return UTMLatLng().convertLatLonToUtm(i.lat, i.lon, 1);
            default:
                return { display: `${i.lat.toFixed(8)}, ${i.lon.toFixed(8)}`, lat: i.lat, lon: i.lon };
        }
    }

    let radToMils = (rad) => {
        return rad * 1018.591636;
    }

    let radToDeg = (rad) => {
        return (rad * 180 / Math.PI)
    }





    //MEASURE TOOL

    let Measure = () => {
        let counter = 0;
        let pt1 = null;
        let pt2 = null;

        let mapClick = (click) => {
            console.log("points", pt1, pt2);
            if (pt1 == null) {
                viewer.entities.remove(entities["user_tape"]);
                delete entities["user_tape"];
                pt1 = { lat: click.data.lat, lon: click.data.lon };
                entities["user_tape"] = createLineEntity("user_tape", "Measure", "", [pt1.lon, pt1.lat], "arrow", "#000000");
            } else if (pt2 == null) {
                pt2 = { lat: click.data.lat, lon: click.data.lon };
                let positionArr = [pt1.lon, pt1.lat, pt2.lon, pt2.lat];
                console.log("click2", positionArr)
                currentEntity = entities["user_tape"];
                let p1 = UTMLatLng().convertLatLonToUtm(pt1.lat, pt1.lon, 1);
                let p2 = UTMLatLng().convertLatLonToUtm(pt2.lat, pt2.lon, 1);
                let vector = measure.distanceAndAngle(p1, p2);
                let description = `Distance(m): ${vector.distance}<br>Angle (mils): ${vector.angle.mils}<br>Angle (deg): ${vector.angle.deg}`
                updateLineEntity("Measure", description, [pt1.lon, pt1.lat, pt2.lon, pt2.lat], "arrow", "#000000");
                viewer.selectedEntity = entities["user_tape"];
            }

        }

        let start = () => {
            MODE = modes.MEASURE;
            pt1 = null;
            pt2 = null;
        }


        //@param pt1 and pt2 = {Easting, Northing, Zone} type utm coords
        let distanceAndAngle = (pt1, pt2) => {
            if (pt1.ZoneNumber != pt2.ZoneNumber) {
                return { distance: -1, angle: { rad: 0, mils: 0, deg: 0 } };
            }
            let xDiff = pt2.Easting - pt1.Easting;
            let yDiff = pt2.Northing - pt1.Northing;
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
            let deg = Math.round(radToDeg(rad))
            let mils = Math.round(radToMils(rad))
            return { distance, angle: { deg, rad, mils } }

        }

        return {
            distanceAndAngle,
            mapClick,
            start
        }
    }
    measure = Measure()


    /* //TEST pts
    let pos1 = [137.760855, -32.480295];
    let pos2 = [137.752533, -32.485136];
    let pt1 = UTMLatLng().convertLatLonToUtm(pos1[1], pos1[0], 1);
    let pt2 = UTMLatLng().convertLatLonToUtm(pos2[1], pos2[0], 1);
    let vector = measure.distanceAndAngle(pt1, pt2);
    let description = `Distance(m): ${vector.distance}<br>Angle (mils): ${vector.angle.mils}<br>Angle (deg): ${vector.angle.deg}`

    let measureLine = createLineEntity("user_tape", "Measure", description, [...pos1, ...pos2], "arrow", "#000000");
    console.log(vector)
    */

    let createPolyLineMat = (type, color) => {
        let material = type == "dashed" ? lineMat(color).DASHED : type == "arrow" ? lineMat(color).ARROW : lineMat(color).SOLID;
        let width = type == "arrow" ? 20 : 5;
        return { material, width };
    }

    let descriptionArray = (description) => {
        let desc = "";
        description.forEach(line => {
            desc += line;
            desc += "<br>"
        })

        return desc;
    }

    //LINE FUNCTIONS

    //@param posArray = [<lon1>,<lat1>,<lon2>,<lat2>.....]
    //@param type = <string> dashed/arrow/""
    function createLineEntity(id, name, description, posArray, type, color) {
        name;
        let material = type == "dashed" ? lineMat(color).DASHED : type == "arrow" ? lineMat(color).ARROW : lineMat(color).SOLID;
        let width = type == "arrow" ? 20 : 5;
        return viewer.entities.add({
            name,
            id,
            type: "line",
            description,
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray(posArray),
                material,
                width,
                clampToGround: true
            }
        })
    }

    function updateLineEntity(name, description, posArray, type, color) {
        currentEntity.name = name;
        currentEntity.description = description;
        console.log(posArray)
        currentEntity.polyline.positions = Cesium.Cartesian3.fromDegreesArray(posArray)
        //material
        let material = type == "dashed" ? lineMat(color).DASHED : type == "arrow" ? lineMat(color).ARROW : lineMat(color).SOLID;
        let width = type == "arrow" ? 20 : 10;
        currentEntity.polyline.material = material;
        currentEntity.polyline.width = width;
        clearLineArray();
        MODE = modes.NAVIGATE;
    }

    function enableLineEditing() {
        let id = createId("user");
        MODE = modes.LINE;
        entities[id] = createLineEntity(id, "line", "", [], "solid", "#000");
        setCurrentEntity(id)
        document.getElementById("lineFinishPopup").style.display = "block";
    }


    function clearLineArray() { lineArray = []; }

    function lineArrayAdd(posArray) {
        lineArray = lineArray.concat(posArray);
        console.log(getCurrentEntity(), entities)
        getCurrentEntity().polyline.positions = Cesium.Cartesian3.fromDegreesArray(lineArray)
    }

    function getLineArray() {
        return lineArray
    }






    //ENTITY FUNCTIONS
    /**
     * @return {array} array of Entity object literals
     */
    let exportEntities = () => {
        let result = [];
        for (id in entities) {
            result.push(entitied[id].export)
        }
        return result;
    }

    let removeAllEntities = () => {
        for (id in entities) {
            viewer.entities.remove(entities[id])
        }
        entities = {};
        currentEntity = null;
    }

    let removeEntities = (partId) => {
        for (id in entities) {
            if (id.includes(partId)) {
                viewer.entities.remove(entities[id])
                delete entities[id];
            }
        }
        currentEntity = null;
    }


    //sets the currentEntity using the @param id
    function setCurrentEntity(id) {
        console.log(id)
        currentEntity = entities[id];
        //viewer.selectedEntity = currentEntity;
    }

    function addEntity(entity, datasource) {
        let preId = datasource == "qde" ? "qde" : "user";
        let id = createId(preId);
        entity.id = id;
        createMapEntity(entity)


    }

    //sets the currentEntity to null
    function emptyCurrentEntity() {
        currentEntity = null;
    }

    let removeCurrentEntity = () => {
        let curEnt = getCurrentEntity();
        if (curEnt) {
            viewer.entities.remove(curEnt)
            delete entities[curEnt.id];
            emptyCurrentEntity();
            return { error: false, msg: `Entity "${curEnt.id} removed` }
        }
        return { error: true, msg: `Could not delete entity(id): "${id} ` }
    }

    //returns the currentEntity
    function getCurrentEntity() { return currentEntity }

    function getEntities() { return entities }



    //functions to edit the current entity
    function rotEntity(dir) {
        let entity = getCurrentEntity()
        if (entity.type == "line") {
            Swal.fire({
                title: "Edit Tools",
                text: "Can only use \"Edit Info\" tool on Line"
            });
        } else if (entity && entity.id.includes("user")) {
            //let hpr = currentEntity.hpr;
            let rot = currentEntity.export.rotation;
            rot = dir == "left" ? rot + 0.2 : rot - 0.2;
            //currentEntity.hpr = hpr;
            if (entity.export.type == "billboard") {
                entity.billboard.rotation = rot;
            } else if (entity.export.type == "rectangle") {
                entity.rectangle.rotation = rot;
                entity.rectangle.stRotation = rot;
            } else if (entity.export.type == "task") {

            }
            entity.export.rotation = rot;
            console.log(rot)
        }
    }

    let scaleRect = (entity) => {
        let { scale, positions } = entity.export;
        entity.rectangle.coordinates = createRectFromPt(positions[0], scale)
    }

    let createRectFromPt = (pos, scale) => {
        let dif = scale ? 0.0003 * scale : .003;
        return Cesium.Rectangle.fromDegrees(
            pos.lon - dif,
            pos.lat - dif,
            pos.lon + dif,
            pos.lat + dif
        )
    }

    //exmaple entities
    /* 
        let bluefor = {
            id: "let1",
            name: "Bluefor",
            description: ["3 x pers", "4x donkeys"],
            type: "symbol",
            subType: null,
            color: null,
            label: null,
            image: "./media/mil/abf.png",
            positions: [{ lat: -32.9818627, lon: 137.639168 }],
            rotation: 0
        }
    
        let lineline = {
            id: "let2",
            name: "Line",
            description: ["MV to Fac", "4x donkeys"],
            type: "line",
            subType: "arrow",
            color: "#443344",
            label: null,
            image: null,
            positions: [{ lat: -32.9818627, lon: 137.639168 }, { lat: -32.9818627, lon: 137.578 }],
            rotation: 0
        }
    
     */
    //EXPERIMENTAL
    let createLabel = (text) => {
        if (text)
            return {
                text,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(50, -40)
            }
    }


    let createMapSymbol = async (position, url, name, type) => {
        let id = map.createId("user")
        let description = "";
        let { data, cancel } = await editEntityDetails(name);
        if (cancel) { return { error: true, data: null }}
        console.log(cancel)
        name = data.value[0] != "" ? data.value[0] : name;
        description = data.value[1] != "" ? data.value[1] : description;
        let entity = { id, name, description: [description], type, subType: null, image: url, positions: [{ lon: position.lon, lat: position.lat }], rotation: 0, scale: 3, label: data.value[2] }
        return { error: false, data: createMapEntity(entity) }
    }

    let createMapEntity = (item) => {
        let entity = {}
        console.log(item.type)
        switch (item.type) {
            case "line":
                let { material, width } = createPolyLineMat(item.subType, item.color);
                let posArray = [];
                item.positions.forEach(loc => {
                    posArray.push(loc.lon);
                    posArray.push(loc.lat);
                })
                entity.polyline = {
                    material,
                    width,
                    positions: Cesium.Cartesian3.fromDegreesArray(posArray),
                    clampToGround: true
                }
                break;
            case "task":
                {
                    let dim = item.scale ? 50 * item.scale : 200;
                    console.log(item)
                    entity.box = {
                        material: new Cesium.ImageMaterialProperty({ image: item.image, transparent: true }),
                        dimensions: new Cesium.Cartesian3(dim, dim, 0.006),
                    }
                }
                break;
            case "rectangle":
                entity.rectangle = {
                    material: new Cesium.ImageMaterialProperty({ image: item.image, transparent: true }),
                    coordinates: createRectFromPt(item.positions[0], item.scale),
                    rotation: item.rotation,
                    stRotation: item.rotation,
                    classificationType: Cesium.ClassificationType.TERRAIN,
                }
                break;
            case "billboard":
                entity.billboard = {
                    image: item.image,
                    sizeInMeters: true,
                    height: 40,
                    width: 40,
                    scale: item.scale ? item.scale : 6,
                    rotation: item.rotation
                    //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
                break;
        };
        if ("x" in item.positions[0]) {
            entity.position = item.positions[0]
        } else {
            entity.position = Cesium.Cartesian3.fromDegrees(item.positions[0].lon, item.positions[0].lat);
        }
        entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(
            entity.position,
            new Cesium.HeadingPitchRoll(item.rotation, 0, 0)
        )
       /*  entity.model = {
            uri: `../media/aslav.glb`,
            scale: 1,
            //minimumPixelSize: 64,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 500)
        }, */
            console.log(entity.model)
        entity.label = item.label ? createLabel(item.name) : null;
        entity.export = item;
        entity.name = item.name;
        entity.id = item.id;
        entity.description = descriptionArray(item.description)
        entities[entity.id] = viewer.entities.add(entity)
        setCurrentEntity(entity.id)
        viewer.selectedEntity = currentEntity;
        createEntitySelector();
        return entities[entity.id]
    }

    //entities[bluefor.id] = createMapEntity(bluefor)
    //entities[lineline.id] = createMapEntity(lineline)
    //viewer.selectedEntity = entities[bluefor.id]

    //map click listener

    handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction(function (click) {
        var cartesian = viewer.camera.pickEllipsoid(click.position, scene.globe.ellipsoid)
        let latLonRads = Cesium.Cartographic.fromCartesian(cartesian);
        let lon = Cesium.Math.toDegrees(latLonRads.longitude);
        let lat = Cesium.Math.toDegrees(latLonRads.latitude);
        if (getMode() != modes.LINE) {
            var pickedObject = scene.pick(click.position);
            if (Cesium.defined(pickedObject)) {
                console.log(pickedObject)
                setCurrentEntity(pickedObject.id._id);
                openMapMenu("itemsEdit")
            } else {
                emptyCurrentEntity();
                openMapMenu("mapItems")
            }
        }

        let output = convertCoords({ lat, lon, precision: 5 }, getProj());
        displayCoords(output.display)
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction((up) => {

    }, Cesium.ScreenSpaceEventType.LEFT_UP)

    return {
        scaleRect,
        createId,
        addMapImg,
        createLineEntity,
        getEntities,
        setCurrentEntity,
        getCurrentEntity,
        emptyCurrentEntity,
        createRectFromPt,
        createMapEntity,
        createMapSymbol,
        createLabel,
        addEntity,
        removeCurrentEntity,
        removeAllEntities,
        removeEntities,
        rotEntity,
        lineArrayAdd,
        getLineArray,
        clearLineArray,
        enableLineEditing,
        updateLineEntity,
        setMode,
        getMode,
        convertCoords,
        modes,
        proj,
        measure,
        setProj,
        getProj
        //distanceAndAngle
    }
}

//map object with entity manipulation
let map = Map(viewer);

//ALL THE EVENT LISTENERS
//CESIUM MAP DIV EVENT LISTENERS
//mouse listeners
cesiumMap.addEventListener("mouseup", function (evt) { });
cesiumMap.addEventListener("mouseover", function (evt) { });
cesiumMap.addEventListener("mouseout", function (evt) { });
cesiumMap.addEventListener("mousemove", function (evt) { });
cesiumMap.addEventListener("click", function (evt) {
    if (evt.touches) {
        console.log("Touches")
        return;
    }
    switch (map.getMode()) {
        case map.modes.LINE:
            var ellipsoid = viewer.scene.globe.ellipsoid;
            var position = viewer.camera.pickEllipsoid(new Cesium.Cartesian3(evt.clientX, evt.clientY - 30), ellipsoid);
            var pos = ellipsoid.cartesianToCartographic(position);
            map.lineArrayAdd([Cesium.Math.toDegrees(pos.longitude), Cesium.Math.toDegrees(pos.latitude)]);
            return
        case map.modes.ADD:
            dragDrop(evt, selectedIcon.url, selectedIcon.name);
            map.setMode(map.modes.NAVIGATE)
            return
        case map.modes.MEASURE:
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
        case map.modes.ADD:
            dragDropTouch(evt, selectedIcon.url, selectedIcon.name, selectedIcon.type);
            map.setMode(map.modes.NAVIGATE)
            break;
        /* case map.modes.MEASURE:
            let pos = screenXYtoLatLon(evt.touches[0].clientX, evt.touches[0].clientY, viewer)
            map.measure.mapClick(pos);
            break; */
    }
    //startDragOffset.x = evt.touches[0].clientX - translatePos.x;
}, { passive: true });

cesiumMap.addEventListener("touchend", function (evt) { });
cesiumMap.addEventListener("touchmove", function (evt) { });

//listen for touch start on mapMenuIcons
//touch screen dragDrop functionality
let menuIcons = document.querySelectorAll(".dragImg");
let selectedIcon = { url: "", name: "Map Icon", type: "billboard" }
menuIcons.forEach(icon => {
    icon.addEventListener("touchstart", function (evt) {
        console.log("adding item to map")
        map.setMode(map.modes.ADD);
        selectedIcon.name = icon.getAttribute("alt");
        selectedIcon.type = icon.getAttribute("type");
        selectedIcon.url = icon.src
        mobileAddItem = true;
        rl = icon.src
    })
})

function dragStart(evt) {
    evt
        .dataTransfer
        .setData("text/plain", JSON.stringify({ url: evt.target.src, name: evt.toElement.alt, type: evt.target.getAttribute("type") }))
}

function finishLine() {
    document.getElementById("lineFinishPopup").style.display = "none";
    map.setMode(map.modes.NAVIGATE);
    createLineMenu("Line", "", map.getLineArray());
}


//functions to edit the current entity
function rotEntity(dir) {
    let entity = map.getCurrentEntity()
    if (entity.type == "line") {
        Swal.fire({
            title: "Edit Tools",/*  */
            text: "Can only use \"Edit Info\" tool on Line"
        });
    } else if (entity && entity.id.includes("user")) {
        //let hpr = map.getCurrentEntity().hpr;
        //let rot = map.getCurrentEntity().billboard.rotation;
        let rot = entity.export.rotation
        rot = dir == "left" ? rot + 0.2 : rot - 0.2;
        //map.getCurrentEntity().hpr = hpr;
        entity.export.rotation = rot;
        entity.billboard.rotation = rot;
    }
}


//functions to edit the current entity
function translateEntity(dir) {
    let entity = map.getCurrentEntity()
    if (entity.type == "line") {
        Swal.fire({
            title: "Edit Tools",
            text: "Can only use \"Edit Info\" tool on Line"
        });
    } else if (entity && entity.id.includes("user")) {

        let ellipsoid = viewer.scene.globe.ellipsoid;
        let { lat, lon } = entity.export.positions[0];

        //uses dir input to change lat or lon position
        lat = dir == "up" ? lat += 0.0005 : dir == "down" ? lat -= 0.0005 : lat;
        lon = dir == "right" ? lon += 0.0005 : dir == "left" ? lon -= 0.0005 : lon;
        if (entity.export.type == "rectangle") {
            entity.rectangle.coordinates = map.createRectFromPt({ lat, lon }, entity.export.scale);
        } else {
            entity.position = Cesium.Cartesian3.fromDegrees(lon, lat, 0, ellipsoid);
        }
        entity.export.positions = [{ lon, lat }];
    }
}

//functions to edit the current entity
function scaleEntity(size) {
    let entity = map.getCurrentEntity()
    if (entity.type == "line") {
        Swal.fire({
            title: "Edit Tools",
            text: "Can only use \"Edit Info\" tool on Line"
        });
    } else if (entity && entity.id.includes("user")) {
        let scale = entity.export.scale;
        scale = size == "up" ? scale *= 1.05 : scale *= 0.95;
        entity.export.scale = scale

        switch (entity.export.type) {
            case "task":
                let dim = 50 * scale
                entity.box.dimensions = new Cesium.Cartesian3(dim, dim, .0006);
                break;
            case "billboard":
                entity.billboard.scale = scale;
            case "rectangle":
                map.scaleRect(entity)
        }

    }
}

//deletes the currently selected entity
function removeEntity() {
    let entity = map.getCurrentEntity()
    if (entity) {
        if (entity.id.includes("user")) { //only removes entities with "user" string in id
            map.removeCurrentEntity()
            openMapMenu("mapItems")
            createEntitySelector();
        }

    }
}


async function editEntityInfo() {
    let entity = map.getCurrentEntity()
    if (entity) {
        let { name, description } = map.getCurrentEntity();
        let { data, cancel } = await editEntityDetails(name, description._value);
        if (cancel) {
            return { error: true, data: null }
        }
        entity.name = data.value[0];
        entity.description = data.value[1];
        entity.label = data.value[2] ? map.createLabel(entity.name) : "";
        return { error: false, data: null }
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



