import faunadb from 'faunadb'

const {
    Call,
    Collection,
	Create,
	Delete,
    Function: Fn,
	Get,
	Index,
    Login,
    Logout,
    Match,
	Ref,
    Update,
} = faunadb.query

let DATA_STORE = null

const fClient = new faunadb.Client({ secret: 'fnAED7DuMtACBgvGB0Nwki8Djg0yclrf3UkfGmP4' })

export const createUser = async (email, firstName, lastName, password, tosAgreement = false) => {
    const { data } = await fClient.query(
        Create(
            Collection('users'), 
            { 
                credentials: { password }, 
                data: { email, firstName, lastName, passUpdateTs: 0, selectedListId: 0, todoLists: [], tosAgreement } 
            }
        )
    )

    delete data.passUpdateTs
    delete data.tosAgreement
    
    return data
}

export const logInUser = async (email, password) => {
    const response = await fClient.query(
        Login(
            Match(
                Index("users_by_email"), email),
                { password },
            )
    )

    return {
        userRef: response.instance.id,
        userToken: response.secret
    }
}

const createSessionToken = (credentials) => {
    if (typeof(credentials) === 'object' && ('userRef' in credentials) && ('userToken' in credentials)) {
        localStorage.setItem('testSessionToken', JSON.stringify(credentials))
        return true
    }

    return false
}

const getCredentials = () => JSON.parse(localStorage.getItem('testSessionToken')) || null

export const logOutUser = async (secret) => {
    return await new faunadb.Client({ secret }).query(Logout(true))
}

export const updateUserAccount = async (email, firstName, lastName, { userRef, userToken: secret }) => {
    const { data } = await new faunadb.Client({ secret }).query(
        Update(
            Ref(Collection("users"), userRef),
            { data: { email, firstName, lastName } }
        )
    )

    return {
        email: data.email, 
        firstName: data.firstName, 
        lastName: data.lastName
    }
}

export const updateUserPassword = async (password, { userRef, userToken: secret }) => {
    const response = await new faunadb.Client({ secret }).query(
        Update(
            Ref(Collection("users"), userRef),
            { 
                credentials: { password },
                data: { passUpdateTs: Date.now() * 1000 }
            }
        )
    )

    return ('data' in response)
}

export const getLatestUserData = async ({ userRef, userToken: secret }) => {
    const { data } = await new faunadb.Client({ secret }).query(
        Call(Fn('getUserDoc'), userRef)
        // Get(Ref(Collection('users'), userRef))
        // Paginate(Documents(Collection('users')))
    )

    delete data.tosAgreement
    delete data.passUpdateTs

    return data
}

export const deleteUserAccount = async ({ userRef, userToken: secret }) => {
    const { data } = await new faunadb.Client({ secret }).query(
        Delete(Ref(Collection('users'), userRef))
    )

    return data
}

export const updateUserTodos = async (todoLists, { userRef, userToken: secret }) => {
    if (typeof(todoLists) !== 'object' && !(todoLists instanceof Array)) throw Error('Invalid type of data')

    const { data } = await new faunadb.Client({ secret }).query(
        Update(
            Ref(Collection('users'), userRef), 
            { data: { todoLists } }
        )
    )

    return data.todoLists
}

export const getUserTodos = async ({ userRef, userToken: secret }) => {
    const { data } = await new faunadb.Client({ secret }).query(
        // Get(Ref(Collection('users'), userRef))
        Call(Fn('getUserDoc'), userRef)
    )
    
    return data.todoLists
}

let first, last, email, password, tos

function toggleLoader() {
    document.querySelector('#showLoader').classList.toggle('hidden')
}

document.querySelectorAll('input').forEach(input => {
    switch (input.name) {
        case 'first': first = input.value
            break;
        case 'last': last = input.value
            break;
        case 'email': email = input.value
            break;  
        case 'password': password = input.value
            break; 
        case 'tos': tos = input.checked
            break;                                    
        default:
            break;
    }

    input.addEventListener('input', (e) => {
        switch (input.name) {
            case 'first': first = input.value
                break;
            case 'last': last = input.value
                break;
            case 'email': email = input.value
                break;  
            case 'password': password = input.value
                break; 
            case 'tos': tos = input.checked
                break;                                    
            default:
                break;
        }
    })
})

document.querySelectorAll('button').forEach(button => 
    button.addEventListener('click', (e) => {

        if (e.target.id === 'suli') {
            toggleLoader()
            createUser(email, first, last, password, tos)
                .then(userData => {
                    DATA_STORE = { ...userData }
                    console.log('DATA_STORE >>>', DATA_STORE)

                    logInUser(email, password)
                        .then(credentials => {
                            console.log('credentials loginUser >>>', credentials)

                            if (createSessionToken(credentials)) {
                                console.log('Login success')
                            }

                            toggleLoader()
                        })
                        .catch(e => {
                            console.error('error loginUser >>>', e.message)
                            toggleLoader()
                        })
                })
                .catch(e => {
                    console.error('error createUser >>>', e.message)
                    toggleLoader()
            })
        }

        if (e.target.id === 'li') {
            toggleLoader()
            logInUser(email, password)
                .then(credentials => {
                    console.log('credentials loginUser >>>', credentials)

                    if (createSessionToken(credentials)) {
                        console.log('Login success')

                        getUserData({ ...credentials })
                            .then(userData => {
                                console.log('userData getUserData >>>', userData)
                                DATA_STORE = { ...userData }
                                console.log('DATA_STORE >>>', DATA_STORE)
                                toggleLoader()
                            })
                            .catch(e => {
                                console.error(e.message)
                                toggleLoader()
                            })
                    }
                })
                .catch(e => {
                    console.error('error loginUser >>>', e.message)
                    toggleLoader()
                })
        }

        // all fns below only trigger if session active --->

        if (e.target.id === 'ua') {
            toggleLoader()
            updateUserAccount(email, first, last, { ...getCredentials() })
                .then(newUserData => {
                    console.log('newUserData updateUserAccount >>>', newUserData)
                    DATA_STORE = (DATA_STORE !== null) ? {...DATA_STORE, ...newUserData} : null
                    console.log('DATA_STORE >>>', DATA_STORE)
                    toggleLoader()
                })
                .catch(e => {
                    console.error(e.message)
                    toggleLoader()
                })
        }

        if (e.target.id === 'up') {
            toggleLoader()
            updateUserPassword(password, { ...getCredentials() })
                .then(updated => {
                    console.log('updateUserPassword >>>', updated)
                    toggleLoader()
                })
                .catch(e => {
                    console.error(e.message)
                    toggleLoader()
                })
        }

        if (e.target.id === 'lo') {
            toggleLoader()
            logOutUser(getCredentials().userToken)
                .then(s => {
                    console.log('Logout >>>', s)
                    DATA_STORE = null
                    console.log('DATA_STORE reset >>>', DATA_STORE)
                    toggleLoader()
                })
                .catch(e => {
                    console.error(e.message)
                    toggleLoader()
                })
        }

        if (e.target.id === 'gu') {
            toggleLoader()
            getLatestUserData({ ...getCredentials() })
                .then(latestUserData => {
                    console.log('getLatestUserData >>>', latestUserData)
                    DATA_STORE = (DATA_STORE !== null) ? {...DATA_STORE, ...latestUserData} : null
                    console.log('DATA_STORE latest >>>', DATA_STORE)
                    toggleLoader()
                })
                .catch(e => {
                    console.error(e.message)
                    toggleLoader()
                })
        }

        if (e.target.id === 'gutds') {
            toggleLoader()
            getUserTodos({ ...getCredentials() })
                .then(todos => {
                    console.log('getUserTodos >>>', todos)
                    toggleLoader()
                })
                .catch(e => {
                    console.error(e.message)
                    toggleLoader()
                })
        }

        if (e.target.id === 'utd') {
            toggleLoader()
            const newTodo = { id: Date.now(), name: 'First Todo List', tasks: [] }
            const todoLists = (DATA_STORE !== null && 'todoLists' in DATA_STORE) ? DATA_STORE.todoLists : []
            todoLists.push(newTodo)
            DATA_STORE = { ...DATA_STORE, todoLists }
            updateUserTodos(todoLists, { ...getCredentials() })
                .then(todo => {
                    console.log('updateUserTodos >>>', todo)
                    toggleLoader()
                })
                .catch(e => {
                    console.error(e.message)
                    toggleLoader()
                })
        }

        if (e.target.id === 'dua') {
            toggleLoader()
            deleteUserAccount({ ...getCredentials() })
                .then(m => {
                    console.log('deleteUserAccount >>>', m)
                    toggleLoader()
                })
                .catch(e => {
                    console.error(e.message)
                    toggleLoader()
                })
        }
    })
)