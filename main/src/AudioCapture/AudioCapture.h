/*
This will keep track of any claps and triggers that occur
And also the direction the audio came from.
*/
#ifndef AudioCapture_h
#define AudioCapture_h

#include "../Car/Car.h"

class AudioCapture {
    private:
        int TRIG_VAL = 550; // the threshold for a successful clap
        int AUDIO_DIR = -1; //this will store the audio direction heard from clap
        int counter = 0; //counts from first clap
        bool clap1;
        bool clap2;
        bool triggered;

        int micPin_0;
        int micPin_1;
        int micPin_2;

        int mic0Val;
        int mic1Val;
        int mic2Val;

    public:
        AudioCapture(int mic0, int mic1, int mic2);

        void Incr();

        //reads mics and returns whether a successful trigger has occured.
        bool readMics();

        //returns the last triggered audio direction
        int getAudioDirection();

        bool calcTrigger();

        //returns degrees from mic 1
        //this will be in 60deg blocks (0, 60, 120, 180, -60, -120)
        int calcDirection();

};

#endif