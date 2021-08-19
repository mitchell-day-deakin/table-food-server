#include "src/Car/Car.h"
#include "src/AudioCapture/AudioCapture.h"
#include "src/DistMonitor.h"


Car car(1,2,3,4);
AudioCapture aCapture = AudioCapture(1,2,3);


void setup() {
  Serial.begin(9600); 

}

void loop() {
  // put your main code here, to run repeatedly:
  bool isTriggered = aCapture.readMics();
  if(isTriggered){
    int degrees = aCapture.getAudioDirection();
    int time = car.turn(degrees);
  }

}
