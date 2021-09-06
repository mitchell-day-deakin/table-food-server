    #include "Motor.h"
    #include "Arduino.h"
    
    Motor::Motor(){};
    void Motor::init(int fPin, int bPin, int enPin)
    {
      _fPin = fPin;
      _bPin = bPin;
      _enPin = enPin;

       pinMode(_fPin, OUTPUT);
       pinMode(_bPin, OUTPUT);
       pinMode(_enPin, OUTPUT);
       analogWrite(_enPin, 255);

    }

    void Motor::forward(int pwm){
      analogWrite(_enPin, pwm);
      digitalWrite(_fPin, HIGH);
      digitalWrite(_bPin, LOW);
    };

    void Motor::back(int pwm)
    {
      analogWrite(_enPin, pwm);
      digitalWrite(_fPin, LOW);
      digitalWrite(_bPin, HIGH);
    };

    void Motor::brake()
    {
      digitalWrite(_fPin, LOW);
      digitalWrite(_bPin, LOW);
    };
