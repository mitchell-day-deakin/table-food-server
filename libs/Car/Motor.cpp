    #include "Motor.h"
    #include "Arduino.h"
    
    Motor::Motor(){};
    void Motor::init(int fPin, int bPin)
    {
      _fPin = fPin;
      _bPin = bPin;

       pinMode(_fPin, OUTPUT);
       pinMode(_bPin, OUTPUT);
    }

    void Motor::forward(){
      analogWrite(_fPin, HIGH);
      analogWrite(_bPin, LOW);
    };

    void Motor::back()
    {
      analogWrite(_fPin, LOW);
      analogWrite(_bPin, HIGH);
    };

    void Motor::brake()
    {
      analogWrite(_fPin, LOW);
      analogWrite(_bPin, LOW);
    };
