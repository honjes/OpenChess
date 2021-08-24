import Parse from "parse/dist/parse.min.js"
import config from "../config"
import _ from "lodash"
import { Router } from "vue-router"
import * as localstorage from "./localstorage"
import moment from "moment"
import { StoreParseObject } from "../main"

export interface SingeUpUserData {
  username: string
  password: string
  email: string
}

export interface ParseObject {
  id: string
  get?: (varName: string) => any | any[]
  set?: (varName: string, varValue: any) => void
  add?: (varName: string, varValue: any) => void
  relation?: (relationName: string) => any
  save?: () => void
  [index: string]: string | number | undefined | ((index?: string, index2?: any) => any)
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
      Parse.liveQueryServerURL = config.back4app_livequeryurl
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
      const enemy = this.get("users").filter(val => val.id !== userId)[0]

      return enemy
    },
    isUsersTurn: function (userId: string): boolean {
      const lastMoveUser = this.get("lastMove")

      if (!_.isUndefined(lastMoveUser) && lastMoveUser !== " " && lastMoveUser !== "")
        return lastMoveUser !== userId
      else {
        const history = this.get("moveHistory")

        if (!_.isUndefined(history) && history.length > 0) {
          const lastMove = history[history.length - 1]

          return lastMove.user !== userId
        } else return this.get("white") === userId
      }
    },
    getUserColor: function (userId: string): string {
      return this.get("white") === userId ? "white" : "black"
    },
  })
}

/**
 * Creates all Parse Objects needed
 * @returns {} - Returns an object with the extended parse Objects
 */
export function getParseStoreObject(): StoreParseObject {
  const Game = createParseGameObject()

  return { Game: new Game() }
}

async function setCurrentUser(): Promise<void> {
  const currentUser = getCurrentUser()
  if (currentUser && _.isUndefined(currentUser.get("emailVerified")))
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
  // redirect if router is defined and not LoggedIn
  if (!isLoggedIn && !_.isUndefined(router)) {
    router.push("/login")
  }
  return isLoggedIn
}

export function emailIsVerified(): boolean {
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
      // check if object is User
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
    if (_.isString(connection)) {
      const queryResponse = await parseQuery(createParseGameObject(), {
        objectId: String(connection),
      })
      const responseObject = queryResponse[0]

      return responseObject
    } else {
      const response = await parseQuery(createParseGameObject(), {
        users: connection,
      })
      return response
    }
  }
  return false
}

export async function setWhiteToCurrent(gameId: string): Promise<boolean> {
  const game = await getGame(gameId)
  const user = getCurrentUser()
  if (game && user) {
    const isStarted = game.get("started")
    if (!isStarted) {
      game.set("white", user.id)
      game.set("started", true)

      try {
        await game.save()
        return true
      } catch (error) {
        console.error("error: ", error)
        return false
      }
    }
  }
  return false
}

export async function updateGame(gameId: string, gameObject: any): Promise<boolean> {
  const game = await getGame(gameId)
  const user = getCurrentUser()
  if (game && user && game.get("lastMove") !== user.id) {
    game.set("fen", gameObject.fen())
    game.set("pgn", gameObject.pgn())
    try {
      await game.save()
      return true
    } catch (error) {
      console.error("error: ", error)
      return false
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

export async function getUserByName(username: string): Promise<ParseGame | false> {
  if (isLoggedIn()) {
    const response = await parseQuery(Parse.User, {
      username: username,
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
export async function sendVerificationEmail(): Promise<boolean> {
  if (isLoggedIn() && !config.debug) {
    const lastEmail = localstorage.getItem("lastEmailSend")
    const lastEmailDate = moment(lastEmail)
    const dateBefore = moment().subtract(config.email_resend_delay_sec, "seconds")

    if (lastEmail === "" || lastEmailDate.isBefore(dateBefore)) {
      const currentUser = getCurrentUser()
      if (currentUser) {
        try {
          const response = await Parse.User.requestEmailVerification(currentUser.get("email"))
          localstorage.setItem("lastEmailSend", moment().toString())
          return true
        } catch (error) {
          console.error("error: ", error)
          return false
        }
      }
    }
  }
  return false
}

export async function sendFriendRequest(friendName: string): Promise<boolean> {
  const current = getCurrentUser()
  const newFriend = await getUserByName(friendName)

  if (current && newFriend) {
    const friendsRel = current.relation("friends")
    friendsRel.add(newFriend)

    try {
      await current.save()
      return true
    } catch (error) {
      console.error(error)
    }
  }
  return false
}

export async function getFriends(userId: string): Promise<false | ParseUser[]> {
  const user = await getUserById(userId)

  if (user) {
    const friendRel = user.relation("friends")
    try {
      const friendQuery = await friendRel.query()
      const currentFriends = await friendQuery.find()
      return currentFriends
    } catch (error) {
      console.error("error: ", error)
      return false
    }
  }

  return false
}

export async function currentFriendRequests(): Promise<false | ParseUser[]> {
  const current = getCurrentUser()
  const query = new Parse.Query(Parse.User)
  const friendQuery = new Parse.Query(Parse.User)

  if (current) {
    const currentFriends = await getFriends(current.id)

    if (currentFriends) {
      // applie filter to Querys
      friendQuery.equalTo("objectId", current.id)
      query.matchesQuery("friends", friendQuery)
      try {
        let friendRequests = await query.find()
        // const friendIds = friendRequests.
        const removedFriends = _.remove(friendRequests, value => {
          const currUserId = value.id
          var returnValue = false

          currentFriends.map(friend => {
            if (friend.id === currUserId) returnValue = true
            return false
          })

          return returnValue
        })

        return friendRequests
      } catch (error) {
        console.error("error: ", error)
        return false
      }
    }
  }
  return false
}

// Subscriptions
export async function getGameSubscription(gameId: string): Promise<false | any> {
  try {
    const query = new Parse.Query("Game")
    query.equalTo("objectId", gameId)
    const subscription = await query.subscribe()
    return subscription
  } catch (error) {
    console.error("error: ", error)

    return false
  }
}
