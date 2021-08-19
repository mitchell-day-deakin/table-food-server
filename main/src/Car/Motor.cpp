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
      digitalWrite(_fPin, HIGH);
      digitalWrite(_bPin, LOW);
    };

    void Motor::back()
    {
      digitalWrite(_fPin, LOW);
      digitalWrite(_bPin, HIGH);
    };

    void Motor::brake()
    {
      digitalWrite(_fPin, LOW);
      digitalWrite(_bPin, LOW);
    };
