// =====================================
// TRAKIVENT
// Shared API Module
// Version 0.5.1
// =====================================


// =====================================
// API URL
// =====================================

const API_URL =
    "https://script.google.com/macros/s/AKfycbx-PZRxcXfgbz09VGvQJYc34Cpv6hro1XJb_8oNcEOOIwTIDjpukz6KStuM2St1u_-2/exec";


// =====================================
// Context Helpers
// =====================================

// Get the current Event ID.
//
// Station:
//     STATION_EVENT_ID
//
// Control Centre:
//     CONTROL_EVENT_ID

function getCurrentEventId() {

    if (
        typeof STATION_EVENT_ID !== "undefined"
    ) {

        return STATION_EVENT_ID;

    }


    if (
        typeof CONTROL_EVENT_ID !== "undefined"
    ) {

        return CONTROL_EVENT_ID;

    }


    return "";

}


// =====================================
// Get Current Station ID
// =====================================

// Only Check-in Stations have a Station ID.
//
// Control Centre does not.

function getCurrentStationId() {

    if (
        typeof STATION_ID !== "undefined"
    ) {

        return STATION_ID;

    }


    return "";

}


// =====================================
// Generic API Request
// =====================================

async function apiRequest(
    action,
    token = "",
    eventId = "",
    stationId = ""
) {

    try {

        const response =
            await fetch(

                `${API_URL}` +
                `?action=${action}` +
                `&token=${encodeURIComponent(token)}` +
                `&eventId=${encodeURIComponent(eventId)}` +
                `&stationId=${encodeURIComponent(stationId)}`

            );


        // ---------------------------------
        // HTTP Error
        // ---------------------------------

        if (!response.ok) {

            return {

                success: false,

                networkError: true,

                message:
                    "Unable to reach TRAKIVENT server."

            };

        }


        // ---------------------------------
        // Parse JSON
        // ---------------------------------

        const data =
            await response.json();


        return data;

    }


    catch (error) {

        console.error(
            "TRAKIVENT API Error:",
            error
        );


        return {

            success: false,

            networkError: true,

            message:
                "Unable to reach TRAKIVENT server."

        };

    }

}


// =====================================
// Dashboard
// =====================================

async function apiDashboard() {

    return await apiRequest(

        "dashboard",

        "",

        getCurrentEventId()

    );

}


// =====================================
// Recent Feed
// =====================================

async function apiRecent() {

    return await apiRequest(

        "recent",

        "",

        getCurrentEventId()

    );

}


// =====================================
// Guest Search
// =====================================

async function apiSearch(query) {

    return await apiRequest(

        "search",

        query,

        getCurrentEventId()

    );

}

// =====================================
// Station QR Lookup
// =====================================

async function apiStationLookup(token) {

    return await apiRequest(

        "stationlookup",

        token,

        getCurrentEventId(),

        getCurrentStationId()

    );

}

// =====================================
// Guest List
// =====================================

async function apiGuestList() {

    return await apiRequest(

        "guestlist",

        "",

        getCurrentEventId()

    );

}

// =====================================
// Events
// =====================================

async function apiEvents() {

    return await apiRequest(

        "events",

        "",

        "",

        ""

    );

}

// =====================================
// Station Monitor
// =====================================
//
// Control Centre uses Event ID only.
//
// It does NOT send a Station ID.
//

async function apiStationMonitor() {

    return await apiRequest(

        "stationmonitor",

        "",

        getCurrentEventId()

    );

}


// =====================================
// Check In
// =====================================

async function apiCheckin(token) {

    return await apiRequest(

        "checkin",

        token,

        getCurrentEventId(),

        getCurrentStationId()

    );

}


// =====================================
// Undo Check In
// =====================================

async function apiUndo(token) {

    return await apiRequest(

        "undocheckin",

        token,

        getCurrentEventId(),

        getCurrentStationId()

    );

}