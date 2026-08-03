// =====================================
// TRAKIVENT
// Event Control Centre
// dashboard.js
// Version 0.4.4
// =====================================

const API_URL =
"https://script.google.com/macros/s/AKfycbx-PZRxcXfgbz09VGvQJYc34Cpv6hro1XJb_8oNcEOOIwTIDjpukz6KStuM2St1u_-2/exec";

// =====================================
// Dashboard Overview
// =====================================

async function loadDashboard() {

    try {

        const response =
            await fetch(`${API_URL}?action=dashboard`);

        const data =
            await response.json();

        if (!data.success) return;

        document.getElementById("eventName").textContent =
            data.eventName;

        document.getElementById("expectedGuests").textContent =
            data.expectedGuests;

        document.getElementById("checkedIn").textContent =
            data.checkedIn;

        document.getElementById("remaining").textContent =
            data.remaining;

        document.getElementById("attendance").textContent =
            data.attendance + "%";

        document.getElementById("attendanceLabel").textContent =
            data.attendance + "%";

        document.getElementById("vipExpected").textContent =
            data.vipExpected;

        document.getElementById("vipChecked").textContent =
            data.vipCheckedIn;

        document.getElementById("progressFill").style.width =
            data.attendance + "%";

    }

    catch (error) {

        console.error("Dashboard Error:", error);

    }

}

// =====================================
// Recent Check-ins Feed
// =====================================

async function loadRecentFeed() {

    try {

        const response =
            await fetch(`${API_URL}?action=recent`);

        const data =
            await response.json();

        const feed =
            document.getElementById("recentFeed");

        feed.innerHTML = "";

        if (!data.success || data.recent.length === 0) {

            feed.innerHTML =
                '<div class="emptyFeed">No recent check-ins.</div>';

            return;

        }

        data.recent.forEach(function (guest) {

            const item =
                document.createElement("div");

            item.className =
                "feedItem";

            const time =
                new Date(
                    guest.checkinTime
                ).toLocaleTimeString([], {

                    hour: "2-digit",

                    minute: "2-digit"

                });

            item.innerHTML = `

                <div>

                    <div class="feedGuest">

                        ✓ ${guest.fullName}

                    </div>

                    <div class="feedCategory">

                        ${guest.ticketType}

                    </div>

                </div>

                <div class="feedTime">

                    ${time}

                </div>

            `;

            feed.appendChild(item);

        });

    }

    catch (error) {

        console.error("Recent Feed Error:", error);

    }

}

// =====================================
// Guest List
// =====================================

async function loadGuestList() {

    try {

        const response =
            await fetch(`${API_URL}?action=guestlist`);

        const data =
            await response.json();

        const guestList =
            document.getElementById("guestList");

        guestList.innerHTML = "";

        if (!data.success) {

            guestList.innerHTML =
                "<div class='emptyFeed'>No guests found.</div>";

            return;

        }

        const groups = {

            VIP: [],
            Regular: [],
            Staff: [],
            Vendor: []

        };

        const icons = {

            VIP: "👑",
            Regular: "👤",
            Staff: "🛠",
            Vendor: "🏪"

        };

        data.guests.forEach(function (guest) {

            if (groups[guest.ticketType]) {

                groups[guest.ticketType].push(guest);

            }

        });

        Object.keys(groups).forEach(function (type) {

            if (groups[type].length === 0) return;

            // Pending first
            groups[type].sort(function(a, b){

                if(a.checkedIn === b.checkedIn) return 0;

                return a.checkedIn ? 1 : -1;

            });

            const header =
                document.createElement("div");

            header.className = "groupHeader";

            header.innerHTML =
                `${icons[type]} ${type.toUpperCase()} (${groups[type].length})`;

            guestList.appendChild(header);

            groups[type].forEach(function (guest) {

                const item =
                    document.createElement("div");

                item.className = "guestItem";

                item.innerHTML = `

                    <div class="guestRow">

                        <div>

                            <div class="guestName">

                                ${guest.fullName}

                            </div>

                            <div class="guestTicket ticket-${guest.ticketType.toLowerCase()}">

                                ${guest.registrationNo}

                            </div>

                        </div>

                        <div class="${guest.checkedIn ? "guestStatusIn" : "guestStatusOut"}">

                            ${guest.checkedIn ? "✓" : "●"}

                        </div>

                    </div>

                `;

                item.addEventListener("click", function () {

                    document
                        .querySelectorAll(".guestItem")
                        .forEach(function (g) {

                            g.classList.remove("activeGuest");

                        });

                    item.classList.add("activeGuest");

                    document.getElementById("searchBox").value =
                        guest.registrationNo;

                    searchGuest(guest.registrationNo);

                });

                guestList.appendChild(item);

            });

        });

    }

    catch (error) {

        console.error("Guest List:", error);

    }

}

// =====================================
// Guest Search
// =====================================

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

        const guest = data.guests[0];

        const statusBadge =
            guest.checkedIn
                ? `<span class="statusChecked">✅ CHECKED IN</span>`
                : `<span class="statusPending">⏳ PENDING</span>`;

        const actionButton =
            guest.checkedIn
                ? `
                    <button
                        class="undoBtn"
                        onclick="undoGuest('${guest.qrToken}')">
                        Undo Check-in
                    </button>
                  `
                : `
                    <button
                        class="checkinBtn"
                        onclick="checkinGuest('${guest.qrToken}')">
                        Check In
                    </button>
                  `;

        result.innerHTML = `

<div class="searchCard">

    <div class="guestHeader">

        <div class="guestAvatar">

            ${guest.fullName
                .split(" ")
                .map(n => n[0])
                .join("")
                .substring(0,2)
                .toUpperCase()}

        </div>

        <div class="guestIdentity">

            <h3>${guest.fullName}</h3>

            <span class="ticketBadge ticket-${guest.ticketType.toLowerCase()}">

                ${guest.ticketType}

            </span>

        </div>

    </div>

    <div class="guestInfo">

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

                    Checked In

                </span>

                <span>

                    ${new Date(guest.checkinTime).toLocaleString()}

                </span>

            </div>
            `
            : ""
        }

    </div>

    <div class="guestActions">

        ${actionButton}

    </div>

</div>

`;

    }

    catch(error){

        console.error(error);

    }

}

// =====================================
// Search Event
// =====================================

document
.getElementById("searchBox")
.addEventListener("keyup", function () {

    searchGuest(this.value);

});

// =====================================
// Refresh Entire Control Centre
// =====================================

async function refreshDashboard() {

    await Promise.all([

        loadDashboard(),

        loadRecentFeed(),

        loadGuestList()

    ]);

}

refreshDashboard();

setInterval(refreshDashboard, 5000);
// =====================================
// Manual Check In
// =====================================

async function checkinGuest(token){

    try{

        const response =
            await fetch(
                `${API_URL}?action=manualcheckin&token=${token}`
            );

        const data =
            await response.json();

        if(data.success){

            await refreshDashboard();

            searchGuest(token);

        }else{

            alert(data.message || "Unable to check in guest.");

        }

    }

    catch(error){

        console.error(error);

    }

}

// =====================================
// Undo Check In
// =====================================

async function undoGuest(token){

    try{

        const response =
            await fetch(
                `${API_URL}?action=undocheckin&token=${token}`
            );

        const data =
            await response.json();

        if(data.success){

            await refreshDashboard();

            searchGuest(token);

        }else{

            alert(data.message || "Unable to undo check-in.");

        }

    }

    catch(error){

        console.error(error);

    }

}

// =====================================
// Manual Check-in
// =====================================

async function checkinGuest(token){

    try{

        const response =
            await fetch(
                `${API_URL}?action=manualcheckin&token=${encodeURIComponent(token)}`
            );

        const data =
            await response.json();

        if(!data.success){

            alert(data.message || "Unable to check in guest.");

            return;

        }

        // Refresh dashboard

        await refreshDashboard();

        // Refresh guest card

        searchGuest(
            data.guest.registrationNo
        );

    }

    catch(error){

        console.error(error);

    }

}

// =====================================
// Undo Check-in
// =====================================

async function undoGuest(token){

    try{

        const response =
            await fetch(
                `${API_URL}?action=undocheckin&token=${encodeURIComponent(token)}`
            );

        const data =
            await response.json();

        if(!data.success){

            alert(data.message || "Unable to undo check-in.");

            return;

        }

        await refreshDashboard();

        searchGuest(
            data.guest.registrationNo
        );

    }

    catch(error){

        console.error(error);

    }

}