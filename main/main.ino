#include "src/Car/Car.h"
#include "src/Car/Motor.h"
#include "src/AudioCapture/AudioCapture.h"
#include "src/AlertSystem/AlertSystem.h"
#include "src/DistMonitor/DistMonitor.h"
#include "src/Bluetooth/Bluetooth.h"
#include <SoftwareSerial.h>

//mitchell dev branch

Car car(4,5,6,7,9,10);
AudioCapture aCapture(A0, A1, A2);
DistMonitor distMonitor(2,3, 10);
Bluetooth bluetooth(13, 12);
AlertSystem alert(11);

//arduino setup
void setup()
{
  Serial.begin(19200);
  bluetooth.begin();
}


//Listen for audio triggers and drive car to location
void audioListener()
{
  //test the audio system
  bool isTriggered = aCapture.readMics();
  //delay(1000);
  if (isTriggered)
  {
    int degrees = aCapture.getAudioDirection();
    Serial.print("Degrees: ");
    Serial.println(degrees);
    int time = car.turn(degrees);
    //alert.makeSound(1);
    car.enableForward();
    car.forward();
  }
}



//Check if distance exceeds limit then stop robot
void distSensorListener(){
    if (!distMonitor.checkDist() && car.isForwardEnabled()) {
        car.brake();
        car.disableForward();
        car.reverse();
        delay(200);
        car.brake();
        alert.makeSound(1);
    }
    /* else {
        car.enableForward();
        car.forward();
    } */
}


// put your main code here, to run repeatedly:
void loop()
{
  distSensorListener();
  audioListener();
  
}




//Functions used for teting

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
