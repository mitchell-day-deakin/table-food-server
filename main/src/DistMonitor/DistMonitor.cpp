#include "DistMonitor.h"
#include "Arduino.h"

DistMonitor::DistMonitor(int trigPin, int echoPin){
    _trigPin = trigPin;
    _echoPin = echoPin;
};

void DistMonitor::checkDist(){

};

float DistMonitor::getCurDist()
{
    return curDist;
};
