#include "Car.h"
#include "Motor.h"
#include "Arduino.h"

Car::Car(int forR, int revR, int forL, int revL)
{
    rMotor.init(forR, revR);
    lMotor.init(forL, revL);
};

void Car::forward()
{
    rMotor.forward();
    lMotor.forward();
}

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

void Car::brake()
{
    lMotor.brake();
    rMotor.brake();
};
