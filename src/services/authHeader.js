export default function authHeader() {
    // Retrieves the user from local storage.
    const user = JSON.parse(localStorage.getItem('user'))

    // If the user exists, return the authorization header with the token.
    if (user && user.accessToken) {
        return {'x-access-token': user.accessToken }
    } else {
        // Return an empty object if there is no user or token.
        return {}
    }
}