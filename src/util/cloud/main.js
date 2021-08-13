Parse.Cloud.define("setGameStarter", async request => {
  const GameId = request.params.gameId

  const query = new Parse.Query("Game")
  query.equalTo("objectId", GameId)
  const game = await query.first()

  if (game) {
    const turn = game.get("turn")
    if (typeof turn !== typeof "string" || turn === "") {
      // random number between 1-2
      const randomNumber = Math.round(Math.random())
      const randomUsername = game.get("users")[randomNumber].get("username")
      game.set("turn", randomUsername)
      await game.save()
      return { message: `Turn set to ${randomUsername}`, value: randomUsername }
    }
  }
  return {
    message: `Turn could not be set`,
  }
})
