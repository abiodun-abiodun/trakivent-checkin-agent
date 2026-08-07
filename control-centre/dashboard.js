// =====================================
// TRAKIVENT
// Event Control Centre
// dashboard.js
// Version 0.4.4
// =====================================



let guestFilter = "all";

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



// =====================================
// Guest List
// =====================================


// =====================================
// Refresh Entire Control Centre
// =====================================

async function refreshDashboard() {

    await Promise.all([

        loadDashboard(),

        refreshFeed(),

        refreshGuestList()

    ]);

}


refreshDashboard();

setInterval(refreshDashboard, 5000);
// =====================================
// Manual Check In
// =====================================

async function checkinGuest(token){

    try{

        const data =
            await apiCheckin(token);

        if(data.success){

            await refreshDashboard();

            searchGuest(token);

        }else{

            alert(data.message || "Unable to check in guest.");

        }

    }

    catch(error){

        console.error("Check-in:", error);

    }

}



// =====================================
// Manual Check-in
// =====================================


// =====================================
// Undo Check-in
// =====================================

async function undoGuest(token){

    try{

        const data =
            await apiUndo(token);

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

        console.error("Undo:", error);

    }

}



// ======================================
// Guest Filters
// ======================================


document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".filterBtn").forEach(function (btn) {

        btn.addEventListener("click", function () {

            document.querySelectorAll(".filterBtn").forEach(function (b) {

                b.classList.remove("activeFilter");

            });

            this.classList.add("activeFilter");

            guestFilter = this.dataset.filter;

            refreshGuestList();

        });

    });

});