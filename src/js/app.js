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
