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
const sidebarOpenMobileEmptyTasks = selectEl('#add-todo-sidebar')

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