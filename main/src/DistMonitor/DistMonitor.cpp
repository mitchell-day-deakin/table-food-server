#include "DistMonitor.h"
//#include "../Car/Car.h"
#include "Arduino.h"

DistMonitor::DistMonitor(int trigPin, int echoPin, int distThreshold)
{
    _trigPin = trigPin;
    _echoPin = echoPin;
    //_car = &car;
    _distThreshold = distThreshold;
    pinMode(_trigPin, OUTPUT);
    pinMode(_echoPin, INPUT);
};

void DistMonitor::init(){

};

bool DistMonitor::checkDist()
{
    int distance = getCurDist();
    return distance < _distThreshold;
};

int DistMonitor::getCurDist()
{
    // Clears the trigPin condition
    digitalWrite(_trigPin, LOW);
    delayMicroseconds(2);
    // Sets the trigPin HIGH (ACTIVE) for 10 microseconds
    digitalWrite(_trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(_trigPin, LOW);
    // Reads the echoPin, returns the sound wave travel time in microseconds
    duration = pulseIn(_echoPin, HIGH);
    //Serial.print("Time: ");
    //Serial.println(duration);
    // Calculating the distance
    curDist = duration * 0.034 / 2; // Speed of sound wave divided by 2 (go and back)
    // Displays the distance on the Serial Monitor
    Serial.print("Distance: ");
    Serial.print(curDist);
    Serial.println(" cm");
    return curDist;
};
