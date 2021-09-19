#ifndef AlertSystem_h
#define AlertSystem_h

class AlertSystem {
  private:
    int _pin;
  public:
    AlertSystem(int pin);
    void makeSound(int numSounds);
  
};

#endif