// =====================================
// TRAKIVENT
// Guest Module
// Version 1.0
// =====================================

async function checkinGuest(token){

    const button =
        document.querySelector(".checkinBtn");

    if(button){

        button.disabled = true;

        button.innerHTML = `
    <span class="spinner"></span>
    Checking in...
`;

    }

    try{

        const data =
            await apiCheckin(token);

        if(!data.success){

            alert(data.message || "Unable to check in guest.");

            if(button){

                button.disabled = false;

                button.textContent = "✔ Check In";

            }

            return;

        }

        // Update guest profile immediately
        renderGuestProfile(data.guest);

        // Refresh dashboard in background
        refreshDashboard();

    }

    catch(error){

        console.error("Check-in:", error);

        if(button){

            button.disabled = false;

            button.textContent = "✔ Check In";

        }

    }

}

async function undoGuest(token){

    try{

        const data =
            await apiUndo(token);

        if(data.success){

            await refreshDashboard();

            await searchGuest(token);

        }else{

            alert(data.message || "Unable to undo check-in.");

        }

    }

    catch(error){

        console.error("Undo:", error);

    }

}