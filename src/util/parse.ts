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
 * Function to request a User by its Username
 * @param value {string} - value of the User that should be given back
 * @param id {string} - value of the User that should be given back
 * @returns {Promise<any[]>} - the Array that the parse function returns
 */
export async function requestUsers(
  value: string,
  id = "username"
): Promise<any[]> {
  const query = new Parse.Query(Parse.User)
  query.equalTo(id, value)
  return await query.find()
}

/**
 * Checks if The given Username is already taken
 * @param value {string} - value that should be checked on avalibility
 * @returns {Promise<boolean>} Returns if there is a User with the given value
 */
export async function checkIfUsernameExists(value: string): Promise<boolean> {
  //const response = await requestUsers(value, "username")
  return false //response.length >= 1
}

/**
 * Checks if The given Email is already taken
 * @param email {string} - Email that should be checked on avalibility
 * @returns
 */
export async function checkIfEmailExists(email: string): Promise<boolean> {
  //const response = await requestUsers(email, "email")
  return //response.length >= 1
}

/**
 * Checks if Parse is currently logged in and returns false if not
 * @returns {boolean} - Returns if there is a User set as boolean
 */
export function getCurrentUser(): boolean {
  const curUser = Parse.User.current()
  console.log("curUser: ", curUser)
  return Boolean(curUser)
}
