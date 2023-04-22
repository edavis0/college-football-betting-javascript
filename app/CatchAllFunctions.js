// Returns the current game score as a string
async function GetHomeVsVisitorScore(bettingApiInstance, gameOptions) {
  try {
    // Retrieve API response
    const apiResponse = await bettingApiInstance.getLines(gameOptions);

    // Print game score information to the console
    const homeVsVisitorScore = `${apiResponse[0].homeTeam} ${apiResponse[0].homeScore} - ${apiResponse[0].awayTeam} ${apiResponse[0].awayScore}`;

    return homeVsVisitorScore;
  } catch (error) {
    console.error(`Exception when calling BettingApi->get_lines: ${error}\n`);
  }
}

module.exports = {
  GetHomeVsVisitorScore
};
