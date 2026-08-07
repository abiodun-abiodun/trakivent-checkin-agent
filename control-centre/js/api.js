// =====================================
// TRAKIVENT
// Shared API Module
// =====================================

const API_URL =
"https://script.google.com/macros/s/AKfycbx-PZRxcXfgbz09VGvQJYc34Cpv6hro1XJb_8oNcEOOIwTIDjpukz6KStuM2St1u_-2/exec";

/*
========================================
Generic API Request
========================================
*/

async function apiRequest(action, token = "") {

    const response = await fetch(

        `${API_URL}?action=${action}&token=${encodeURIComponent(token)}`

    );

    return await response.json();

}

/*
========================================
Dashboard
========================================
*/

async function apiDashboard() {

    return await apiRequest("dashboard");

}

/*
========================================
Recent Feed
========================================
*/

async function apiRecent() {

    return await apiRequest("recent");

}

/*
========================================
Guest Search
========================================
*/

async function apiSearch(query) {

    return await apiRequest("search", query);

}

/*
========================================
Guest List
========================================
*/

async function apiGuestList() {

    return await apiRequest("guestlist");

}

/*
========================================
Check In
========================================
*/

async function apiCheckin(token) {

    return await apiRequest("checkin", token);

}

/*
========================================
Undo Check In
========================================
*/

async function apiUndo(token) {

    return await apiRequest("undocheckin", token);

}