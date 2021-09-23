#include "Arduino.h"
#include "AudioCapture.h"
#include "../Car/Car.h"
//#include "../AlertSystem/AlertSystem.h"

AudioCapture::AudioCapture(int mic0, int mic1, int mic2)
{
    micPin_0 = mic0; //front left -60deg
    micPin_1 = mic1; //front right 60deg
    micPin_2 = mic2; //back 180deg

    //pinMode(micPin_0, INPUT);
    //pinMode(micPin_1, INPUT);
    //pinMode(micPin_2, INPUT);
};

void AudioCapture::Incr()
{
    counter++;
};

//reads mics and returns whether a successful trigger has occured.
bool AudioCapture::readMics()
{
    micVal[0] = analogRead(micPin_0);
    micVal[1] = analogRead(micPin_1);
    micVal[2] = analogRead(micPin_2);

    //use this to see values coming in from microphones
    //comment out when testing is complete
    /* if (mic0Val >= TRIG_VAL)
    { */
    /* Serial.println("mic0");
        Serial.println(mic0Val);
        Serial.println("mic1");
        Serial.println(mic1Val);
        Serial.println("mic2");
        Serial.println(mic2Val);
        Serial.println(""); */
    //}

    //if a trigger does occur, then get the direction
    bool isTriggered = calcTrigger();
    if (isTriggered)
    {
        mic0Val = micVal[0];
        mic1Val = micVal[1];
        mic2Val = micVal[2];
        triggered = true;
        AUDIO_DIR = calcDirection();
        return true;
    }
    Incr();
    return false;
};

//returns the last triggered audio direction
int AudioCapture::getAudioDirection()
{
    return AUDIO_DIR;
}

bool AudioCapture::calcTrigger()
{
   /*  if(micVal[0] > 580){
        AlertSystem alert(11);
        alert.makeSound(1);
    } */

    if (micVal[0] > TRIG_VAL || micVal[1] > TRIG_VAL || micVal[2] > TRIG_VAL)
    {
        Serial.println(micVal[0]);
        Serial.println(micVal[1]);
        Serial.println(micVal[2]);

        //if first clap is not set then set it and start the counter
        if (clap1 == false || counter > 1000)
        {
            clap1 = true;
            counter = 0;
            Serial.println("Clap 1 Recorded");
            return false;
        }
        //if first clap is set and second clap is less then 200 counts apart the return true and reset clap1 and counter
        if (clap1 && counter < 1000)
        {
            counter = 0;
            clap1 = false;
            Serial.println("Clap 2 Recorded");
            return true;
        }
        clap1 = false;
    }

    return false;
}

//returns degrees from mic 1
//this will be in 60deg blocks (0, 60, 120, 180, -60, -120)
int AudioCapture::calcDirection()
{
    //this looks at if mic1 and mic2 are similar db
    if ((abs(mic1Val - mic2Val)) < 30)
    {

        //checks if mic0 is 50 higher than the average of the other 2
        if (mic0Val - 15 > (mic1Val + mic2Val) / 2)
        {
            return -60;
        };

        //checks if mic0 is 50 lower than the average of the other 2, returns angle between the two.
        if (mic0Val + 15 < (mic1Val + mic2Val) / 2)
        {
            return 120;
        };
    };

    //this looks at if mic0 and mic2 are similar db
    if ((abs(mic0Val - mic2Val)) < 30)
    {
        //checks if mic1 is 50 higher than the average of the other 2
        if (mic1Val - 15 > (mic0Val + mic2Val) / 2)
        {
            return 60;
        };

        //checks if mic1 is 50 lower than the average of the other 2, returns angle between the two.
        if (mic1Val + 15 > (mic0Val + mic2Val) / 2)
        {
            return -120;
        };
    };

    //this looks at if mic1 and mic0 are similar db
    if ((abs(mic1Val - mic0Val)) < 30)
    {

        //checks if mic2 is 50 higher than the average of the other 2
        if (mic2Val - 15 > (mic0Val + mic1Val) / 2)
        {
            return 180;
        };

        //checks if mic1 is 50 lower than the average of the other 2, returns angle between the two.
        if (mic2Val + 15 > (mic0Val + mic1Val) / 2)
        {
            return 0;
        };
    };

    return 29;
};
