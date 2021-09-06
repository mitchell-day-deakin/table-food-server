#include "Bluetooth.h"
#include "Arduino.h"
#include <SoftwareSerial.h>

Bluetooth::Bluetooth(int tx, int rx) : _bluetooth(tx, rx) {
       
    _message = "";
    return;
};

void Bluetooth::receive() {
    if (_bluetooth.available() > 0)
    {
        Serial.println("Recieved");
        String receive = (String)_bluetooth.readStringUntil('\n');
        receive.trim();
        Serial.println(receive);
        _message = receive;
       
    }
};

void Bluetooth::begin() {
    _bluetooth.begin(9600);
};

