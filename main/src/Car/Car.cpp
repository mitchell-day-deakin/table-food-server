#include "Car.h"
#include "Motor.h"
#include "Arduino.h"

Car::Car(int forR, int revR, int forL, int revL)
{
    forwardEnabled = true;
    rMotor.init(forR, revR);
    lMotor.init(forL, revL);
};

void Car::forward()
{
    if (forwardEnabled)
    {
        rMotor.forward();
        lMotor.forward();
    }
};

void Car::reverse()
{
    rMotor.back();
    lMotor.back();
};

int Car::turn(int angle)
{

    float onTime = abs(angle) * degPerMs;

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
void disableForward()
{
    forwardEnabled = false;
};

//distance sensor would enable forward when it doesnt detect edge
void enableForward()
{
    forwardEnabled = true;
};

void Car::brake()
{
    lMotor.brake();
    rMotor.brake();
};
