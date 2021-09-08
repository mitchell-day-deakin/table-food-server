



async function dragDropTouch(e, url, name, type) {
    let reply = map.screenXYtoLatLon(e.touches[0].clientX, e.touches[0].clientY)
    if (!reply.error) {
        result = await map.createMapSymbol(reply.data, url, name, type)
        if (!result.error) {
            openMapMenu("itemsEdit")
        }
    }
}





/* viewer.scene.canvas.addEventListener('click', function (e) {
    let ellipsoid = viewer.scene.globe.ellipsoid;
    // Mouse over the globe to see the cartographic position
    let cartesian = viewer.camera.pickEllipsoid(new Cesium.Cartesian3(e.clientX, e.clientY), ellipsoid);
    if (cartesian) {
        let cartographic = ellipsoid.cartesianToCartographic(cartesian);
        let lon = Cesium.Math.toDegrees(cartographic.longitude)//.toFixed(10);
        let lat = Cesium.Math.toDegrees(cartographic.latitude)//.toFixed(10);
        let output = map.convertCoords({lat, lon, precision: 5}, map.getProj());
        displayCoords(output.display)
    } else {
        //entity.label.show = false;
    }
}) */