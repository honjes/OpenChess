import { isUndefined } from "lodash"

export interface FormCheckError {
  field: string
  message: string
}
export interface ErrorObject {
  [errorName: string]: string
}

export function usernameCheck(username: string): true | FormCheckError {
  // Check if Username is set
  const empty = username === ""
  if (empty) return { field: "username", message: "Username needs to be set" }

  return true
}

export function emailCheck(email: string): true | FormCheckError {
  // Check if Email is set
  const empty = email === ""
  if (empty) return { field: "email", message: "Email needs to be set" }
  return true
}

export function passwordCheck(password: string): true | FormCheckError {
  // Check if Password is set
  const empty = password === ""
  if (empty) return { field: "password", message: "Password needs to be set" }

  // Check if Password is to short
  const short = password.length < 8
  if (short)
    return { field: "password", message: "Password needs to be at least 8 characters long" }
  return true
}

export function setError(errorObject: ErrorObject, newError: FormCheckError): ErrorObject {
  errorObject[newError.field] = newError.message
  return errorObject
}

export function setValid(errorObject: ErrorObject, fieldName: string): ErrorObject {
  if (!isUndefined(errorObject[fieldName])) delete errorObject[fieldName]
  return errorObject
}

/**
 * Checks if any errors are in the given Object
 * @returns {boolean} - returns true if no Errors are found else returns false
 */
export function hasNoError(errorOBject: ErrorObject): boolean {
  const keys = Object.keys(errorOBject)
  if (keys.length > 0) return false
  return true
}
