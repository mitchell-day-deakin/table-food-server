#include "AlertSystem.h"
#include "Arduino.h"

AlertSystem::AlertSystem(int pin){
    _pin = pin;
    pinMode(_pin, OUTPUT);
};


void AlertSystem::makeSound(int numSounds)
{
    if(numSounds < 0 || numSounds > 5){
        return
    }

    for(int i = 0; i< numSounds; i++){
        digitalWrite(_pin, HIGH);
        delay(200)
        digitalWrite(_pin, LOW);
        delay(200);
    }

    return
};