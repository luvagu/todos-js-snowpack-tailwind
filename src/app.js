
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
let TODOS_WORKER = undefined

// Custom query selector use selectEl & selectAll instead of selectEl
const selectEl = (element) => document.querySelector(element)
const selectAll = (elements) => document.querySelectorAll(elements)

// App Elemnt Selectors
const homeLink = selectEl('#home-link')

const mobileMenu = selectEl('#mobile-menu')
const mobileMenuOpenBtn = selectEl('#mobile-menu-open')
const mobileMenuCloseBtn = selectEl('#mobile-menu-close')

const sideBar = selectEl('#sidebar')
const sidebarOverlay = selectEl('#sidebar-overlay')
const sidebarOpen = selectEl('#sidebar-open')
const sidebarOpenNoTasksMobile = selectEl('#add-todo-sidebar')
const enableNotificationsBtn = selectEl('#enable-notifications')

const dropDownToggleBtn = selectEl('#dropdown-toggle')

const signUpBtns = selectAll('[data-signup-button]')
const logInBtns = selectAll('[data-login-button]')

const dashboardBtns = selectAll('[data-dashboard-button]')
const accountBtns = selectAll('[data-account-button]')
const logOutBtnNav = selectAll('[data-logout-button]')

const allForms = selectAll('form')
const deleteAccountBtn = selectEl('#delete-account')

const todosContainer = selectEl('[data-todos]')
const newTodoInput = selectEl('[data-new-todo-input]')
const todoListDisplayTasks = selectEl('[data-todo-display-tasks]')
const selectedTodoTitle = selectEl('[data-todo-title]')
const saveTodoTitleBtn = selectEl('[data-save-list-name]')
const todosListCounter = selectEl('[data-todo-count]')
const tasksContainer = selectEl('[data-tasks]')
const newTaskInput = selectEl('[data-new-task-input]')
const taskTemplate = selectEl('#task-template')
const clearCompletedTasksBtn = selectEl('[data-clear-complete-tasks]')
const deleteTodoListBtn = selectEl('[data-delete-todo-list]')

// Home link
homeLink.addEventListener('click', (e) => {
    e.preventDefault()

    // Hide all sections
    hideAllSections()

    if (!isSessionActive()) {
        // Show the home section
        showHomeSection()
    } else {
        // Load the logInComponent
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

        // Load the signUpComponent
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

        // Load the logInComponent
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

        // Hide mobile menu
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu()
        }
        
        if (isSessionActive()) {
            toggleLoader('Logging you out...')

            // Call fauna fLogout
            fLogout(getCredentials().secret)
                .then(() => {
                    logoutAfterTasks()
                    toggleLoader()
                })
                .catch(e => {
                    console.error('Logout >>>', e.message)
                    toggleLoader()
                })
        }
    })
)

// Dashboard button
dashboardBtns.forEach(button => 
    button.addEventListener('click', (e) => {
        e.preventDefault()

        // Hide all sections
        hideAllSections()

        // Load the logInComponent
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
        selectEl('#account-form').querySelector('[data-error-msg]').innerText = ''
        selectEl('#account-form').querySelector('[data-success-msg]').innerText = ''

        // Populate account-form values accordingly
        selectEl('#account-form #email-address-account').value = USER_STORE.email
        selectEl('#account-form #first-name-account').value = USER_STORE.firstName
        selectEl('#account-form #last-name-account').value = USER_STORE.lastName

        // Hide all sections
        hideAllSections()

        // Load the logInComponent
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

// Enable desktop notifications
enableNotificationsBtn.addEventListener('click', askNotificationPermission)

// Dropdown open/close
dropDownToggleBtn.addEventListener('click', toggleDropdown)

// SignUp, LogIn, Account, New todo/tasks forms
allForms.forEach(form => form.addEventListener('submit', formsHandler))

// Delete user account
deleteAccountBtn.addEventListener('click', (e) => {
    e.preventDefault()

    toggleLoader('Deleting your account...')

    fDeleteAccount({ ...getCredentials() })
        .then(deletedData => {
            console.log(deletedData)
            logoutAfterTasks()
            toggleLoader()
        })
        .catch(e => {
            console.error('fDeleteAccount >>>', e.message)
            toggleLoader()
        })
}) 

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
        getCredentials() !== null && (
            'userRef' in getCredentials() &&
            'secret' in getCredentials() 
        ) && 
        USER_STORE !== null && 
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

// Toggle loader with message
function toggleLoader(msg) {
    const loader = selectEl('#showLoader')
    if (msg) loader.querySelector('[data-info-msg]').innerText = msg
    loader.classList.toggle('hidden')
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
    selectEl('#dropdown-tools').classList.toggle('hidden')
}

// Forms handler and logic for each specific formId
function formsHandler(e) {
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

            // Call faunadb fSignup
            fSignup(payload.email, payload.firstName, payload.lastName, payload.password, payload.tosAgreement)
                .then(userData => {
                    // Set USER_STORE
                    USER_STORE = { ...userData }
                    // Call faunadb fLogin
                    fLogin(payload.email, payload.password)
                        .then(credentials => {
                            // Save credentials
                            if (!createSessionTokens(credentials)) throw Error('Cannot get user credentials')
                            // Load dashboard
                            loginAfterTasks()
                            e.target.reset()
                            toggleLoader()
                        })
                        .catch(e => {
                            console.error('fLogin error >>>', e.message)
                            errorMsg.innerText = `Log In error: ${e.message}`
                            toggleLoader()
                        })
                })
                .catch(e => {
                    console.error('fSignup error >>>', e.message)
                    errorMsg.innerText = `Sign Up error: ${e.message.replace('instance', 'email')}`
                    toggleLoader()
                })
        }

        // Log In Form
        if (formId === 'login-form') {
            toggleLoader('Logging you in...')

            // Call faunadb fLogin
            fLogin(payload.email, payload.password)
                .then(credentials => {
                    // Save credentials
                    if (createSessionTokens(credentials)) {
                        // Call faunadb fGetUserData and set USER_STORE
                        fGetUserData({ ...credentials })
                            .then(userData => {
                                USER_STORE = { ...userData }
                                // Load dashboard
                                loginAfterTasks()
                                e.target.reset()
                                toggleLoader()
                            })
                            .catch(e => {
                                console.error('fGetUserData >>> ', e.message)
                                errorMsg.innerText = `Log In error: ${e.message}`
                                toggleLoader()
                            })
                    } else {
                        throw Error('Cannot get user credentials')
                    }
                })
                .catch(e => {
                    console.error('fLogin >>>', e.message)
                    errorMsg.innerText = `Log In error: ${e.message}`
                    toggleLoader()
                })
        }

        // Account Form 
        if (formId === 'account-form' && isSessionActive()) {
            toggleLoader('Updating your details...')

            // Call faunadb fUpdateAccount
            fUpdateAccount(payload.email, payload.firstName, payload.lastName, { ...getCredentials() })
                .then(newUserData => {
                    // Replace user's old data with new data
                    USER_STORE = {...USER_STORE, ...newUserData}
                    renderUserFirstInitial()

                    if (payload.password) {
                        fUpdatePassword(payload.password, { ...getCredentials() })
                            .then(() => {
                                // Show a success message
                                successMsg.innerText = 'Update successful'
                                selectEl('#account-form #password-account').value = ''
                                toggleLoader()

                                // Reset success message after 3s
                                setTimeout(() => {
                                    successMsg.innerText = ''
                                }, 3000)
                            })
                            .catch(e => {
                                console.error('fUpdatePassword >>>', e.message)
                                errorMsg.innerText = `Update error: ${e.message}`
                                toggleLoader()
                            })
                    } else {
                        // Show a success message
                        successMsg.innerText = 'Update successful'
                        toggleLoader()

                        // Reset success message after 3s
                        setTimeout(() => {
                            successMsg.innerText = ''
                        }, 3000)
                    }
                })
                .catch(e => {
                    console.error('fUpdateAccount >>>', e.message)
                    errorMsg.innerText = `Update error: ${e.message}`
                    toggleLoader()
                })
        }

        // Reset error message
        errorMsg.innerText = ''
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
function showHomeSection() {
    selectEl('#home-component').classList.remove('hidden')
}

function showSignUpSection() {
    selectEl('#signup-component').classList.remove('hidden')
}

function showLogInSection() {
    selectEl('#login-component').classList.remove('hidden')
}

function showAccountSection() {
    selectEl('#account-component').classList.remove('hidden')
}

function showDashboardSection() {
    selectEl('#dashboard-component').classList.remove('hidden')
}

function hideAllSections() {
    selectEl('#home-component').classList.add('hidden')
    selectEl('#signup-component').classList.add('hidden')
    selectEl('#login-component').classList.add('hidden')
    selectEl('#account-component').classList.add('hidden')
    selectEl('#dashboard-component').classList.add('hidden')
}

function toogleLoggedInOutElems() {
    selectAll('[data-logged-out]').forEach(link => link.classList.toggle('hidden'))
    selectAll('[data-logged-in]').forEach(link => link.classList.toggle('hidden'))
}

// Get/Set user's name first initial
function renderUserFirstInitial() {
    selectEl('[data-user-name]').innerText = `${USER_STORE.firstName.charAt(0).toUpperCase()}'s Todo Lists`
}

// Log in user and render dashboard
function loginAfterTasks() {
    // Show logged in elements
    toogleLoggedInOutElems()

    // Hide all sections
    hideAllSections()

    // Show the dashboard
    showDashboardSection()

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
    toogleLoggedInOutElems()

    // Hide all sections
    hideAllSections()

    // Show the home section
    showHomeSection()

    // Reset Nav 'active' class
    activeNavBtn(undefined)

    // Destroy the current session
    destroySessionData()
}

// Populate elements in todos container
todosContainer.addEventListener('click', (e) => {
    e.preventDefault()

    if (e.target.tagName.toLowerCase() === 'a') {
        USER_STORE.selectedListId = e.target.dataset.todoId
        // saveAndRender()
        renderTodos()
        if (!sideBar.classList.contains('hidden')) toggleSidebar()
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
clearCompletedTasksBtn.addEventListener('click', (e) => {
    e.preventDefault()

    const selectedTodo = USER_STORE.todoLists.find(todo => todo.id === USER_STORE.selectedListId)
    selectedTodo.tasks = selectedTodo.tasks.filter(task => !task.completed)
    saveAndRender()
    toggleDropdown()
})

// Delete a selected todo list
deleteTodoListBtn.addEventListener('click', (e) => {
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
    todosListCounter.innerText = `${incompleteTasksCount} ${taskString} remaining`
}

// Render a selected todo's tasks
function renderTodoTasks(selectedTodo) {
    selectedTodo.tasks.forEach(task => {
        const { id, name, alarmDate, alarmTime, completed, notified, overdue } = task
        const taskElement = document.importNode(taskTemplate.content, true)
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

// Save todos data to localstorage
function saveTodos() {
    toggleLoader('Saving changes...')

    fUpdateTodos(USER_STORE.todoLists, USER_STORE.selectedListId, { ...getCredentials() })
        .then(updatedTodos => {
            // Replace with latest data
            USER_STORE = { ...USER_STORE, ...updatedTodos }
            toggleLoader()
        })
        .catch(e => {
            console.error('fUpdateTodos >>>', e.message)
            toggleLoader()
        })
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

function checkAlarmsAndNotify() {
    if (isSessionActive() && USER_STORE.todoLists.length) {

        let tracker = 0

        const toBeNotified = (task) => {
            const { alarmDate, alarmTime, name, notified, overdue } = task

            if (alarmDate && alarmTime) {
                const parsedDate = Date.parse(`${alarmDate} ${alarmTime}`)
                const dateNow = Date.now()
                const img = 'img/notifications-icon-128x128.png'
                const text = `Hey ${USER_STORE.firstName}! Your task "${name}" is now overdue and has been marked as complete.`

                if (!overdue && (dateNow > parsedDate)) {
                    if (!notified && notificationsAllowed()) {
                        new Notification(`To-Do's JS`, { body: text, icon: img })
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
}

function stopWorker() {
    clearInterval(TODOS_WORKER)
}

// Check an active user session and load its last state
function sessionChecker() {
    // Check for an active session, if so run loginAfterTasks otherwise destroy any session data
    if (getCredentials() !== null && ('userRef' in getCredentials() &&'secret' in getCredentials())) {
        toggleLoader('Loading your dashboard...')

        // Call faunadb fGetUserData and set USER_STORE
        fGetUserData({ ...getCredentials() })
            .then(userData => {
                USER_STORE = { ...userData }
                // Load dashboard
                loginAfterTasks()
                toggleLoader()
            })
            .catch(e => {
                console.error('fGetUserData >>> ', e.message)
                destroySessionData()
                toggleLoader()
            })
    }
}

// Check active session on pageload
window.onload = () => {
    sessionChecker()
}