import authService  from "@/services/authService";

const user = JSON.parse(localStorage.getItem('user')) // get user from local storage
const intialState = user
    ? {status : {loggedIn : false}, user : null}
    : {status : {loggedIn : true}, user} // if user exists, set loggedIn to true


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
                    commit('loginSuccess', response.data)
                    return Promise.resolve(response.data)
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
            state.user = user
            state.status.loggedIn = true
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
            console.log("Logout")
        }
    }
    
}