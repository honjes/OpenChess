export interface FormCheckErrorOutput {
  field: string
  message: string
}

export function usernameCheck(username: string): true | FormCheckErrorOutput {
  // Check if Username is set
  const empty = username === ""
  if (empty) return { field: "username", message: "Username needs to be set" }

  return true
}

export function emailCheck(email: string): true | FormCheckErrorOutput {
  // Check if Email is set
  const empty = email === ""
  if (empty) return { field: "email", message: "Email needs to be set" }
  return true
}

export function passwordCheck(password: string): true | FormCheckErrorOutput {
  // Check if Password is set
  const empty = password === ""
  if (empty) return { field: "password", message: "Password needs to be set" }

  // Check if Password is to short
  const short = password.length < 8
  if (short)
    return { field: "password", message: "Password needs to be at least 8 characters long" }
  return true
}
