// =====================================
// TRAKIVENT
// Event Control Centre
// dashboard.js
// Version 0.5.5
// =====================================


let guestFilter = "all";


// =====================================
// Control Centre Configuration
// =====================================

// Browser storage key for the selected event.

const CONTROL_EVENT_STORAGE_KEY =
    "trakivent_control_event_id";


// Current event selected in the Control Centre.
// Default fallback is EVT-001.

let CONTROL_EVENT_ID = "EVT-001";


// Prevent overlapping refresh requests.

let controlCentreRefreshing = false;


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
        // Load saved event
        // ---------------------------------

        const savedEventId =
            localStorage.getItem(
                CONTROL_EVENT_STORAGE_KEY
            );


        if (savedEventId) {

            CONTROL_EVENT_ID =
                savedEventId;

        }


        // ---------------------------------
        // Find current event
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


        // ---------------------------------
        // Restore saved/current event
        // ---------------------------------

        if (currentEvent) {

            CONTROL_EVENT_ID =
                currentEvent.eventId;

            eventSelector.value =
                currentEvent.eventId;


            localStorage.setItem(
                CONTROL_EVENT_STORAGE_KEY,
                CONTROL_EVENT_ID
            );

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


            localStorage.setItem(
                CONTROL_EVENT_STORAGE_KEY,
                CONTROL_EVENT_ID
            );

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
    // Save selected event
    // ---------------------------------

    localStorage.setItem(
        CONTROL_EVENT_STORAGE_KEY,
        CONTROL_EVENT_ID
    );


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
// Refresh Entire Control Centre
// =====================================

async function refreshDashboard() {

    // ---------------------------------
    // Prevent overlapping requests
    // ---------------------------------

    if (controlCentreRefreshing) {

        console.log(
            "Control Centre refresh skipped: previous request still running."
        );

        return;

    }


    controlCentreRefreshing = true;


    const startTime =
        performance.now();


    try {

        const data =
            await apiControlCentre();


        const apiTime =
            performance.now() -
            startTime;


        console.log(
            "Control Centre API:",
            Math.round(apiTime),
            "ms"
        );


        if (
            !data ||
            !data.success
        ) {

            console.error(
                "Control Centre:",
                data
            );

            return;

        }


        // ---------------------------------
        // Dashboard
        // ---------------------------------

        const dashboard =
            data.dashboard;


        if (dashboard) {

            const eventName =
                document.getElementById(
                    "eventName"
                );

            if (eventName) {

                eventName.textContent =
                    dashboard.eventName;

            }


            const expectedGuests =
                document.getElementById(
                    "expectedGuests"
                );

            if (expectedGuests) {

                expectedGuests.textContent =
                    dashboard.expectedGuests;

            }


            const checkedIn =
                document.getElementById(
                    "checkedIn"
                );

            if (checkedIn) {

                checkedIn.textContent =
                    dashboard.checkedIn;

            }


            const remaining =
                document.getElementById(
                    "remaining"
                );

            if (remaining) {

                remaining.textContent =
                    dashboard.remaining;

            }


            const attendance =
                document.getElementById(
                    "attendance"
                );

            if (attendance) {

                attendance.textContent =
                    dashboard.attendance + "%";

            }


            const attendanceLabel =
                document.getElementById(
                    "attendanceLabel"
                );

            if (attendanceLabel) {

                attendanceLabel.textContent =
                    dashboard.attendance + "%";

            }


            const vipExpected =
                document.getElementById(
                    "vipExpected"
                );

            if (vipExpected) {

                vipExpected.textContent =
                    dashboard.vipExpected;

            }


            const vipChecked =
                document.getElementById(
                    "vipChecked"
                );

            if (vipChecked) {

                vipChecked.textContent =
                    dashboard.vipCheckedIn;

            }


            const progressFill =
                document.getElementById(
                    "progressFill"
                );

            if (progressFill) {

                progressFill.style.width =
                    dashboard.attendance + "%";

            }

        }


        // ---------------------------------
        // Guest List
        // ---------------------------------

        renderGuestList(
            data.guests || []
        );


        // ---------------------------------
        // Recent Feed
        // ---------------------------------

        renderFeed(
            data.recent || []
        );


        // ---------------------------------
        // Station Monitor
        // ---------------------------------

        renderStationMonitor(
            data.stations || []
        );

    }


    catch (error) {

        console.error(
            "Control Centre Refresh:",
            error
        );

    }


    finally {

        controlCentreRefreshing =
            false;

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
