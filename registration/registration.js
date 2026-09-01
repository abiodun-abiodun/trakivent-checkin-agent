// =====================================================
// TRAKIVENT
// Single Guest Registration
// Version 0.3.0
// Dynamic Event Selection + QR Handling
// =====================================================


const REGISTRATION_API_URL =
    "https://script.google.com/macros/s/AKfycbx-PZRxcXfgbz09VGvQJYc34Cpv6hro1XJb_8oNcEOOIwTIDjpukz6KStuM2St1u_-2/exec";


// =====================================================
// DOM Elements
// =====================================================

const registrationForm =
    document.getElementById("registrationForm");

const successCard =
    document.getElementById("successCard");

const message =
    document.getElementById("message");

const submitButton =
    document.getElementById("submitBtn");

const eventSelect =
    document.getElementById("eventId");


// =====================================================
// Load Events
// =====================================================

async function loadEvents() {

    if (!eventSelect) {
        return;
    }

    try {

        eventSelect.disabled = true;

        eventSelect.innerHTML = `
            <option value="">
                Loading events...
            </option>
        `;

        const response =
            await fetch(
                REGISTRATION_API_URL +
                "?action=events"
            );

        const data =
            await response.json();

        console.log(
            "Events Response:",
            data
        );

        if (
            !data ||
            !data.success ||
            !Array.isArray(data.events)
        ) {

            throw new Error(
                "Unable to load events."
            );

        }

        eventSelect.innerHTML = `
            <option value="">
                Select an event
            </option>
        `;

        data.events.forEach(
            function(event) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    event.eventId;

                option.textContent =
                    event.eventName;

                eventSelect.appendChild(
                    option
                );

            }
        );

        eventSelect.disabled = false;

    }

    catch (error) {

        console.error(
            "Event Loading Error:",
            error
        );

        eventSelect.innerHTML = `
            <option value="">
                Unable to load events
            </option>
        `;

        eventSelect.disabled = true;

        showError(
            "Unable to load events. Please refresh the page and try again."
        );

    }

}


// =====================================================
// Registration Form
// =====================================================

if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const fullName =
                document.getElementById("fullName")
                    .value
                    .trim();

            const phone =
                document.getElementById("phone")
                    .value
                    .trim();

            const email =
                document.getElementById("email")
                    .value
                    .trim();

            const guestCategory =
                document.getElementById("guestCategory")
                    .value
                    .trim();

            const tableNumber =
                document.getElementById("tableNumber")
                    .value
                    .trim();

            const ticketType =
                document.getElementById("ticketType")
                    .value
                    .trim();

            const eventId =
                document.getElementById("eventId")
                    .value
                    .trim();


            if (!fullName) {

                showError(
                    "Please enter the guest's full name."
                );

                return;

            }


            if (!phone) {

                showError(
                    "Please enter a phone / WhatsApp number."
                );

                return;

            }


            if (!eventId) {

                showError(
                    "Please select an event."
                );

                return;

            }


            setLoading(true);

            hideMessage();

            hideSuccessCard();


            try {

                const url =
                    REGISTRATION_API_URL +
                    "?action=register" +
                    "&eventId=" +
                    encodeURIComponent(eventId) +
                    "&fullName=" +
                    encodeURIComponent(fullName) +
                    "&phone=" +
                    encodeURIComponent(phone) +
                    "&email=" +
                    encodeURIComponent(email) +
                    "&ticketType=" +
                    encodeURIComponent(ticketType) +
                    "&guestCategory=" +
                    encodeURIComponent(guestCategory) +
                    "&tableNumber=" +
                    encodeURIComponent(tableNumber);


                const response =
                    await fetch(url);


                const data =
                    await response.json();


                console.log(
                    "Registration Response:",
                    data
                );


                if (!data.success) {

                    showError(
                        data.message ||
                        "Registration failed."
                    );

                    return;

                }


                if (
                    !data.guest ||
                    !data.guest.registrationNo
                ) {

                    showError(
                        "Registration completed, but the guest record could not be displayed."
                    );

                    console.error(
                        "Invalid registration response:",
                        data
                    );

                    return;

                }


                displayRegistrationSuccess(
                    data.guest
                );

            }


            catch (error) {

                console.error(
                    "Registration Error:",
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
    );

}


// =====================================================
// Display Registration Success
// =====================================================

function displayRegistrationSuccess(guest) {

    const successName =
        document.getElementById(
            "successName"
        );

    const successRegistration =
        document.getElementById(
            "successRegistration"
        );

    const successQR =
        document.getElementById(
            "successQR"
        );

    const successEvent =
        document.getElementById(
            "successEvent"
        );

    const qrImage =
        document.getElementById(
            "qrImage"
        );

    const downloadQR =
        document.getElementById(
            "downloadQR"
        );


    if (successName) {

        successName.textContent =
            guest.fullName || "";

    }


    if (successRegistration) {

        successRegistration.textContent =
            guest.registrationNo || "";

    }


    if (successQR) {

        successQR.textContent =
            guest.qrToken || "Not available";

    }


    if (successEvent) {

        successEvent.textContent =
            guest.eventName || "";

    }


    // ---------------------------------------------
    // Reset QR State
    // ---------------------------------------------

    if (qrImage) {

        qrImage.style.display =
            "none";

        qrImage.removeAttribute(
            "src"
        );

    }


    if (downloadQR) {

        downloadQR.style.display =
            "none";

        downloadQR.removeAttribute(
            "href"
        );

        downloadQR.removeAttribute(
            "download"
        );

    }


    // ---------------------------------------------
    // Generate QR Image
    // ---------------------------------------------

    if (
        qrImage &&
        guest.qrToken
    ) {

        const qrURL =
            "https://api.qrserver.com/v1/create-qr-code/" +
            "?size=300x300" +
            "&data=" +
            encodeURIComponent(
                guest.qrToken
            );


        qrImage.alt =
            "QR Code for " +
            (guest.fullName || "guest");


        qrImage.onload =
            function() {

                qrImage.style.display =
                    "block";


                if (downloadQR) {

                    downloadQR.href =
                        qrURL;

                    downloadQR.download =
                        guest.qrToken +
                        ".png";

                    downloadQR.style.display =
                        "inline-block";

                }

            };


        qrImage.onerror =
            function() {

                qrImage.style.display =
                    "none";


                if (downloadQR) {

                    downloadQR.style.display =
                        "none";

                }


                console.error(
                    "QR image failed to load:",
                    qrURL
                );

            };


        qrImage.src =
            qrURL;

    }


    else {

        console.warn(
            "No QR token returned for guest:",
            guest
        );

    }


    // ---------------------------------------------
    // Show Success Card
    // ---------------------------------------------

    if (registrationForm) {

        registrationForm.style.display =
            "none";

    }


    if (successCard) {

        successCard.style.display =
            "block";

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =====================================================
// Error Message
// =====================================================

function showError(text) {

    if (!message) {

        alert(text);

        return;

    }


    message.textContent =
        text;


    message.className =
        "message error";


    message.style.display =
        "block";

}


// =====================================================
// Hide Message
// =====================================================

function hideMessage() {

    if (!message) {

        return;

    }


    message.textContent =
        "";


    message.className =
        "message";


    message.style.display =
        "none";

}


// =====================================================
// Hide Success Card
// =====================================================

function hideSuccessCard() {

    if (successCard) {

        successCard.style.display =
            "none";

    }

}


// =====================================================
// Loading State
// =====================================================

function setLoading(isLoading) {

    if (!submitButton) {

        return;

    }


    submitButton.disabled =
        isLoading;


    submitButton.textContent =
        isLoading
            ? "Registering..."
            : "Register Guest";

}


// =====================================================
// Initialise
// =====================================================

loadEvents();
