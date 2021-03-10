import faunadb from 'faunadb'

const {
    Call,
    Collection,
	Create,
	Delete,
	Documents,
    Function: Fn,
	Get,
	Index,
    Lambda,
    Login,
    Logout,
	Map: FMap,
    Match,
	Paginate,
	Ref,
    Update,
    Var
} = faunadb.query

const fClient = new faunadb.Client({ secret: 'fnAED7DuMtACBgvGB0Nwki8Djg0yclrf3UkfGmP4' })

export const createUser = async (firstName, lastName, email, password, tosAgreement = false) => {
    return await fClient.query(
        Create(
            Collection('users'), 
            { 
                credentials: { password }, 
                data: { email, firstName, lastName, selectedListId: 0, todoLists: [], tosAgreement } 
            }
        )
    )
}

export const logInUser = async (email, password) => {
    return await fClient.query(
        Login(
            Match(
                Index("users_by_email"), email),
                { password },
            )
    )
}

const createSessionToken = (userRef, userToken) => {
    if (userRef && userToken) {
        localStorage.setItem('testSessionToken', JSON.stringify({ userRef, userToken }))
        return true
    }
    return false
}

const getSessionKeys = () => JSON.parse(localStorage.getItem('testSessionToken')) || null

export const logOutUser = async (secret) => {
    return await new faunadb.Client({ secret }).query(Logout(true))
}

export const updateUserAccount = async (firstName, lastName, email, { userRef, userToken: secret }) => {
    return await new faunadb.Client({ secret }).query(
        Update(
            Ref(Collection("users"), userRef),
            { data: { firstName, lastName, email } }
        )
    )
}

export const updateUserPassword = async (password, { userRef, userToken: secret }) => {
    return await new faunadb.Client({ secret }).query(
        Update(
            Ref(Collection("users"), userRef),
            { credentials: { password } }
        )
    )
}

export const getUserData = async ({ userRef, userToken: secret }) => {
    const { data } = await new faunadb.Client({ secret }).query(
        // Call(Fn('getUserDoc'), userRef)
        Get(Ref(Collection('users'), userRef))
        // Paginate(Documents(Collection('users')))
    )

    return data
}

export const deleteUserAccount = async ({ userRef, userToken: secret }) => {
    return await new faunadb.Client({ secret }).query(
        Delete(Ref(Collection('users'), userRef))
    )
}

export const updateUserTodos = async (todoLists, { userRef, userToken: secret }) => {
    if (typeof(todoLists) !== 'object' && !(todoLists instanceof Array)) throw Error('Invalid type of data')

    return await new faunadb.Client({ secret }).query(
        Update(
            Ref(Collection('users'), userRef), 
            { data: { todoLists } }
        )
    )
}

export const getUserTodos = async ({ userRef, userToken: secret }) => {
    const { data } = await new faunadb.Client({ secret }).query(
        Get(Match(Index("all_users")))
    )

    // const todos = data.map(doc => {
    //     const { data } = doc
    //     data.id = doc.ref.id
    //     return data
    // })
    
    return data
}

let first, last, email, password, tos

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
            createUser(first, last, email, password, tos)
                .then(res => {
                    console.log('res createUser >>>', res.data)

                    logInUser(email, password)
                        .then(res => {
                            console.log('res loginUser >>>', res)
                            console.log('userToken >>>', res.secret)
                            console.log('user ref >>>', res.instance.id)

                            if (createSessionToken(res.instance.id, res.secret)) {
                                console.log('Login success')
                            }
                        })
                        .catch(e => {
                            console.error('error loginUser >>>', e.message)
                        })
                })
                .catch(e => {
                    console.error('error createUser >>>', e.message)
            })
        }

        if (e.target.id === 'li') {
            logInUser(email, password)
                .then(res => {
                    console.log('res loginUser >>>', res)
                    console.log('userToken >>>', res.secret)
                    console.log('user ref >>>', res.instance.id)

                    if (createSessionToken(res.instance.id, res.secret)) {
                        console.log('Login success')
                    }
                })
                .catch(e => {
                    console.error('error loginUser >>>', e.message)
                })
        }

        if (e.target.id === 'ua') {
            updateUserAccount(first, last, email, { ...getSessionKeys() })
                .then(m => console.log('updateUserAccount >>>', m))
                .catch(e => console.error(e.message))
        }

        if (e.target.id === 'up') {
            updateUserPassword(password, { ...getSessionKeys() })
                .then(m => console.log('updateUserPassword >>>', m))
                .catch(e => console.error(e.message))
        }

        if (e.target.id === 'lo') {
            logOutUser(getSessionKeys().userToken)
                .then(s => console.log('Logout', s))
                .catch(e => console.error(e.message))
        }

        if (e.target.id === 'gu') {
            getUserData({ ...getSessionKeys() })
                .then(user => console.log('getUserData >>>', user))
                .catch(e => console.error(e.message))
        }

        if (e.target.id === 'ctd') {
            createTodo('test2 todo', { ...getSessionKeys() })
                .then(todo => {
                    const { data } = todo
                    data.id = todo.ref.id
                    console.log('creteTodo >>>', data)
                })
                .catch(e => console.error(e.message))
        }

        if (e.target.id === 'gutds') {
            getUserTodos({ ...getSessionKeys() })
                .then(todos => console.log('getUserTodos >>>', todos))
                .catch(e => console.error(e.message))
        }

        if (e.target.id === 'utd') {
            updateUserTodos([{ id: Date.now(), name: 'First Todo List', tasks: [] }], { ...getSessionKeys() })
                .then(todo => console.log('updateUserTodos >>>', todo))
                .catch(e => console.error(e.message))
        }

        if (e.target.id === 'dua') {
            deleteUserAccount({ ...getSessionKeys() })
                .then(m => console.log('deleteUserAccount >>>', m))
                .catch(e => console.error(e.message))
        }
        if (e.target.id === '') {}
    })
)