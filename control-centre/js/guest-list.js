// =====================================
// TRAKIVENT
// Guest List Module
// =====================================

async function refreshGuestList() {

    try {

        const data = await apiGuestList();

        const guestList =
            document.getElementById("guestList");

        guestList.innerHTML = "";

        if (!data.success) {

            guestList.innerHTML =
                "<div class='emptyFeed'>No guests found.</div>";

            return;

        }

        renderGuestList(data.guests);

    }

    catch (error) {

        console.error("Guest List:", error);

    }

}

function renderGuestList(guests) {

    const guestList =
        document.getElementById("guestList");

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

    guests.forEach(function (guest) {

        if (groups[guest.ticketType]) {

            groups[guest.ticketType].push(guest);

        }

    });

    Object.keys(groups).forEach(function (type) {

        groups[type].sort(function (a, b) {

            if (a.checkedIn === b.checkedIn) return 0;

            return a.checkedIn ? 1 : -1;

        });

        let guestsToShow = groups[type];

        if (guestFilter === "pending") {

            guestsToShow =
                guestsToShow.filter(g => !g.checkedIn);

        }

        if (guestFilter === "checked") {

            guestsToShow =
                guestsToShow.filter(g => g.checkedIn);

        }

        if (guestsToShow.length === 0) return;

        const header =
            document.createElement("div");

        header.className =
            `groupHeader group-${type.toLowerCase()}`;

        header.innerHTML = `

            <span>
                ${icons[type]} ${type.toUpperCase()}
            </span>

            <span>
                ${guestsToShow.length} Guest${guestsToShow.length > 1 ? "s" : ""}
            </span>

        `;

        guestList.appendChild(header);

        guestsToShow.forEach(function (guest) {

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

                    <div class="${guest.checkedIn ? "guestStatusIn" : "guestStatusOut"}"></div>

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