
#include "src/Car/Car.h"
#include "src/Car/Motor.h"
#include "src/AudioCapture/AudioCapture.h"
#include "src/DistMonitor/DistMonitor.h"

#define CUSTOM_SETTINGS
#define INCLUDE_GAMEPAD_MODULE
#include <Dabble.h>


Car car(6,7,4,5);
AudioCapture aCapture(A0, A1, A2);
DistMonitor distMonitor(8, 9, 16);

void setup()
{
  Serial.begin(9600);
  Dabble.begin(9600);
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
  car.forward();
  Serial.println("f");
  delay(1000);
  car.turn(120);
  Serial.println("r");
  car.reverse();
  Serial.println("b");
  delay(1000);
  car.turn(-120);
  Serial.println("l");
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

//check bluetooth board;

//test distance monitor
void testDistMonitor()
{
  int distance = distMonitor.getCurDist();
}

// put your main code here, to run repeatedly:
void loop()
{
  testCar();
  //testDistMonitor();
  //audioTest();
  //gamePadProcess();
  //remoteServerControl();
  //Serial.println("From arduino\n");
}
