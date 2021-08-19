#include "src/Car/Car.h"
#include "src/AudioCapture/AudioCapture.h"
#include "src/DistMonitor.h"


Car car(1,2,3,4);
AudioCapture aCapture = AudioCapture(A0,A1,A2);


void setup() {
  Serial.begin(9600); 

}

void loop() {
  // put your main code here, to run repeatedly:
  bool isTriggered = aCapture.readMics();
  //delay(1000);
  if(isTriggered){
    int degrees = aCapture.getAudioDirection();
    
    int time = car.turn(degrees);
  }

}
