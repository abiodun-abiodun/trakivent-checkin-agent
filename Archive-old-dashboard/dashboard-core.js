// =====================================
// TRAKIVENT
// Dashboard Core
// =====================================

let guestFilter = "all";

/*
=====================================
Application Startup
=====================================
*/

async function initializeDashboard(){

    await refreshDashboard();

    setInterval(refreshDashboard, 5000);

}

/*
=====================================
Refresh Everything
=====================================
*/

async function refreshDashboard(){

    await loadDashboard();

    await loadRecentFeed();

    await loadGuestList();

}

/*
=====================================
Guest Filters
=====================================
*/

document.addEventListener("DOMContentLoaded", function(){

    document.querySelectorAll(".filterBtn").forEach(function(btn){

        btn.addEventListener("click", function(){

            document
                .querySelectorAll(".filterBtn")
                .forEach(function(b){

                    b.classList.remove("activeFilter");

                });

            this.classList.add("activeFilter");

            guestFilter =
                this.dataset.filter;

            loadGuestList();

        });

    });

    initializeDashboard();

});