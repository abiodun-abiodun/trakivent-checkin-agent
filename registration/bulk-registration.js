const REGISTRATION_API_URL =
"https://script.google.com/macros/s/AKfycbx-PZRxcXfgbz09VGvQJYc34Cpv6hro1XJb_8oNcEOOIwTIDjpukz6KStuM2St1u_-2/exec";

const guestTableBody =
document.getElementById("guestTableBody");

const addGuestBtn =
document.getElementById("addGuestBtn");

const submitBtn =
document.getElementById("submitBtn");

const eventIdInput =
document.getElementById("eventId");

const message =
document.getElementById("message");

const summary =
document.getElementById("summary");

const submittedCount =
document.getElementById("submittedCount");

const registeredCount =
document.getElementById("registeredCount");

const rejectedCount =
document.getElementById("rejectedCount");

const results =
document.getElementById("results");

let rowCount = 0;

function addGuestRow() {


rowCount++;


const row =
    document.createElement("tr");


row.dataset.row =
    rowCount;


row.innerHTML = `

    <td class="rowNumber">

        ${rowCount}

    </td>


    <td>

        <input
            type="text"
            class="nameField"
            data-field="fullName"
            placeholder="Full name">

    </td>


    <td>

        <input
            type="tel"
            class="phoneField"
            data-field="phone"
            placeholder="08012345678">

    </td>


    <td>

        <input
            type="email"
            data-field="email"
            placeholder="Email">

    </td>


    <td>

        <input
            type="text"
            data-field="guestCategory"
            placeholder="e.g. Speaker">

    </td>


    <td>

        <input
            type="text"
            data-field="tableNumber"
            placeholder="A01">

    </td>


    <td>

        <select data-field="ticketType">

            <option value="">

                Not specified

            </option>

            <option value="VIP">

                VIP

            </option>

            <option value="Regular">

                Regular

            </option>

            <option value="Staff">

                Staff

            </option>

            <option value="Vendor">

                Vendor

            </option>

        </select>

    </td>


    <td>

        <button
            type="button"
            class="removeBtn">

            Remove

        </button>

    </td>

`;


row
    .querySelector(".removeBtn")
    .addEventListener(
        "click",
        function() {

            row.remove();

            renumberRows();

        }
    );


guestTableBody.appendChild(row);


}

function renumberRows() {


const rows =
    guestTableBody.querySelectorAll("tr");


rows.forEach(
    function(row, index) {

        row
            .querySelector(".rowNumber")
            .textContent =
            index + 1;

    }
);


}

function collectGuests() {


const rows =
    guestTableBody.querySelectorAll("tr");


const guests = [];


rows.forEach(
    function(row) {

        const guest = {};


        row
            .querySelectorAll("[data-field]")
            .forEach(
                function(field) {

                    guest[field.dataset.field] =
                        field.value.trim();

                }
            );


        guests.push(guest);

    }
);


return guests;


}

function validateGuests(guests) {


if (!eventIdInput.value.trim()) {

    return "Please select an event.";

}


if (guests.length === 0) {

    return "Please add at least one guest.";

}


for (
    let i = 0;
    i < guests.length;
    i++
) {

    if (!guests[i].fullName) {

        return (
            "Row " +
            (i + 1) +
            ": Full name is required."
        );

    }


    if (!guests[i].phone) {

        return (
            "Row " +
            (i + 1) +
            ": Phone / WhatsApp number is required."
        );

    }

}


return "";


}

async function registerGuests() {


const guests =
    collectGuests();


const validationError =
    validateGuests(guests);


if (validationError) {

    showError(
        validationError
    );

    return;

}


setLoading(true);

hideMessage();

summary.style.display =
    "none";


try {

    const url =
        REGISTRATION_API_URL +
        "?action=bulkregister" +
        "&eventId=" +
        encodeURIComponent(
            eventIdInput.value.trim()
        ) +
        "&guests=" +
        encodeURIComponent(
            JSON.stringify(guests)
        );


    const response =
        await fetch(url);


    const data =
        await response.json();


    console.log(
        "Bulk Registration Response:",
        data
    );


    if (!data.success) {

        showError(
            data.message ||
            "Bulk registration failed."
        );

        return;

    }


    displayResults(data);

}


catch (error) {

    console.error(
        "Bulk Registration Error:",
        error
    );


    showError(
        "Unable to connect to TRAKIVENT. Please try again."
    );

}


finally {

    setLoading(false);

}

}

function displayResults(data) {


submittedCount.textContent =
    data.totalSubmitted || 0;


registeredCount.textContent =
    data.registered || 0;


rejectedCount.textContent =
    data.rejected || 0;


results.innerHTML =
    "";


if (
    data.guests &&
    data.guests.length > 0
) {

    data.guests.forEach(
        function(guest) {

            const item =
                document.createElement("div");


            item.className =
                "resultItem";


            item.innerHTML = `

                <div class="resultName">

                    ✓ ${guest.fullName}

                </div>

                <div class="resultDetails">

                    Registration:
                    ${guest.registrationNo}

                    &nbsp; | &nbsp;

                    QR Token:
                    ${guest.qrToken}

                </div>

            `;


            results.appendChild(item);

        }
    );

}


if (
    data.rejectedGuests &&
    data.rejectedGuests.length > 0
) {

    data.rejectedGuests.forEach(
        function(rejected) {

            const item =
                document.createElement("div");


            item.className =
                "resultItem rejectedItem";


            item.innerHTML = `

                <div class="resultName">

                    Row ${rejected.row}

                </div>


                <div class="rejectedReason">

                    ${rejected.reason}

                </div>

            `;


            results.appendChild(item);

        }
    );

}


summary.style.display =
    "block";


showSuccess(
    "Bulk registration completed successfully."
);


window.scrollTo({

    top:
        document.body.scrollHeight,

    behavior:
        "smooth"

});

}

function showError(text) {


message.textContent =
    text;


message.className =
    "message error";


message.style.display =
    "block";


}

function showSuccess(text) {

message.textContent =
    text;


message.className =
    "message success";


message.style.display =
    "block";


}

function hideMessage() {

message.textContent =
    "";


message.className =
    "message";


message.style.display =
    "none";


}

function setLoading(isLoading) {


submitBtn.disabled =
    isLoading;


addGuestBtn.disabled =
    isLoading;


submitBtn.textContent =
    isLoading
        ? "Registering..."
        : "Register Guests";


}

addGuestBtn.addEventListener(


"click",

function() {

    addGuestRow();

}

);

submitBtn.addEventListener(


"click",

function() {

    registerGuests();

}


);

// Start with three empty guest rows.

addGuestRow();

addGuestRow();

addGuestRow();
