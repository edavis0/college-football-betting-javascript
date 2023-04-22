// Returns a list of the user's point total bet information
// RETURN TYPE: [boolean, string]
function GetUserBetOnOverOrUnder(userInputOverOrUnder) {
  let boolBetOnOver;
  let stringOverOrUnder;

  // Create a boolean (over = true, under = false) and a string variable based on user's input of over or under
  if (userInputOverOrUnder === "Over" || userInputOverOrUnder === "over") {
    boolBetOnOver = true;
    stringOverOrUnder = "over";
  } else if (userInputOverOrUnder === "Under" || userInputOverOrUnder === "under") {
    boolBetOnOver = false;
    stringOverOrUnder = "under";
  }

  const listUserOverOrUnder = [boolBetOnOver, stringOverOrUnder];
  return listUserOverOrUnder;
}

// Returns the line of the chosen point total bet
// RETURN TYPE: number (floating point)
async function GetUserTotalLine(betProvider, bettingApiInstance, gameOptions) {
  try {
    
    // Retrieve API response
    const apiResponse = await bettingApiInstance.getLines(gameOptions);

    // Assign game line information to a list variable
    const listOfLines = apiResponse[0].lines;

    // Iterate through list of providers and their information to find user input
    const j = listOfLines.findIndex(line => line.provider.toLowerCase() === betProvider.toLowerCase());

    // Return the spread or O/U
    const betLine = parseFloat(listOfLines[j].overUnder);
    return betLine;

  } catch (e) {
    console.error("Exception when calling BettingApi->get_lines:", e);
  }
}

// Returns the total score information
// RETURN TYPE: integer
async function GetTotalScore(bettingApiInstance, gameOptions) {
  try {

    // Retrieve API response
    const apiResponse = await bettingApiInstance.getLines(gameOptions);

    // Identify score of favored team and unfavored team
    const homeTeamScore = apiResponse[0].homeScore;
    const awayTeamScore = apiResponse[0].awayScore;

    // Calculate total score
    const totalScore = parseInt(homeTeamScore + awayTeamScore, 10);
    return totalScore;

  } catch (e) {
    console.error("Exception when calling BettingApi->get_lines:", e);
  }
}

// Print score information
function PrintTotalBetCurrentScoreInfo(homeVsVistorScore, totalScore) {
  console.log(`\nCurrent Score: ${homeVsVistorScore}`);
  console.log(`Total Score: ${totalScore}`);
}

// Calculate cash based on point total O/U bet
// RETURN TYPE: integer
function CalculateCashFromTotalBet(currentCash, betAmount, betLine, betOnOver, actualTotalScore) {
  let newCash;
  if (betLine < actualTotalScore && betOnOver) {
    newCash = currentCash + parseInt(betAmount, 10);
  } else if (betLine > actualTotalScore && betOnOver) {
    newCash = currentCash - parseInt(betAmount, 10);
  } else if (betLine < actualTotalScore && !betOnOver) {
    newCash = currentCash - parseInt(betAmount, 10);
  } else if (betLine > actualTotalScore && !betOnOver) {
    newCash = currentCash + parseInt(betAmount, 10);
  } else {
    newCash = currentCash;
  }
  return newCash;
}

module.exports = {
  GetUserBetOnOverOrUnder,
  GetUserTotalLine,
  GetTotalScore,
  PrintTotalBetCurrentScoreInfo,
  CalculateCashFromTotalBet
};
