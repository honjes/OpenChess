import Parse from "parse/dist/parse.min.js"
import config from "../config"
import { isString } from "lodash"

export interface SingeUpUserData {
  userId: string
  password: string
  email: string
}

export interface ParseCurrentUserResponse {
  id: string
  userId: string
  getuserId?: () => string
  get?: (par: string) => string
  [index: string]: string | number | undefined | Function
}

export interface ParseGameResponse {
  id: string
  get?: (par: string) => string
  getEnemy?: (id: string) => ParseCurrentUserResponse
  isUsersTurn?: (id: string) => boolean
  [index: string]: string | number | undefined | Function
}

export interface ParseGameCreate {
  user: any[]
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

/**
 * Handels the singeup Process
 * @param userData {SingeUpUserData} - Userdata that is used to create an Useraccount
 */
export async function singeUpUser(userData: SingeUpUserData): Promise<boolean> {
  if (!config.debug) {
    const parseUser = new Parse.User()
    parseUser.set("userId", userData.userId)
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
 * Check the current loggedin user and returns it
 * @returns {ParseCurrentUserResponse | false} - Returns the Userobject if logged in else returns false
 */
export function getCurrentUser(): ParseCurrentUserResponse | false {
  if (!config.debug) {
    const currentUser: ParseCurrentUserResponse = Parse.User.current()
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
    [index: string]: string | number | ParseCurrentUserResponse | ParseGameResponse
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
 * @param connection {string | ParseCurrentUserResponse} - Id of a specific game or userObject to get games for that user
 */
export async function getGame(
  connection: ParseCurrentUserResponse
): Promise<ParseGameResponse[] | false>
export async function getGame(connection: string): Promise<ParseGameResponse | false>
export async function getGame(
  connection: string | ParseCurrentUserResponse
): Promise<ParseGameResponse | false | ParseGameResponse[]> {
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

export async function getUserById(userId: string): Promise<ParseGameResponse | false> {
  if (isLoggedIn()) {
    const response = await parseQuery(Parse.User, {
      objectId: userId,
    })
    return response[0]
  }
  return false
}

export async function getUserByName(userId: string): Promise<ParseGameResponse | false> {
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
