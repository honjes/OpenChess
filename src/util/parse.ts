import Parse from "parse/dist/parse.min.js"
import config from "../config"

export interface SingeUpUserData {
  username: string
  password: string
  email: string
}

/**
 * Initalises the Parse connection and adds default Object
 */
export function initaliseParse() {
  if (!config.debug) {
    Parse.initialize(config.back4app_applicationId, config.back4app_clientKey)
    Parse.serverURL = config.back4app_url
  } else {
  }
}

/**
 * Handels the singeup Process
 * @param userData {SingeUpUserData} - Userdata that is used to create an Useraccount
 */
export async function singeUpUser(userData: SingeUpUserData) {
  if (!config.debug) {
    console.log("userData: ", userData)
    const parseUser = new Parse.User()
    parseUser.set("username", userData.username)
    parseUser.set("email", userData.email)
    parseUser.set("password", userData.password)

    try {
      await parseUser.signUp()
    } catch (error) {
      console.error("error: ", error)
    }
  }
}

/**
 * Checks if Parse is currently logged in and returns false if not
 * @returns {boolean} - Returns if there is a User set as boolean
 */
export function getCurrentUser(): boolean {
  if (!config.debug) {
    const curUser = Parse.User.current()
    console.log("curUser: ", curUser)
    return Boolean(curUser)
  } else return false
}
