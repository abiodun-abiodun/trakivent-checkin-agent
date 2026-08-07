const API_URL =
"https://script.google.com/macros/s/AKfycbx-PZRxcXfgbz09VGvQJYc34Cpv6hro1XJb_8oNcEOOIwTIDjpukz6KStuM2St1u_-2/exec";

const html5QrCode =
new Html5Qrcode("reader");

let scannerBusy = false;

async function onScanSuccess(decodedText){

    if(scannerBusy) return;

    scannerBusy = true;

    html5QrCode.pause();

    await searchGuest(decodedText);

}

async function startScanner(){

    try{

        const cameras =
            await Html5Qrcode.getCameras();

        if(!cameras.length){

            alert("No camera found.");

            return;

        }

        await html5QrCode.start(

            cameras[0].id,

            {

                fps:10,

                qrbox:250

            },

            onScanSuccess

        );

    }

    catch(err){

        console.error(err);

    }

}

document.addEventListener(

    "DOMContentLoaded",

    startScanner

);

async function searchGuest(query) {

    const result =
        document.getElementById("searchResult");

    if (query.trim() === "") {

        result.innerHTML = `

            <div class="emptySearch">

                Start typing to search...

            </div>

        `;

        return;

    }

    try {

        const response =
            await fetch(
                `${API_URL}?action=search&token=${encodeURIComponent(query)}`
            );

        const data =
            await response.json();

        if (!data.success || data.count === 0) {

            result.innerHTML = `

                <div class="emptySearch">

                    No guest found.

                </div>

            `;

            return;

        }

        const guest =
            data.guests[0];

        const initials =
            guest.fullName
                .split(" ")
                .map(n => n[0])
                .join("")
                .substring(0,2)
                .toUpperCase();

        const badgeClass =
            "ticket-" + guest.ticketType.toLowerCase();

        const statusBadge =
            guest.checkedIn
            ? '<span class="statusChecked">🟢 Checked In</span>'
            : '<span class="statusPending">🔴 Pending</span>';

        const actionButton =
            guest.checkedIn
            ? `
                <button
                    class="undoBtn"
                    onclick="undoGuest('${guest.qrToken}')">

                    ↩ Undo Check-In

                </button>
              `
            : `
                <button
                    class="checkinBtn"
                    onclick="checkinGuest('${guest.qrToken}')">

                    ✔ Check In

                </button>
              `;

        result.innerHTML = `

<div class="searchCard">

    <div class="profileHeader">

        <div class="profileAvatar">

            ${initials}

        </div>

        <div class="profileIdentity">

            <h2>${guest.fullName}</h2>

            <span class="ticketBadge ${badgeClass}">

                ${guest.ticketType}

            </span>

        </div>

    </div>

    <div class="profileBody">

        <div class="infoRow">

            <span class="label">Registration</span>

            <span>${guest.registrationNo}</span>

        </div>

        <div class="infoRow">

            <span class="label">Category</span>

            <span>${guest.guestCategory || "-"}</span>

        </div>

        <div class="infoRow">

            <span class="label">Table</span>

            <span>${guest.tableNumber || "-"}</span>

        </div>

        <div class="infoRow">

            <span class="label">Status</span>

            <span>${statusBadge}</span>

        </div>

        ${
            guest.checkedIn
            ? `
            <div class="infoRow">

                <span class="label">

                    Check-in Time

                </span>

                <span>

                    ${new Date(guest.checkinTime).toLocaleString()}

                </span>

            </div>
            `
            : ""
        }

    </div>

    <div class="profileActions">

        ${actionButton}

    </div>

</div>

`;

    }

    catch(error){

        console.error("Search:", error);

    }

}