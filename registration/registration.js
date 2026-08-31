const REGISTRATION_API_URL =
    "https://script.google.com/macros/s/AKfycbx-PZRxcXfgbz09VGvQJYc34Cpv6hro1XJb_8oNcEOOIwTIDjpukz6KStuM2St1u_-2/exec";


const registrationForm =
    document.getElementById("registrationForm");


const successCard =
    document.getElementById("successCard");


const message =
    document.getElementById("message");


const submitButton =
    document.getElementById("submitBtn");


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
            guest.qrToken || "";

    }


    if (successEvent) {

        successEvent.textContent =
            guest.eventName || "";

    }


    if (qrImage && guest.qrToken) {

        const qrURL =
            "https://api.qrserver.com/v1/create-qr-code/" +
            "?size=300x300" +
            "&data=" +
            encodeURIComponent(
                guest.qrToken
            );


        qrImage.src =
            qrURL;


        qrImage.alt =
            "QR Code for " +
            guest.fullName;


        qrImage.style.display =
            "block";


        if (downloadQR) {

            downloadQR.href =
                qrURL;

            downloadQR.download =
                guest.qrToken +
                ".png";

        }

    }


    registrationForm.style.display =
        "none";


    if (successCard) {

        successCard.style.display =
            "block";

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


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


function hideSuccessCard() {

    if (successCard) {

        successCard.style.display =
            "none";

    }

}


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