#include "Car.h"
#include "Motor.h"
#include "Arduino.h"


Car::Car(int forR, int revR, int forL, int revL){
    forwardEnabled = true;
    rMotor.init(forR, revR);
    lMotor.init(forL, revL);
    return;
};

void Car::init()
{
    
};

void Car::forward()
{
    if (forwardEnabled)
    {
        Serial.println("Driving forward");
        rMotor.forward();
        lMotor.forward();
    }
};

void Car::reverse()
{
    Serial.println("Driving reverse");
    rMotor.back();
    lMotor.back();
};

int Car::turn(int angle)
{

    float onTime = abs(angle) / degPerMs;
    Serial.print("Time");
    Serial.println(onTime);
    Serial.print("Angle:");
    Serial.println(angle);

    if (angle < 0)
    {
        rMotor.forward();
        lMotor.back();
        delay(onTime);
        rMotor.brake();
        lMotor.brake();
    }
    else
    {
        lMotor.forward();
        rMotor.back();
        delay(onTime);
        rMotor.brake();
        lMotor.brake();
    }

    return onTime;
};

//the distance sensor would use this to stop the vehicle from moving forward
void Car::disableForward()
{
    forwardEnabled = false;
};

//distance sensor would enable forward when it doesnt detect edge
void Car::enableForward()
{
    forwardEnabled = true;
};

void Car::brake()
{
    lMotor.brake();
    rMotor.brake();
};
