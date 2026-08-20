// =====================================
// TRAKIVENT
// Station Audio Module
// =====================================

let stationAudioContext = null;


// -------------------------------------
// Initialise audio after user interaction
// -------------------------------------

function initStationAudio() {

    if (!stationAudioContext) {

        stationAudioContext =
            new (window.AudioContext ||
                 window.webkitAudioContext)();

    }

    if (
        stationAudioContext.state ===
        "suspended"
    ) {

        stationAudioContext.resume();

    }

}


// -------------------------------------
// Play short station tone
// -------------------------------------

function playStationTone(
    frequency,
    duration,
    type = "sine"
) {

    try {

        initStationAudio();

        const oscillator =
            stationAudioContext.createOscillator();

        const gain =
            stationAudioContext.createGain();

        oscillator.type = type;

        oscillator.frequency.value =
            frequency;

        gain.gain.setValueAtTime(
            0.0001,
            stationAudioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.15,
            stationAudioContext.currentTime + 0.01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            stationAudioContext.currentTime + duration
        );

        oscillator.connect(gain);

        gain.connect(
            stationAudioContext.destination
        );

        oscillator.start();

        oscillator.stop(
            stationAudioContext.currentTime +
            duration
        );

    }

    catch(error) {

        console.warn(
            "Station audio unavailable:",
            error
        );

    }

}


// -------------------------------------
// Success
// -------------------------------------

function playSuccessSound() {

    playStationTone(
        880,
        0.12,
        "sine"
    );

    setTimeout(function(){

        playStationTone(
            1175,
            0.16,
            "sine"
        );

    },120);

}


// -------------------------------------
// Already Checked In
// -------------------------------------

function playWarningSound() {

    playStationTone(
        440,
        0.20,
        "triangle"
    );

}


// -------------------------------------
// Invalid QR / Error
// -------------------------------------

function playErrorSound() {

    playStationTone(
        220,
        0.25,
        "sawtooth"
    );

}

document.addEventListener(
    "click",
    initStationAudio,
    { once: true }
);