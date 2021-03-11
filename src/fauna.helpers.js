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

const fClient = new faunadb.Client({ secret: 'YOUR_API_KEY' })

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
