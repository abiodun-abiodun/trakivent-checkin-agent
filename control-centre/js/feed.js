// =====================================
// TRAKIVENT
// Feed Module
// =====================================

async function refreshFeed() {

    try {

        const data = await apiRecent();

        if (!data.success) return;

        renderFeed(data.recent);

    }

    catch (error) {

        console.error("Feed:", error);

    }

}

function renderFeed(feed) {

    const container =
        document.getElementById("recentFeed");

    if (!container) return;

    if (!feed || feed.length === 0) {

        container.innerHTML = `
            <div class="emptyFeed">
                No recent check-ins.
            </div>
        `;

        return;

    }

    container.innerHTML = "";

    feed.forEach(function (guest) {

        const item = document.createElement("div");

        item.className = "feedItem";

        item.innerHTML = `

            <strong>${guest.fullName}</strong>

            <div>${guest.guestCategory || "-"}</div>

            <small>
                ${guest.checkinTime || ""}
            </small>

        `;

        container.appendChild(item);

    });

}