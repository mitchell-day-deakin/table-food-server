#include "src/Car/Car.h"
#include "src/Car/Motor.h"
#include "src/AudioCapture/AudioCapture.h"
#include "src/AlertSystem/AlertSystem.h"
#include "src/DistMonitor/DistMonitor.h"
#include "src/Bluetooth/Bluetooth.h"
#include <SoftwareSerial.h>

//mitchell dev branch

Car car(5,4,7,6,9, 10);
AudioCapture aCapture(A0, A1, A2);
DistMonitor distMonitor(2,3, 10);
Bluetooth bluetooth(13, 12);
AlertSystem alert(11);
void setup()
{
  Serial.begin(19200);
  bluetooth.begin();
  alert.makeSound(2);
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
    Serial.print("Degrees: ");
    Serial.print(degrees);
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


//read serial and pass to bluetooth
void remoteServerControl(){
  if(Serial.available()>0){
    String value = Serial.readString();
    bluetooth.send(value);
    if(value == "f"){
      car.forward();
    }
    if(value == "r"){
      car.reverse();
    }
  }
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
  Serial.println(bluetooth.message);
  
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
  else if(bluetooth.message == "stop") {
      car.brake();
  }
  else{
    car.brake();
  }
}
// put your main code here, to run repeatedly:
void loop()
{
  //testBluetooth();
  //testCar();
  //testDistStop();
  //car.forward();
  //remoteServerControl();
  audioTest();
  
}
