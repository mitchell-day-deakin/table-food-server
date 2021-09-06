/*
 * Library for turning a motor
 * turns forward reverse and stops
 */
#ifndef Motor_h
#define Motor_h

class Motor {
  private:
    int _fPin;
    int _bPin;
    int _enPin;
    
  public:
    Motor();
    void init(int fPin, int bPin, int enPin);

    void forward(int pwm);

    void back(int pwm);

    void brake();
};

#endif
