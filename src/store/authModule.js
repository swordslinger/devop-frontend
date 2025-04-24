import authService  from "@/services/authService";

const user = JSON.parse(localStorage.getItem('user')) // get user from local storage
console.log("user from storage", user)
const token = user?.accessToken || localStorage.getItem('token') // get token from local storage

const intialState = user
    ? {status : {loggedIn : true}, user, token} // if user exists, set loggedIn to true
    : {status : {loggedIn : false}, user: null, token: null} // if user exists, set loggedIn to true

console.log("Initial state", intialState)

// module for user registration with vuex.
export const auth = {
    // state and actions are scoped.
    namespaced: true,
    state: intialState,
    // methods for commiting mutations.
    actions: {
        register({ commit }, user){
            // on sucesssful registration passes user object to registerSuccess mutation.
            return authService.register(user).then(
            response => {
                commit('registerSuccess', response.data)
                return Promise.resolve(response.data)
            },
            // On failed registration, registerFailure mutation is called and an error is passed to the invoker of the authModule.
            error => {
                commit('registerFailure')
                return Promise.reject(error)
            }
            )
        },
        login({ commit}, user){
            // on sucesssful login passes user object to registerSuccess mutation.
            return authService.login(user).then(
                response => {
                    console.log("Login response", response.data)

                    if(response && response.data.username){
                        commit('loginSuccess', response.data)
                        return Promise.resolve(response.data)
                    } else {
                        console.log("error", response.data)
                        commit('loginFailure')
                        return Promise.reject("Login failed")
                    }
                },
                // On failed login, registerFailure mutation is called and an error is passed to the invoker of the authModule.
                error => {
                    commit('loginFailure')
                    return Promise.reject(error)
                }
            )
        },
        logout({ commit }){
            // Calls the logout method from authService and commits the logout mutation.
            authService.logout()
            commit('logout')
        }
    },


    // Changes state of vuex store based on Sucessful or Unsucessful registration/
    mutations: {
        registerSuccess(state, user){
            state.user = user
            console.log("Register sucess")
        },
        registerFailure(state){
            state.user = null
            console.log("Register fail")
        },
        loginSuccess(state, user){
            if(!user){
                console.log("User is null")
                return
            }
            state.user = user
            state.status.loggedIn = true
            state.token = user.token || user.accessToken // set token in state

            localStorage.setItem('user', JSON.stringify(user)) // set user in local storage
            localStorage.setItem('token', state.token) // set token in local storage
            console.log("Login sucess")
        },
        loginFailure(state){
            state.user = null
            state.status.loggedIn = false
            console.log("Login fail")
        },
        logout(state){
            state.user = null
            state.status.loggedIn = false
            state.token = null // set token in state to null}
            localStorage.removeItem('user') // remove user from local storage
            localStorage.removeItem('token') // remove token from local storage
            console.log("Logout")
        },
    }
}