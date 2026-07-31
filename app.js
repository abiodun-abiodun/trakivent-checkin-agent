// =====================================================
// TRAKIVENT CHECK-IN AGENT
// Version: v0.3.1
// Manspace Technologies
// =====================================================



// =====================================================
// CONFIGURATION
// =====================================================

const API_URL =
"https://script.google.com/macros/s/AKfycbw1dJq1BYbqAzonBP7V9plYfZFMChY_NGc1Pu2eFmTEXj69AWNBjPrPr22NUWYjwZSd/exec";

const OVERLAY_DURATION = 4500;



// =====================================================
// DOM ELEMENTS
// =====================================================

const qrInput =
document.getElementById("qrInput");

const checkInButton =
document.getElementById("checkInButton");

const startScannerButton =
document.getElementById("startScannerButton");

const stopScannerButton =
document.getElementById("stopScannerButton");

const reader =
document.getElementById("reader");

const result =
document.getElementById("result");

const statusIcon =
document.getElementById("statusIcon");

const resultTitle =
document.getElementById("resultTitle");

const guestName =
document.getElementById("guestName");

const details =
document.getElementById("details");



// =====================================================
// GLOBALS
// =====================================================

let html5QrCode = null;



// =====================================================
// CAMERA ENGINE
// =====================================================

function startCameraScanner() {

    startScannerButton.hidden = true;
    stopScannerButton.hidden = false;

    reader.style.display = "block";
    reader.innerHTML = "";

    html5QrCode =
    new Html5Qrcode("reader");

    html5QrCode.start(

        { facingMode: "environment" },

        {

            fps: 10,

            qrbox: {

                width: 250,
                height: 250

            }

        },

        onQRCodeDetected,

        function () {

            // Ignore scan noise

        }

    )

    .catch(function (error) {

        console.error(error);

        showSystemError();

        stopCameraScanner();

    });

}



function stopCameraScanner() {

    if (!html5QrCode) {

        startScannerButton.hidden = false;
        stopScannerButton.hidden = true;

        return;

    }

    html5QrCode.stop()

    .then(function () {

        html5QrCode.clear();

        html5QrCode = null;

        reader.style.display = "none";

        startScannerButton.hidden = false;
        stopScannerButton.hidden = true;

    })

    .catch(function (error) {

        console.error(error);

    });

}



function onQRCodeDetected(decodedText) {

    qrInput.value = decodedText;

    html5QrCode.pause(true);

    checkInGuest();

}
// =====================================================
// API ENGINE
// =====================================================

async function processCheckIn(token) {

    console.log("Processing:", token);
    
    showProcessing();

    try {

        const response = await fetch(

            `${API_URL}?action=checkin&token=${encodeURIComponent(token)}`

        );

        const apiResult = await response.json();

        console.log(apiResult);

        if (apiResult.success) {

            showSuccess(apiResult.guest);

        }

        else if (apiResult.status === "duplicate") {

            showDuplicate(apiResult.guest);

        }

        else {

            showInvalidQR();

        }

    }

    catch (error) {

        console.error(error);

        showSystemError();

    }

    resumeScanningSession();

}



// =====================================================
// CHECK-IN ENGINE
// =====================================================

function checkInGuest() {

    const token = qrInput.value.trim();

    if (!token) {

        showInvalidQR();

        resumeScanningSession();

        return;

    }

    processCheckIn(token);

}



function resumeScanningSession() {

    setTimeout(function () {

        hideOverlay();

        // Clear previous token
        qrInput.value = "";

        // Put cursor back into the input
        qrInput.focus();

        // Resume camera only if camera is active
        if (html5QrCode) {

            html5QrCode.resume();

        }

    }, OVERLAY_DURATION);

}



// =====================================================
// OVERLAY ENGINE
// =====================================================

function hideOverlay() {

    result.style.display = "none";

}
function showProcessing() {

    result.className = "result-overlay processing";

    result.style.display = "flex";

    statusIcon.textContent = "⏳";

    resultTitle.textContent = "VERIFYING GUEST...";

    guestName.textContent = "";

    details.textContent = "Please wait...";

}


function showSuccess(data) {

    result.className = "result-overlay success";

    result.style.display = "flex";

    statusIcon.textContent = "✓";

    resultTitle.textContent = "CHECK-IN SUCCESSFUL";

    guestName.textContent = data.name || "";

    details.innerHTML =

        `<strong>${data.registrationNumber || ""}</strong><br>
         ${data.ticketType || ""}`;

    playSuccessSound();

}



function showDuplicate(data) {

    result.className = "result-overlay duplicate";

    result.style.display = "flex";

    statusIcon.textContent = "⚠";

    resultTitle.textContent = "ALREADY CHECKED IN";

    guestName.textContent = data.name || "";

    details.innerHTML =

        `<strong>${data.registrationNumber || ""}</strong><br>
         ${data.ticketType || ""}<br><br>
         Checked in at:<br>
         <strong>${formatCheckinTime(data.checkinTime)}</strong>`;

    playDuplicateSound();

}



function showInvalidQR() {

    result.className = "result-overlay error";

    result.style.display = "flex";

    statusIcon.textContent = "✕";

    resultTitle.textContent = "INVALID QR CODE";

    guestName.textContent = "";

    details.textContent =

        "QR code not recognised.";

    playInvalidSound();

}



function showSystemError() {

    result.className = "result-overlay error";

    result.style.display = "flex";

    statusIcon.textContent = "⚠";

    resultTitle.textContent = "SYSTEM ERROR";

    guestName.textContent = "";

    details.textContent =

        "Unable to connect to Trakivent server.";

    playInvalidSound();

}
// =====================================================
// AUDIO ENGINE
// =====================================================

function playSuccessSound() {

    playTone(880, 0.12, "sine");

    setTimeout(function () {

        playTone(1175, 0.12, "sine");

    }, 130);

}


function playDuplicateSound() {

    playTone(450, 0.18, "triangle");

}


function playInvalidSound() {

    playTone(220, 0.18, "square");

    setTimeout(function () {

        playTone(180, 0.18, "square");

    }, 180);

}


function playTone(frequency, duration, type) {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        const audioContext =
            new AudioContext();

        const oscillator =
            audioContext.createOscillator();

        const gainNode =
            audioContext.createGain();

        oscillator.type = type;

        oscillator.frequency.value = frequency;

        oscillator.connect(gainNode);

        gainNode.connect(audioContext.destination);

        gainNode.gain.setValueAtTime(
            0.15,
            audioContext.currentTime
        );

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + duration
        );

    }

    catch {

        console.log("Audio unavailable.");

    }

}



// =====================================================
// UTILITY FUNCTIONS
// =====================================================

function formatCheckinTime(timestamp) {

    if (!timestamp) return "";

    const date = new Date(timestamp);

    return date.toLocaleString("en-GB", {

        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true

    });

}



// =====================================================
// EVENT LISTENERS
// =====================================================

startScannerButton.addEventListener(
    "click",
    startCameraScanner
);

stopScannerButton.addEventListener(
    "click",
    stopCameraScanner
);

checkInButton.addEventListener(
    "click",
    checkInGuest
);

qrInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        event.preventDefault();

        checkInGuest();

    }

});



// =====================================================
// INITIALISATION
// =====================================================

window.addEventListener("load", function () {

    qrInput.focus();

});