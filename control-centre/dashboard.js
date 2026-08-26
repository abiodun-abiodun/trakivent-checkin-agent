// =====================================
// TRAKIVENT
// Event Control Centre
// dashboard.js
// Version 0.5.3
// =====================================


let guestFilter = "all";


// =====================================
// Control Centre Configuration
// =====================================

// Current event selected in the Control Centre.
// Default event is EVT-001.

let CONTROL_EVENT_ID = "EVT-001";


// =====================================
// Event Selector
// =====================================

function getSelectedEventId() {

    return CONTROL_EVENT_ID;

}


// =====================================
// Load Events Into Selector
// =====================================

async function loadEventSelector() {

    const eventSelector =
        document.getElementById(
            "eventSelector"
        );


    if (!eventSelector) {

        return;

    }


    try {

        const result =
            await apiEvents();


        if (
            !result ||
            !result.success ||
            !Array.isArray(result.events)
        ) {

            console.error(
                "Unable to load events:",
                result
            );

            return;

        }


        // ---------------------------------
        // Clear existing options
        // ---------------------------------

        eventSelector.innerHTML = "";


        // ---------------------------------
        // Add available events
        // ---------------------------------

        result.events.forEach(
            function(event) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    event.eventId;


                option.textContent =
                    event.eventName;


                eventSelector.appendChild(
                    option
                );

            }
        );


        // ---------------------------------
        // Select current event
        // ---------------------------------

        const currentEvent =
            result.events.find(
                function(event) {

                    return (
                        String(event.eventId)
                            .trim() ===
                        String(CONTROL_EVENT_ID)
                            .trim()
                    );

                }
            );


        if (currentEvent) {

            eventSelector.value =
                currentEvent.eventId;

        }


        // ---------------------------------
        // Fallback to first event
        // ---------------------------------

        else if (
            result.events.length > 0
        ) {

            CONTROL_EVENT_ID =
                result.events[0].eventId;


            eventSelector.value =
                CONTROL_EVENT_ID;

        }


        // ---------------------------------
        // Event Change Handler
        // ---------------------------------

        eventSelector.addEventListener(
            "change",
            function() {

                changeControlEvent(
                    this.value
                );

            }
        );

    }


    catch (error) {

        console.error(
            "Event Selector Error:",
            error
        );

    }

}


// =====================================
// Change Event
// =====================================

async function changeControlEvent(eventId) {

    if (!eventId) {

        return;

    }


    CONTROL_EVENT_ID =
        eventId;


    // ---------------------------------
    // Clear current guest search
    // ---------------------------------

    const searchBox =
        document.getElementById(
            "searchBox"
        );


    if (searchBox) {

        searchBox.value = "";

    }


    const searchResult =
        document.getElementById(
            "searchResult"
        );


    if (searchResult) {

        searchResult.innerHTML = `

            <div class="emptySearch">

                Start typing to search...

            </div>

        `;

    }


    // ---------------------------------
    // Reset guest filter
    // ---------------------------------

    guestFilter =
        "all";


    document
        .querySelectorAll(
            ".filterBtn"
        )
        .forEach(
            function(btn) {

                btn.classList.remove(
                    "activeFilter"
                );

            }
        );


    const allButton =
        document.querySelector(
            '.filterBtn[data-filter="all"]'
        );


    if (allButton) {

        allButton.classList.add(
            "activeFilter"
        );

    }


    // ---------------------------------
    // Refresh everything
    // ---------------------------------

    await refreshDashboard();

}


// =====================================
// Dashboard Overview
// =====================================

async function loadDashboard() {

    try {

        const data =
            await apiDashboard();


        if (!data.success) {

            console.error(
                "Dashboard:",
                data.message
            );

            return;

        }


        document
            .getElementById(
                "eventName"
            )
            .textContent =
                data.eventName;


        document
            .getElementById(
                "expectedGuests"
            )
            .textContent =
                data.expectedGuests;


        document
            .getElementById(
                "checkedIn"
            )
            .textContent =
                data.checkedIn;


        document
            .getElementById(
                "remaining"
            )
            .textContent =
                data.remaining;


        document
            .getElementById(
                "attendance"
            )
            .textContent =
                data.attendance + "%";


        document
            .getElementById(
                "attendanceLabel"
            )
            .textContent =
                data.attendance + "%";


        document
            .getElementById(
                "vipExpected"
            )
            .textContent =
                data.vipExpected;


        document
            .getElementById(
                "vipChecked"
            )
            .textContent =
                data.vipCheckedIn;


        document
            .getElementById(
                "progressFill"
            )
            .style.width =
                data.attendance + "%";

    }


    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

    }

}


// =====================================
// Refresh Entire Control Centre
// =====================================

async function refreshDashboard() {

    await Promise.all([

        loadDashboard(),

        refreshFeed(),

        refreshGuestList(),

        refreshStationMonitor()

    ]);

}


// =====================================
// Manual Check In
// =====================================

async function checkinGuest(token) {

    try {

        const data =
            await apiCheckin(token);


        if (data.success) {

            await refreshDashboard();

            searchGuest(token);

        }


        else {

            alert(
                data.message ||
                "Unable to check in guest."
            );

        }

    }


    catch (error) {

        console.error(
            "Check-in:",
            error
        );

    }

}


// =====================================
// Undo Check-in
// =====================================

async function undoGuest(token) {

    try {

        const data =
            await apiUndo(token);


        if (!data.success) {

            alert(
                data.message ||
                "Unable to undo check-in."
            );

            return;

        }


        await refreshDashboard();


        searchGuest(
            data.guest.registrationNo
        );

    }


    catch (error) {

        console.error(
            "Undo:",
            error
        );

    }

}


// =====================================
// Control Centre Initialisation
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {


        // ---------------------------------
        // Guest Filters
        // ---------------------------------

        document
            .querySelectorAll(
                ".filterBtn"
            )
            .forEach(
                function(btn) {

                    btn.addEventListener(
                        "click",
                        function() {


                            document
                                .querySelectorAll(
                                    ".filterBtn"
                                )
                                .forEach(
                                    function(b) {

                                        b.classList
                                            .remove(
                                                "activeFilter"
                                            );

                                    }
                                );


                            this.classList.add(
                                "activeFilter"
                            );


                            guestFilter =
                                this.dataset.filter;


                            refreshGuestList();

                        }
                    );

                }
            );


        // ---------------------------------
        // Event Selector
        // ---------------------------------

        await loadEventSelector();


        // ---------------------------------
        // Initial Dashboard Load
        // ---------------------------------

        await refreshDashboard();

    }
);


// =====================================
// Automatic Refresh
// =====================================

setInterval(
    refreshDashboard,
    5000
);