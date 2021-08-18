#ifndef Car_h
#define Car_h

#include "Motor.h"

class Car
{
private:
  Motor rMotor;
  Motor lMotor;
  float degPerMs = 4.44;

public:
  
  Car(int forR, int revR, int forL, int revL);

  void forward();

  void reverse();

  //input from -180 to 180
  int turn(int angle);

  void brake();
};

#endif
