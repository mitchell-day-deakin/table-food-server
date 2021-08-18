
class DistMonitor {
  private:
    float curDist;
    
  public:
    DistMonitor();

    void checkDist();

    float getCurDist(){
      return curDist;
    };
  
};
