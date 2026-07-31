// =====================================================
// TRAKIVENT CHECK-IN AGENT
// Version: v0.3.2
// Manspace Technologies
// =====================================================


// =====================================================
// CONFIGURATION
// =====================================================

const CONFIG = {

    API_URL:
        "https://script.google.com/macros/s/AKfycbw1dJq1BYbqAzonBP7V9plYfZFMChY_NGc1Pu2eFmTEXj69AWNBjPrPr22NUWYjwZSd/exec",

    OVERLAY_DURATION: 4500,

    CAMERA_FPS: 10,

    QR_BOX: {

        width: 250,
        height: 250

    }

};


// =====================================================
// DOM REFERENCES
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
// APPLICATION STATE
// =====================================================

let html5QrCode = null;

let scannerRunning = false;

let processing = false;


// =====================================================
// INITIALISATION
// =====================================================

window.addEventListener("load", initialiseApplication);

function initialiseApplication() {

    qrInput.focus();

    stopScannerButton.hidden = true;

    console.log("TRAKIVENT v0.3.2 started.");

}
// =====================================================
// SCANNER ENGINE
// =====================================================

function startCameraScanner() {

    if (scannerRunning) return;

    reader.style.display = "block";
    reader.innerHTML = "";

    startScannerButton.hidden = true;
    stopScannerButton.hidden = false;

    html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(

        { facingMode: "environment" },

        {
            fps: CONFIG.CAMERA_FPS,
            qrbox: CONFIG.QR_BOX
        },

        onScanSuccess,

        onScanFailure

    )

    .then(() => {

        scannerRunning = true;

        console.log("Camera scanner started.");

    })

    .catch(error => {

        console.error(error);

        scannerRunning = false;

        reader.style.display = "none";

        showSystemError();

    });

}


function stopCameraScanner() {

    if (!html5QrCode || !scannerRunning) return;

    html5QrCode.stop()

        .then(() => {

            html5QrCode.clear();

            html5QrCode = null;

            scannerRunning = false;

            reader.style.display = "none";

            startScannerButton.hidden = false;
            stopScannerButton.hidden = true;

            console.log("Camera scanner stopped.");

        })

        .catch(console.error);

}


function onScanSuccess(decodedText) {

    if (processing) return;

    processing = true;

    qrInput.value = decodedText;

    if (html5QrCode) {

        html5QrCode.pause(true);

    }

    checkInGuest();

}


function onScanFailure() {

    // Intentionally ignored
}
// =====================================================
// EVENTS
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
// API ENGINE
// =====================================================

async function checkInGuest() {

    if (processing === false) {

        processing = true;

    }

    const token = qrInput.value.trim();

    if (!token) {

        showInvalidQR();

        resumeScanningSession();

        return;

    }

    showProcessing();

    await processCheckIn(token);

}


async function processCheckIn(token) {

    try {

        const response = await fetch(

            `${CONFIG.API_URL}?action=checkin&token=${encodeURIComponent(token)}`

        );

        const data = await response.json();

        console.log(data);

        if (data.success) {

            showSuccess(data.guest);

        }

        else if (data.status === "duplicate") {

            showDuplicate(data.guest);

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
// SESSION MANAGER
// =====================================================

function resumeScanningSession() {

    setTimeout(function () {

        hideOverlay();

        qrInput.value = "";

        qrInput.focus();

        processing = false;

        if (scannerRunning && html5QrCode) {

            html5QrCode.resume();

        }

    }, CONFIG.OVERLAY_DURATION);

}
// =====================================================
// OVERLAY ENGINE
// =====================================================

function setOverlay(type) {

    result.className = "result-overlay";

    result.classList.add(type);

    result.style.display = "flex";

}

function hideOverlay() {

    result.style.display = "none";

}

function showProcessing() {

    setOverlay("processing");

    statusIcon.textContent = "⏳";

    resultTitle.textContent = "VERIFYING GUEST...";

    guestName.textContent = "";

    details.textContent = "Please wait...";

}

function showSuccess(data) {

    setOverlay("success");

    statusIcon.textContent = "✓";

    resultTitle.textContent = "CHECK-IN SUCCESSFUL";

    guestName.textContent =
        data.name || "";

    details.innerHTML =
        "<strong>" +
        (data.registrationNumber || "") +
        "</strong><br>" +
        (data.ticketType || "");

    playSuccessSound();

}

function showDuplicate(data) {

    setOverlay("duplicate");

    statusIcon.textContent = "⚠";

    resultTitle.textContent = "ALREADY CHECKED IN";

    guestName.textContent =
        data.name || "";

    details.innerHTML =
        "<strong>" +
        (data.registrationNumber || "") +
        "</strong><br>" +
        (data.ticketType || "") +
        "<br><br>" +
        "Checked in at:<br><strong>" +
        formatTimestamp(data.checkinTime) +
        "</strong>";

    playDuplicateSound();

}

function showInvalidQR() {

    setOverlay("error");

    statusIcon.textContent = "✕";

    resultTitle.textContent = "INVALID QR CODE";

    guestName.textContent = "";

    details.textContent =
        "QR code not recognised.";

    playInvalidSound();

}

function showSystemError() {

    setOverlay("error");

    statusIcon.textContent = "✕";

    resultTitle.textContent = "SYSTEM ERROR";

    guestName.textContent = "";

    details.textContent =
        "Unable to connect to the server.";

    playErrorSound();

}
// =====================================================
// AUDIO ENGINE
// =====================================================

function playSuccessSound() {

    playTone(880, 0.12, "sine");

    setTimeout(() => {

        playTone(1175, 0.12, "sine");

    }, 130);

}


function playDuplicateSound() {

    playTone(450, 0.18, "triangle");

}


function playInvalidSound() {

    playTone(220, 0.18, "square");

    setTimeout(() => {

        playTone(180, 0.18, "square");

    }, 180);

}


function playErrorSound() {

    playTone(160, 0.30, "sawtooth");

}


function playTone(frequency, duration, type) {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        const ctx = new AudioContext();

        const oscillator = ctx.createOscillator();

        const gain = ctx.createGain();

        oscillator.type = type;

        oscillator.frequency.value = frequency;

        oscillator.connect(gain);

        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);

        oscillator.start();

        oscillator.stop(ctx.currentTime + duration);

    }

    catch (e) {

        console.log("Audio unavailable.");

    }

}
// =====================================================
// UTILITIES
// =====================================================

function formatTimestamp(timestamp) {

    if (!timestamp) return "";

    const date = new Date(timestamp);

    return date.toLocaleString("en-GB", {

        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"

    });

}