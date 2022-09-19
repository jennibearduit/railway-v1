/*TODO: CHECK IF KEY GIVES CORRECT INFO */
/* HTML IDs */
const ID_ADD_RESERVATION_SUBMIT_BUTTON = "submit"
const ID_NAVIGATION_BAR = "navBar"
const ID_HOME_NAVIGATION_BAR = "homeBar"
const ID_RESERVATIONS_LIST_NAVIGATION_BAR = "resListBar"
const ID_DELETE_BUTTON = "delete"
const ID_PHONE = "phone"
const ID_NAME = "name"
/* GENERAL ATTRIBUTES */
const KEY_RESERVATIONS = 'reservations'
const MAIN = document.getElementById("main")
const IS_KEY_EXISTS = false
/* RESERVATIONS ATTRIBUTES */
const SERIAL_NO = 'Serial No.'
const NAME = 'Name'
const PHONE = 'Phone Number'
const TIMESTAMP = 'Timestamp'
const AVAILABILITY = 'Availability'
/* PAGE NAVIGATION ATTRIBUTES */
/* 1 = HOME; 2 = RESERVATIONS LIST; 3 = FORM */
let STATE = 1;
let PREVIOUS_STATE = 1;
/* Keeps track of which user seat is clicked */
let CLICKED_SEAT = 1;
/* RESERVATIONS LIST ATTRIBUTES */
const TIMEOUT = 60*1000
let RESERVATIONS_TIMEOUT;
let reservations;


/* STORAGE FUNCTIONS */
function initializeReservationsArray() {
    reservations =  
        Array
            .from({length: 10}, (_, i) => i + 1)
            .map(num => {
                return ({
                    SERIAL_NO: num,
                    NAME: '',
                    PHONE: '',
                    TIMESTAMP: '',
                    AVAILABILITY: true
                })
            })
}

function saveReservations() {
    const json_reservations = JSON.stringify(reservations)
    localStorage.setItem(KEY_RESERVATIONS, json_reservations)
}

function loadReservations() {
    const json_reservations = localStorage.getItem(KEY_RESERVATIONS) ?? []
    try {
        reservations = JSON.parse(json_reservations)
    } catch(err) {
        console.log(err.message)
        saveReservations()
    } 
}

function deleteReservation(serial_no) {
    reservations
        .filter(res => res.SERIAL_NO === serial_no)
        .forEach(res => {
            res.NAME = ''
            res.PHONE = ''
            res.TIMESTAMP = ''
            res.AVAILABILITY = true
        })
    saveReservations()
}


/* INITIALIZATION */
initializeReservationsArray()
loadReservations()
parsePageState()
addNavigationEventListener()


/* PAGE NAVIGATION FUNCTIONS */
function clearPage() {
    MAIN.innerHTML = ``
}

function parsePageState() {
    if (PREVIOUS_STATE === 3 && STATE !== 3) {
        clearTimeout(RESERVATIONS_TIMEOUT)
    }
    switch(STATE) {
        case 1: displayHomePage(); break;
        case 2: displayReservationsListPage(); break;
        case 3: displayMakeReservationFormPage(); break;
    }
}

function addHomeNavigationEventListener() {
    const element = document.getElementById(ID_HOME_NAVIGATION_BAR)
    element.addEventListener("click", () => {
        PREVIOUS_STATE = STATE;
        STATE = 1;
        parsePageState()
    })
}

function addReservationsListNavigationEventListener() {
    const element = document.getElementById(ID_RESERVATIONS_LIST_NAVIGATION_BAR)
    element.addEventListener("click", () => {
        PREVIOUS_STATE = STATE;
        STATE = 2;
        parsePageState()
    })
}

function addNavigationEventListener() {
    addHomeNavigationEventListener()
    addReservationsListNavigationEventListener()
}


/* HOME PAGE FUNCTIONS */
function displayHomePage() {
    clearPage()
    displayHomePageHeader()
    displayHomePageSeatingPlan()
}

function displayHomePageHeader() {
    const element = document.createElement("div")
    element.classList.add("header")
    element.innerHTML = "Seating Plan"
    MAIN.appendChild(element)
}

function displayHomePageSeatingPlan() {
    /* First row */
    const container1 = document.createElement("div")
    container1.classList.add("container")
    reservations
        .filter(res => res.SERIAL_NO <= 5)
        .forEach(res => {
            const element = document.createElement("div")
            res.AVAILABILITY 
                ? element.classList.add("blueSeat")
                : element.classList.add("pinkSeat")
            element.innerHTML = `${res.SERIAL_NO}`
            element.setAttribute('id', `${SERIAL_NO}${res.SERIAL_NO}`)
            container1.appendChild(element)
        }
    )
    MAIN.appendChild(container1)

    /* Second row */
    const container2 = document.createElement("div")
    container2.classList.add("container")
    reservations
        .filter(res => res.SERIAL_NO > 5)
        .forEach(res => {
            const element = document.createElement("div")
            res.AVAILABILITY 
                ? element.classList.add("blueSeat")
                : element.classList.add("pinkSeat")
            element.innerHTML = `${res.SERIAL_NO}`
            element.setAttribute('id', `${SERIAL_NO}${res.SERIAL_NO}`)
            container2.appendChild(element)
        }
    )
    MAIN.appendChild(container2)
    addHomePageSeatingPlanEventListeners()
}

function addHomePageSeatingPlanEventListeners() {
    reservations.forEach((res => {
        const element = document.getElementById(`${SERIAL_NO}${res.SERIAL_NO}`)
        console.log(element.innerHTML)
        if (!res.AVAILABILITY) {
            element.addEventListener("click", () => {
                window.alert('This seat has been reserved. If you would like to delete reservation, please go to "Reservations List" page.')
            })
        } else {
            element.addEventListener("click", () => {
                PREVIOUS_STATE = STATE;
                STATE = 3
                CLICKED_SEAT = res.SERIAL_NO
                parsePageState()
            })
        }
    }))
}


/* RESERVATIONS LIST PAGE FUNCTIONS */
function displayReservationsListPage() {
    clearPage()
    displayReservationsListPageHeader()
    displayReservationsListPageContent()
}

function displayReservationsListPageHeader() {
    const element = document.createElement("div")
    element.classList.add("header")
    element.innerHTML = "Reservations List"
    MAIN.appendChild(element)
}

function displayReservationsListPageContent() {
    reservations
        .filter(res => res.AVAILABILITY === false)
        .forEach(res => {
            const delete_button = document.createElement("button")
            delete_button.classList.add("deleteButton")
            delete_button.setAttribute('id', `${ID_DELETE_BUTTON}${res.SERIAL_NO}`)
            delete_button.innerHTML = `Delete`
            const reservation_box = document.createElement("div")
            reservation_box.classList.add("reservationBox")
            reservation_box.setAttribute('id', `${KEY_RESERVATIONS}${res.SERIAL_NO}`)
            reservation_box.innerHTML = 
                `Serial Number: ${res.SERIAL_NO}<br><br>
                 Name: ${res.NAME}<br><br>
                 Phone Number: ${res.PHONE}<br><br>
                 Timestamp: ${new Date(res.TIMESTAMP).toString()}<br><br>
            `
            MAIN.appendChild(reservation_box)
            MAIN.appendChild(delete_button)
        })
    addReservationsListDeleteButtonEventListener()
    if (reservations.filter(res => !res.AVAILABILITY).length === 0) {
        const element = document.createElement("div")
        element.classList.add("emptyReservationText")
        element.innerHTML = `There is currently no reservation.`
        MAIN.appendChild(element)
    }
}

function addReservationsListDeleteButtonEventListener() {
    reservations
        .filter(res => !res.AVAILABILITY)
        .forEach(res => {
            const id = ID_DELETE_BUTTON + res.SERIAL_NO
            const button = document.getElementById(id)
            button.addEventListener("click", () => {
                if (window.confirm(`Delete seat ${res.SERIAL_NO} reservation for ${res.NAME}?`)) {
                    deleteReservation(res.SERIAL_NO)
                    saveReservations()
                    loadReservations()
                    parsePageState()
                } 
            })
        })
}


/* MAKE RESERVATION FORM */
function displayMakeReservationFormPage() {
    clearPage()
    displayMakeReservationFormPageHeader()
    displayMakeReservationFormPageContent()
    displayMakeReservationFormPageSubmitButton()
    RESERVATIONS_TIMEOUT = 
        setTimeout(displayMakeReservationFormPageTimeoutConfirmation, TIMEOUT)
}

function displayMakeReservationFormPageHeader() {
    const element = document.createElement("div")
    element.classList.add("header")
    element.innerHTML = `Make Reservation (Seat ${CLICKED_SEAT})`
    MAIN.appendChild(element)
}

function displayMakeReservationFormPageContent() {
    const element = document.createElement("form")
    element.setAttribute('align', 'center')
    element.innerHTML = `
        <label for=${NAME}>Name:</label><br>
        <input type="text" id=${ID_NAME} name=${NAME}><br></br>
        <label for=${PHONE}>Phone Number:</label><br>
        <input type="text" id=${ID_PHONE} name=${PHONE}><br></br>
    `
    MAIN.appendChild(element)
}

function displayMakeReservationFormPageSubmitButton() {
    const element = document.createElement("button")
    element.setAttribute('id', ID_ADD_RESERVATION_SUBMIT_BUTTON)
    element.classList.add("submitButton")
    element.innerHTML = `Submit`
    MAIN.appendChild(element)
    addMakeReservationFormPageSubmitButtonEventListener()
}

function addMakeReservationFormPageSubmitButtonEventListener() {
    const element = document.getElementById(ID_ADD_RESERVATION_SUBMIT_BUTTON)
    console.log(element.html)
    element.addEventListener("click", (e) => {
        e.preventDefault()
        console.log("submitting")
        const name = document.getElementById(ID_NAME).value
        const phone = document.getElementById(ID_PHONE).value
        console.log("name", name)
        console.log("phone", phone)
        if (!name && !phone) {
            window.alert("Name and phone number cannot be empty!")
        } else if (!phone) {
            window.alert("Phone number cannot be empty!")
        } else if (!name) {
            window.alert("Name cannot be empty!")
        } else {
            saveReservationInformation(name, phone)
            PREVIOUS_STATE = STATE;
            STATE = 1;
            parsePageState()
        }
    })
}

function saveReservationInformation(name, phone) {
    reservations
        .filter(res => res.SERIAL_NO === CLICKED_SEAT)
        .map(res => {
            res.NAME = name
            res.PHONE = phone
            res.TIMESTAMP = Date.now()
            res.AVAILABILITY = false
        })
    saveReservations()
    loadReservations()
}

function displayMakeReservationFormPageTimeoutConfirmation() {
    if (window.confirm("Do you want to continue the session?")) {
        const name = document.getElementById(ID_NAME).value
        const phone = document.getElementById(ID_PHONE).value
        parsePageState()
        document.getElementById(ID_NAME).value = name
        document.getElementById(ID_PHONE).value = phone
    } else {
        PREVIOUS_STATE = STATE;
        STATE = 1
        parsePageState()
    }
}