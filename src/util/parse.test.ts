import * as parse from "./parse"
import * as parse_min from "parse/dist/parse.min.js"

// @ponicode
describe("parse.getParseStoreObject", () => {
    test("0", () => {
        let result: any = parse.getParseStoreObject()
        expect(result).toMatchObject({ Game: { className: "Game", _objCount: 0 } })
    })
})
