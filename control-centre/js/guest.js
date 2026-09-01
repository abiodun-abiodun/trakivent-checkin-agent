// =====================================
// TRAKIVENT
// Guest Module
// Version 1.1
// =====================================


// =====================================
// Check In Guest
// =====================================

async function checkinGuest(token) {

    const button =
        document.querySelector(".checkinBtn");


    if (button) {

        button.disabled = true;

        button.innerHTML = `
            <span class="spinner"></span>
            Checking in...
        `;

    }


    try {

        const data =
            await apiCheckin(token);


        if (!data || !data.success) {

            alert(
                data?.message ||
                "Unable to check in guest."
            );


            if (button) {

                button.disabled = false;

                button.textContent =
                    "✔ Check In";

            }

            return;

        }


        // ---------------------------------
        // Update guest profile immediately
        // ---------------------------------

        if (typeof renderGuestProfile === "function") {

            renderGuestProfile(
                data.guest
            );

        }


        // ---------------------------------
        // Refresh dashboard
        // ---------------------------------

        await refreshDashboard();


        // ---------------------------------
        // Restore selected guest
        // ---------------------------------

        if (
            data.guest &&
            data.guest.registrationNo &&
            typeof searchGuest === "function"
        ) {

            await searchGuest(
                data.guest.registrationNo
            );

        }

    }


    catch (error) {

        console.error(
            "Check-in:",
            error
        );


        alert(
            "Unable to complete check-in."
        );

    }


    finally {

        if (button) {

            button.disabled = false;

        }

    }

}


// =====================================
// Undo Check In
// =====================================

async function undoGuest(token) {

    try {

        const data =
            await apiUndo(token);


        if (!data || !data.success) {

            alert(
                data?.message ||
                "Unable to undo check-in."
            );

            return;

        }


        // ---------------------------------
        // Refresh dashboard
        // ---------------------------------

        await refreshDashboard();


        // ---------------------------------
        // Restore selected guest
        // ---------------------------------

        if (
            data.guest &&
            data.guest.registrationNo &&
            typeof searchGuest === "function"
        ) {

            await searchGuest(
                data.guest.registrationNo
            );

        }

    }


    catch (error) {

        console.error(
            "Undo:",
            error
        );


        alert(
            "Unable to undo check-in."
        );

    }

}