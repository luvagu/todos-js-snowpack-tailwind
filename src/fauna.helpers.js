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

const fClient = new faunadb.Client({ secret: 'fnAED7DuMtACBgvGB0Nwki8Djg0yclrf3UkfGmP4' })

export const fSignup = async (email, firstName, lastName, password, tosAgreement = false) => {
    const { data } = await fClient.query(
        Create(
            Collection('users'), 
            { 
                credentials: { password }, 
                data: { email, firstName, lastName, passUpdateTs: 0, selectedListId: '', todoLists: [], tosAgreement } 
            }
        )
    )

    delete data.passUpdateTs
    delete data.tosAgreement
    
    return data
}

export const fLogin = async (email, password) => {
    const response = await fClient.query(
        Login(
            Match(
                Index("users_by_email"), email),
                { password },
            )
    )

    return {
        userRef: response.instance.id,
        secret: response.secret
    }
}

export const fLogout = async (secret) => {
    return await new faunadb.Client({ secret }).query(Logout(true))
}

export const fUpdateAccount = async (email, firstName, lastName, { userRef, secret }) => {
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

export const fUpdatePassword = async (password, { userRef, secret }) => {
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

export const fGetUserData = async ({ userRef, secret }) => {
    const { data } = await new faunadb.Client({ secret }).query(
        Call(Fn('getUserDoc'), userRef)
        // Get(Ref(Collection('users'), userRef))
        // Paginate(Documents(Collection('users')))
    )

    delete data.tosAgreement
    delete data.passUpdateTs

    return data
}

export const fDeleteAccount = async ({ userRef, secret }) => {
    const { data } = await new faunadb.Client({ secret }).query(
        Delete(Ref(Collection('users'), userRef))
    )

    return data
}

export const fUpdateTodos = async (todoLists, selectedListId, { userRef, secret }) => {
    if (typeof(todoLists) !== 'object' && !(todoLists instanceof Array)) throw Error('Invalid type of data')

    const { data } = await new faunadb.Client({ secret }).query(
        Update(
            Ref(Collection('users'), userRef), 
            { data: { todoLists, selectedListId } }
        )
    )

    return {
        todoLists: data.todoLists,
        selectedListId: data.selectedListId
    }
}

export const fGetTodos = async ({ userRef, secret }) => {
    const { data } = await new faunadb.Client({ secret }).query(
        // Get(Ref(Collection('users'), userRef))
        Call(Fn('getUserDoc'), userRef)
    )
    
    return {
        todoLists: data.todoLists,
        selectedListId: data.selectedListId
    }
}

// let first, last, email, password, tos

// let DATA_STORE = null

// function toggleLoader(msg) {
//     const loader = document.querySelector('#showLoader')
//     if (msg) loader.innerText = msg
//     loader.classList.toggle('hidden')
// }

// document.querySelectorAll('input').forEach(input => {
//     switch (input.name) {
//         case 'first': first = input.value
//             break;
//         case 'last': last = input.value
//             break;
//         case 'email': email = input.value
//             break;  
//         case 'password': password = input.value
//             break; 
//         case 'tos': tos = input.checked
//             break;                                    
//         default:
//             break;
//     }

//     input.addEventListener('input', (e) => {
//         switch (input.name) {
//             case 'first': first = input.value
//                 break;
//             case 'last': last = input.value
//                 break;
//             case 'email': email = input.value
//                 break;  
//             case 'password': password = input.value
//                 break; 
//             case 'tos': tos = input.checked
//                 break;                                    
//             default:
//                 break;
//         }
//     })
// })

// document.querySelectorAll('button').forEach(button => 
//     button.addEventListener('click', (e) => {

//         if (e.target.id === 'suli') {
//             toggleLoader('Signing Up...')
//             fSignup(email, first, last, password, tos)
//                 .then(userData => {
//                     DATA_STORE = { ...userData }
//                     console.log('DATA_STORE >>>', DATA_STORE)

//                     fLogin(email, password)
//                         .then(credentials => {
//                             console.log('credentials loginUser >>>', credentials)

//                             if (createSessionTokens(credentials)) {
//                                 console.log('Login success')
//                             }

//                             toggleLoader()
//                         })
//                         .catch(e => {
//                             console.error('error loginUser >>>', e.message)
//                             toggleLoader()
//                         })
//                 })
//                 .catch(e => {
//                     console.error('error fSignup >>>', e.message)
//                     toggleLoader()
//                 })
//         }

//         if (e.target.id === 'li') {
//             toggleLoader()
//             fLogin(email, password)
//                 .then(credentials => {
//                     console.log('credentials loginUser >>>', credentials)

//                     if (createSessionTokens(credentials)) {
//                         console.log('Login success')

//                         fGetUserData({ ...credentials })
//                             .then(userData => {
//                                 console.log('userData fGetUserData >>>', userData)
//                                 DATA_STORE = { ...userData }
//                                 console.log('DATA_STORE >>>', DATA_STORE)
//                                 toggleLoader()
//                             })
//                             .catch(e => {
//                                 console.error(e.message)
//                                 toggleLoader()
//                             })
//                     }
//                 })
//                 .catch(e => {
//                     console.error('error loginUser >>>', e.message)
//                     toggleLoader()
//                 })
//         }

//         if (isSessionActive()) {

//             if (e.target.id === 'lo') {
//                 toggleLoader()
//                 fLogout(getCredentials().secret)
//                     .then(s => {
//                         console.log('Logout >>>', s)
//                         destroySessionData()
//                         console.log('DATA_STORE destroy >>>', DATA_STORE)
//                         console.log('Session tokens destroy >>>', getCredentials())
//                         toggleLoader()
//                     })
//                     .catch(e => {
//                         console.error(e.message)
//                         toggleLoader()
//                     })
//             }
    
//             if (e.target.id === 'ua') {
//                 toggleLoader()
//                 fUpdateAccount(email, first, last, { ...getCredentials() })
//                     .then(newUserData => {
//                         console.log('newUserData fUpdateAccount >>>', newUserData)
//                         DATA_STORE = {...DATA_STORE, ...newUserData}
//                         console.log('DATA_STORE >>>', DATA_STORE)
//                         toggleLoader()
//                     })
//                     .catch(e => {
//                         console.error(e.message)
//                         toggleLoader()
//                     })
//             }
    
//             if (e.target.id === 'up') {
//                 toggleLoader()
//                 fUpdatePassword(password, { ...getCredentials() })
//                     .then(updated => {
//                         console.log('fUpdatePassword >>>', updated)
//                         toggleLoader()
//                     })
//                     .catch(e => {
//                         console.error(e.message)
//                         toggleLoader()
//                     })
//             }
    
//             if (e.target.id === 'gu') {
//                 toggleLoader()
//                 fGetUserData({ ...getCredentials() })
//                     .then(latestUserData => {
//                         console.log('fGetUserData >>>', latestUserData)
//                         DATA_STORE = { ...latestUserData }
//                         console.log('DATA_STORE latest >>>', DATA_STORE)
//                         toggleLoader()
//                     })
//                     .catch(e => {
//                         console.error(e.message)
//                         toggleLoader()
//                     })
//             }
    
//             if (e.target.id === 'utd') {
//                 toggleLoader()
//                 const newTodo = { id: Date.now(), name: 'New Todo List', tasks: [] }
//                 DATA_STORE.todoLists.push(newTodo)
//                 fUpdateTodos(DATA_STORE.todoLists, { ...getCredentials() })
//                     .then(todo => {
//                         console.log('fUpdateTodos >>>', todo)
//                         toggleLoader()
//                     })
//                     .catch(e => {
//                         console.error(e.message)
//                         toggleLoader()
//                     })
//             }

//             if (e.target.id === 'gutds') {
//                 toggleLoader()
//                 fGetTodos({ ...getCredentials() })
//                     .then(todos => {
//                         console.log('fGetTodos >>>', todos)
//                         toggleLoader()
//                     })
//                     .catch(e => {
//                         console.error(e.message)
//                         toggleLoader()
//                     })
//             }
    
//             if (e.target.id === 'dua') {
//                 toggleLoader()
//                 fDeleteAccount({ ...getCredentials() })
//                     .then(m => {
//                         console.log('fDeleteAccount >>>', m)
//                         toggleLoader()
//                     })
//                     .catch(e => {
//                         console.error(e.message)
//                         toggleLoader()
//                     })
//             }

//         } else {
//             console.log('Please fLogin or fSignup')
//         }
//     })
// )