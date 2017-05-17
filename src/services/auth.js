import Router from 'vue-router'
import esri from 'esri-leaflet'

const ACCESS_TOKEN_KEY = 'arcgis_access_token_key'
const USER_DATA_TOKEN_KEY = 'arcgis_user_data_token_key'
const ARCGIS_TOKEN_URL = 'https://www.arcgis.com/sharing/generateToken'
const ARCGIS_PORTAL_URL = 'https://www.arcgis.com/sharing/rest/portals/self'

const router = new Router({mode: 'history'})

function generateToken(credentials) {
  return new Promise((resolve, reject) => {
    esri.post(ARCGIS_TOKEN_URL, credentials, (error, response) => {
      resolve(response)
      reject(error)
    })
  })
}

function getUserData(token) {
  return new Promise((resolve, reject) => {
    esri
      .get(ARCGIS_PORTAL_URL, {
        token: token
      }, function (error, response) {
        resolve(response)
        reject(error)
      })
  })
}

function isLoggedIn() {
  if (getAccessToken()) {
    return true
  } else {
    return false
  }
}

function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

function setAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

function getUserDataToken() {
  localStorage.getItem(USER_DATA_TOKEN_KEY)
}

function setUserDataToken(token) {
  localStorage.setItem(USER_DATA_TOKEN_KEY, token)
}

function clearUserDataToken() {
  localStorage.removeItem(USER_DATA_TOKEN_KEY)
}

// send a request to the login URL and save the returned JWT
function login(credentials) {
  // if (isLoggedIn()) {
  //   return new Promise((resolve, reject) => {
  //     resolve(getUserDataToken())
  //     reject('user is not logged in')
  //   });
  // } else {
    return generateToken(credentials).then(response => {
      setAccessToken(response.token)
      return response.token
    })
      .then(token => getUserData(token))
      .then(userData => {
        setUserDataToken(JSON.stringify(userData.user))
        return userData
      })
      .catch(error => {
        return new Error('User not logged in!\nError:', error)
      })
  // }
}

function logout() {
  clearAccessToken()
  clearUserDataToken()
  router.go('/')
}

function requireAuth(to, from, next) {
  if (!isLoggedIn()) {
    console.log('authentication failed!')
    next({path: '/'})
  } else {
    next()
  }
}

const auth0 = {
  login,
  logout,
  isLoggedIn,
  requireAuth,
  getAccessToken,
  getUserDataToken
}
export default auth0
