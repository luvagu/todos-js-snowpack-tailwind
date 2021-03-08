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

export let clientToken = 'fnAEDwpQFiACA7Juc4hq9yNjbOPxlv7SFt4jQ1e3'

const fClient = new faunadb.Client({ secret: clientToken })

export const createUser = async (firstName, lastName, email, password, tosAgreement = false) => {
    return await fClient.query(
        Create(
            Collection('users'), 
            { 
                credentials: { password }, 
                data: { firstName, lastName, email, tosAgreement } 
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

export const getUser = async (email, secret) => {
    const { data } = await new faunadb.Client({ secret }).query(
        FMap(
            Paginate(
                Match(Index('users_by_email'), email)
            ),
            Lambda('ref', Get(Var('ref')))
        )
    )

    return data
}

export const createTodo = async (id, name, {userRef, userToken: secret}) => {
    return await new faunadb.Client({ secret }).query(
        Create(
            Collection('todos'), 
            { 
                data: { id, name, tasks: [], user: Call(Fn('getUser'), 'luiavag@gmail.com')  } 
            }
        )
    )
}

// getUser('luiavag@gmail.com', clientToken)
//     .then(res => console.log('res getUser >>>', res))
//     .catch(e => console.error('error getUser >>>', e.message))

// logOutUser()

const messages = document.querySelector('#messages')

document.querySelectorAll('button').forEach(button => 
    button.addEventListener('click', (e) => {

        if (e.target.id === 'suli') {
            createUser('Luis', 'Vallejo', 'luiavag@gmail.com', '9792', true)
                .then(res => {
                    console.log('res createUser >>>', res)
                    messages.value += `createUser >>>\r\n ${JSON.stringify(res)} \r\n`

                    logInUser('luiavag@gmail.com', '9792')
                        .then(res => {
                            clientToken = res.secret

                            console.log('res loginUser >>>', res)
                            console.log('clientToken >>>', res.secret)
                            console.log('user ref >>>', res.ref.id)
                            messages.value += `loginUser >>> ${JSON.stringify(res)} \r\n`
                            messages.value += `clientToken >>> ${res.secret} \r\n`
                            messages.value += `user ref >>> ${res.ref.id} \r\n`

                            if (createSessionToken(res.ref.id, clientToken)) {
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
                    clientToken = res.secret

                    console.log('res loginUser >>>', res)
                    console.log('clientToken >>>', res.secret)
                    console.log('user ref >>>', res.ref.id)
                    messages.value += `loginUser >>> ${JSON.stringify(res)} \r\n`
                    messages.value += `clientToken >>> ${res.secret} \r\n`
                    messages.value += `user ref >>> ${res.ref.id} \r\n`

                    if (createSessionToken(res.ref.id, clientToken)) {
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
            createTodo(Date.now(), 'test todo', { ...getSessionKeys() })
                .then(todo => messages.value += `creteTodo >>> ${JSON.stringify(todo)} \r\n`)
                .catch(e => messages.value += `${e.message} \r\n`)
        }

        if (e.target.id === '') {}
        if (e.target.id === '') {}
        if (e.target.id === '') {}
        if (e.target.id === '') {}
        if (e.target.id === '') {}
    })
)