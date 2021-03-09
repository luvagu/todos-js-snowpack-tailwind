import faunadb from 'faunadb'

const {
    Call,
    Collection,
	Create,
	Delete,
	Documents,
    Exists,
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
    Var
} = faunadb.query

const fClient = new faunadb.Client({ secret: 'fnAEDwpQFiACA7Juc4hq9yNjbOPxlv7SFt4jQ1e3' })

export const createUser = async (firstName, lastName, email, password, tosAgreement = false) => {
    return await fClient.query(
        Create(
            Collection('users'), 
            { 
                credentials: { password }, 
                data: { firstName, lastName, email, tosAgreement, selectedListId: '' } 
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

const getSessionKeys = () => JSON.parse(localStorage.getItem('testSessionToken'))

export const logOutUser = async (secret) => {
    return await new faunadb.Client({ secret }).query(Logout(true))
}

export const updateUserPassword = async (userRef, secret, password) => {
    return await new faunadb.Client({ secret }).query(
        Update(
            Ref(Collection("users"), userRef),
            { credentials: { password } }
        )
    )
}

export const getUserData = async ({userRef, userToken: secret}) => {
    const { data } = await new faunadb.Client({ secret }).query(
        Call(Fn('getUserDoc'), userRef)
        // Get(Ref(Collection("users"), userRef))
    )

    return data
}

export const createTodo = async (name, {userRef, userToken: secret}) => {
    return await new faunadb.Client({ secret }).query(
        Create(
            Collection('todos'), 
            { 
                data: { name, tasks: [], user: Ref(Collection("users"), userRef) } 
            }
        )
    )
}

export const getUserTodos = async ({userRef, userToken: secret}) => {
    const { data } = await new faunadb.Client({ secret }).query(
        FMap(
            Paginate(
                Match(Index('todos_by_user'), Ref(Collection("users"), userRef))
            ),
            Lambda('ref', Get(Var('ref')))
        )
    )

    const todos = 'data.map()'
    
    return data
}

const messages = document.querySelector('#messages')

document.querySelectorAll('button').forEach(button => 
    button.addEventListener('click', (e) => {

        if (e.target.id === 'suli') {
            createUser('Luis', 'Vallejo', 'luiavag@gmail.com', '9792', true)
                .then(res => {
                    console.log('res createUser >>>', res.data)
                    messages.value += `createUser >>>\r\n ${JSON.stringify(res.data)} \r\n`

                    logInUser('luiavag@gmail.com', '9792')
                        .then(res => {
                            console.log('res loginUser >>>', res)
                            console.log('userToken >>>', res.secret)
                            console.log('user ref >>>', res.instance.id)
                            messages.value += `loginUser >>> ${JSON.stringify(res)} \r\n`
                            messages.value += `userToken >>> ${res.secret} \r\n`
                            messages.value += `user ref >>> ${res.instance.id} \r\n`

                            if (createSessionToken(res.instance.id, res.secret)) {
                                console.log('Login success')
                                messages.value += `Login success \r\n`
                            }
                        })
                        .catch(e => {
                            console.error('error loginUser >>>', e.message)
                            messages.value += `error loginUser >>> ${e.message} \r\n`
                        })
                })
                .catch(e => {
                    console.error('error createUser >>>', e.message)
                    messages.value += `error createUser >>> ${e.message} \r\n`
            })
        }

        if (e.target.id === 'li') {
            logInUser('luiavag@gmail.com', '9792')
                .then(res => {
                    console.log('res loginUser >>>', res)
                    console.log('userToken >>>', res.secret)
                    console.log('user ref >>>', res.instance.id)
                    messages.value += `loginUser >>> ${JSON.stringify(res)} \r\n`
                    messages.value += `userToken >>> ${res.secret} \r\n`
                    messages.value += `user ref >>> ${res.instance.id} \r\n`

                    if (createSessionToken(res.instance.id, res.secret)) {
                        console.log('Login success')
                        messages.value += `Login success \r\n`
                    }
                })
                .catch(e => {
                    console.error('error loginUser >>>', e.message)
                    messages.value += `error loginUser >>> ${e.message} \r\n`
                })
        }

        if (e.target.id === 'lo') {
            logOutUser(getSessionKeys().userToken)
                .then(s => messages.value += `Logout - ${s} \r\n`)
                .catch(e => messages.value += `${e.message} \r\n`)
        }

        if (e.target.id === 'ctd') {
            createTodo('test2 todo', { ...getSessionKeys() })
                .then(todo => {
                    const { data } = todo
                    data.id = todo.ref.id
                    console.log('creteTodo >>>', data)
                    messages.value += `creteTodo >>> ${JSON.stringify(data)} \r\n`
                })
                .catch(e => messages.value += `${e.message} \r\n`)
        }

        if (e.target.id === 'gu') {
            getUserData({ ...getSessionKeys() })
                .then(user => messages.value += `getUser >>> ${JSON.stringify(user)} \r\n`)
                .catch(e => messages.value += `${e.message} \r\n`)
        }

        if (e.target.id === 'gutds') {
            getUserTodos({ ...getSessionKeys() })
                .then(todos => {
                    console.log('getUser >>>', todos)
                    messages.value += `getUser >>> ${JSON.stringify(todos)} \r\n`
                })
                .catch(e => messages.value += `${e.message} \r\n`)
        }
        if (e.target.id === '') {}
        if (e.target.id === '') {}
        if (e.target.id === '') {}
    })
)