#include "src/Car/Car.h"
#include "src/Car/Motor.h"
#include "src/AudioCapture/AudioCapture.h"
#include "src/DistMonitor.h"

Car car(4,5,6,7);
AudioCapture aCapture = AudioCapture(A0, A1, A2);

void setup()
{
  Serial.begin(9600);
}

//test the audio system
void audioTest()
{
  //test the audio system
  bool isTriggered = aCapture.readMics();
  //delay(1000);
  if (isTriggered)
  {
    int degrees = aCapture.getAudioDirection();
    int time = car.turn(degrees);
  }
}


//test car dive, reverse, turn functionality
void testCar(){
  car.forward();
  delay(1000);
  car.turn(90);
  car.reverse();
  delay(1000);
  car.turn(-120);
}


void loop()
{

  testCar();
  // put your main code here, to run repeatedly:
}
