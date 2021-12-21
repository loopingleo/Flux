import { equals, xf } from './functions.js';
import { score } from './ml.js';

function HeartRateMode() {
    let heartRate = 0;
    let powerTarget = 50;
    let hrtarget = 120;

    function init() {
        // on start button press the subscribtions are initialized
        xf.sub('ui:watchStart', () => {
            start();
        });
        
        // on stop button press the subscribtions are cleared
        xf.sub('ui:watchStop', () => {
            stop();
        });
    }

    function start() {
        // subscribe to heart rate values, power target updates and heart rate target updates
        xf.sub('db:heartRate', onHeartRate);
        xf.sub('db:powerTarget', onPowerTarget);
        xf.sub('db:heartRateTarget', onheartRateTarget);
    }

    function stop() {
        xf.unsub('db:heartRate', onHeartRate);
        xf.unsub('db:powerTarget', onPowerTarget);
        xf.unsub('db:heartRateTarget', onheartRateTarget);
    }

    // updates with the latest value of heart rate when one is available
    function onHeartRate(value) {
        heartRate = value;   
        // and calls the power setting logic
        setPowerTarget();
    }

    function onPowerTarget(value) {
        powerTarget = value;

        //setPowerTarget();
    }

    function onheartRateTarget(value) {
        hrtarget = value;
    }

    function setPowerTarget() {
        if(shouldUpdateTarget()) {
            const adjustedTarget = adjustPowerTarget(powerTarget);
            xf.dispatch('ui:power-target-set', adjustedTarget);
        }
    }

    function shouldUpdateTarget() {
        var seconds = new Date().getTime() / 1000;

        if (equals(Math.round(seconds) % 10, 0)){
            return true;
        } else {
            return false;
        }
    }

    function adjustPowerTarget(powerTarget) {

        //if(heartRate < hrtarget) {
        //    return powerTarget + 1;
        //} else {
        //    return powerTarget - 1;
        //}

        console.log(score(
            [90, //cad 
            100, // hr
            150, //pwr
            180 //hr in 60 sec
        ]))

        if(heartRate < hrtarget) {
            powerTarget = Math.min(Math.round(powerTarget * ((hrtarget/heartRate - 1) * 1.5 + 1)), powerTarget + 3);
            return powerTarget;
        } else {
            powerTarget = (Math.round(powerTarget * ((hrtarget/heartRate - 1) * 1.0 + 1)));
            return powerTarget;
        }

    }

    return {
        init,
        start,
        stop,
    };
}


const heartRateMode = HeartRateMode();

heartRateMode.init();
