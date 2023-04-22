const cfbd = require("cfb.js");

// Returns a list of the user's point total bet information
// RETURN TYPE: list = [boolean, string]
function getUserBetOnOverOrUnder(userInputOverOrUnder) {
  let boolBetOnOver;
  let stringOverOrUnder;

  if (userInputOverOrUnder === "Over" || userInputOverOrUnder === "over") {
    boolBetOnOver = true;
    stringOverOrUnder = "over";
  } else if (
    userInputOverOrUnder === "Under" ||
    userInputOverOrUnder === "under"
  ) {
    boolBetOnOver = false;
    stringOverOrUnder = "under";
  }

  return [boolBetOnOver, stringOverOrUnder];
}

// Returns the line of the chosen point total bet
// RETURN TYPE: floating point
async function getUserTotalLine(betProvider, apiInstance, year, week, team, conference) {
  try {
    const apiResponse = await apiInstance.getLines(year, week, team, conference);

    const listOfLines = apiResponse[0].lines;

    let j;
    for (let i = 0; i < listOfLines.length; i++) {
      if (listOfLines[i].provider.toLowerCase() === betProvider.toLowerCase()) {
        j = i;
      }
    }

    let betLine = parseFloat(listOfLines[j].overUnder);
    return betLine;
  } catch (error) {
    console.error(`Exception when calling BettingApi->get_lines: ${error}`);
  }
}

// Returns the total score information
// RETURN TYPE: integer
async function getTotalScore(apiInstance, year, week, team, conference) {
  try {
    const apiResponse = await apiInstance.getLines(year, week, team, conference);

    const homeTeamScore = apiResponse[0].home_score;
    const awayTeamScore = apiResponse[0].away_score;

    const totalScore = parseInt(homeTeamScore + awayTeamScore);
    return totalScore;
  } catch (error) {
    console.error(`Exception when calling BettingApi->get_lines: ${error}`);
  }
}

// Print score information
function printTotalBetCurrentScoreInfo(homeVsVisitorScore, totalScore) {
  console.log(`\nCurrent Score: ${homeVsVisitorScore}`);
  console.log(`Total Score: ${totalScore}`);
}

// Calculate cash based on point total O/U bet
// RETURN TYPE: integer
function calculateCashFromTotalBet(currentCash, betAmount, betLine, betOnOver, actualTotalScore) {
  let newCash;
  if (betLine < actualTotalScore && betOnOver === true) {
    newCash = currentCash + parseInt(betAmount);
  } else if (betLine > actualTotalScore && betOnOver === true) {
    newCash = currentCash - parseInt(betAmount);
  } else if (betLine < actualTotalScore && betOnOver === false) {
    newCash = currentCash - parseInt(betAmount);
  } else if (betLine > actualTotalScore && betOnOver === false) {
    newCash = currentCash + parseInt(betAmount);
  } else {
    newCash = currentCash;
  }
  return newCash;
}

module.exports = {
  getUserBetOnOverOrUnder,
  getUserTotalLine,
  getTotalScore,
  printTotalBetCurrentScoreInfo,
  calculateCashFromTotalBet,
};
