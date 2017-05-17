import router from '../router';

const API_URL = '';

export default {
  // authentification status
  authenticated: false,

  // send a request to the login URL and save the returned JWT
  login (context, creds, redirect) {
    context.$http.post(API_URL, creds, (data) => {
      localStorage.setItem('user', JSON.stringify(data))
      this.authenticated = true
      context.$root.user = data

      // redirect to a specified route
      if (redirect) {
        router.go(redirect)
      }
    }).error(errors => { context.errors = errors })
  },
  logout () {
    localStorage.removeItem('user')
    this.authenticated = false
    router.go('/home')
  }
}