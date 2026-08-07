// =====================================
// TRAKIVENT
// Check-in Station
// Version 1.0
// =====================================

const scanner =
    new Html5Qrcode("reader");

    // Prevent immediate duplicate scans
let lastScannedToken = "";
let lastScanTime = 0;

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

function stopScanner(){

    scanner.stop();

}

async function onScanSuccess(decodedText){

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

    document.getElementById("stationResult").innerHTML =

        `
        <h2>Searching Guest...</h2>
        `;

    await stationSearch(decodedText);

}

// =====================================
// Search Guest
// =====================================

async function stationSearch(token){

    const data =
        await apiSearch(token);

    if(!data.success || !data.guests || data.guests.length === 0){

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

},2000);

    return;

}

    const guest =
        data.guests[0];

        // =====================================
// Already Checked In
// =====================================

if(guest.checkedIn){

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

            ${new Date(guest.checkinTime).toLocaleString()}

        </strong>

    </div>

    `;

   setTimeout(function(){

    document.getElementById("stationResult").innerHTML =
        "Waiting for Guest...";

    lastScannedToken = "";
    lastScanTime = 0;

    startScanner();

},2000);

    return;

}

    const initials = guest.fullName
    .split(" ")
    .map(n => n[0])
    .join("")
    .substring(0,2)
    .toUpperCase();

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
await stationCheckin(guest.qrToken);
}

// =====================================
// Station Check-in
// =====================================

async function stationCheckin(token){

    try{

        const data =
            await apiCheckin(token);

        if(!data.success){

    document.getElementById("stationResult").innerHTML = `

        <div class="stationInvalid">

            <div class="invalidIcon">✖</div>

            <h2>

                ${data.message || "Unable to check in guest."}

            </h2>

        </div>

    `;

    setTimeout(function(){

        document.getElementById("stationResult").innerHTML =
            "Waiting for Guest...";

        lastScannedToken = "";
        lastScanTime = 0;

        startScanner();

    },2000);

    return;

}

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

},1500);

    }

    catch(error){

        console.error("Station Check-in:", error);

        alert("Check-in failed.");

        startScanner();

    }

}

startScanner();