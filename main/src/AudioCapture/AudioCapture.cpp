#include "Arduino.h"
#include "AudioCapture.h"

AudioCapture::AudioCapture(int mic0, int mic1, int mic2)
{
    micPin_0 = "A"+mic0; //front left -60deg
    micPin_1 = "A"+mic1; //front right 60deg
    micPin_2 = "A"+mic2; //back 180deg

    pinMode(micPin_0, INPUT);
    pinMode(micPin_1, INPUT);
    pinMode(micPin_2, INPUT);
};

void AudioCapture::Incr()
{
    counter++;
};

//reads mics and returns whether a successful trigger has occured.
bool AudioCapture::readMics()
{
    mic0Val = analogRead(micPin_0);
    mic1Val = analogRead(micPin_1);
    mic2Val = analogRead(micPin_2);

    //use this to see values coming in from microphones
    //comment out when testing is complete
    Serial.println("mic0");
    Serial.println(mic0Val);
    Serial.println("mic1");
    Serial.println(mic1Val);
    Serial.println("mic2");
    Serial.println(mic2Val);

    //if a trigger does occur, then get the direction
    bool isTriggered = calcTrigger();
    if (isTriggered)
    {
        AUDIO_DIR = calcDirection();
    }
    Incr();
};

//returns the last triggered audio direction
int AudioCapture::getAudioDirection()
{
    return AUDIO_DIR;
}

bool AudioCapture::calcTrigger()
{
    if (mic0Val > TRIG_VAL || mic0Val > TRIG_VAL || mic0Val > TRIG_VAL)
    {
        //if first clap is not set then set it and start the counter
        if (clap1 == false)
        {
            clap1 = true;
            counter = 0;
            return false;
        }
        //if first clap is set and second clap is less then 200 counts apart the return true and reset clap1 and counter
        if (clap1 && counter < 200)
        {
            counter = 0;
            clap1 = false;
            return true;
        }
    }
    return false;
}

//returns degrees from mic 1
//this will be in 60deg blocks (0, 60, 120, 180, -60, -120)
int AudioCapture::calcDirection()
{
    //this looks at if mic1 and mic2 are similar db
    if ((abs(mic1Val - mic2Val)) < 100)
    {

        //checks if mic0 is 50 higher than the average of the other 2
        if (mic0Val - 50 > (mic1Val - mic2Val) / 2)
        {
            return -60;
        };

        //checks if mic0 is 50 lower than the average of the other 2, returns angle between the two.
        if (mic0Val + 50 < (mic1Val - mic2Val) / 2)
        {
            return 120;
        };
    };

    //this looks at if mic0 and mic2 are similar db
    if ((abs(mic0Val - mic2Val)) < 100)
    {
        //checks if mic1 is 50 higher than the average of the other 2
        if (mic1Val - 50 > (mic0Val - mic2Val) / 2)
        {
            return 60;
        };

        //checks if mic1 is 50 lower than the average of the other 2, returns angle between the two.
        if (mic1Val + 50 > (mic0Val - mic2Val) / 2)
        {
            return -120;
        };
    };

    //this looks at if mic1 and mic0 are similar db
    if ((abs(mic1Val - mic0Val)) < 100)
    {

        //checks if mic2 is 50 higher than the average of the other 2
        if (mic2Val - 50 > (mic0Val - mic1Val) / 2)
        {
            return 180;
        };

        //checks if mic1 is 50 lower than the average of the other 2, returns angle between the two.
        if (mic2Val + 50 > (mic0Val - mic1Val) / 2)
        {
            return 0;
        };
    };

    return -1;
};

