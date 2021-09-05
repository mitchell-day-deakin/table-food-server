#include "src/Car/Car.h"
#include "src/Car/Motor.h"
#include "src/AudioCapture/AudioCapture.h"
#include "src/DistMonitor/DistMonitor.h"
#include "src/Bluetooth/Bluetooth.h"
#include <SoftwareSerial.h>


Car car(4,5,6,7,9,10);
AudioCapture aCapture(A0, A1, A2);
DistMonitor distMonitor(2,3, 10);
Bluetooth bluetooth(13, 12);
void setup()
{
  Serial.begin(9600);
  bluetooth.begin();
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
  //Serial.print("Main: ");
  //Serial.println(distance);
}

void testDistStop(){
    if (!distMonitor.checkDist()) {
        car.brake();
        car.disableForward();
    }
    else {
        car.enableForward();
        car.forward();
    }
}

void testBluetooth(){
  bluetooth.receive();
  
  if (bluetooth.message == "forward")
    {
      car.brake();
      car.forward();

    }
  else if(bluetooth.message == "backward") {
      car.reverse();

    }
  else if(bluetooth.message == "left") {
      car.turn(-90);

  }
  else if(bluetooth.message == "right") {
      car.turn(90);

  }
  else{
    car.brake();
  }
}
// put your main code here, to run repeatedly:
void loop()
{
  testBluetooth();
    
  //testCar();
  //testDistStop();
  //car.forward();
  
}
