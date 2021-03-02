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
const deleteTodoListBtn = selectEl('[data-delete-todo-list]')
const todoListDisplayTasks = selectEl('[data-todo-display-tasks]')
const selectedTodoTitle = selectEl('[data-todo-title]')
const saveTodoTitleBtn = selectEl('[data-save-list-name]')
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

        // Set the user's data
        setCurrentUserData()

        // Assign the user first initial
        USER_FIRST_INITIAL = USER_OBJECT.firstName

        // Get the hashed password from the user's object or default to an empty string
        const hash = USER_OBJECT.password !== undefined ? USER_OBJECT.password : ''

        // Verify the user's password and continue or throw an error
        if (verifyPassword(payload.password, hash)) { 
            const sessionData = {
                id: Date.now(),
                user: CURRENT_USER
            }

            // Create a session
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

// Set the USER_OBJECT, USER_TODOS and SELECTED_TODO_LIST_ID
function setCurrentUserData() {
    USER_OBJECT = localStorage.getItem(LS_USERS_PREFIX + CURRENT_USER) !== null ? JSON.parse(localStorage.getItem(LS_USERS_PREFIX + CURRENT_USER)) : {}
    USER_TODOS = USER_OBJECT[LS_USER_TODO_LISTS] !== undefined ? USER_OBJECT[LS_USER_TODO_LISTS] : []
    SELECTED_TODO_LIST_ID = USER_OBJECT[LS_USER_SELECTED_LIST_ID] !== undefined ? USER_OBJECT[LS_USER_SELECTED_LIST_ID] : null
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

// Show/Hide relevant componets by active session/action
function showHomeSection() {
    sectionHome.classList.remove('hidden')
}

function showSignUpSection() {
    sectionSignUp.classList.remove('hidden')
}

function showLogInSection() {
    sectionLogIn.classList.remove('hidden')
}

function showAccountSection() {
    sectionAccount.classList.remove('hidden')
}

function showDashboardSection() {
    sectionDashboard.classList.remove('hidden')
}

function hideAllSections() {
    sectionHome.classList.add('hidden')
    sectionSignUp.classList.add('hidden')
    sectionLogIn.classList.add('hidden')
    sectionAccount.classList.add('hidden')
    sectionDashboard.classList.add('hidden')
}

function toogleLoggedInOutElems() {
    loggedOutElems.forEach(link => link.classList.toggle('hidden'))
    loggedInElems.forEach(link => link.classList.toggle('hidden'))
}

// Get/Set user's name first initial
function renderUserFirstInitial() {
    userFirstInitialDisplay.innerText = `${USER_FIRST_INITIAL.charAt(0).toUpperCase()}'s Todo Lists`
}

// Log in user and render dashboard
function logUserIn() {
    // Show logged in elements
    toogleLoggedInOutElems()

    // Render user first initial display
    renderUserFirstInitial()

    // Hide all sections
    hideAllSections()

    // Show the dashboard
    showDashboardSection()

    // Activate Nav dashboard button
    activeNavBtn('dashboard')

    // Render User's todos
    renderTodos()
}

// Log the user out and destroy the current session
function logUserOut() {
    // Show logged out elements
    toogleLoggedInOutElems()

    // Hide all sections
    hideAllSections()

    // Show the home section
    showHomeSection()

    // Reset Nav 'active' class
    activeNavBtn(undefined)

    // Delete the current session token
    localStorage.removeItem(LS_SESSION_NAME)

    // Reset the USER_OBJECT, USER_TODOS, SELECTED_TODO_LIST_ID and CURRENT_USER to their defaults
    USER_OBJECT = {}
    USER_TODOS = []
    SELECTED_TODO_LIST_ID = null
    CURRENT_USER = undefined
}

// Check an active user session and load its last state
function sessionChecker() {
    // Check for an active session, if so redirect to the dashboard and load their todos, otherwise log the user out if there is an error
    if (SESSION !== null && SESSION.user !== undefined) {
        // Set the current user
        CURRENT_USER = SESSION.user

        // Set the user's data
        setCurrentUserData()

        // Set the user first initial
        USER_FIRST_INITIAL = USER_OBJECT.firstName
        
        // Log the User in
        logUserIn()

        // Render User's todos
        renderTodos()

        // console.log('A ssession was found')
    } else {
        showHomeSection()

        // console.log('No session found')
    }
}

// Add new todo
newTodoForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const todoName = newTodoInput.value.trim()
    if (todoName == null || todoName === '' || USER_TODOS.some(todo => todo.name == todoName)) return
    const todo = createTodo(todoName)
    newTodoInput.value = null
    USER_TODOS.push(todo)
    SELECTED_TODO_LIST_ID = todo.id
    saveAndRender()
    if (!sideBar.classList.contains('hidden')) toggleSidebar()
})

// Populate elements in todos container
todosContainer.addEventListener('click', (e) => {
    e.preventDefault()
    if (e.target.tagName.toLowerCase() === 'a') {
        SELECTED_TODO_LIST_ID = e.target.dataset.todoId
        saveAndRender()
        if (!sideBar.classList.contains('hidden')) toggleSidebar()
    }
})

// Add new task
newTaskForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if (taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedTodo = USER_TODOS.find(list => list.id === SELECTED_TODO_LIST_ID)
    selectedTodo.tasks.push(task)
    saveAndRender()
})

// Populate elements in tasks container
tasksContainer.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedTodo = USER_TODOS.find(todo => todo.id === SELECTED_TODO_LIST_ID)
        const selectedTask = selectedTodo.tasks.find(task => task.id === e.target.id)
        selectedTask.completed = e.target.checked
        saveTodos()
        renderTodoTasksCount(selectedTodo)
    }
})

// Selected title activate for editing
selectedTodoTitle.addEventListener('click', (e) => {
    saveTodoTitleBtn.classList.remove('hidden')
    selectedTodoTitle.style.backgroundColor = 'white'
    selectedTodoTitle.style.padding = '0 5px'
})

// Edit & Update todo title
selectedTodoTitle.addEventListener('input', (e) => {
    e.preventDefault()

    let id = selectedTodoTitle.dataset.todoId
    let name = selectedTodoTitle.textContent.replace('\n', '').trim()
    if (name.length >= 1 && !USER_TODOS.some(todo => todo.name == name)) {
        updateTodoName(id, name)
    }
})

// Clear tasks marked as completed
clearCompletedTasksBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const selectedTodo = USER_TODOS.find(todo => todo.id === SELECTED_TODO_LIST_ID)
    selectedTodo.tasks = selectedTodo.tasks.filter(task => !task.completed)
    saveAndRender()
    toggleDropdown()
})

// Delete a selected todo list
deleteTodoListBtn.addEventListener('click', (e) => {
    e.preventDefault()
    USER_TODOS = USER_TODOS.filter(todo => todo.id !== SELECTED_TODO_LIST_ID)
    SELECTED_TODO_LIST_ID = null
    saveAndRender()
    toggleDropdown()
})

// Create new todo
function createTodo(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
}

// Create new task
function createTask(name) {
    return { id: Date.now().toString(), name: name, completed: false }
}

// Render a selected todo list
function renderTodos() {
    clearElement(todosContainer)
    renderTodosList()

    const selectedTodoList = USER_TODOS.find(list => list.id === SELECTED_TODO_LIST_ID)
    if (SELECTED_TODO_LIST_ID == null || USER_TODOS.length < 1) {
        selectEl('[data-todo-display-empty]').classList.remove('hidden')
        todoListDisplayTasks.style.display = 'none'
    } else {
        selectEl('[data-todo-display-empty]').classList.add('hidden')
        todoListDisplayTasks.style.display = ''
        todosListTitle.innerText = selectedTodoList.name !== undefined ? selectedTodoList.name : ''
        todosListTitle.setAttribute('contenteditable', 'true')
        todosListTitle.dataset.todoId = selectedTodoList.id
        renderTodoTasksCount(selectedTodoList)
        clearElement(tasksContainer)
        renderTodoTasks(selectedTodoList)
    }
}

// Render the todos list
function renderTodosList() {
    USER_TODOS.forEach(todo => {
        const html = `
            <svg class="h-6 w-6 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
            </svg>
            <span class="ml-3 pointer-events-none">${todo.name}</span>
        `
        const selectedClass = ['flex', 'items-center', 'mb-2', 'p-2', 'text-base', 'text-indigo-700', 'bg-gray-200', 'rounded']
        const normalClass = ['flex', 'items-center', 'mb-2', 'p-2', 'text-base', 'text-gray-600', 'hover:text-gray-700', 'hover:bg-gray-200', 'rounded']
        
        const todoElement = document.createElement('a')
        todoElement.href = '#'
        todoElement.dataset.todoId = todo.id
        todoElement.innerHTML = html
        if (todoElement.dataset.todoId === SELECTED_TODO_LIST_ID) {
            todoElement.classList.add(...selectedClass)
        } else {
            todoElement.classList.add(...normalClass)
        }
        todosContainer.appendChild(todoElement)
    })
}

// Update a selected todo's title
function updateTodoName(id, name) {
    const selectedTodoList = USER_TODOS.find(list => list.id == id)
    selectedTodoList.name = name
}

// Render the remaining tasks count
function renderTodoTasksCount(selectedTodo) {
    const incompleteTasksCount = selectedTodo.tasks.filter(task => !task.completed).length
    const taskString = incompleteTasksCount === 1 ? 'task' : 'tasks'
    todosListCounter.innerText = `${incompleteTasksCount} ${taskString} remaining`
}

// Render a selected todo's tasks
function renderTodoTasks(selectedTodo) {
    selectedTodo.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.completed
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
}

// Clear elemnts from a parent node
function clearElement(elem) {
    while(elem.firstChild) {
        elem.removeChild(elem.firstChild)
    }
}

// Save todos data to localstorage
function saveTodos() {
    USER_OBJECT[LS_USER_TODO_LISTS] = USER_TODOS
    USER_OBJECT[LS_USER_SELECTED_LIST_ID] = SELECTED_TODO_LIST_ID
    localStorage.setItem(LS_USERS_PREFIX + CURRENT_USER, JSON.stringify(USER_OBJECT))
}

// Save and render any changes
function saveAndRender() {
    saveTodos()
    renderTodos()
}





































window.onload = () => {
    // Check active session
    sessionChecker()
}