import Parse from "parse/dist/parse.min.js"
import config from "../config"

export interface SingeUpUserData {
  username: string
  password: string
  email: string
}

export interface ParseCurrentUserResponse {
  id: string
  [index: string]: string | number | undefined
}

/**
 * Initalises the Parse connection and adds default Object
 */
export function initaliseParse(): boolean {
  if (!config.debug) {
    try {
      Parse.initialize(
        config.back4app_applicationId,
        config.back4app_javascriptKey
      )
      Parse.serverURL = config.back4app_url
      return true
    } catch (error) {
      console.error(error)
    }
  }
  return false
}

/**
 * Creates all Parse Objects needed
 * @returns {} - Returns an object with the extended parse Objects
 */
export function getParseObjects() {
  const Game = Parse.Object.extend("Game", {
    getEnemy: function (userName: string): any {
      return this.get("users").filter(val => val !== userName)[0]
    },
    isUsersTurn: function (userName: string): boolean {
      return this.get("turn") === userName
    },
  })

  return { Game: new Game() }
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
      return true
    } catch (error) {
      console.error("error: ", error)
    }
  }
  return false
}

/**
 * Handels the login Process
 * @param username {string} - Username of the User that should be logged in
 * @param password {string} - Password of the User
 * @returns {Promise<boolean>} - returns true if successfull signed in els returns false
 */
export async function loginUser(
  username: string,
  password: string
): Promise<boolean> {
  if (!config.debug) {
    try {
      const parseUser = await Parse.User.logIn(username, password, {
        usePost: true,
      })
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
 * @returns {boolean} - Returns if there is a User set as boolean
 */
export function isLoggedIn(): boolean {
  if (!config.debug) {
    const curUser = Parse.User.current()
    return Boolean(curUser)
  } else return false
}

/**
 * Check the current loggedin user and returns its Id
 * @returns {string} - Returns the UserId if logged in else returns empty string
 */
export function getUser(): any {
  if (!config.debug) {
    const currentUser: ParseCurrentUserResponse = Parse.User.current()
    if (currentUser?.id) return currentUser
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
  queryParams?: { [index: string]: string | number }
): Promise<any | false> {
  if (!config.debug) {
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
