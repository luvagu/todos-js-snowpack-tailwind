
import { 
    fSignup,
    fLogin,
    fLogout,
    fUpdateAccount,
    fUpdatePassword,
    fDeleteAccount,
    fGetUserData,
    fUpdateTodos
 } from './fauna.helpers'

// CONSTANTS & REFERENCES
const LS_SESSION_KEY = 'todos.session.tokens'
let USER_STORE = null
let TODOS_WORKER = null
let IS_WORKER_RUNNING = false

// Custom querySelector use selectEl & selectAll instead
const selectEl = (element) => document.querySelector(element)
const selectAll = (elements) => document.querySelectorAll(elements)

// App Multi-use Element Selectors
const mobileMenu = selectEl('#mobile-menu')
const mobileMenuOpenBtn = selectEl('#mobile-menu-open')
const sideBar = selectEl('#sidebar')
const sidebarOverlay = selectEl('#sidebar-overlay')
const enableNotificationsBtn = selectEl('#enable-notifications')
const dropDownTools = selectEl('#dropdown-tools')
const dashboardBtns = selectAll('[data-dashboard-button]')
const accountBtns = selectAll('[data-account-button]')
const todosContainer = selectEl('[data-todos]')
const newTodoInput = selectEl('[data-new-todo-input]')
const todoListDisplayTasks = selectEl('[data-todo-display-tasks]')
const selectedTodoTitle = selectEl('[data-todo-title]')
const saveTodoTitleBtn = selectEl('[data-save-list-name]')
const tasksContainer = selectEl('[data-tasks]')
const newTaskInput = selectEl('[data-new-task-input]')

// Home link
selectEl('#home-link').addEventListener('click', (e) => {
    e.preventDefault()

    // Hide all sections
    hideAllComponents()

    if (!isSessionActive()) {
        // Show the home section
        showComponent('#home-component')
    } else {
        // Load the logInComponent
        showComponent('#dashboard-component')

        // Set the 'active' class
        activeNavBtn('dashboard')
    }
})

// SignUp buttons
selectAll('[data-signup-button]').forEach(button => 
    button.addEventListener('click', (e) => {
        e.preventDefault()

        // Hide error message if previously shown
        selectEl('#signup-form').querySelector('[data-error-msg]').innerText = ''
        
        // Hide all sections
        hideAllComponents()

        // Load the signUpComponent
        showComponent('#signup-component')

        // Hide mobile menu
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu()
        }
    })
)

// LogIn buttons
selectAll('[data-login-button]').forEach(button => 
    button.addEventListener('click', (e) => {
        e.preventDefault()

        // Hide error message if previously shown
        selectEl('#login-form').querySelector('[data-error-msg]').innerText = ''

        // Hide all sections
        hideAllComponents()

        // Load the logInComponent
        showComponent('#login-component')

        // Hide mobile menu
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu()
        }
    })
)

// LogOut button
selectAll('[data-logout-button]').forEach(button => 
    button.addEventListener('click', async (e) => {
        e.preventDefault()

        // Hide mobile menu
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu()
        }
        
        if (isSessionActive()) {
            toggleLoader('Logging you out...')

            try {
                // Call fauna fLogout (returns true/false) then proceed if secret was revoked
                if (await fLogout(getCredentials().secret)) {
                    logoutAfterTasks()
                    toggleLoader()
                }
            } catch (e) {
                console.error('fLogout >>>', e.message)
                toggleLoader()
            }
        }
    })
)

// Dashboard button
dashboardBtns.forEach(button => 
    button.addEventListener('click', (e) => {
        e.preventDefault()

        // Hide all sections
        hideAllComponents()

        // Load the logInComponent
        showComponent('#dashboard-component')

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

        // Hide error message if previously shown
        selectEl('#account-form').querySelector('[data-error-msg]').innerText = ''

        // Populate account-form values accordingly
        selectEl('[data-acc-ref-id]').innerText = getCredentials().userRef
        selectEl('#account-form #email-address-account').value = USER_STORE.email
        selectEl('#account-form #first-name-account').value = USER_STORE.firstName
        selectEl('#account-form #last-name-account').value = USER_STORE.lastName

        // Hide all sections
        hideAllComponents()

        // Load the logInComponent
        showComponent('#account-component')

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
selectEl('#mobile-menu-close').addEventListener('click', toggleMobileMenu)

// Sidebar open/close
selectEl('#sidebar-open').addEventListener('click', toggleSidebar)
sidebarOverlay.addEventListener('click', toggleSidebar)
selectEl('#add-todo-sidebar').addEventListener('click', (e) => {
    e.preventDefault()

    if (sideBar.classList.contains('hidden')) {
        toggleSidebar()
    }

    newTodoInput.focus()
})

// Enable desktop notifications
enableNotificationsBtn.addEventListener('click', askNotificationPermission)

// Dropdown open/close
selectEl('#dropdown-toggle').addEventListener('click', toggleDropdown)

// SignUp, LogIn, Account, New todo/tasks forms
selectAll('form').forEach(form => form.addEventListener('submit', formsHandler))

// Delete user account
selectEl('#delete-account').addEventListener('click', handleAccDelete) 

// Helper functions
function createSessionTokens(credentials) {
    if (typeof(credentials) === 'object' && ('userRef' in credentials) && ('secret' in credentials)) {
        localStorage.setItem(LS_SESSION_KEY, JSON.stringify(credentials))
        return true
    }
    return false
}

function destroySessionData() {
    USER_STORE = null
    localStorage.removeItem(LS_SESSION_KEY)
}

function getCredentials() {
    return JSON.parse(localStorage.getItem(LS_SESSION_KEY)) || null
}

function isSessionActive() {
    if (
        getCredentials() !== null && 
        typeof(getCredentials()) === 'object' && (
            'userRef' in getCredentials() &&
            'secret' in getCredentials() 
        ) && 
        USER_STORE !== null && 
        typeof(USER_STORE) === 'object' &&
        (
            'email' in USER_STORE &&
            'firstName' in USER_STORE &&
            'lastName' in USER_STORE &&
            'selectedListId' in USER_STORE &&
            'todoLists' in USER_STORE
        )
    ) return true
    return false
}

// Toggle loader with message and other message
function toggleLoader(msg) {
    if (msg) selectEl('[data-info-msg]').innerText = msg
    selectEl('#show-loader').classList.toggle('hidden')
}

function injectLoaderMsg(msg) {
    selectEl('[data-info-msg]').innerText = msg
}

// Mobile menu toggle
function toggleMobileMenu(e) {
    mobileMenu.classList.toggle('hidden')

    if (mobileMenu.classList.contains('hidden')) {
        mobileMenuOpenBtn.setAttribute('aria-expanded', 'false')
    } else {
        mobileMenuOpenBtn.setAttribute('aria-expanded', 'true')
    }
}

// Sidebar toggle
function toggleSidebar(e) {
    sideBar.classList.toggle('hidden')
    sidebarOverlay.classList.toggle('hidden')
}

// Dropdown toggle
function toggleDropdown(e) {
    dropDownTools.classList.toggle('hidden')
}

// Forms handler and logic for each specific formId
async function formsHandler(e) {
    e.preventDefault()

    // Get the form ID
    const formId = e.target.id

    if (formId === 'signup-form' || formId === 'login-form' || formId === 'account-form') {
        // Select the form error and susccess messages elems
        const errorMsg = e.target.querySelector('[data-error-msg]')
        const successMsg = e.target.querySelector('[data-success-msg]')

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

        // Validate payload & show err accordingly
        if (!validateInputData(payload, formId)) {
            // Throw error message to user
            errorMsg.innerText = 'Missing or invalid field(s) supplied' 
            return
        }

        // Sign Up Form 
        if (formId === 'signup-form') {
            toggleLoader('Signing you up...')

            try {
                // Call faunadb fSignup and set USER_STORE
                const suUserData = await fSignup(payload.email, payload.firstName, payload.lastName, payload.password, payload.tosAgreement)
                USER_STORE = { ...suUserData }

                injectLoaderMsg('Loading your dashboard...')

                // Call faunadb fLogin, then check & save credentials or throw error if check not passed
                const suCredentials = await fLogin(payload.email, payload.password)

                if (!createSessionTokens(suCredentials)) throw Error('Cannot get user credentials')

                // Load dashboard
                loginAfterTasks()
                e.target.reset()
                toggleLoader()
            } catch (e) {
                console.error('fSignup/fLogin error >>>', e.message)
                errorMsg.innerText = `Sign Up error: ${e.message.replace('instance', 'email')}`
                toggleLoader()
            }
        }

        // Log In Form
        if (formId === 'login-form') {
            toggleLoader('Logging you in...')

            try {
                // Call faunadb fLogin, then check & save credentials or throw error if check not passed
                const liCredentials = await fLogin(payload.email, payload.password)
                
                if (createSessionTokens(liCredentials)) {
                    injectLoaderMsg('Loading your dashboard...')

                    // Call faunadb fGetUserData and set USER_STORE
                    const liUserData = await fGetUserData({ ...liCredentials })
                    USER_STORE = { ...liUserData }

                    // Load dashboard
                    loginAfterTasks()
                    e.target.reset()
                    toggleLoader()
                } else {
                    throw Error('Cannot get user credentials')
                }
            } catch (e) {
                console.error('fLogin/fGetUserData >>>', e.message)
                errorMsg.innerText = `Log In error: ${e.message}`
                toggleLoader()
            }
        }

        // Account Form 
        if (formId === 'account-form' && isSessionActive()) {
            toggleLoader('Updating your details...')

            try {
                // Call faunadb fUpdateAccount and replace user's old data with new data
                const newUserData = await fUpdateAccount(payload.email, payload.firstName, payload.lastName, { ...getCredentials() })
                USER_STORE = {...USER_STORE, ...newUserData}
                renderUserFirstInitial()

                // If user is updating password
                if (payload.password) {
                    injectLoaderMsg('Updating your password...')

                    // Call faunadb fUpdatePassword
                    await fUpdatePassword(payload.password, { ...getCredentials() })
                    selectEl('#account-form #password-account').value = ''
                }

                // Show a success message
                successMsg.innerText = 'Update successful'
                toggleLoader()

                // Reset success message after 3s
                setTimeout(() => {
                    successMsg.innerText = ''
                }, 3000)
            } catch (e) {
                console.error('fUpdateAccount/fUpdatePassword >>>', e.message)
                errorMsg.innerText = `Update error: ${e.message}`
                toggleLoader()
            }
        }
    }

    if (formId === 'new-todo-form' && isSessionActive()) {
        // Add new todo
        const todoName = newTodoInput.value.trim()
        if (todoName === null || todoName === '' || USER_STORE.todoLists.some(todo => todo.name == todoName)) return
        const todo = createTodo(todoName)
        newTodoInput.value = null
        USER_STORE.todoLists.push(todo)
        USER_STORE.selectedListId = todo.id
        saveAndRender()
        if (!sideBar.classList.contains('hidden')) toggleSidebar()
    }

    if (formId === 'new-task-form' && isSessionActive()) {
        // Add new task
        const taskName = newTaskInput.value
        if (taskName === null || taskName === '') return
        const task = createTask(taskName)
        newTaskInput.value = null
        const selectedTodo = USER_STORE.todoLists.find(list => list.id === USER_STORE.selectedListId)
        selectedTodo.tasks.push(task)
        saveAndRender()
    }
}

// Validate form inputs
function validateInputData(payload, formId) {
    payload = typeof(payload) === 'object' && payload !== null ? payload : false

    const { email, firstName, lastName, password, tosAgreement } = payload

    if (payload && formId === 'signup-form') {
        return (typeof(firstName) === 'string' && firstName.length > 0) && 
            (typeof(lastName) === 'string' && lastName.length > 0) && 
            (typeof(email) === 'string' && validateEmail(email)) && 
            (typeof(password) === 'string' && password.length >= 4) && 
            (typeof(tosAgreement) === 'boolean' && tosAgreement !== false)
    }
    
    if (payload && formId === 'login-form') {
        return (typeof(email) === 'string' && validateEmail(email)) && 
            (typeof(password) === 'string' && password.length >= 4)
    }
    
    if (payload && formId === 'account-form') {
        return (typeof(firstName) === 'string' && firstName.length > 0) && 
            (typeof(lastName) === 'string' && lastName.length > 0) && 
            (typeof(email) === 'string' && validateEmail(email)) && 
            (typeof(password) === 'string' && (password === '' || password.length >= 4))
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

// Activate navbar button to match the current view
function activeNavBtn(target) {
    // Reset element current 'active' class 
    dashboardBtns.forEach(button => button.classList.remove('bg-indigo-200'))
    accountBtns.forEach(button => button.classList.remove('bg-indigo-200'))

    // Return if e isn't defined
    if (target == undefined || target == null) return

    if (target === 'dashboard') {
        dashboardBtns.forEach(button => button.classList.add('bg-indigo-200'))
    }

    if (target === 'account') {
        accountBtns.forEach(button => button.classList.add('bg-indigo-200'))
    }
}

// Show/Hide relevant componets by active session/action
function showComponent(element) {
    selectEl(element).classList.remove('hidden')
}

function hideAllComponents() {
    selectEl('#home-component').classList.add('hidden')
    selectEl('#signup-component').classList.add('hidden')
    selectEl('#login-component').classList.add('hidden')
    selectEl('#dashboard-component').classList.add('hidden')
    selectEl('#account-component').classList.add('hidden')
    selectEl('#acc-deleted-component').classList.add('hidden')
}

function showLoggedInElems() {
    selectAll('[data-logged-out]').forEach(link => link.classList.add('hidden'))
    selectAll('[data-logged-in]').forEach(link => link.classList.remove('hidden'))
}

function showLoggedOutElems() {
    selectAll('[data-logged-out]').forEach(link => link.classList.remove('hidden'))
    selectAll('[data-logged-in]').forEach(link => link.classList.add('hidden'))
}

// Get/Set user's name first initial
function renderUserFirstInitial() {
    selectEl('[data-user-name]').innerText = `${USER_STORE.firstName.charAt(0).toUpperCase()}'s Todo Lists`
}

// Log in user and render dashboard
function loginAfterTasks() {
    // Show logged in elements
    showLoggedInElems()

    // Hide all sections
    hideAllComponents()

    // Show the dashboard
    showComponent('#dashboard-component')

    // Activate Nav dashboard button
    activeNavBtn('dashboard')

    // Render user first initial display
    renderUserFirstInitial()

    // Show/hide NotificationsBtn
    toggleNotificationsBtn()

    // Render User's todos
    renderTodos()

    // Start todos worker
    startWorker()
}

// Log the user out and destroy the current session
function logoutAfterTasks() {
    // Show logged out elements
    showLoggedOutElems()

    // Hide all sections
    hideAllComponents()

    // Show the home section
    showComponent('#home-component')

    // Reset Nav 'active' class
    activeNavBtn(undefined)

    // Destroy the current session
    destroySessionData()

    // Start todos worker
    stopWorker()
}

async function handleAccDelete(e) {
    e.preventDefault()

    toggleLoader('Deleting your account...')

    try {
        // Call faunadb fDeleteAccount to get deleted data
        const deletedData = await fDeleteAccount({ ...getCredentials() })

        // Account deleted after tasks
        showLoggedOutElems()
        activeNavBtn(undefined)
        hideAllComponents()
        destroySessionData()

        // Show acc-deleted-component and deleted data
        selectEl('#acc-deleted-component').classList.remove('hidden')
        selectEl('#acc-deleted-component').querySelector('[data-acc-delteted-json]').value = JSON.stringify(deletedData)

        toggleLoader()
    } catch (e) {
        console.error('fDeleteAccount >>>', e.message)
        toggleLoader()
    }
}

// Populate elements in todos container
todosContainer.addEventListener('click', (e) => {
    e.preventDefault()

    if (e.target.tagName.toLowerCase() === 'a') {
        USER_STORE.selectedListId = e.target.dataset.todoId
        // renderTodos()
        saveAndRender()
        if (!sideBar.classList.contains('hidden')) toggleSidebar()
        if (!dropDownTools.classList.contains('hidden')) toggleDropdown()
    }
})

// Populate elements in tasks container
tasksContainer.addEventListener('click', (e) => {
    if (e.target.name === 'task-checkbox') {
        const selectedTodo = USER_STORE.todoLists.find(todo => todo.id === USER_STORE.selectedListId)
        const selectedTask = selectedTodo.tasks.find(task => task.id === e.target.id)
        selectedTask.completed = e.target.checked
        saveTodos()
        renderTodoTasksCount(selectedTodo)
    }

    if ('toggleAlarmForm' in e.target.dataset) {
        e.preventDefault()
        selectEl(`[data-form-id-${e.target.dataset.targetformId}]`).classList.toggle('hidden')
    }
})

tasksContainer.addEventListener('submit', (e) => {
    e.preventDefault()

    const taskId = e.target.dataset.taskId
    let alarmDate, alarmTime

    Array.from(e.target.elements).forEach(input => {
        if (input.name === 'alarm-date') alarmDate = input.value
        if (input.name === 'alarm-time') alarmTime = input.value
    })
    
    if (!taskId || !alarmDate || !alarmTime) return

    const selectedTask = USER_STORE.todoLists.find(({id}) => id === USER_STORE.selectedListId).tasks.find(({id}) => id === taskId)
    selectedTask.alarmDate = alarmDate
    selectedTask.alarmTime = alarmTime
    selectedTask.notified = false
    selectedTask.completed = false
    selectedTask.overdue = false
    saveAndRender()

    e.target.classList.toggle('hidden')
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
    if (name.length >= 1 && !USER_STORE.todoLists.some(todo => todo.name == name)) {
        updateTodoName(id, name)
    }
})

// Reset selectedTodoTitle to its defaults and render todos
saveTodoTitleBtn.addEventListener('click', (e) => {
    selectedTodoTitle.style.backgroundColor = 'transparent'
    selectedTodoTitle.style.padding = '0'
    selectedTodoTitle.blur()
    saveTodoTitleBtn.classList.add('hidden')
    saveAndRender()
})

// Clear tasks marked as completed
selectEl('[data-clear-complete-tasks]').addEventListener('click', (e) => {
    e.preventDefault()

    const selectedTodo = USER_STORE.todoLists.find(todo => todo.id === USER_STORE.selectedListId)
    selectedTodo.tasks = selectedTodo.tasks.filter(task => !task.completed)
    saveAndRender()
    toggleDropdown()
})

// Delete a selected todo list
selectEl('[data-delete-todo-list]').addEventListener('click', (e) => {
    e.preventDefault()

    USER_STORE.todoLists = USER_STORE.todoLists.filter(todo => todo.id !== USER_STORE.selectedListId)
    USER_STORE.selectedListId = ''
    saveAndRender()
    toggleDropdown()
})

// Create new todo
function createTodo(name) {
    return { id: Date.now().toString(), name, tasks: [] }
}

// Create new task
function createTask(name) {
    return { id: Date.now().toString(), name, completed: false, alarmDate: '', alarmTime: '', notified: false, overdue: false }
}

// Render a selected todo list
function renderTodos() {
    clearElement(todosContainer)
    renderTodosList()

    const selectedTodoList = USER_STORE.todoLists.find(list => list.id === USER_STORE.selectedListId)
    if (USER_STORE.selectedListId === '' || !USER_STORE.todoLists.length) {
        selectEl('[data-todo-display-empty]').classList.remove('hidden')
        todoListDisplayTasks.style.display = 'none'
    } else {
        selectEl('[data-todo-display-empty]').classList.add('hidden')
        todoListDisplayTasks.style.display = ''
        selectedTodoTitle.innerText = selectedTodoList.name !== undefined ? selectedTodoList.name : ''
        selectedTodoTitle.setAttribute('contenteditable', 'true')
        selectedTodoTitle.dataset.todoId = selectedTodoList.id
        renderTodoTasksCount(selectedTodoList)
        clearElement(tasksContainer)
        renderTodoTasks(selectedTodoList)
    }
}

// Render the todos list
function renderTodosList() {
    USER_STORE.todoLists.forEach(todo => {
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
        if (todoElement.dataset.todoId === USER_STORE.selectedListId) {
            todoElement.classList.add(...selectedClass)
        } else {
            todoElement.classList.add(...normalClass)
        }
        todosContainer.appendChild(todoElement)
    })
}

// Update a selected todo's title
function updateTodoName(id, name) {
    const selectedTodoList = USER_STORE.todoLists.find(list => list.id == id)
    selectedTodoList.name = name
}

// Render the remaining tasks count
function renderTodoTasksCount(selectedTodo) {
    const incompleteTasksCount = selectedTodo.tasks.filter(task => !task.completed).length
    const taskString = incompleteTasksCount === 1 ? 'task' : 'tasks'
    selectEl('[data-todo-count]').innerText = `${incompleteTasksCount} ${taskString} remaining`
}

// Render a selected todo's tasks
function renderTodoTasks(selectedTodo) {
    selectedTodo.tasks.forEach(task => {
        const { id, name, alarmDate, alarmTime, completed, notified, overdue } = task
        const taskElement = document.importNode(selectEl('#task-template').content, true)
        // Form alarm defaults
        taskElement.querySelector('form').setAttribute(`data-form-id-${id}`, '')
        taskElement.querySelector('form').dataset.taskId = id
        taskElement.querySelector('input[name=alarm-date]').value = alarmDate
        taskElement.querySelector('input[name=alarm-time]').value = alarmTime
        taskElement.querySelector('[data-toggle-alarm-form]').dataset.targetformId = id
        // Task checkbox/label/dueText
        const checkbox = taskElement.querySelector('input[name=task-checkbox]')
        checkbox.id = id
        checkbox.checked = completed
        const label = taskElement.querySelector('label')
        label.htmlFor = id
        label.append(name)
        const dueText = taskElement.querySelector('[data-due-text]')
        dueText.innerText = (!overdue && alarmDate && alarmTime) ? `Task due on ${new Date(`${alarmDate} ${alarmTime}`).toLocaleString()}` : overdue ? `Task overdue, marked as complete.` : ''
        if (overdue) dueText.classList.add('text-pink-400')
        const notifiedText = taskElement.querySelector('[data-notified-text]')
        notifiedText.innerText = (overdue && notified) ? 'Notified!' : (overdue && !notified) ? 'Not notified!' : ''
        if (!notified) notifiedText.classList.add('text-indigo-500')
        tasksContainer.appendChild(taskElement)
    })
}

// Clear elemnts from a parent node
function clearElement(elem) {
    while(elem.firstChild) {
        elem.removeChild(elem.firstChild)
    }
}

// Save todos data to FaunaDB
async function saveTodos() {
    try {
        // Call fUpdateTodos and replace latest todo data in USER_STORE
        const updatedTodos = await fUpdateTodos(USER_STORE.todoLists, USER_STORE.selectedListId, { ...getCredentials() })
        USER_STORE = { ...USER_STORE, ...updatedTodos }

        // Start worker if stopped and if new tasks are added
        if (IS_WORKER_RUNNING === false && areThereTasks()) startWorker()
    } catch (e) {
        // On error logout user to prevent data loss
        console.error('fUpdateTodos >>>', e.message)

        // Show DB error with countdown, then logout
        selectEl('#show-db-error').classList.remove('hidden')

        // 5s Countdown to logout
        let timer = 6
        function recursiveTimer() {
            if (timer > 1) {
                selectEl('[data-db-error]').innerText = `Database connection error. To prevent data loss you'll be logged out in ${timer-1}s.`
            } else {
                selectEl('#show-db-error').classList.add('hidden')
                selectEl('[data-db-error]').innerText = ''
                logoutAfterTasks()
            }
            timer--
            if (timer > 0) {
                setTimeout(recursiveTimer, 1000)
            }
        }
        recursiveTimer()
    }
}

// Save and render any changes
function saveAndRender() {
    saveTodos()
    renderTodos()
}

// Notifications service
function askNotificationPermission() {
	// Check if the browser supports notifications
	if (!('Notification' in window)) {
		console.log('This browser does not support notifications.')
	} else {
		if (notificationsPromise()) {
            // Ask the user and handle response
			Notification.requestPermission().then(() => toggleNotificationsBtn())
		} else {
			Notification.requestPermission(() => toggleNotificationsBtn())
		}
	}
}

// Notifications promise
function notificationsPromise() {
	try {
		Notification.requestPermission().then()
	} catch (e) {
		return false
	}
	return true
}

// Set the button to shown or hidden, depending on what the user answers
function toggleNotificationsBtn() {
    if (notificationsAllowed()) {
        enableNotificationsBtn.classList.add('hidden')
    } else {
        enableNotificationsBtn.classList.remove('hidden')
    }
}

function notificationsAllowed() {
    return (Notification.permission === 'denied' || Notification.permission === 'default') ? false : true
}

// Count available tasks
function areThereTasks() {
    return USER_STORE.todoLists.length && USER_STORE.todoLists.reduce((acc, todo) => acc + todo.tasks.length, 0)
}

function checkAlarmsAndNotify() {
    if (isSessionActive() && areThereTasks()) {

        let tracker = 0

        // Callback function for each task
        const toBeNotified = (task) => {
            const { alarmDate, alarmTime, name, notified, overdue } = task

            if (alarmDate && alarmTime) {
                const parsedDate = Date.parse(`${alarmDate} ${alarmTime}`)
                const dateNow = Date.now()
                const img = 'img/notifications-icon-128x128.png'
                const text = `Hey ${USER_STORE.firstName}! Your task "${name}" is now overdue and has been marked as complete.`

                if (!overdue && (dateNow > parsedDate)) {
                    if (!notified && notificationsAllowed()) {
                        new Notification(`ToDo's JS`, { body: text, icon: img })
                        task.notified = true
                    }
                    task.completed = true
                    task.overdue = true
                    tracker++
                }
            }

            return task
        }

        USER_STORE.todoLists = USER_STORE.todoLists.map(todo => {
            if (todo.tasks.length) todo.tasks.map(toBeNotified)
            return todo
        })

        if (tracker) saveAndRender()

    } else {
        stopWorker()
    }
}

function startWorker() {
    TODOS_WORKER = setInterval(checkAlarmsAndNotify, 5000)
    IS_WORKER_RUNNING = true
}

function stopWorker() {
    clearInterval(TODOS_WORKER)
    IS_WORKER_RUNNING = false
}

// Check an active user session and load its last state
async function sessionChecker() {
    // Check for an active session, if so run loginAfterTasks otherwise destroy any session data
    if (getCredentials() !== null && ('userRef' in getCredentials() && 'secret' in getCredentials())) {
        toggleLoader('Loading your dashboard...')

        try {
            // Call faunadb fGetUserData and set USER_STORE
            const userData = await fGetUserData({ ...getCredentials() })
            USER_STORE = { ...userData }
            loginAfterTasks()
            toggleLoader()
        } catch (e) {
            console.error('fGetUserData >>> ', e.message)
            logoutAfterTasks()
            toggleLoader()
        }
    } else {
        showComponent('#home-component')
    }
}

// Check active session on pageload
window.onload = () => {
    sessionChecker()
}
