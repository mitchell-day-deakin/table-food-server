#ifndef Car_h
#define Car_h

#include "Motor.h"

class Car
{
private:
  Motor rMotor;
  Motor lMotor;
  float degPerMs = 0.24;
  bool forwardEnabled;

public:
  Car(int forR, int revR, int forL, int revL);
  void init();

  void forward();

  void reverse();

  //input from -180 to 180
  int turn(int angle);

  //the distance sensor would use this to stop the vehicle from moving forward
  void disableForward();

  //distance sensor would enable forward when it doesnt detect edge
  void enableForward();

  void brake();
};

#endif
