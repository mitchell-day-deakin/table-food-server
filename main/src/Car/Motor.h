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
  public:
    Motor();
    void init(int fPin, int bPin);

    void forward();

    void back();

    void brake();
};

#endif
