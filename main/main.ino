
#include "src/Car/Car.h"
#include "src/Car/Motor.h"
#include "src/AudioCapture/AudioCapture.h"
#include "src/DistMonitor/DistMonitor.h"
#include "src/Bluetooth/Bluetooth.h"
#include <SoftwareSerial.h>

#define CUSTOM_SETTINGS
#define INCLUDE_GAMEPAD_MODULE


Car car(6,7,4,5);
AudioCapture aCapture(A0, A1, A2);
DistMonitor distMonitor(8, 9, 16);
Bluetooth bluetooth()

void setup()
{
  Serial.begin(19200);
  //pinMode(txPin, OUTPUT);
}

//test the audio system
void audioTest()
{
  //test the audio system
  bool isTriggered = aCapture.readMics();
  delay(1000);
  if (isTriggered)
  {
    int degrees = aCapture.getAudioDirection();
    int time = car.turn(degrees);
  }
}

//test car dive, reverse, turn functionality
void testCar()
{
  Serial.println("f");
  car.forward();
  delay(1000);
  Serial.println("r");
  car.turn(120);
  Serial.println("b");
  car.reverse();
  delay(1000);
  Serial.println("l");
  car.turn(-120);
  
}

//test the audio functionality
void testAudio()
{
}

//bluetooth process
void gamePadProcess()
{
  Dabble.processInput();
  if (GamePad.isUpPressed())
  {
    Serial.print("Up pressed");
    car.forward();
  }
  if (GamePad.isDownPressed())
  {
    Serial.print("Down pressed");
    car.reverse();
  }
  if (GamePad.isLeftPressed())
  {
    Serial.print("Down pressed");
    car.turn(-180);
  }
  if (GamePad.isRightPressed())
  {
    Serial.print("Down pressed");
    car.turn(180);
  }
  if (GamePad.isCrossPressed())
  {
    Serial.print("Down pressed");
    car.brake();
  }
}

void remoteServerControl(){
  if(Serial.available()>0){
    char value = Serial.read();
    Serial.println(value);
    if(value == "f"){
      car.forward();
    }
    if(value == "b"){
      car.reverse();
    }
  }
}


//test distance monitor
void testDistMonitor()
{
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
  else if(bluetooth.message=="stop"){
    car.brake();
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
  testDistStop();
  //car.forward();
  remoteServerControl();
  
}
