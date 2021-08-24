#include "src/Car/Car.h"
#include "src/Car/Motor.h"
#include "src/AudioCapture/AudioCapture.h"
#include "src/DistMonitor/DistMonitor.h"

Car car(4,5,6,7);
AudioCapture aCapture(A0, A1, A2);
DistMonitor distMonitor(2,3, 47);
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

//test the audio functionality
void testAudio(){

}


//test distance monitor
void testDistMonitor(){
  int distance = distMonitor.getCurDist();
  Serial.print("Main: ");
  Serial.println(distance);
}

// put your main code here, to run repeatedly:
void loop()
{

  //testCar();
  testDistMonitor();
  
}
