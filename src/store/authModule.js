import authService  from "@/services/authService";

const intialState = {
    user:null
}

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
        }
    }
    
}