import Parse from "parse/dist/parse.min.js"
import config from "../config"
import { isString, isUndefined } from "lodash"
import { Router } from "vue-router"
import { getItem, setItem } from "./localstorage"
import moment from "moment"

export interface SingeUpUserData {
  username: string
  password: string
  email: string
}

export interface ParseObject {
  id: string
  get?: (varName: string) => string | boolean | ParseObject
  set?: (varName: string, varValue: any) => void
  save?: () => void
  [index: string]:
    | string
    | number
    | undefined
    | ((index?: string, index2?: any) => void | string | boolean | ParseObject)
}

export interface ParseUser extends ParseObject {
  getUsername?: () => string
}

export interface ParseGame extends ParseObject {
  getEnemy?: (id: string) => ParseUser
  isUsersTurn?: (id: string) => boolean
}

/**
 * Initalises the Parse connection and adds default Object
 */
export function initaliseParse(): boolean {
  if (!config.debug) {
    try {
      Parse.initialize(config.back4app_applicationId, config.back4app_javascriptKey)
      Parse.serverURL = config.back4app_url
      Parse.secret = config.parse_secret
      Parse.enableEncryptedUser()
      return true
    } catch (error) {
      console.error(error)
    }
  }
  return false
}

function createParseGameObject() {
  return Parse.Object.extend("Game", {
    getEnemy: function (userId: string): any {
      return this.get("users").filter(val => val.id !== userId)[0]
    },
    isUsersTurn: function (userId: string): boolean {
      const turn = this.get("turn")
      return turn === userId || turn === "choose"
    },
  })
}

/**
 * Creates all Parse Objects needed
 * @returns {} - Returns an object with the extended parse Objects
 */
export function getParseObjects() {
  const Game = createParseGameObject()

  return { Game: new Game() }
}

async function setCurrentUser(): Promise<void> {
  const currentUser = getCurrentUser()
  if (currentUser && isUndefined(currentUser.get("emailVerified")))
    await getUserById(currentUser.id)
}

/**
 * Handels the singeup Process
 * @param userData {SingeUpUserData} - Userdata that is used to create an Useraccount
 */
export async function singeUpUser(userData: SingeUpUserData): Promise<boolean> {
  if (!config.debug) {
    const parseUser = new Parse.User()
    parseUser.set("username", userData.username)
    parseUser.set("email", userData.email)
    parseUser.set("password", userData.password)

    try {
      await parseUser.signUp()
      await setCurrentUser()
      return true
    } catch (error) {
      console.error("error: ", error)
    }
  }
  return false
}

/**
 * Handels the login Process
 * @param userId {string} - userId of the User that should be logged in
 * @param password {string} - Password of the User
 * @returns {Promise<boolean>} - returns true if successfull signed in els returns false
 */
export async function loginUser(userId: string, password: string): Promise<boolean> {
  if (!config.debug) {
    try {
      const parseUser = await Parse.User.logIn(userId, password, {
        usePost: true,
      })
      await setCurrentUser()
      return true
    } catch (error) {
      console.error("error: ", error)
      return false
    }
  }
}

export async function logoutUser(): Promise<boolean> {
  try {
    await Parse.User.logOut()
    return true
  } catch (error) {
    console.error("error: ", error)
    return false
  }
}

/**
 * Checks if Parse is currently logged in and returns false if not
 * @param router {Router} - if given the function will redirect to the loginpage if not logged in
 * @returns {boolean} - Returns if there is a User set as boolean. If router is not given
 */
export function isLoggedIn(router?: Router): boolean {
  let isLoggedIn = false
  const currentUser = getCurrentUser()

  // sets isLoggedIn if debug is false
  if (!config.debug) isLoggedIn = Boolean(currentUser)
  if (!isLoggedIn && currentUser) {
    if (isUndefined(router)) return isLoggedIn
    // redirect if router is defined
    else router.push("login")
  } else return isLoggedIn
}

export function isVerified(): boolean {
  if (!config.debug && isLoggedIn()) {
    const currentUser = getCurrentUser()
    if (currentUser) {
      const emailVerified = currentUser.get("emailVerified")
      return Boolean(emailVerified)
    }
  }
  return false
}

/**
 * Check the current loggedin user and returns it
 * @returns {ParseUser | false} - Returns the Userobject if logged in else returns false
 */
export function getCurrentUser(): ParseUser | false {
  if (!config.debug) {
    const currentUser: ParseUser = Parse.User.current()
    if (currentUser?.id) return currentUser
  }
  return false
}

export async function createGameWithCurrent(enemyName: string): Promise<boolean> {
  const Game = createParseGameObject()
  const users = [getCurrentUser(), await getUserByName(enemyName)]

  const gameObject = new Game()
  gameObject.set("users", users)
  try {
    await gameObject.save()
  } catch (error) {
    console.error("error:", error)
  }

  return false
}

/**
 * Makes an equalTo query to Parse
 * @param object {any} - ParseObject that should be searched
 * @param column {string} - name of the column that should be searched
 * @param value {value} - The value the column should equal to
 * @returns {any | false} - Returns the the queryresult or false if there was an error
 */
export async function parseQuery(
  object: any,
  queryParams?: {
    [index: string]: string | number | ParseUser | ParseGame
  }
): Promise<any | false> {
  if (!config.debug && isLoggedIn()) {
    try {
      const query = new Parse.Query(object)

      // Adding queryParameters
      Object.keys(queryParams).map(key => {
        query.equalTo(key, queryParams[key])
      })
      const result = await query.find()

      return result
    } catch (error) {
      console.error("error: ", error)
      return false
    }
  }
  return false
}

/**
 * Returns a specific game or games for a specific user
 * @param connection {string | ParseUser} - Id of a specific game or userObject to get games for that user
 */
export async function getGame(connection: ParseUser): Promise<ParseGame[] | false>
export async function getGame(connection: string): Promise<ParseGame | false>
export async function getGame(
  connection: string | ParseUser
): Promise<ParseGame | false | ParseGame[]> {
  if (isLoggedIn()) {
    if (isString(connection)) {
      const response = await parseQuery(createParseGameObject(), {
        objectId: String(connection),
      })
      return response[0]
    } else {
      const response = await parseQuery(createParseGameObject(), {
        users: connection,
      })
      return response
    }
  }
  return false
}

export async function getUserById(userId: string): Promise<ParseGame | false> {
  if (isLoggedIn()) {
    const response = await parseQuery(Parse.User, {
      objectId: userId,
    })
    return response[0]
  }
  return false
}

export async function getUserByName(userId: string): Promise<ParseGame | false> {
  if (isLoggedIn()) {
    const response = await parseQuery(Parse.User, {
      userId: userId,
    })
    return response[0]
  }
  return false
}

export async function callCloudCode(
  name: string,
  params: { [index: string]: string | number }
): Promise<false | { message: string; value?: any }> {
  if (isLoggedIn()) {
    try {
      const response = await Parse.Cloud.run(name, params)
      return response
    } catch (error) {
      console.error("error: ", error)
    }
  }
  return false
}

/**
 * Sends an VerificationEmail to the current user
 */
export async function sendVerificationEmail() {
  if (isLoggedIn() && !config.debug) {
    const lastEmail = getItem("lastEmailSend")
    const lastEmailDate = moment(lastEmail)
    const dateBefore = moment().subtract(1, "minute")

    if (lastEmail === "" || lastEmailDate.isBefore(dateBefore)) {
      const currentUser = getCurrentUser()
      if (currentUser) {
        try {
          const response = await Parse.User.requestEmailVerification(currentUser.get("email"))
          setItem("lastEmailSend", moment().toString())
        } catch (error) {}
      }
    }
  }
}
