#include "AlertSystem.h"
#include "Arduino.h"

AlertSystem::AlertSystem(int pin)
{
    _pin = pin;
    pinMode(_pin, OUTPUT);
};

void AlertSystem::makeSound(int numSounds)
{
    //check if user inputs less then 0 or more than 5 (5 would be more than enough);
    if (numSounds < 0 || numSounds > 5)
    {
        return;
    }

    //loop through requested number of times and sound short alarm 
    for(int i = 0; i < numSounds; i++){
        digitalWrite(_pin, HIGH);
        delay(300);
        digitalWrite(_pin, LOW);
        delay(300);
    }

    return;
};