/*
 * Library recieving bluetooth signals
 * Recieves messages to act upon
 */
#ifndef Bluetooth_h
#define Bluetooth_h

#include <SoftwareSerial.h>


class Bluetooth {
private:
    SoftwareSerial _bluetooth;
    String _message;

public:
    const String& message = _message;

    Bluetooth(int tx, int rx);

    void begin();

    void receive();


};

#endif
