import * as form from "./form"
// @ponicode
describe("form.usernameCheck", () => {
    test("0", () => {
        let result: any = form.usernameCheck("")
        expect(result).toEqual({ field: "username", message: "Username needs to be set" })
    })

    test("1", () => {
        let result: any = form.usernameCheck("user_name")
        expect(result).toBe(true)
    })
})

// @ponicode
describe("form.emailCheck", () => {
    test("0", () => {
        let result: any = form.emailCheck("")
        expect(result).toEqual({ field: "email", message: "Email needs to be set" })
    })

    test("1", () => {
        let result: any = form.emailCheck("something@example.com")
        expect(result).toBe(true)
    })
})

// @ponicode
describe("form.passwordCheck", () => {
    test("0", () => {
        let result: any = form.passwordCheck("!ush3r")
        expect(result).toEqual({ field: "password", message: "Password needs to be at least 8 characters long" })
    })

    test("1", () => {
        let result: any = form.passwordCheck("")
        expect(result).toEqual({ field: "password", message: "Password needs to be set" })
    })

    test("2", () => {
        let result: any = form.passwordCheck("!Lov3MyPianoPony")
        expect(result).toBe(true)
    })
})

// @ponicode
describe("form.setError", () => {
    test("0", () => {
        let param1: any = { email: "Email has to be set" }
        let result: any = form.setError(param1, { field: "", message: "" })
        expect(result).toEqual({ email: "Email has to be set" })
        expect(param1).toEqual({ email: "Email has to be set" })
    })

    test("1", () => {
        let param1: any = { email: "Email has to be set" }
        let result: any = form.setError(param1, { field: "username", message: "Username has to be set" })
        expect(result).toEqual({ email: "Email has to be set", username: "Username has to be set" })
        expect(param1).toEqual({ email: "Email has to be set", username: "Username has to be set" })
        expect(param1).toEqual({ email: "Email has to be set", username: "Username has to be set" })
    })
})

// @ponicode
describe("form.setValid", () => {
    test("0", () => {
        let param1: any = { email: "Email has to be set" }
        let result: any = form.setValid(param1, "email")
        expect(result).toEqual({})
        expect(param1).toEqual({})
    })

    test("1", () => {
        let param1: any = { email: "Email has to be set", password: "Password has to be set" }
        let result: any = form.setValid(param1, "email")
        expect(result).toEqual({ password: "Password has to be set" })
        expect(param1).toEqual({ password: "Password has to be set" })
        expect(param1).toEqual({ password: "Password has to be set" })
    })
})

// @ponicode
describe("form.hasNoErrors", () => {
    test("0", () => {
        let result: any = form.hasNoErrors({ key0: "p", key1: "Elio", key2: "192.168.99.101", key3: "192.168.99.101" })
        expect(result).toBe(false)
    })

    test("1", () => {
        let result: any = form.hasNoErrors({})
        expect(result).toBe(true)
    })
})
