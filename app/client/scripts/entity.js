
/**
 * MapEntity for entities in the Map object.
 * @param {Map} map Map object used to create Cesium map
 */
function MapEntities(map) {
    let layers = {};
    let currentLayer = null;                // id of layer currently editing
    let currentEntity = null;               //id of entity currently editing
    let viewer = map.getViewer().viewer;
    let addIcon = { name: null, url: null, type: null }
    let numEntities = 0;

    //used to store ruler coords temporarily
    let ruler = {
        pt1: null,
        pt2: null
    }

    //list of the entity types created
    const TYPE = {
        LINE: "line",
        SUBTYPE: {
            ARROW: "arrow",
            SOLID: "solid",
            DASHED: "dashed",
            HASH: "hash",
            DOUBLE_HASH: "double_hash",
        },
        RULER: "ruler",
        RECTANGLE: "rectangle",
        TEXT: "text",
        BILLBOARD: "billboard",
        TASK: "task",
        AREA: "area"
    }

    //ENUM for polyline materials
    let LineMat = colour => {
        return {
            DASHED: new Cesium.PolylineDashMaterialProperty({ color: Cesium.Color.fromCssColorString(colour), dashLength: 8 }),
            SOLID: Cesium.Color.fromCssColorString(colour),
            ARROW: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.fromCssColorString(colour))
        }
    }

    /**
     * Creates a stripe material object
     * @param {string} color Colour of the stripeds
     * @param {int} opacity Opacity of the stripes
     * @param {bool} vertical If true creates the stripes vertically (default is horizontal)
     */
    let stripedMaterial = (color, opacity, vertical) => {
        let orientation = vertical ? "VERTICAL" : "HORIZONTAL";
        return new Cesium.StripeMaterialProperty({
            evenColor: Cesium.Color.fromCssColorString(color).withAlpha(0.3),
            oddColor: Cesium.Color.BLUE.withAlpha(0.0),
            repeat: 100,
        })
    }

    /**
     * Creates a stripe material object
     * @param {string} color Color of the stripeds
     * @param {int} opacity Opacity of the stripes
     * @param {bool} vertical If true creates the stripes vertically (default is horizontal)
     */
    let gridMaterial = (color, type) => {
        const thickness = 3;
        const gridThick = type == TYPE.SUBTYPE.DOUBLE_HASH ? thickness : 0;
        return new Cesium.GridMaterialProperty({
            color: Cesium.Color.fromCssColorString(color).withAlpha(0.5),
            lineThickness: new Cesium.Cartesian2(thickness, gridThick),
            lineCount: new Cesium.Cartesian2(25,25)
        })
    }

    let createId = () => {
        let id = `${numEntities}`
        numEntities++;
        return id
    }

    let scaleByDistanceValue = (scale) => {
        //let scaleVal = new Cesium.NearFarScalar(100, (2 / scale), (1000), (.1 * scale))
        let scaleVal = new Cesium.NearFarScalar(50 * scale, 1, 300 * scale * scale, .6)
        return scaleVal;
    }

    let viewByDistanceValue = (scale) => {
        //let scaleVal = new Cesium.NearFarScalar(100, (2 / scale), (1000), (.1 * scale))
        let distance = new Cesium.DistanceDisplayCondition(1, 800 * scale)
        return distance;
    }


    /**
     * Creates a label object for the entity
     * @param {string} text The text being displayed in the label.
     * @param {double} scale This is the entity scale value
     */
    let createLabel = (text, scale, type) => {
        scale = type == TYPE.TEXT ? 100 : scale;
        if (text)
            return {
                text,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                pixelOffset: new Cesium.Cartesian2(40, -10),
                eyeOffset: new Cesium.Cartesian3(0, 0, -5),
                //disableDepthTestDistance: Number.POSITIVE_INFINITY,
                clampToGround: true,
                depthTestAgainstTerrain: false,
                pixelOffsetScaleByDistance: new Cesium.NearFarScalar(10, 3, 1000, .5),
                scaleByDistance: scaleByDistanceValue(scale),
                distanceDisplayCondition: viewByDistanceValue(scale)
            }
    }

    let storeIcon = (name, url, type) => {
        if (map.getMode() == map.MODES.LINE || map.getMode() == map.MODES.RULER) { return };

        addIcon.name = name;
        addIcon.type = type;
        addIcon.url = url
    }

    let loadIcon = () => {
        if (!addIcon.name) { return error }
        return addIcon
    }

    //stores line values and creates
    let Line = (() => {
        let coords = [];
        let name = "Line"
        let type = TYPE.LINE
        let id = null;
        let addPt = (pos) => {
            coords.push(pos)
            if (coords.length == 1) {
                id = addEntity({ name, description: [""], type, subType: TYPE.SUBTYPE.SOLID, positions: coords, label: false, image: null, rotation: 0, scale: 3, color: "#000000" }, "user")
                console.log("adding line" + id)
            } else {
                layers[currentLayer].entities[id].polyline.positions = Cesium.Cartesian3.fromDegreesArray(latLonToArr(coords))
                layers[currentLayer].entities[id].export.positions = coords.map(coord => { return { lat: coord.lat, lon: coord.lon } });
            }
        }

        let clearPts = () => { coords = [] }
        let getPts = () => coords;
        let start = () => {
            emptyCurrent();
            hideMapMenus();
            coords = [];
            map.setMode(map.MODES.LINE);
            document.getElementById("lineFinishPopup").style.display = "block";
        }

        let update = (name, description, type, color, width, showLabel, showPos) => {
            currentEntity.name = name;
            currentEntity.description = description;
            //currentEntity.polyline.positions = Cesium.Cartesian3.fromDegreesArray(posArray);
            currentEntity.polyline.width = width;
            let centerNode = Math.round(currentEntity.polyline.positions._value.length/2)
            currentEntity.position = currentEntity.polyline.positions._value[centerNode-1];
            //save to export key in entity
            currentEntity.export.name = name;
            currentEntity.export.description = description.split("<br>");
            currentEntity.export.color = color;
            currentEntity.export.subType = type;
            //currentEntity.export.positions = posArray;
            currentEntity.export.width = width;
            currentEntity.export.showPos = showPos;
            currentEntity.export.label = showLabel


            //do label and position
            if (currentEntity.export["showPos"]) {
                let { mgrs } = map.getCoord(currentEntity.export.positions[0], map.PROJ.LATLON);
                currentEntity.description = `${description}<br>${mgrs.mgrsString}`;
            } else {
                currentEntity.description = description
            }

            currentEntity.label = currentEntity.export.label ? createLabel(currentEntity.name) : "";
            //material
            let material = type == "dashed" ? LineMat(color).DASHED : type == "arrow" ? LineMat(color).ARROW : LineMat(color).SOLID;
            //let width = type == "arrow" ? 20 : 10;
            currentEntity.polyline.material = material;
            map.setMode(map.MODES.NAVIGATE);
            clearPts();
        }
        let finish = async () => {
            select(id)
            document.getElementById("lineFinishPopup").style.display = "none";
            map.setMode(map.MODES.NAVIGATE);
            let {width, color, positions} = currentEntity.export
            let reply = await createLineMenu("Line", "", TYPE.SUBTYPE.SOLID, color, width, false);
            if(reply.cancel){
                mapEntities.removeCurrent();
            }
        }
        return {
            addPt,
            clearPts,
            getPts,
            start,
            finish,
            update
        }
    })()




    //Ruler object. Create, edit, and store positions
    let Ruler = (() => {
        let pt1 = null;
        let pt2 = null;
        let positions = [];
        let name = "Ruler"
        let type = TYPE.RULER
        let id = null;
        let addPt = (pos) => {
            if (pt1 == null) {
                pt1 = map.getCoord(pos, map.PROJ.LATLON);
                console.log("PT:", pt1)
                positions.push(pt1);
                id = addEntity({ name, description: [""], type, width: 14, subType: TYPE.SUBTYPE.ARROW, positions, label: false, image: null, rotation: 0, scale: 3, color: "#000000" }, "user")
            } else if (pt2 == null) {
                pt2 = map.getCoord(pos, map.PROJ.LATLON);
                positions = [pt1, pt2]
                update();
            } else {
                map.setMode(map.MODES.NAVIGATE);
                clearPts()
            }
            console.log(positions)
        }
        let clearPts = () => {
            pt1 = null;
            pt2 = null;
            positions = [];
        }
        let getPts = () => coords;
        let start = () => {
            emptyCurrent()
            clearPts();
            map.setMode(type);
        }
        let update = () => {
            let vector = distanceAndAngle(pt1, pt2);
            let description;
            if (vector.projCalc == map.PROJ.LATLON) {
                description = `Start Loc: ${pt1.lat}, ${pt1.lon}<br>End Loc: ${pt2.lat}, ${pt2.lon}<br>Distance(m): ${vector.distance}<br>Angle (mils): ${vector.angle.mils}<br>Angle (deg): ${vector.angle.deg}`
            } else {
                description = `Start Loc: ${pt1.mgrs.mgrsString}<br>End Loc: ${pt2.mgrs.mgrsString}<br>Distance(m): ${vector.distance}<br>Angle (mils): ${vector.angle.mils}<br>Angle (deg): ${vector.angle.deg}`
            }
            select(id);
            currentEntity.polyline.positions = Cesium.Cartesian3.fromDegreesArray([pt1.lon, pt1.lat, pt2.lon, pt2.lat])
            currentEntity.description = description;
            currentEntity.export.description = description.split("<br>");
            currentEntity.export.positions = positions;
            map.setMode(map.MODES.EDIT);
            clearPts();
        }
        let finish = () => {
            document.getElementById("lineFinishPopup").style.display = "none";
            map.setMode(map.MODES.NAVIGATE);
            console.log(currentEntity.export.positions)
            createLineMenu("Line", "", latLonToArr(currentEntity.export.positions));
        }
        return {
            addPt,
            clearPts,
            getPts,
            start,
            finish,
            update
        }
    })()



    //stores Area values and creates
    let Area = (() => {
        let coords = [];
        let name = "Area"
        let type = TYPE.AREA
        let id = null;
        let addPt = (pos) => {
            coords.push(pos)
            if (coords.length == 1) {
                id = addEntity({ name, description: [""], type, subType: TYPE.SUBTYPE.HASH, positions: coords, label: false, image: null, rotation: 0, scale: 3, color: "#FF0000" }, "user")
                console.log("adding Area: " + id)
            } else {
                layers[currentLayer].entities[id].polygon.hierarchy = Cesium.Cartesian3.fromDegreesArray(latLonToArr(coords))
                layers[currentLayer].entities[id].export.positions = coords.map(coord => { return { lat: coord.lat, lon: coord.lon } });
            }
        }

        let clearPts = () => { coords = [] }
        let getPts = () => coords;
        let start = () => {
            emptyCurrent();
            hideMapMenus();
            coords = [];
            map.setMode(map.MODES.AREA);
            document.getElementById("areaFinishPopup").style.display = "block";
        }

        let update = (name, description, type, color, showLabel, showPos) => {
            currentEntity.name = name;
            currentEntity.description = description;
            currentEntity.position = centerOfEntity(currentEntity)
            //save to export key in entity
            currentEntity.export.name = name;
            currentEntity.export.description = description.split("<br>");
            currentEntity.export.color = color;
            currentEntity.export.subType = type;
            currentEntity.export.showPos = showPos;
            currentEntity.export.label = showLabel

            //do label and position
            if (currentEntity.export["showPos"]) {
                console.log(currentEntity.export)
                let { mgrs } = map.getCoord(currentEntity.export.positions[0], map.PROJ.LATLON);
                console.log("mgrs: ", mgrs)
                currentEntity.description = `${description}<br>${mgrs.mgrsString}`;
            } else {
                currentEntity.description = description
            }

            currentEntity.label = currentEntity.export.label ? createLabel(currentEntity.name) : "";

            //material
            //let material = type == "hash" ? stripedMaterial(color, .5) : gridMaterial(color, 0.5);
            let material = gridMaterial(color, type);
            currentEntity.polygon.material = material;
            map.setMode(map.MODES.NAVIGATE);
            clearPts();
        }
        let finish = async () => {
            select(id)
            document.getElementById("areaFinishPopup").style.display = "none";
            map.setMode(map.MODES.NAVIGATE);
            let reply = await createAreaMenu("Area", "", TYPE.SUBTYPE.HASH, "#FF0000", false);
            console.log(reply)
            if(reply.cancel){
                mapEntities.removeCurrent();
            }
        }
        return {
            addPt,
            clearPts,
            getPts,
            start,
            finish,
            update
        }
    })()





    /**
     * This creates a menu for the user to select the required laye.
     * @param {layers} layers Layers object from TEWT
     */
    async function layerMenuSelect() {
        let editList = '';
        let viewList = '';
        let cancel = false;

        for (layer in layers) {
            let checked = ''; //for if layer is editable
            let checkedView = '';
            if (layer == currentLayer) { checked = 'checked' }
            if (layers[layer].show) { checkedView = "checked" }
            editList += `<input style="margin: 0 8px 8px 8px" type="radio" id="${layer}_edit" name="edit" ${checked} value="${layer}"><label for="${layer}_edit">${layers[layer].title}</label><br>`
            viewList += `<input style="margin: 0 8px 8px 8px" type="checkbox" id="${layer}_view" name="viewLayersInput" ${checkedView} value="${layer}"><label for="${layer}_view">${layers[layer].title}</label><br>`
        }

        let data = await Swal.fire({
            title: 'Layers',
            html:
                '<div style="display: inline-block; width: calc(50% - 2px); border-right: 2px solid black; text-align: center">' +
                '<h3>EDIT</h3>' +
                '<form style="text-align: left" id="editLayerOption">' +
                editList +
                '</form>' +
                '</div>' +
                '<div style="display: inline-block; width: 50%"; text-align: center>' +
                '<h3>VIEW</h3>' +
                '<form style="text-align: left" id="viewLayerOption">' +
                viewList +
                '</form>' +
                '</div>',
            showCancelButton: true,
            preConfirm: () => {
                let layersSelected = [];
                let viewLayers = document.getElementsByName("viewLayersInput");
                viewLayers.forEach(option => {
                    if (option.checked) {
                        showLayer(option.value, true);
                    } else {
                        showLayer(option.value, false);
                    }
                })
                return {
                    edit: document.getElementById("editLayerOption").edit.value,
                    view: layersSelected
                }
            }
        })
        if ("dismiss" in data) {
            cancel = true;
        }
        return { data: data.value, cancel };
    }




    /**
     * Adds layers of entities to layers object. 
     * @param {Object} inputLayers {<x>: {name, entities:[]}, <y>: {name, entitites:[]}} 
     * @param {string} group This will be the group the all entities in these layers belongs to - "system", "user"
     */
    function addLayers(inputLayers, group) {
        console.log("Groups: "+group)
        let count = 0
        for (layerKey in inputLayers) {
            let show = inputLayers[layerKey].show ? inputLayers[layerKey].show : false
            if (count == 0) {
                currentLayer = layerKey;
                show = true;
            }
            count++
            layers[layerKey] = { title: inputLayers[layerKey].name, show, entities: {} };
            if (!inputLayers[layerKey].entities) continue;
            inputLayers[layerKey].entities.forEach(entity => {
                addEntity(entity, group ? group : "", layerKey);
            })
            viewLayers();

        }
    }

    function showLayer(layerId, showVal) {
        if (!layers[layerId]) return;
        layers[layerId].show = showVal;
        for (id in layers[layerId].entities) {
            viewer.entities.getById(id).show = showVal;
        }
    }

    async function editLayers() {
        let layerOptions = await layerMenuSelect()
        if (layerOptions.cancel) return;
        currentLayer = layerOptions.data.edit;
        showLayer(currentLayer, true);
        createEntitySelector()
        viewLayers();
        if (!layerOptions.data.view) return
    }

    let getLayers = _ => layers;

    let getCurrentLayer = _ => currentLayer;

    
    function viewLayers() {
        let layerBtn = document.getElementById("layerSelectBtn");
        layerBtn.innerHTML = `LAYERS - ${layers[currentLayer].title}`
        for (id in layers) {
            if (layers[id].show) {
                showLayer(id, true);
            } else {
                showLayer(id, false);
            }
        }
    }


    let scaleRect = (entity) => {
        let { scale, positions } = entity.export;
        entity.rectangle.coordinates = createRectFromPt(positions[0], scale)
    }


    /**
     * Uses a lat lon pt and scale to create a rectangle
     * @param {lat, lon} pos positions used to calculate the rectangle bounds
     * @param {float} scale value to scale the rectangle by
     */
    let createRectFromPt = (pos, scale) => {
        let dif = scale ? 0.0003 * scale : .0003;
        return Cesium.Rectangle.fromDegrees(
            pos.lon - dif,
            pos.lat - dif,
            pos.lon + dif,
            pos.lat + dif
        )
    }


    //positions => [{lat,lon}, {lat,lon}..]
    let latLonToArr = (positions) => {
        let result = []
        if (positions.lat) { return [positions.lon, positions.lat] }
        positions.forEach(pos => {
            result.push(pos.lon);
            result.push(pos.lat)
        })
        return result
    }

    let descriptionArray = (description) => {
        let desc = "";
        description.forEach((line, i) => {
            desc += line;
            if (i < description.length - 1) {
                desc += "<br>"
            }
        })

        return desc;
    }

    let centerOfEntity = (entity)=>{
        if(entity.polygon){
            let center = Cesium.BoundingSphere.fromPoints(entity.polygon.hierarchy.getValue().positions).center;
            return new Cesium.ConstantPositionProperty(center);
        }
        
    }

    /**
     * Creates an Entity object literal
     * Passed to add function to add entity to map, and passed to export key
     * 
     * @param {lat, lon} position is an object literal that contains a lat and lon
     * @param {string} url  a url to an image file
     * @param {string} name name of the entity
     * @param {string} type value from TYPE enum. Defines the type of entity for the map
     * @param {float} rotation rotation in radians
     */
    async function create(position, url, name, type, rotation) {
        let reply;
        if (type == TYPE.TEXT) {
            reply = await editTextEntityDetails(name, "");
         } else {
            reply = await editEntityDetails(name, "", false, false);
         }
         let {data, cancel} = reply;
        
        if (cancel) {
            return { error: true, data: null }
        }
        name = data.value.name != "" ? data.value.name : name;
        let description = data.value.description != "" ? data.value.description.split("<br>") : [""];
        let scale = viewer.camera._positionCartographic.height/1500;
        let entity = { name, group: "user", description, type, subType: null, image: url, positions: [{ lat: position.lat, lon: position.lon }], rotation, scale, label: data.value.label, showPos: data.value.showPos }
        let entityId = addEntity(entity, "user");
        viewLayers()
        select(entityId);
        return { error: false, data: entityId }
    }


    /**
     * Adds entity object to viewer.entities
     * Creates new key = item.id for entities object e.g entities[item.id] = {}
     * @param {object} item {id, type, subType, name, image, description, positions, imgUrl, orientation, scale, label}
     * @param {string} id_prefix A prefix string for the entity being created
     * @param {string} layerId The key value of the layer in the entities object, that the entity is added to.
     * @return {any} 
     */
    function addEntity(item, group, layerId) {
        let entity = {};
        layerId = layerId ? layerId : currentLayer
        entity.id = createId();
        //if group has value use it, else if the item has group use it, else use "system"
        item.group = group ? group : item.group ? item.group : "system";
        item.id = entity.id;
        switch (item.type) {
            case TYPE.RECTANGLE:
                item.type = TYPE.RECTANGLE; //force billboard types to become rectangle types
                entity.rectangle = {
                    material: new Cesium.ImageMaterialProperty({ image: item.image, transparent: true }),
                    coordinates: createRectFromPt(item.positions[0], item.scale),
                    rotation: item.rotation,
                    stRotation: item.rotation,
                    height: 0.5,
                    clampToGround: true,
                    zIndex: 1000,
                }
                break;
            case TYPE.BILLBOARD:
                item.type = TYPE.BILLBOARD; //force billboard types to become rectangle types
                item.scale = 0.1;
                entity.billboard = {
                    image: item.image,
                    //height: 100,
                    scale: item.scale,
                    pixelOffset: new Cesium.Cartesian2(0, 0),
                    //sizeInMeters: true
                    //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    //heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                }
                break;
            case TYPE.LINE:
            case TYPE.RULER:
                {
                    let material = item.subType == "dashed" ? LineMat(item.color).DASHED : item.subType == "arrow" ? LineMat(item.color).ARROW : LineMat(item.color).SOLID;
                    let width = item.width ? item.width : 5;
                    width = item.type == TYPE.RULER ? 10 : width;
                    item.width = width;
                    let positions = item.positions ? latLonToArr(item.positions) : null;
                    entity.polyline = {
                        positions: Cesium.Cartesian3.fromDegreesArray(latLonToArr(item.positions)),
                        material,
                        width,
                        height: 0.8,
                        zIndex: 3,
                        clampToGround: true
                    }
                    entity.polyline.positions = item.positions ? Cesium.Cartesian3.fromDegreesArray(positions) : null
                }
                break;
            case TYPE.AREA:
                let material = gridMaterial(item.color, item.subType);
                item.type = TYPE.AREA;
                entity.polygon = {
                    hierarchy: Cesium.Cartesian3.fromDegreesArray(latLonToArr(item.positions)),
                    material,
                    stRotation: Cesium.Math.toRadians(45),
                    height: 0.2,
                    outline: true,
                    outlineWidth: 2,
                    zIndex: 0,
                }
                //entity.polygon.hierarchy = item.positions ? Cesium.Cartesian3.fromDegreesArray(positions) : null
                break;
            case TYPE.TEXT:
                item.label = true
                break;
            default:
                return { error: true, data: null }
        }
        entity.name = item.name;
        //entity.parent = entities[layerId]; //this links the entity to the layer
        entity.label = item.label ? createLabel(item.name, item.scale, item.type) : null;
        entity.layer = layerId
        entity.position = Cesium.Cartesian3.fromDegrees(item.positions[0].lon, item.positions[0].lat);
        entity.export = item;
        if (item["showPos"]) {
            let pos = map.getCoord(item.positions[0], map.PROJ.LATLON)
            entity.description = descriptionArray([...item.description, pos.mgrs.mgrsString]);
        } else {
            entity.description = descriptionArray(item.description);
        }
        layers[layerId].entities[entity.id] = viewer.entities.add(entity);
        createEntitySelector();
        return entity.id;
    }

    //ENTITY GETTERS AND SETTERS
    /**
     * Deletes the entity with id value.
     * Removes from viewer entities, and entities obj
     * @param {string} id id of entity
     */
    let remove = id => {
        let entity = viewer.entities.getById(id);
        if (!entity) return
        viewer.entities.removeById(id)
        delete layers[entity.layer].entities[entity.id]
        createEntitySelector();
    }

    let removeEntities = () => {
        viewer.entities.removeAll()
        layers = {};
        currentEntity = null;
    }

    let getAll = () => { return viewer.entities }

    let getAllFromCurrentLayer = _ => layers[currentLayer].entities

    let getCurrent = () => {
        let result = currentEntity ? currentEntity : { error: true, msg: "No entity selected" }
        return result;
    }

    let select = (id) => {
        if (!viewer.entities.getById(id)) return;
        setCurrent(id)
        viewer.selectedEntity = viewer.entities.getById(id);
        openMapMenu("itemsEdit");
    }

    let entityExists = (entityId) => {
        let entity = viewer.entities.getById(entityId)
        if (entity) {
            return { valid: true, entity };
        } else {
            return { valid: false, entity: null };
        }
    }

    let changeEntityLayer = (entityId, layerId) => {
        if (!entityExists(entityId).valid) return;
        if (!layerId || !layers[layerId]) return;
        let entity = viewer.entities.getById(entityId);
        layers[layerId].entities[entity.id] = entity;
        delete layers[entity.layer].entities[entity.id]
    }

    let setCurrent = id => {
        if (!viewer.entities.getById(id)) { return { error: true, msg: "No entity with that id" } }
        currentEntity = viewer.entities.getById(id);
        return currentEntity;
    }

    let removeCurrent = () => {
        let curEnt = getCurrent();
        if (!(curEnt.export.group == "user")) { return }
        if (!curEnt) { return { error: true, msg: `Could not delete entity(id): "${id} ` } }
        remove(curEnt.id)
        emptyCurrent();
        openMapMenu("mapItems")
        return { error: false, msg: `Entity "${curEnt.id} removed` }
    }

    let emptyCurrent = () => {
        currentEntity = null;
    }

    let exportAll = () => {
        let entitiesExport = {}
        for (l in layers) {
            let layer = layers[l];
            entitiesExport[l] = { name: layer.title, show: layer.show, entities: [] };
            for (entId in layer.entities) {
                entitiesExport[l].entities.push(layer.entities[entId].export)
            }
        }
        return entitiesExport;
    }

    let saveEntitiesToStorage = ()=>{
        if(!current.tewt) return;
        current.entities = exportAll();
        saveTewt();
    }

    /**
     * 
     * @param {string} layerId the id of the layer to export
     * @param {bool} array if array is true, it will export all the entities of the layer as an array of entities
     */
    let exportLayer = (array, layerId) => {
        layerId = layerId ? layerId : currentLayer;
        if (!layers[layerId]) return;
        if (!array) {
            let entObj = {};
            for (id in layers[layerId].entities) {
                entObj[id] = layers[layerId].entities[id].export;
            }
            return entObj
        }
        let entArray = [];
        for (entId in layers[layerId].entities) {
            entArray.push(layers[layerId].entities[entId].export);
        }
        return entArray;

    }


    //ENTITY SCALE, TRANSLATE AND ROTATE FUNCTIONALITY

    let scale = (size) => {
        if (currentEntity.type == TYPE.LINE) {
            Swal.fire({ title: "Edit Tools", text: "Can only use \"Edit Info\" tool on Line" });
        } else if (currentEntity && currentEntity.export.group == "user") {
            let scale = currentEntity.export.scale;
            scale = size == "up" ? scale *= 1.05 : scale *= 0.95;
            currentEntity.export.scale = scale

            switch (currentEntity.export.type) {
                case "task":
                    let dim = 50 * scale
                    currentEntity.box.dimensions = new Cesium.Cartesian3(dim, dim, .0006);
                    break;
                case TYPE.BILLBOARD:
                    currentEntity.billboard.scale = scale;
                    break
                case TYPE.RECTANGLE:
                    scaleRect(currentEntity)
                    break;
                case TYPE.TEXT:
                    break;
                default:
                    break;
            }
            if (currentEntity.label) {
                currentEntity.label.scaleByDistance = scaleByDistanceValue(scale);
                currentEntity.label.distanceDisplayCondition = viewByDistanceValue(scale)
            }
        }
        return
    }

    let rotate = (dir) => {
        if (currentEntity.type == "line") {
            Swal.fire({ title: "Edit Tools", text: "Can only use \"Edit Info\" tool on Line" });
        } else if (currentEntity && currentEntity.export.group == "user") {
            //let hpr = currentEntity.hpr;
            let rot = currentEntity.export.rotation;
            rot = dir == "left" ? rot + 0.1 : rot - 0.1;
            //currentEntity.hpr = hpr;
            if (currentEntity.export.type == "billboard") {
                currentEntity.billboard.rotation = rot;
            } else if (currentEntity.export.type == "rectangle") {
                currentEntity.rectangle.rotation = rot;
                currentEntity.rectangle.stRotation = rot;
            } else if (currentEntity.export.type == "task") {

            }
            currentEntity.export.rotation = rot;
        }
    }


    let translate = (dir) => {
        if (currentEntity.export.type == "line") {
            Swal.fire({
                title: "Edit Tools",
                text: "Can only use \"Edit Info\" tool on Line"
            });
        } else if (currentEntity && currentEntity.export.group == "user") {

            let ellipsoid = viewer.scene.globe.ellipsoid;
            let { lat, lon } = currentEntity.export.positions[0];

            //uses dir input to change lat or lon position
            lat = dir == "up" ? lat += (0.00005 * currentEntity.export.scale) : dir == "down" ? lat -= (0.00005 * currentEntity.export.scale) : lat;
            lon = dir == "right" ? lon += (0.00005 * currentEntity.export.scale) : dir == "left" ? lon -= (0.00005 * currentEntity.export.scale) : lon;
            if (currentEntity.export.type == "rectangle") {
                currentEntity.position = Cesium.Cartesian3.fromDegrees(lon, lat);
                currentEntity.rectangle.coordinates = createRectFromPt({ lat, lon }, currentEntity.export.scale);
            } else {
                currentEntity.position = Cesium.Cartesian3.fromDegrees(lon, lat, 0, ellipsoid);
            }
            let coord = map.getCoord({ lat, lon }, map.PROJ.LATLON);
            if (currentEntity.export["showPos"]) {
                currentEntity.description = descriptionArray([...currentEntity.export.description, coord.mgrs.mgrsString])
            }
            currentEntity.export.positions = [{ lat, lon }];
        }
    }

    async function createEntityMenu(name, description, showLabel, showPos){
        console.log(description)
        let { data, cancel } = await editEntityDetails(name, descriptionArray(description), showLabel, showPos);
        if (cancel) {
            return { error: true, data: null }
        }
        currentEntity.export.showPos = data.value.showPos ? true : false;
        currentEntity.export.description = data.value.description.split("<br>");
        if (currentEntity.export["showPos"]) {
            let { mgrs } = map.getCoord(currentEntity.export.positions[0], map.PROJ.LATLON);
            currentEntity.description = `${data.value.description}<br>${mgrs.mgrsString}`;
        } else {
            currentEntity.description = data.value.description
        }
        //entity.name = data.value[0];
        currentEntity.export.name = data.value.name; //this is the export object used for results
        currentEntity.name = data.value.name //this is the values used by cesium
        currentEntity.label = data.value.label ? createLabel(currentEntity.name) : "";
        currentEntity.export.label = data.value.label ? true : false
        createEntitySelector();
        return { error: false, data: null }
    }

    async function createTextEntityMenu(name, description){
        console.log("Text: ",description)
        let { data, cancel } = await editTextEntityDetails(name, description)
        console.log(data, cancel)
        if (cancel) {
            return { error: true, data: null }
        }
        currentEntity.export.showPos = data.value.showPos ? true : false;
        currentEntity.export.description = data.value.description.split("<br>");
        if (currentEntity.export["showPos"]) {
            let { mgrs } = map.getCoord(currentEntity.export.positions[0], map.PROJ.LATLON);
            currentEntity.description = `${data.value.description}<br>${mgrs.mgrsString}`;
        } else {
            currentEntity.description = data.value.description
        }
        //entity.name = data.value[0];
        currentEntity.export.name = data.value.name; //this is the export object used for results
        currentEntity.name = data.value.name //this is the values used by cesium
        currentEntity.label = data.value.label ? createLabel(currentEntity.name) : "";
        createEntitySelector();
        return { error: false, data: null }
    }


    function editInfo() {
        let entity = currentEntity;
        if (!entity) return;
        if (!(entity.export.group == "user")) { return }
        let {name, description, subType, color, positions, label, showPos} = entity.export;
        switch(entity.export.type){
            case TYPE.LINE:
                let {width} = entity.export;
                createLineMenu(name, description, subType, color, width, label)
                break;
            case TYPE.RECTANGLE:
            case TYPE.BILLBOARD:
                createEntityMenu(name, description, label, showPos)
                break;
            case TYPE.AREA:
                createAreaMenu(name, description, subType, color, label)
                break;
            case TYPE.TEXT:
                createTextEntityMenu(name, description);
                break;
        }
    }


    async function editLine() {

    }

    //variable to store mapEntities interval method
    let entityInterval;

    //saves the entities on the map every x seconds
    function startInterval(){
        entityInterval = setInterval(()=>{
            saveEntitiesToStorage();
        }, 20000)
    }

    function stopInterval(){
        clearInterval(entityInterval);
    }

    

    return {
        TYPE,
        Line,
        Ruler,
        Area,
        addIcon,
        loadIcon,
        storeIcon,
        editLayers,
        addLayers,
        getLayers,
        getCurrentLayer,
        exportLayer,
        create,
        addEntity,
        remove,
        removeCurrent,
        removeEntities,
        saveEntitiesToStorage,
        getAll,
        getAllFromCurrentLayer,
        exportAll,
        getCurrent,
        setCurrent,
        select,
        emptyCurrent,
        rotate,
        translate,
        scale,
        editInfo,
        startInterval,
        stopInterval
    }
}



//example entity objects
/* let bluefor = {
    id: "let1",
    name:"Bluefor",
    desciption: ["3 x pers", "4x donkeys"],
    type: "symbol",
    subType: null,
    color: null,
    label: null,
    image: "./mil/abf.png",
    position: [{lat: -32.5, lon: 137.564}],
    rotation: 0
}

let lineline = {
    id: "let2",
    name:"Line",
    desciption: ["MV to Fac", "4x donkeys"],
    type: "line",
    subType: "arrow",
    color: "#443344",
    label: null,
    image: null,
    position: [{lat: -32.5, lon: 137.564}, {lat: -32.6, lon: 137.578}],
    rotation: 0
} */





//pass in a name string, and returns array
//@param
async function createLineMenu(name, description, subType, color, width, showLabel) {
    description = description ? description : "";
    let cancel = false;
    let data = await Swal.fire({
        onOpen: () => Swal.getConfirmButton().focus(),
        title: 'Edit Line',
        allowOutsideClick: false,
        html:
            '<h4>Line Name:</h4>' +
            `<input autocomplete="off" placeholder="<Name Of Line>" id="line-input-name" value="${name}" class="swal2-input">` +
            '<h4>Description:</h4>' +
            `<input placeholder="<Use commas, to make a list>" autocomplete="off" value="${description}" id="line-input-description" class="swal2-input">` +
            `<select type="autocomplete="off" placeholder="<Name Of Line>" id="line-input-type" value="${subType}" class="swal2-input">` +
            `<option ${subType == "solid" ? "selected" : ""} value="solid">SOLID</option>`+
            `<option ${subType == "dashed" ? "selected" : ""} value="dashed">DASHED</option>`+
            `<option ${subType == "arrow" ? "selected" : ""} value="arrow">ARROW</option></select>` +
            `<input type="color" class="swal2-input" id="line-input-color" value="${color || "#000000"}">` +
            `<h4>Line Width</h4><input type="number" class="swal2-input" id="line-input-width" value=${width || 5}><br>`+
            `<span>Label: <input type="checkbox" ${showLabel ? "checked" : ""} id="showLabel"/>`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            return {
                name: document.getElementById('line-input-name').value,
                description: document.getElementById('line-input-description').value,
                type: document.getElementById('line-input-type').value,
                color: document.getElementById('line-input-color').value,
                width: document.getElementById('line-input-width').value,
                showLabel: document.getElementById("showLabel").value,
                showLabel: document.getElementById("showLabel").checked
            }
        }
    })
    if ("dismiss" in data) {
        cancel = true;
    } else {
        let {name, description, type, color, width, showLabel} = data.value;
        description = description.replace(/,/g, "<br>");
        mapEntities.Line.update(name, description, type, color, width, showLabel);
        map.getViewer().viewer.trackedEntity = undefined;
        map.getViewer().viewer.selectedEntity = mapEntities.getCurrent();
        openMapMenu("itemsEdit")
    }
    return { data, cancel };
}

//pass in a name string, and returns array
//@param
async function createAreaMenu(name, description, subType, color, showLabel) {
    console.log(description)
    description = description ? description : "";
    let cancel = false;
    let data = await Swal.fire({
        onOpen: () => Swal.getConfirmButton().focus(),
        title: 'Edit Area',
        allowOutsideClick: false,
        html:
            '<h4>Area Name:</h4>' +
            `<input autocomplete="off" placeholder="<Name Of area>" id="area-input-name" value="${name}" class="swal2-input">` +
            '<h4>Description:</h4>' +
            `<input placeholder="<Use commas, to make a list>" autocomplete="off" value="${description}" id="area-input-description" class="swal2-input">` +
            `<select type="autocomplete="off" placeholder="<Name Of Area>" id="area-input-type" value="${name}" class="swal2-input">` +
            `<option ${subType == mapEntities.TYPE.SUBTYPE.HASH ? "selected" : ""} value="hash">HASH</option>`+
            `<option ${subType == mapEntities.TYPE.SUBTYPE.DOUBLE_HASH ? "selected" : ""} value="double_hash">DOUBLE HASH</option></select>` +
            `<input type="color" class="swal2-input" id="area-input-color"  value="${color || "#ff0000"}"><br>` +
            `<span>Label: <input type="checkbox" ${showLabel ? "checked" : ""} id="showLabel"/>`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            return {
                name: document.getElementById('area-input-name').value,
                description: document.getElementById('area-input-description').value,
                type: document.getElementById('area-input-type').value,
                color: document.getElementById('area-input-color').value,
                showLabel: document.getElementById("showLabel").checked
            }
        }
    })
    if ("dismiss" in data) {
        cancel = true;
    } else {
        let {name, description, type, color, showLabel} = data.value;
        description = description.replace(/,/g, "<br>");
        mapEntities.Area.update(name, description, type, color, showLabel);
        map.getViewer().viewer.trackedEntity = undefined;
        map.getViewer().viewer.selectedEntity = mapEntities.getCurrent();
        openMapMenu("itemsEdit")
    }
    return { data, cancel };
}



//opens popup with name and description inputs.
//pass in a name string, and returns array
//@param
async function editEntityDetails(name, description, showLabel, showPos) {
    description = description ? description : "";
    console.log("entity details: ",description)
    description = description.replace(/<br>/g, ",");
    let cancel = false;
    let data = await Swal.fire({
        onOpen: () => Swal.getConfirmButton().focus(),
        title: 'Edit Item Details',
        html:
            '<h4>Entity Name:</h4>' +
            `<input autocomplete="off" id="swal-input1" value="${name}" class="swal2-input">` +
            '<h4>Description:</h4>' +
            `<input placeholder="<Use commas, to make a list>" autocomplete="off" value="${description}" id="swal-input2" class="swal2-input">` +
            `<span>Label: <input ${showLabel ? "checked" : ""} type="checkbox" id="showLabel"/></br><span>Show Position: <input ${showPos ? "checked" : ""} type="checkbox" id="showPos"/>`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            return {
                name: document.getElementById('swal-input1').value,
                description: document.getElementById('swal-input2').value,
                label: document.getElementById("showLabel").checked,
                showPos: document.getElementById("showPos").checked
            }
        }
    })
    if ("dismiss" in data) {
        cancel = true;
    } else {
        data.value.description = data.value.description.replace(/,/g, "<br>");
    }
    return { data, cancel };
}

//opens popup with name and description inputs.
//pass in a name string, and returns array
//@param
async function editTextEntityDetails(name, description) {
    description = description ? description : "";
    console.log(description.length)
    //description = description.replace(/<br>/g, ",");
    let cancel = false;
    let data = await Swal.fire({
        onOpen: () => Swal.getConfirmButton().focus(),
        title: 'Edit Text Details',
        html:
            '<h4>Entity Name:</h4>' +
            `<input autocomplete="off" id="swal-input1" value="${name}" class="swal2-input">` +
            '<h4>Description:</h4>' +
            `<input placeholder="<Use commas, to make a list>" autocomplete="off" value="${description}" id="swal-input2" class="swal2-input">`,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            return {
                name: document.getElementById('swal-input1').value,
                description: document.getElementById('swal-input2').value,
                label: true,
                showPos: false
            }
        }
    })
    if ("dismiss" in data) {
        cancel = true;
    } else {
        data.value.description = data.value.description.replace(/,/g, "<br>");
    }
    return { data, cancel };
}


