// =====================================
// TRAKIVENT
// Station Monitor Module
// Version 0.5.1
// =====================================


// =====================================
// Refresh Station Monitor
// =====================================

async function refreshStationMonitor() {

    const container =
        document.getElementById("stationMonitor");

    const status =
        document.getElementById(
            "stationMonitorStatus"
        );

    if (!container) return;


    try {

        const data =
            await apiStationMonitor();


        // =================================
        // API / Network Error
        // =================================

        if (
            data.networkError ||
            !data.success
        ) {

            if (status) {

                status.textContent =
                    "● Connection problem";

                status.className =
                    "stationMonitorStatus stationMonitorError";

            }


            container.innerHTML = `

                <div class="emptyFeed">

                    Unable to load station activity.

                </div>

            `;

            return;

        }


        // =================================
        // Connected
        // =================================

        if (status) {

            status.textContent =
                "● Monitoring";

            status.className =
                "stationMonitorStatus stationMonitorOnline";

        }


        renderStationMonitor(
            data.stations
        );

    }

    catch (error) {

        console.error(
            "Station Monitor:",
            error
        );


        if (status) {

            status.textContent =
                "● Connection problem";

            status.className =
                "stationMonitorStatus stationMonitorError";

        }

    }

}


// =====================================
// Render Station Monitor
// =====================================

function renderStationMonitor(stations) {

    const container =
        document.getElementById(
            "stationMonitor"
        );

    if (!container) return;


    // =================================
    // No Activity
    // =================================

    if (
        !stations ||
        stations.length === 0
    ) {

        container.innerHTML = `

            <div class="emptyFeed">

                No station activity yet.

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    // =================================
    // Station Cards
    // =================================

    stations.forEach(function(station) {

        const stationId =
            station.stationId ||
            "CONTROL CENTRE";


        const checkins =
            Number(
                station.checkins || 0
            );


        let lastCheckin =
            "No check-ins yet";


        if (station.lastCheckin) {

            const date =
                new Date(
                    station.lastCheckin
                );


            if (
                !isNaN(
                    date.getTime()
                )
            ) {

                lastCheckin =
                    date.toLocaleString();

            }

        }


        const card =
            document.createElement("div");


        card.className =
            "stationMonitorCard";


        card.innerHTML = `

            <div class="stationMonitorCardHeader">

                <div>

                    <h3>
                        ${stationId}
                    </h3>

                </div>

                <span class="stationMonitorOnline">

                    ● Active

                </span>

            </div>


            <div class="stationMonitorStats">

                <div>

                    <strong>
                        ${checkins}
                    </strong>

                    <span>
                        Check-ins
                    </span>

                </div>


                <div>

                    <strong>
                        ${lastCheckin}
                    </strong>

                    <span>
                        Last Check-in
                    </span>

                </div>

            </div>

        `;


        container.appendChild(card);

    });

}
