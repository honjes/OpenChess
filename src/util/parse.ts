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
    getEnemy: function (userId: string): any {
      return this.get("users").filter(val => val !== userId)[0]
    },
    isUsersTurn: function (userId: string): boolean {
      console.log(`this.get("turn") === userId: `, this.get("turn") === userId)
      console.log(`this.get("turn"): `, this.get("turn"))
      console.log(`userId: `, userId)
      return this.get("turn") === userId
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
 * @returns {string | false} - Returns the UserId if logged in else false
 */
export function getUserId(): string | false {
  if (!config.debug) {
    const currentUser: ParseCurrentUserResponse = Parse.User.current()
    if (currentUser?.id) return currentUser.id
  }
  return false
}
