// =====================================
// TRAKIVENT
// Guest List Module
// Version 0.3.0
// =====================================


// =====================================
// Refresh Guest List
// =====================================

async function refreshGuestList() {

    try {

        const data =
            await apiGuestList();


        const guestList =
            document.getElementById("guestList");


        if (!guestList) {

            return;

        }


        guestList.innerHTML = "";


        if (
            !data ||
            !data.success
        ) {

            guestList.innerHTML =
                "<div class='emptyFeed'>No guests found.</div>";

            return;

        }


        renderGuestList(
            data.guests || []
        );

    }


    catch (error) {

        console.error(
            "Guest List:",
            error
        );

    }

}


// =====================================
// Render Guest List
// =====================================

function renderGuestList(guests) {

    const guestList =
        document.getElementById("guestList");


    if (!guestList) {

        return;

    }


    // ---------------------------------
    // Clear existing list
    // ---------------------------------

    // Prevent duplicates during
    // automatic dashboard refresh.

    guestList.innerHTML = "";


    // ---------------------------------
    // Guest Groups
    // ---------------------------------

    const groups = {

        VIP: [],

        Regular: [],

        Staff: [],

        Vendor: [],

        Unclassified: []

    };


    // ---------------------------------
    // Group Icons
    // ---------------------------------

    const icons = {

        VIP: "👑",

        Regular: "👤",

        Staff: "🛠",

        Vendor: "🏪",

        Unclassified: "👥"

    };


    // ---------------------------------
    // Assign Guests To Groups
    // ---------------------------------

    guests.forEach(
        function(guest) {

            const ticketType =
                String(
                    guest.ticketType || ""
                )
                .trim();


            // ---------------------------------
            // Known ticket type
            // ---------------------------------

            if (
                ticketType === "VIP" ||
                ticketType === "Regular" ||
                ticketType === "Staff" ||
                ticketType === "Vendor"
            ) {

                groups[ticketType].push(
                    guest
                );

                return;

            }


            // ---------------------------------
            // No ticket type / unknown type
            // ---------------------------------

            groups.Unclassified.push(
                guest
            );

        }
    );


    // =====================================
    // Render Groups
    // =====================================

    Object.keys(groups).forEach(
        function(type) {


            // ---------------------------------
            // Sort
            // ---------------------------------

            // Pending guests appear first.
            // Checked-in guests appear after them.

            groups[type].sort(
                function(a, b) {

                    if (
                        a.checkedIn ===
                        b.checkedIn
                    ) {

                        return 0;

                    }


                    return a.checkedIn
                        ? 1
                        : -1;

                }
            );


            // ---------------------------------
            // Apply Guest Filter
            // ---------------------------------

            let guestsToShow =
                groups[type];


            if (
                guestFilter === "pending"
            ) {

                guestsToShow =
                    guestsToShow.filter(
                        function(guest) {

                            return !guest.checkedIn;

                        }
                    );

            }


            if (
                guestFilter === "checked"
            ) {

                guestsToShow =
                    guestsToShow.filter(
                        function(guest) {

                            return guest.checkedIn;

                        }
                    );

            }


            // ---------------------------------
            // Skip Empty Group
            // ---------------------------------

            if (
                guestsToShow.length === 0
            ) {

                return;

            }


            // ---------------------------------
            // Group Header
            // ---------------------------------

            const header =
                document.createElement(
                    "div"
                );


            header.className =
                `groupHeader group-${type.toLowerCase()}`;


            header.innerHTML = `

                <span>

                    ${icons[type]}
                    ${type.toUpperCase()}

                </span>

                <span>

                    ${guestsToShow.length}
                    Guest${guestsToShow.length > 1 ? "s" : ""}

                </span>

            `;


            guestList.appendChild(
                header
            );


            // ---------------------------------
            // Guests
            // ---------------------------------

            guestsToShow.forEach(
                function(guest) {


                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "guestItem";


                    // ---------------------------------
                    // Safe Ticket Class
                    // ---------------------------------

                    const ticketClass =
                        String(
                            guest.ticketType || ""
                        )
                        .trim()
                        .toLowerCase()
                        .replace(
                            /\s+/g,
                            "-"
                        );


                    // ---------------------------------
                    // Display Registration
                    // ---------------------------------

                    item.innerHTML = `

                        <div class="guestRow">

                            <div>

                                <div class="guestName">

                                    ${guest.fullName}

                                </div>


                                <div class="guestTicket ${
                                    ticketClass
                                        ? "ticket-" + ticketClass
                                        : "ticket-unclassified"
                                }">

                                    ${guest.registrationNo}

                                </div>

                            </div>


                            <div class="${
                                guest.checkedIn
                                    ? "guestStatusIn"
                                    : "guestStatusOut"
                            }"></div>

                        </div>

                    `;


                    // ---------------------------------
                    // Guest Selection
                    // ---------------------------------

                    item.addEventListener(
                        "click",
                        function() {


                            document
                                .querySelectorAll(
                                    ".guestItem"
                                )
                                .forEach(
                                    function(g) {

                                        g.classList.remove(
                                            "activeGuest"
                                        );

                                    }
                                );


                            item.classList.add(
                                "activeGuest"
                            );


                            const searchBox =
                                document.getElementById(
                                    "searchBox"
                                );


                            if (searchBox) {

                                searchBox.value =
                                    guest.registrationNo;

                            }


                            searchGuest(
                                guest.registrationNo
                            );

                        }
                    );


                    guestList.appendChild(
                        item
                    );

                }
            );

        }
    );

}