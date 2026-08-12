// ==========================================
// RESCUECONNECT - JAVASCRIPT
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const areaInput =
    document.getElementById("area");

const areaSuggestions =
    document.getElementById("areaSuggestions");

const findHelpBtn =
    document.getElementById("findHelpBtn");

const loadingState =
    document.getElementById("loadingState");

const emptyState =
    document.getElementById("emptyState");

const resultsSection =
    document.getElementById("resultsSection");

const areaTitle =
    document.getElementById("areaTitle");

const areaDescription =
    document.getElementById("areaDescription");

const shelterCount =
    document.getElementById("shelterCount");

const resourceCount =
    document.getElementById("resourceCount");

const volunteerCount =
    document.getElementById("volunteerCount");

const shelterSectionCount =
    document.getElementById("shelterSectionCount");

const shelterContainer =
    document.getElementById("shelterContainer");

const resourceContainer =
    document.getElementById("resourceContainer");

const volunteerContainer =
    document.getElementById("volunteerContainer");
// ==========================================
// SEARCH ERROR ELEMENTS
// ==========================================
const searchError =
    document.getElementById("searchError");

const searchErrorTitle =
    document.getElementById("searchErrorTitle");

const searchErrorMessage =
    document.getElementById("searchErrorMessage");

const closeSearchError =
    document.getElementById("closeSearchError");


// ==========================================
// API
// ==========================================

// const API_BASE_URL =
//     "http://localhost:8080";
const API_BASE_URL = 
       "https://disasterresourceconnector-production.up.railway.app";

// ==========================================
// NETWORK STATUS
// ==========================================

const networkStatusText =
    document.getElementById("networkStatusText");

const networkStatusDot =
    document.getElementById("networkStatusDot");
async function checkNetworkStatus() {
    try {
        const response =
            await fetch(`${API_BASE_URL}/api/areas`);
        if (!response.ok) {
            throw new Error("Backend unavailable");
        }
        // Backend is available
        if (networkStatusText) {
            networkStatusText.textContent ="Network active";
        }

        if (networkStatusDot) {
            networkStatusDot.classList.remove("network-offline");
            networkStatusDot.classList.add("network-online");
        }
    } catch (error) {
        // Backend is unavailable
        if (networkStatusText) {
            networkStatusText.textContent ="Network unavailable";
        }

        if (networkStatusDot) {
            networkStatusDot.classList.remove("network-online");
            networkStatusDot.classList.add("network-offline");
        }
    }
}
// Store areas received from backend
let areas = [];
// ==========================================
// LOAD AREAS
// ==========================================
async function loadAreas() {
    try {
        const response =
            await fetch(`${API_BASE_URL}/api/areas`);
        if (!response.ok) {
            throw new Error("Unable to load areas");
        }

        areas =await response.json();
        console.log("Areas loaded:",areas);
        if (areaSuggestions) {
            areaSuggestions.innerHTML = "";
        }
        areas.forEach(area => {
            const name = getAreaName(area);

            if (!name) {
                return;
            }
            const option = document.createElement("option");
            option.value = name;

            if (areaSuggestions) {
                areaSuggestions.appendChild(option);
            }
        });
    } catch (error) {
        console.error( "Area loading error:", error);
        showError("Unable to load areas.","Backend connection problem");
    }
}
// ==========================================
// GET AREA NAME SAFELY
// ==========================================
function getAreaName(area) {
    if (!area) {
        return "";
    }
    return (
        area.name ||
        area.areaName ||
        area.area ||
        ""
    )
        .toString()
        .trim();
}
// ==========================================
// NORMALIZE AREA NAME
// ==========================================
function normalizeAreaName(value) {
    return value
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, " ");
}
// ==========================================
// FIND MATCHING AREA
// ==========================================
function findMatchingArea(searchText) {
    const text =normalizeAreaName(searchText);
    if (!text) {
        return null;
    }
    // --------------------------------------
    // EXACT MATCH
    // --------------------------------------

    let match =
        areas.find(area => {
            const name =normalizeAreaName(getAreaName(area));
            return name === text;
        });
    if (match) {
        return match;
    }
    // --------------------------------------
    // STARTS WITH
    // --------------------------------------
    match = areas.find(area => {
            const name =normalizeAreaName(getAreaName(area));
            return name.startsWith(text);
        });
    if (match) {
        return match;
    }
    // --------------------------------------
    // CONTAINS
    // --------------------------------------
    match =
        areas.find(area => {
            const name = normalizeAreaName(getAreaName(area));
            return name.includes(text);
        });
    return match || null;
}
// ==========================================
// SEARCH INPUT
// ==========================================
if (areaInput) {
    areaInput.addEventListener(
        "input",
        function () {
            hideError();
        }
    );
}
// ==========================================
// CLOSE ERROR BUTTON
// ==========================================
if (closeSearchError) {
    closeSearchError.addEventListener(
        "click",
        function () {
            hideError();
        }
    );
}
// ==========================================
// FIND HELP BUTTON
// ==========================================
if (findHelpBtn) {
    findHelpBtn.addEventListener(
        "click",
        async function () {
            console.log("Find help clicked");
            const areaName = areaInput.value.trim();
            // --------------------------------------
            // NO INPUT
            // --------------------------------------
            if (!areaName) {
                showError("Enter an area name to find available assistance.","Please enter an area");
                return;
            }
            console.log("Searching for:",areaName);
            // --------------------------------------
            // HIDE PREVIOUS ERROR
            // --------------------------------------
            hideError();
            // --------------------------------------
            // HIDE OLD RESULTS
            // --------------------------------------
            if (resultsSection) {
                resultsSection.classList.add("hidden");
            }
            if (emptyState) {
                emptyState.classList.add("hidden");
            }
            // --------------------------------------
            // SHOW LOADING
            // --------------------------------------
            if (loadingState) {
                loadingState.classList.remove("hidden");
            }
            try {
                // --------------------------------------
                // LOAD AREAS IF NOT LOADED
                // --------------------------------------
                if (areas.length === 0) {
                    await loadAreas();
                }
                // --------------------------------------
                // FIND AREA
                // --------------------------------------
                const matchedArea = findMatchingArea(areaName);
                console.log("Matched area:",matchedArea);
                // --------------------------------------
                // AREA NOT FOUND
                // --------------------------------------
                if (!matchedArea) {
                    showError(
                        `We couldn't find "${areaName}". Please check the area name or choose one from the suggestions.`,
                        "Area not found"
                    );
                    return;
                }
                // --------------------------------------
                // GET AREA ID
                // --------------------------------------
                const areaId = matchedArea.id;
                console.log("Using area ID:",areaId);
                if (
                    areaId === undefined ||
                    areaId === null
                ) {
                    showError(
                        "This area does not have a valid ID.",
                        "Invalid area"
                    );
                    return;
                }
                // --------------------------------------
                // GET ASSISTANCE
                // --------------------------------------
                const response =
                    await fetch(`${API_BASE_URL}/api/help/${areaId}`);
                console.log("Assistance API status:",response.status);

                if (!response.ok) {
                    throw new Error(`Assistance API returned ${response.status}`);
                }
                const data =await response.json();
                console.log("Assistance data:",data);
                // --------------------------------------
                // DISPLAY RESULTS
                // --------------------------------------
                displayResults(data);
            } catch (error) {
                console.error("Find assistance error:",error);
                showError(
                    "We couldn't load assistance for this area. Please make sure the backend is running and try again.",
                    "Unable to find assistance"
                );
            } finally {
                if (loadingState) {
                    loadingState.classList.add(
                        "hidden"
                    );
                }
            }
        }
    );
}
// ==========================================
// ENTER KEY
// ==========================================
if (areaInput) {
    areaInput.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                if (findHelpBtn) {
                    findHelpBtn.click();
                }
            }
        }
    );
}
// ==========================================
// DISPLAY RESULTS
// ==========================================
function displayResults(data) {
    hideError();
    if (emptyState) {
        emptyState.classList.add(
            "hidden"
        );
    }
    if (loadingState) {
        loadingState.classList.add(
            "hidden"
        );
    }
    if (resultsSection) {
        resultsSection.classList.remove(
            "hidden"
        );
    }
    // --------------------------------------
    // CLEAN DATA
    // --------------------------------------
    const shelters = cleanData(data.shelters);
    const resources = cleanData(data.resources);
    const volunteers = cleanData(data.volunteers);
    // --------------------------------------
    // AREA INFORMATION
    // --------------------------------------
    const areaName = data.area || areaInput.value.trim();
    if (areaTitle) {
        areaTitle.textContent =
            `${areaName} assistance`;
    }
    if (areaDescription) {
        areaDescription.textContent =
            `Available disaster support in ${areaName}.`;

    }
    // --------------------------------------
    // SUMMARY
    // --------------------------------------

    if (shelterCount) {

        shelterCount.textContent =
            shelters.length;

    }


    if (resourceCount) {

        resourceCount.textContent =
            resources.length;

    }


    if (volunteerCount) {

        volunteerCount.textContent =
            volunteers.length;

    }


    // --------------------------------------
    // SHELTER COUNT
    // --------------------------------------

    if (shelterSectionCount) {

        shelterSectionCount.textContent =

            `${shelters.length} location${
                shelters.length === 1
                    ? ""
                    : "s"
            }`;

    }


    // --------------------------------------
    // CLEAR OLD RESULTS
    // --------------------------------------

    if (shelterContainer) {

        shelterContainer.innerHTML = "";

    }


    if (resourceContainer) {

        resourceContainer.innerHTML = "";

    }


    if (volunteerContainer) {

        volunteerContainer.innerHTML = "";

    }


    // --------------------------------------
    // RENDER
    // --------------------------------------

    renderShelters(shelters);

    renderResources(resources);

    renderVolunteers(volunteers);


    // --------------------------------------
    // NO ASSISTANCE
    // --------------------------------------

    if (

        shelters.length === 0 &&

        resources.length === 0 &&

        volunteers.length === 0

    ) {

        if (resultsSection) {

            resultsSection.classList.add(
                "hidden"
            );

        }


        showError(

            `No assistance is currently available in ${areaName}.`,

            "No assistance found"

        );

    }

}


// ==========================================
// SHELTERS
// ==========================================

function renderShelters(shelters) {

    if (!shelterContainer) {

        return;

    }


    shelters.forEach(shelter => {

        const card =
            document.createElement("div");


        card.className =
            "shelter-card";


        const capacity =
            Number(
                shelter.capacity
            ) || 0;


        const occupancy =
            Number(
                shelter.currentOccupancy
            ) || 0;


        const available =
            capacity - occupancy;


        card.innerHTML = `

            <div class="shelter-top">

                <div class="shelter-name">

                    <div class="shelter-name-icon">
                        🏠
                    </div>

                    <div>

                        <h3>
                            ${
                                shelter.name ||
                                "Relief center"
                            }
                        </h3>

                    </div>

                </div>


                <span class="open-status">

                    ${
                        shelter.status ||
                        "AVAILABLE"
                    }

                </span>

            </div>


            <div class="shelter-stats">

                <div class="shelter-stat">

                    <span>
                        Capacity
                    </span>

                    <strong>
                        ${shelter.capacity ?? "-"}
                    </strong>

                </div>


                <div class="shelter-stat">

                    <span>
                        Currently Occupied
                    </span>

                    <strong>
                        ${
                            shelter.currentOccupancy ??
                            "-"
                        }
                    </strong>

                </div>


                <div class="shelter-stat">

                    <span>
                        Spaces Available
                    </span>

                    <strong>

                        ${
                            available >= 0
                                ? available
                                : "-"
                        }

                    </strong>

                </div>

            </div>

        `;


        shelterContainer.appendChild(
            card
        );

    });

}


// ==========================================
// RESOURCES
// ==========================================

function renderResources(resources) {

    if (!resourceContainer) {

        return;

    }


    resources.forEach(resource => {

        const card =
            document.createElement("div");


        card.className =
            "resource-card";


        card.innerHTML = `

            <div class="resource-icon-large">
                📦
            </div>


            <h3>

                ${
                    resource.name ||
                    "Resource"
                }

            </h3>


            <p>

                ${
                    resource.type ||
                    "Essential resource"
                }

            </p>


            <div class="resource-quantity">

                ${
                    resource.quantity ??
                    "-"
                }

                ${
                    resource.unit ||
                    ""
                }

            </div>

        `;


        resourceContainer.appendChild(
            card
        );

    });

}


// ==========================================
// VOLUNTEERS
// ==========================================

function renderVolunteers(volunteers) {

    if (!volunteerContainer) {

        return;

    }


    volunteers.forEach(volunteer => {

        const card =
            document.createElement("div");


        card.className =
            "volunteer-card";


        card.innerHTML = `

            <div class="volunteer-avatar">
                👤
            </div>


            <div>

                <h3>

                    ${
                        volunteer.name ||
                        "Community volunteer"
                    }

                </h3>


                <p>

                    ${
                        volunteer.skill ||
                        "Emergency assistance"
                    }

                </p>

            </div>

        `;


        volunteerContainer.appendChild(
            card
        );

    });

}


// ==========================================
// SHOW INLINE ERROR
// ==========================================

function showError(
    message,
    title = "Something went wrong"
) {

    if (!searchError) {

        return;

    }


    if (searchErrorTitle) {

        searchErrorTitle.textContent =
            title;

    }


    if (searchErrorMessage) {

        searchErrorMessage.textContent =
            message;

    }


    searchError.classList.remove(
        "hidden"
    );


    // Scroll slightly so user can see error

    searchError.scrollIntoView({

        behavior: "smooth",

        block: "nearest"

    });

}


// ==========================================
// HIDE INLINE ERROR
// ==========================================

function hideError() {

    if (searchError) {

        searchError.classList.add(
            "hidden"
        );

    }

}


// ==========================================
// EMPTY STATE
// ==========================================

function showEmptyState() {

    hideError();


    if (loadingState) {

        loadingState.classList.add(
            "hidden"
        );

    }


    if (resultsSection) {

        resultsSection.classList.add(
            "hidden"
        );

    }


    if (emptyState) {

        emptyState.classList.remove(
            "hidden"
        );

    }

}


// ==========================================
// DATA SAFETY
// ==========================================

function cleanData(data) {

    if (!Array.isArray(data)) {

        return [];

    }


    return data.filter(item => {

        return (

            item &&

            Object.values(item).some(

                value =>

                    value !== null &&

                    value !== undefined

            )

        );

    });

}


// ==========================================
// START APPLICATION
// ==========================================

// console.log(
//     "RescueConnect JavaScript loaded"
// );
console.log(
    "RescueConnect JavaScript loaded"
);

loadAreas();


// Check backend status immediately
checkNetworkStatus();


// Check backend status every 10 seconds
setInterval(
    checkNetworkStatus,
    10000
);

// loadAreas();