// =====================================
// TRAKIVENT
// Check-in Station
// Version 1.0
// =====================================

const scanner =
    new Html5Qrcode("reader");

  // -------------------------------------
// Station Configuration
// -------------------------------------

// -------------------------------------
// Station Configuration
// -------------------------------------

const params =
    new URLSearchParams(
        window.location.search
    );

const STATION_ID =
    params.get("station") || "ST-001";

const STATION_EVENT_ID =
    params.get("event") || "EVT-001";

// =====================================
// Scan Protection
// =====================================

let lastScannedToken = "";
let lastScanTime = 0;


// =====================================
// Start Scanner
// =====================================

function startScanner(){

    scanner.start(

        {
            facingMode: "environment"
        },

        {
            fps: 10,
            qrbox: 250
        },

        onScanSuccess,

        function(error){

            // Ignore continuous scan errors

        }

    );

}


// =====================================
// Stop Scanner
// =====================================

function stopScanner(){

    scanner.stop();

}


// =====================================
// QR Scan Success
// =====================================

async function onScanSuccess(decodedText){

    // =====================================
    // Block scan when offline
    // =====================================

    if(!navigator.onLine){

        document.getElementById("stationResult").innerHTML = `

            <div class="stationOffline">

                <div class="offlineIcon">
                    ⚠
                </div>

                <h1>
                    CONNECTION LOST
                </h1>

                <p>
                    Internet connection is unavailable.
                </p>

                <small>
                    Please wait for the connection to return.
                </small>

            </div>

        `;

        return;

    }


    const now = Date.now();


    // Ignore duplicate scan within 3 seconds

    if(
        decodedText === lastScannedToken &&
        now - lastScanTime < 3000
    ){

        return;

    }


    lastScannedToken = decodedText;
    lastScanTime = now;


    stopScanner();


    document.getElementById("stationResult").innerHTML = `

        <h2>
            Searching Guest...
        </h2>

    `;


    await stationSearch(decodedText);

}


// =====================================
// Search Guest
// =====================================

async function stationSearch(token){

    try{

        const data =
    await apiStationLookup(token);


// =====================================
// Network / API Failure
// =====================================

if(data.networkError){

    document.getElementById("stationResult").innerHTML = `

        <div class="stationOffline">

            <div class="offlineIcon">⚠</div>

            <h1>CONNECTION PROBLEM</h1>

            <p>
                Unable to reach TRAKIVENT server.
            </p>

        </div>

    `;

    return;

}


// =====================================
// Wrong Event
// =====================================

if(data.status === "wrong_event"){

    playWarningSound();

    document.getElementById("stationResult").innerHTML = `

        <div class="stationAlready">

            <div class="alreadyIcon">
                ⚠
            </div>

            <h1>
                WRONG EVENT
            </h1>

            <h2>
                Guest belongs to another event
            </h2>

            <p>
                Please direct the guest
                to the correct check-in station.
            </p>

        </div>

    `;

    setTimeout(function(){

        document.getElementById("stationResult").innerHTML =
            "Waiting for Guest...";

        lastScannedToken = "";
        lastScanTime = 0;

        startScanner();

    },3000);

    return;

}


// =====================================
// Invalid QR
// =====================================

if(
    !data.success ||
    !data.guest
){

    playErrorSound();

    document.getElementById("stationResult").innerHTML = `

        <div class="stationInvalid">

            <div class="invalidIcon">
                ✖
            </div>

            <h1>
                INVALID QR
            </h1>

            <p>
                Guest not found.
            </p>

            <small>
                Please contact the Event Help Desk.
            </small>

        </div>

    `;

    setTimeout(function(){

        document.getElementById("stationResult").innerHTML =
            "Waiting for Guest...";

        lastScannedToken = "";
        lastScanTime = 0;

        startScanner();

    },2500);

    return;

}


// =====================================
// Guest Found
// =====================================

const guest =
    data.guest;


        // =====================================
        // Already Checked In
        // =====================================

        if(guest.checkedIn){

            playWarningSound();

            document.getElementById("stationResult").innerHTML = `

                <div class="stationAlready">

                    <div class="alreadyIcon">
                        ⚠
                    </div>

                    <h1>
                        ALREADY CHECKED IN
                    </h1>

                    <h2>
                        ${guest.fullName}
                    </h2>

                    <div class="stationBadge ticket-${guest.ticketType.toLowerCase()}">

                        ${guest.ticketType}

                    </div>

                    <p>
                        Checked in:
                    </p>

                    <strong>

                        ${new Date(
                            guest.checkinTime
                        ).toLocaleString()}

                    </strong>

                </div>

            `;


            setTimeout(function(){

                document.getElementById("stationResult").innerHTML =
                    "Waiting for Guest...";

                lastScannedToken = "";
                lastScanTime = 0;

                startScanner();

            },2500);


            return;

        }


        // =====================================
        // Guest Initials
        // =====================================

        const initials =
            guest.fullName
                .split(" ")
                .map(n => n[0])
                .join("")
                .substring(0,2)
                .toUpperCase();


        // =====================================
        // Checking In Screen
        // =====================================

        document.getElementById("stationResult").innerHTML = `

            <div class="stationCard">

                <div class="stationAvatar">

                    ${initials}

                </div>

                <h2 class="stationName">

                    ${guest.fullName}

                </h2>

                <div class="stationBadge ticket-${guest.ticketType.toLowerCase()}">

                    ${guest.ticketType}

                </div>

                <h3>

                    Checking In...

                </h3>

            </div>

        `;


        await stationCheckin(
            guest.qrToken
        );

    }

    catch(error){

        console.error(
            "Station Search:",
            error
        );


        document.getElementById("stationResult").innerHTML = `

            <div class="stationOffline">

                <div class="offlineIcon">
                    ⚠
                </div>

                <h1>
                    CONNECTION PROBLEM
                </h1>

                <p>
                    Unable to communicate with TRAKIVENT.
                </p>

                <small>
                    Please check the network connection.
                </small>

            </div>

        `;

    }

}


// =====================================
// Station Check-in
// =====================================

async function stationCheckin(token){

    try{

        const data =
            await apiCheckin(token);


        // =====================================
        // Network / API Failure
        // =====================================

        if(data.networkError){

            document.getElementById("stationResult").innerHTML = `

                <div class="stationOffline">

                    <div class="offlineIcon">
                        ⚠
                    </div>

                    <h1>
                        CONNECTION PROBLEM
                    </h1>

                    <p>
                        Unable to reach TRAKIVENT server.
                    </p>

                    <small>
                        Please check the network connection.
                    </small>

                </div>

            `;

            return;

        }


        // =====================================
        // Normal Check-in Failure
        // =====================================

        if(!data.success){

            document.getElementById("stationResult").innerHTML = `

                <div class="stationInvalid">

                    <div class="invalidIcon">
                        ✖
                    </div>

                    <h2>

                        ${data.message ||
                        "Unable to check in guest."}

                    </h2>

                </div>

            `;


            setTimeout(function(){

                document.getElementById("stationResult").innerHTML =
                    "Waiting for Guest...";

                lastScannedToken = "";
                lastScanTime = 0;

                startScanner();

            },2500);


            return;

        }


        // =====================================
        // Successful Check-in
        // =====================================

        playSuccessSound();

document.getElementById("stationResult").innerHTML = `

<div class="stationSuccess">

                <div class="successIcon">
                    ✓
                </div>

                <h1>
                    CHECKED IN
                </h1>

                <h2>
                    ${data.guest.fullName}
                </h2>

                <div class="stationBadge ticket-${data.guest.ticketType.toLowerCase()}">

                    ${data.guest.ticketType}

                </div>

                <p>
                    Welcome!
                </p>

            </div>

        `;


        setTimeout(function(){

            document.getElementById("stationResult").innerHTML =
                "Waiting for Guest...";

            lastScannedToken = "";
            lastScanTime = 0;

            startScanner();

        },2000);

    }

    catch(error){

        console.error(
            "Station Check-in:",
            error
        );


        document.getElementById("stationResult").innerHTML = `

            <div class="stationOffline">

                <div class="offlineIcon">
                    ⚠
                </div>

                <h1>
                    CONNECTION PROBLEM
                </h1>

                <p>
                    Unable to communicate with TRAKIVENT.
                </p>

                <small>
                    Please check the network connection.
                </small>

            </div>

        `;

    }

}


// =====================================
// Network Connection Status
// =====================================

function updateConnectionStatus(){

    const status =
        document.getElementById("connectionStatus");


    if(!status) return;


    if(navigator.onLine){

        status.textContent =
            "● Online";

        status.className =
            "connectionOnline";

    }

    else{

        status.textContent =
            "● Offline";

        status.className =
            "connectionOffline";

    }

}


// =====================================
// Network Goes Offline
// =====================================

window.addEventListener(

    "offline",

    updateConnectionStatus

);


// =====================================
// Network Comes Back Online
// =====================================

window.addEventListener(

    "online",

    function(){

        updateConnectionStatus();


        document.getElementById("stationResult").innerHTML = `

            <div class="stationOnline">

                <div class="onlineIcon">
                    ✓
                </div>

                <h2>
                    CONNECTION RESTORED
                </h2>

                <p>
                    Ready for the next guest.
                </p>

            </div>

        `;


        setTimeout(function(){

            document.getElementById("stationResult").innerHTML =
                "Waiting for Guest...";

            lastScannedToken = "";
            lastScanTime = 0;

        },1200);

    }

);


// =====================================
// Initialise
// =====================================

updateConnectionStatus();

startScanner();