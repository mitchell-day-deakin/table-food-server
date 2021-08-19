
#ifndef DistMonitor_h
#define DistMonitor_h

class DistMonitor {
  private:
    float curDist;
    int _trigPin;
    int _echoPin;
    
  public:
    DistMonitor(int trigPin, int echoPin);
    void checkDist();
    float getCurDist();
  
};

#endif