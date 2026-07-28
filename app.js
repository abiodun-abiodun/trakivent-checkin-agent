const qrInput = document.getElementById('qrInput');
const checkInButton = document.getElementById('checkInButton');
const scanCameraButton = document.getElementById('scanCameraButton');
const reader = document.getElementById('reader');

const result = document.getElementById('result');
const statusIcon = document.getElementById('statusIcon');
const resultTitle = document.getElementById('resultTitle');
const guestName = document.getElementById('guestName');
const details = document.getElementById('details');

let html5QrCode = null;


// =====================================
// TEMPORARY CAMERA TEST
// =====================================


function startCameraScanner() {

  // Switch buttons
  startScannerButton.style.display = 'none';
  stopScannerButton.style.display = 'block';

  const reader = document.getElementById('reader');

  reader.style.display = 'block';

  reader.innerHTML = '';

  html5QrCode = new Html5Qrcode('reader');

  html5QrCode.start(

    { facingMode: 'environment' },

    {

      fps: 10,

      qrbox: {
        width: 250,
        height: 250
      }

    },

function(decodedText) {

  qrInput.value = decodedText;

  console.log("PAUSE FUNCTION:", typeof html5QrCode.pause);
  console.log("RESUME FUNCTION:", typeof html5QrCode.resume);

  html5QrCode.pause(true);

  checkInGuest();

},

    function(errorMessage) {

      // Ignore normal scan errors

    }

  ).catch(function(error) {

    console.error('CAMERA START ERROR:', error);

    reader.style.display = 'none';

    showSystemError();

    // Restore buttons if camera fails
    startScannerButton.style.display = 'block';
    stopScannerButton.style.display = 'none';

  });

}
function stopCameraScanner() {

  if (html5QrCode) {

    html5QrCode.stop()

      .then(function() {

        html5QrCode.clear();

        html5QrCode = null;

        document.getElementById('reader').style.display = 'none';

        // Return buttons to idle state
        startScannerButton.style.display = 'block';
        stopScannerButton.style.display = 'none';

      })

      .catch(function(error) {

        console.error('CAMERA STOP ERROR:', error);

      });

  } else {

    // If scanner isn't running, still restore the buttons
    startScannerButton.style.display = 'block';
    stopScannerButton.style.display = 'none';

  }

}


// =====================================
// MANUAL CHECK-IN TEST
// =====================================

function checkInGuest() {

  const token = qrInput.value.trim();

  if (!token) {

    showInvalidQR();

    return;

  }

qrInput.value = token;

// Stop the camera before checking in
html5QrCode.pause(true);

// Automatically perform check-in
checkInGuest();

}


// =====================================
// BUTTON EVENTS
// =====================================

const startScannerButton = document.getElementById('startScannerButton');
const stopScannerButton = document.getElementById('stopScannerButton');

startScannerButton.addEventListener(
  'click',
  startCameraScanner
);

stopScannerButton.addEventListener(
  'click',
  stopCameraScanner
);

checkInButton.addEventListener(
  'click',
  checkInGuest
);


// =====================================
// ENTER KEY SUPPORT
// =====================================

qrInput.addEventListener(
  'keydown',
  function(event) {

    if (event.key === 'Enter') {

      event.preventDefault();

      checkInGuest();

    }

  }
);


// =====================================
// RESULT FUNCTIONS
// =====================================

function showSuccess(data) {

  result.className = 'success';

  result.style.display = 'block';

  statusIcon.textContent = '✓';

  resultTitle.textContent =
    'CHECK-IN SUCCESSFUL';

  guestName.textContent =
    data.name || '';

  details.innerHTML =
    '<strong>' +
    (data.registrationNumber || '') +
    '</strong><br>' +
    (data.ticketType || '');

  playSuccessSound();

}


function showAlreadyCheckedIn(data) {

  result.className = 'error';

  result.style.display = 'block';

  statusIcon.textContent = '⚠';

  resultTitle.textContent =
    'ALREADY CHECKED IN';

  guestName.textContent =
    data.name || '';

  details.textContent =
    'This guest has already been checked in.';

  playWarningSound();

}


function showInvalidQR() {

  result.className = 'error';

  result.style.display = 'block';

  statusIcon.textContent = '✕';

  resultTitle.textContent =
    'INVALID QR CODE';

  guestName.textContent = '';

  details.textContent =
    'QR code not recognised.';

  playErrorSound();

}


function showSystemError() {

  result.className = 'error';

  result.style.display = 'block';

  statusIcon.textContent = '✕';

  resultTitle.textContent =
    'SYSTEM ERROR';

  guestName.textContent = '';

  details.textContent =
    'Connection error. Please try again.';

  playErrorSound();

}


// =====================================
// SOUNDS
// =====================================

function playSuccessSound() {

  playTone(
    880,
    0.15,
    'sine'
  );

}


function playWarningSound() {

  playTone(
    440,
    0.25,
    'square'
  );

}


function playErrorSound() {

  playTone(
    220,
    0.35,
    'sawtooth'
  );

}


function playTone(
  frequency,
  duration,
  type
) {

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

    oscillator.type =
      type;

    oscillator.frequency.value =
      frequency;

    oscillator.connect(
      gainNode
    );

    gainNode.connect(
      audioContext.destination
    );

    gainNode.gain.setValueAtTime(
      0.15,
      audioContext.currentTime
    );

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime +
      duration
    );

  } catch (error) {

    console.log(
      'Audio unavailable.'
    );

  }

}


// =====================================
// INITIALISE
// =====================================

window.addEventListener(
  'load',
  function() {

    qrInput.focus();

  }
);