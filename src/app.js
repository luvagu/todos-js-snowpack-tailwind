import bcrypt from 'bcryptjs'

// CONSTANTS
let CURRENT_USER = undefined
let USER_FIRST_INITIAL = ''
let USER_OBJECT = {}
let USER_TODOS = []
let SELECTED_TODO_LIST_ID = null
const LS_SESSION_NAME = 'todos.sessionToken'
const LS_USERS_PREFIX = 'todos.user_'
const LS_USER_TODO_LISTS = 'todoLists'
const LS_USER_SELECTED_LIST_ID = 'selectedListId'
const SESSION = JSON.parse(localStorage.getItem(LS_SESSION_NAME)) || null

// Custom query selector use selectEl & selectAll instead of selectEl
const selectEl = (element) => selectEl(element)
const selectAll = (elements) => selectAll(elements)

// App Elemnt Selectors
const homeLink = selectEl('#home-link')
const navLiElems =  selectAll('nav ul li a')
const loggedOutElems = selectAll('[data-logged-out]')
const loggedInElems = selectAll('[data-logged-in]')

const mobileMenu = selectEl('#mobile-menu')
const mobileMenuOpenBtn = selectEl('#mobile-menu-open')
const mobileMenuCloseBtn = selectEl('#mobile-menu-close')

const sideBar = selectEl('#sidebar')
const sidebarOverlay = selectEl('#sidebar-overlay')
const sidebarOpen = selectEl('#sidebar-open')
const sidebarOpenNoTasksMobile = selectEl('#add-todo-sidebar')

const dropDownToggleBtn = selectEl('#dropdown-toggle')

const signUpBtns = selectAll('[data-signup-button]')
const logInBtns = selectAll('[data-login-button]')

const dashboardBtns = selectAll('[data-dashboard-button]')
const accountBtns = selectAll('[data-account-button]')
const logOutBtnNav = selectAll('[data-logout-button]')

const sectionHome = selectEl('#home-section')
const sectionSignUp = selectEl('#signup-section')
const sectionLogIn = selectEl('#login-section')
const sectionAccount = selectEl('#account-section')
const sectionDashboard = selectEl('#dashboard-section')

const signUpForm = selectEl('#signup-form')
const logInForm = selectEl('#login-form')
const accountForm = selectEl('#account-form')

const userFirstInitialDisplay = selectEl('[data-user-name]')
const todosContainer = selectEl('[data-todos]')
const newTodoForm = selectEl('[data-new-todo-form]')
const newTodoInput = selectEl('[data-new-todo-input]')
const deleteTodoBtn = selectEl('[data-delete-todo-list]')
const todosListDisplayContainer = selectEl('[data-todo-display-container]')
const todosListTitle = selectEl('[data-todo-title]')
const saveListNameBtn = selectEl('[data-save-list-name]')
const todosListCounter = selectEl('[data-todo-count]')
const tasksContainer = selectEl('[data-tasks]')
const newTaskForm = selectEl('[data-new-task-form]')
const newTaskInput = selectEl('[data-new-task-input]')
const taskTemplate = selectEl('#task-template')
const clearCompletedTasksBtn = selectEl('[data-clear-complete-tasks]')

// Home link
homeLink.addEventListener('click', (e) => {
    e.preventDefault()

    // Hide all sections
    hideAllSections()

    if (!CURRENT_USER) {
        // Show the home section
        showHomeSection()
    } else {
        // Load the sectionLogIn
        showDashboardSection()

        // Set the 'active' class
        activeNavBtn('dashboard')
    }
})

// SignUp buttons
signUpBtns.forEach(button => 
    button.addEventListener('click', (e) => {
        e.preventDefault()
        
        // Hide all sections
        hideAllSections()

        // Load the sectionSignUp
        showSignUpSection()

        // Hide mobile menu
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu()
        }
    })
)

// LogIn buttons
logInBtns.forEach(button => 
    button.addEventListener('click', (e) => {
        e.preventDefault()

        // Hide all sections
        hideAllSections()

        // Load the sectionLogIn
        showLogInSection()

        // Hide mobile menu
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu()
        }
    })
)

// LogOut button
logOutBtnNav.forEach(button => 
    button.addEventListener('click', (e) => {
        e.preventDefault()

        // Log the user out
        logUserOut()

        // Hide mobile menu
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu()
        }
    })
)

// Dashboard button
dashboardBtns.forEach(button => 
    button.addEventListener('click', (e) => {
        e.preventDefault()

        // Hide all sections
        hideAllSections()

        // Load the sectionLogIn
        showDashboardSection()

        // Set the 'active' class
        activeNavBtn('dashboard')

        // Hide mobile menu
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu()
        }
    })
)

// Account button
accountBtns.forEach(button => 
    button.addEventListener('click', (e) => {
        e.preventDefault()

        // Hide messages if previously shown
        selectEl('#account-form > #errMsg').classList.add('hidden')
        selectEl('#account-form > #successMsg').classList.add('hidden')

        // Get the user object and load data accordingly
        const user = JSON.parse(localStorage.getItem(LS_USERS_PREFIX + CURRENT_USER)) || null
        selectEl('#account-form #email-address').value = user.email
        selectEl('#account-form #first-name').value = user.firstName
        selectEl('#account-form #last-name').value = user.lastName

        // Hide all sections
        hideAllSections()

        // Load the sectionLogIn
        showAccountSection()

        // Set the 'active' class
        activeNavBtn('account')

        // Hide mobile menu
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu()
        }
    })
)

// Mobile menu buttons
mobileMenuOpenBtn.addEventListener('click', toggleMobileMenu)
mobileMenuCloseBtn.addEventListener('click', toggleMobileMenu)

// Sidebar open/close
sidebarOpen.addEventListener('click', toggleSidebar)
sidebarOverlay.addEventListener('click', toggleSidebar)
sidebarOpenNoTasksMobile.addEventListener('click', (e) => {
    e.preventDefault()

    if (sideBar.classList.contains('hidden')) {
        toggleSidebar()
    }

    newTodoInput.focus()
})

// Dropdown open/close
dropDownToggleBtn.addEventListener('click', toggleDropdown)

// SignUp, LogIn, Account forms
signUpForm.addEventListener('submit', formsHandler)
logInForm.addEventListener('submit', formsHandler)
accountForm.addEventListener('submit', formsHandler)

// Sidebar toggle
function toggleSidebar(e) {
    sideBar.classList.toggle('hidden')
    sidebarOverlay.classList.toggle('hidden')
}

// Dropdown toggle
function toggleDropdown(e) {
    selectEl('#dropdown-tools').classList.toggle('hidden')
}

// Forms handler and logic for each specific formId
function formsHandler(e) {
    e.preventDefault()

    // Get the form ID
    const formId = e.target.id

    // Select the forms error and account susccess elements
    const errMsg = selectEl(`#${formId} > #errMsg`)
    const successMsg = selectEl(`#account-form > #successMsg`)

    // Hide them by default
    errMsg.classList.add('hidden')
    successMsg.classList.add('hidden')

    // Turn the inputs into a payload
    const payload = {}

    // Define the inputs object
    const inputs = e.target.elements

    // Start bulding the payload
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (input.type !== 'submit') {
            // Build the payload
            payload[input.name] = input.type == 'checkbox' ? input.checked : input.value.trim()
        }
    }

    // Validate payload & throw err accordingly
    if (!validateInputData(payload, formId)) {
        // Throw error message to user
        errMsg.classList.remove('hidden')
        errMsg.innerText = 'Missing or invalid field(s) supplied' 
        // console.log(formId, 'Missing or invalid field(s) supplied')
        return
    }

    // Assign the current user
    CURRENT_USER = payload.email

    // Sign Up Form 
    if (formId == 'signup-form') {

        // Check if the user is unique
        if (!isUserUnique(CURRENT_USER)) {
            errMsg.classList.remove('hidden')
            errMsg.innerText = 'A user with that email address already exists'
            CURRENT_USER = undefined
            return
        }

        // Hash the user's password
        payload.password = hashedPassword(payload.password)

        // Create the user's todos defaults
        payload.todoLists = []
        payload.selectedListId = null

        // Store the payload
        localStorage.setItem(LS_USERS_PREFIX + CURRENT_USER, JSON.stringify(payload))

        // Set the USER_OBJECT, USER_TODOS and SELECTED_TODO_LIST_ID
        USER_OBJECT = payload
        USER_TODOS = USER_OBJECT[LS_USER_TODO_LISTS]
        SELECTED_TODO_LIST_ID = USER_OBJECT[LS_USER_SELECTED_LIST_ID]

        // Assign the user first initial
        USER_FIRST_INITIAL = payload.firstName

        // Create a session
        const sessionData = {
            id: Date.now(),
            user: CURRENT_USER
        }
        localStorage.setItem(LS_SESSION_NAME, JSON.stringify(sessionData))

        // Log the user in and redirect
        logUserIn()

        // console.log('signup-form >>>', 'All good')
    }

    // Log In Form
    if (formId == 'login-form') {

        // Set the USER_OBJECT, USER_TODOS and SELECTED_TODO_LIST_ID
        USER_OBJECT = localStorage.getItem(LS_USERS_PREFIX + CURRENT_USER) !== null ? JSON.parse(localStorage.getItem(LS_USERS_PREFIX + CURRENT_USER)) : {}
        USER_TODOS = USER_OBJECT[LS_USER_TODO_LISTS] !== undefined ? USER_OBJECT[LS_USER_TODO_LISTS] : []
        SELECTED_TODO_LIST_ID = USER_OBJECT[LS_USER_SELECTED_LIST_ID] !== undefined ? USER_OBJECT[LS_USER_SELECTED_LIST_ID] : null

        // Assign the user first initial
        USER_FIRST_INITIAL = USER_OBJECT.firstName

        // Get the hashed password from the user's object or default to an empty string
        const hash = USER_OBJECT.password !== undefined ? USER_OBJECT.password : ''

        // Verify the user's password and continue or throw an error
        if (verifyPassword(payload.password, hash)) {

            // Create a session
            const sessionData = {
                id: Date.now(),
                user: CURRENT_USER
            }
            localStorage.setItem(LS_SESSION_NAME, JSON.stringify(sessionData))

            // Log the user in and redirect
            logUserIn()

            // console.log('login-form >>>', 'All good')
        } else {

            // console.log('login-form >>>', 'Incorrect password or the user may not exists')
            errMsg.classList.remove('hidden')
            errMsg.innerText = 'Incorrect email and/or password'
            CURRENT_USER = undefined
            return
        }
    }

    // Account Form 
    if (formId == 'account-form') {

        // Update the user accordingly
        USER_OBJECT.firstName = payload.firstName
        USER_OBJECT.lastName = payload.lastName

        // Assign the user first initial and re-render if changed
        USER_FIRST_INITIAL = payload.firstName
        renderUserFirstInitial()

        // Hash the user's password if a new one was supplied (or keep it unchanged)
        if (payload.password !== '') {
            USER_OBJECT.password = hashedPassword(payload.password)
        }

        // Store the update
        localStorage.setItem(LS_USERS_PREFIX + CURRENT_USER, JSON.stringify(USER_OBJECT))

        // Show a success message
        successMsg.classList.remove('hidden')
        successMsg.innerText = 'Update successful'

        // Reset the password field
        selectEl('#account-form #password').value = ''

        // console.log('account-form >>>', 'All good')
    }

    // Reset SignUp and Login forms specifically
    signUpForm.reset()
    logInForm.reset()
    errMsg.classList.add('hidden')
}

// Validate form inputs
function validateInputData(payload, formId) {
    payload = typeof(payload) === 'object' && payload !== null ? payload : false
    formId = typeof(formId) === 'string' && formId.trim().length > 0 ? formId.trim() : false

    // console.log('validateInputData() -> formId >>>', formId)
    // console.log('validateInputData() -> payload >>>', payload)

    if (payload && formId == 'signup-form') {
        return (typeof(payload['firstName']) === 'string' && payload['firstName'].length > 0) && 
            (typeof(payload['lastName']) === 'string' && payload['lastName'].length > 0) && 
            (typeof(payload['email']) === 'string' && validateEmail(payload['email'])) && 
            (typeof(payload['password']) === 'string' && payload['password'].length >= 4) && 
            (typeof(payload['tosAgreement']) === 'boolean' && payload['tosAgreement'] !== false)
    }
    
    if (payload && formId == 'login-form') {
        return (typeof(payload['email']) === 'string' && validateEmail(payload['email'])) && 
            (typeof(payload['password']) === 'string' && payload['password'].length >= 4)
    }
    
    if (payload && formId == 'account-form') {
        return (typeof(payload['firstName']) === 'string' && payload['firstName'].length > 0) && 
            (typeof(payload['lastName']) === 'string' && payload['lastName'].length > 0) && 
            (typeof(payload['email']) === 'string' && validateEmail(payload['email'])) && 
            (typeof(payload['password']) === 'string' && (payload['password'] === '' || payload['password'].length >= 4))
    } 

    // Default to false
    return false
}

// Email validation
function validateEmail(email) {
    email = typeof(email) == 'string' && email.length >= 6 ? email : false
    const regEx = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,4})(\]?)$/

    if (email) {
        return regEx.test(email)
    } else {
        return false
    }
}

// Check if user already exists
function isUserUnique(user) {
    return localStorage[LS_USERS_PREFIX + user] == undefined
}

// Hash password with bcrypt
function hashedPassword(password) {
    // Password strength
    const salt = bcrypt.genSaltSync(10)

    // Auto-gen a salt and hash:
    const hash = bcrypt.hashSync(password, salt)

    return hash
}

// Verify hashed password
function verifyPassword(password, hash) {
    // Load hash and compare with supplied password
    return bcrypt.compareSync(password, hash)
}

// Activate navbar button to match the current view
function activeNavBtn(target) {
    // Reset element current 'active' class 
    loggedInElems.forEach(link => link.classList.remove('bg-indigo-200'))

    // Return if e isn't defined
    if (target == undefined || target == null) return

    if (target === 'dashboard') {
        selectEl('#dashboard-button-nav').classList.add('bg-indigo-200')
    }

    if (target === 'account') {
        selectEl('#account-button-nav').classList.add('bg-indigo-200')
    }
}

// Get/Set user's First Initial
function renderUserFirstInitial() {
    userFirstInitialDisplay.innerText = `${USER_FIRST_INITIAL.charAt(0).toUpperCase()}'s Todo Lists`
}

