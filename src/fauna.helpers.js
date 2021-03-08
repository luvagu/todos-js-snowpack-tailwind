import faunadb from 'faunadb'

const {
    Collection,
	Create,
	Delete,
	Documents,
    Exists,
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

export let fToken = 'fnAEDwpQFiACA7Juc4hq9yNjbOPxlv7SFt4jQ1e3'

const fClient = new faunadb.Client({ secret: fToken })

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
