const os = require("os")
const path = require("path")
const logger = require(path.join(__dirname, "./logger.js"))

//gets the name and the ipv4 address of each network card as an array
//of objects [{"name": "wifi", "address":"192.168.0.1"}]
let getInterfaceIps = function () {
    let network = os.networkInterfaces()
    let interfaces = []
    for (int in network) {
        for (detail of network[int]) {
            if (detail.family.toLowerCase() == "ipv4" && detail.address != "127.0.0.1") {
                let ob = { name: '', address: '' }
                ob.name = int
                ob.address = detail.address
                interfaces.push(ob)
            }
        }
    }
    return interfaces;
}


//returns subnet (24) from an ipv4 address
let getSubnet = function (ip) {
    let subnet = "";
    let decimal = 0;
    let i = 0;
    while (i < 100 || decimal < 3) {
        if (ip.charAt(i) == ".") {
            decimal += 1;
        }
        if (decimal == 3) {
            i = 100;
        } else {
            subnet += ip.charAt(i);
            i++;
        }
    }
    return subnet;
}


// Give it a subnet e.g "192.168.0" and it returns an object ["192.168.0.1", "192.168.0.2", ...]
var getEntireSubnetIps = function(subnet){
    let result;
    let subnetList = [];
    for(i=0; i<254; i++){
        subnetList[i] = subnet+"."+(i+1);
    }
    return subnetList  
}

//returns array of network interfaces with name, address and subnet
//eg [{name: "wifi", address: "192.168.0.2", subnet: "192.168.0"}]
let getNetworkDetails = function() {
    let ips = getInterfaceIps()
    for (device of ips) {
        let subnet = getSubnet(device.address);
        device.subnet = subnet;
    }
    return ips;
}


module.exports = {
    getSubnet: getSubnet,
    getNetworkDetails: getNetworkDetails,
    getEntireSubnetIps: getEntireSubnetIps
}