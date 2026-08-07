// =====================================
// TRAKIVENT
// Search Module
// =====================================

async function searchGuest(query){

    const result =
        document.getElementById("searchResult");

    if(query.trim()===""){

        result.innerHTML=`

            <div class="emptySearch">

                Start typing to search...

            </div>

        `;

        return;

    }

    try{

        const data =
            await apiSearch(query);

        if(!data.success || data.count===0){

            result.innerHTML=`

                <div class="emptySearch">

                    No guest found.

                </div>

            `;

            return;

        }

        renderGuestProfile(data.guests[0]);

    }

    catch(error){

        console.error("Search:", error);

    }

}

function renderGuestProfile(guest){

    const result =
        document.getElementById("searchResult");

    const initials =
        guest.fullName
        .split(" ")
        .map(n=>n[0])
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

<div class="searchCard" id="activeGuestCard">

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

        ${guest.checkedIn ? `

        <div class="infoRow">

            <span class="label">

                Check-in Time

            </span>

            <span>

                ${new Date(guest.checkinTime).toLocaleString()}

            </span>

        </div>

        ` : ""}

    </div>

    <div class="profileActions">

        ${actionButton}

    </div>

</div>

`;

}

document
.getElementById("searchBox")
.addEventListener("keyup",function(){

    searchGuest(this.value);

});