import Router from 'vue-router'
import esri from 'esri-leaflet'

const ACCESS_TOKEN_KEY = 'arcgis_access_token_key'
const USER_DATA_TOKEN_KEY = 'arcgis_user_data_token_key'
const ARCGIS_TOKEN_URL = 'https://www.arcgis.com/sharing/generateToken'
const ARCGIS_PORTAL_URL = 'https://www.arcgis.com/sharing/rest/portals/self'

const TOKEN_ENDPOINT = 'https://www.arcgis.com/sharing/rest/oauth2/token/'
const AUTHORIZATION_ENDPOINT = 'https://www.arcgis.com/sharing/rest/oauth2/authorize'

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
  return JSON.parse(JSON.parse(localStorage.getItem(USER_DATA_TOKEN_KEY)))
}

function setUserDataToken(token) {
  localStorage.setItem(USER_DATA_TOKEN_KEY, JSON.stringify(token))
}

function clearUserDataToken() {
  localStorage.removeItem(USER_DATA_TOKEN_KEY)
}

// send a request to the login URL and save the returned JWT
function login(credentials) {
  if (isLoggedIn()) {
    console.log('user is authenticated')
    return new Promise((resolve, reject) => {
      const token = getAccessToken()
      setAccessToken(token)
      getUserData(token).then(data => {
        setUserDataToken(JSON.stringify(data.user))
        return data.user
      }).catch(error => {
        reject('user is not logged in\nError:', error)
      })
    });
  } else {
    console.log('user is not authenticated. Trying authentication')
    return generateToken(credentials).then(response => {
      setAccessToken(response.token)
      console.log('access token: ', response.token)
      return response.token
    })
      .then(token => getUserData(token))
      .then(userData => {
        setUserDataToken(JSON.stringify(userData.user))
        return userData.user
      })
      .catch(error => {
        return new Error('User not logged in!\nError:', error)
      })
  }
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

function checkAuth(to, from, next) {
  clearAccessToken()
  clearUserDataToken()
  console.log('clear data');
}

export default {
  login,
  logout,
  isLoggedIn,
  requireAuth,
  getAccessToken,
  getUserDataToken,
  setUserDataToken,
  clearUserDataToken,
  clearAccessToken
}
