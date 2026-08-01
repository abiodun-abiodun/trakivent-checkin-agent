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

        const guest =
            data.guests[0];

        result.innerHTML = `

            <div class="searchCard">

                <h3>${guest.fullName}</h3>

                <p><strong>Registration:</strong> ${guest.registrationNo}</p>

                <p><strong>Ticket:</strong> ${guest.ticketType}</p>

                <p><strong>Category:</strong> ${guest.guestCategory || "-"}</p>

                <p><strong>Table:</strong> ${guest.tableNumber || "-"}</p>

                <p>

                    <strong>Status:</strong>

                    <span class="${guest.checkedIn ? "statusChecked" : "statusPending"}">

                        ${guest.checkedIn ? "✅ Checked In" : "⏳ Pending"}

                    </span>

                </p>

            </div>

        `;

    }

    catch (error) {

        console.error("Search Error:", error);

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
// Auto Refresh
// =====================================

async function refreshDashboard() {

    await loadDashboard();

    await loadRecentFeed();

}

refreshDashboard();

setInterval(refreshDashboard, 5000);