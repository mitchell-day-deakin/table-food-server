#include "Car.h"
#include "Motor.h"
#include "Arduino.h"


Car::Car(int forR, int revR, int forL, int revL, int enR, int enL){
    forwardEnabled = true;
    wasStop = true;
    rMotor.init(forR, revR, enR);
    lMotor.init(forL, revL, enL);
    return;
};

void Car::init()
{
    
};

void Car::forward()
{
    if (forwardEnabled)
    {
        if (wasStop) {
            wasStop = false;
            rMotor.forward(255);
            lMotor.forward(255);
            delay(200);
        }
        Serial.println("Driving forward");
        rMotor.forward(190);
        lMotor.forward(190);
    }
};

void Car::reverse()
{
    Serial.println("Driving reverse");
    rMotor.back(255);
    lMotor.back(255);
};

int Car::turn(int angle)
{

    float onTime = abs(angle) / degPerMs;
    //Serial.print("Time");
    //Serial.println(onTime);
    //Serial.print("Angle:");
    //Serial.println(angle);

    if (angle < 0)
    {
        rMotor.forward(255);
        lMotor.back(255);
        delay(onTime);
        rMotor.brake();
        lMotor.brake();
    }
    else
    {
        lMotor.forward(255);
        rMotor.back(255);
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


//returns true if the cars forwardEnabled is true
bool Car::isForwardEnabled(){
    return forwardEnabled;
}


void Car::brake()
{
    wasStop = true;
    lMotor.brake();
    rMotor.brake();
};
