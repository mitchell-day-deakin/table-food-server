
#ifndef DistMonitor_h
#define DistMonitor_h

//#include "../Car/Car.h"

class DistMonitor {
  private:
    int curDist; //the distance the sensor returns
    int _distThreshold; //the distance at which to stop car
    long duration;
    int _trigPin;
    int _echoPin;
    //Car _car;
    
  public:
    DistMonitor(int trigPin, int echoPin, int distThreshold);
    void init();
    bool checkDist();
    int getCurDist();
  
};

#endif