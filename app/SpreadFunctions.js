const cfb = require("cfb.js");

// Returns a list of the favored and unfavored teams from the chosen bet
// RETURN TYPE: object = [string, string]
async function GetFavoredAndUnfavoredTeamList(bettingApiInstance, betProvider, gameOptions) {
  try {

    // Retrieve API response
    const apiResponse = await bettingApiInstance.getLines(gameOptions);

    // Assign game line information to a list variable
    const listOfLines = apiResponse[0].lines;

    // Iterate through list of providers and their information to find user input for beProvider
    let j;
    for (let i = 0; i < listOfLines.length; i++) {

      // note that provider names are changed to lowercase to minimize error
      if (listOfLines[i].provider.toLowerCase() === betProvider.toLowerCase()) {
        j = i;
      }
    }

    // Create a string containing the favored team using regex and identify favored team
    const favoredTeamUnedited =listOfLines[j].formattedSpread;
    const match = favoredTeamUnedited.match(/^(.+?)\s-/);
    const favoredTeam = match[1];

    // Identify unfavored team
    const homeTeam = apiResponse[0].homeTeam;
    const unfavoredTeam = (homeTeam === favoredTeam) ? apiResponse[0].awayTeam : apiResponse[0].homeTeam;

    // Create a list containing the favored team as element 0 and the unfavore team as element 1
    const listFavoredAndUnfavoredTeams = [favoredTeam, unfavoredTeam];

    return (listFavoredAndUnfavoredTeams);

  } catch (error) {
    console.error("Exception when calling BettingApi->get_lines:", error);
  }
}

// Returns a boolean identifying if the user chose the favored team or not
// RETURN TYPE: boolean
function GetUserBetOnFavoredOrUnfavoredTeam(favoredTeam, chosenTeam) {
  return (favoredTeam === chosenTeam);
}

// Returns the line of the chosen point spread bet
// RETURN TYPE: floating point
async function GetUserSpreadLine(betProvider, bettingApiInstance, gameOptions, listFavoredAndUnfavoredTeams, betOnFavoredTeam) {
    try {

      // Retrieve API response
      const apiResponse = await bettingApiInstance.getLines(gameOptions);
  
      // Assign game line information to a list variable
      const listOfLines = apiResponse[0].lines;
  
      // Iterate through list of providers and their information to find user input
      let j;
      for (let i = 0; i < listOfLines.length; i++) {
        
        // Note that provider names are changed to lowercase to minimize error
        if (listOfLines[i].provider.toLowerCase() === betProvider.toLowerCase()) {
          j = i;
        }
      }
  
      // Return the spread
      let betLine = parseFloat(listOfLines[j].spread);

      // Add correct positive or negative sign to spread, because if favored team is away there is a positive sign on the spread from the api (and vice versa)
      const homeTeam = apiResponse[0].homeTeam;

      // Favored team is away, and bet is on the favored team (needs a sign flip)
      if (homeTeam == listFavoredAndUnfavoredTeams[1] && betOnFavoredTeam == true) {
        betLine = betLine * -1;

      // Favored team is home, and bet is on the unfavored team (needs a sign flip)
      } else if (homeTeam == listFavoredAndUnfavoredTeams[0] && betOnFavoredTeam == false) {
        betLine = betLine * -1;
      }

      return betLine;

    } catch (error) {
      console.error(`Exception when calling BettingApi->get_lines: ${error}`);
    }
  }

// Print chosen bet information when user bets on a point spread
async function PrintSpreadBettingInfo(betLine, listFavoredAndUnfavoredTeams, gameOptions) {
  console.log(`\nThe chosen spread is: ${betLine}`);
  console.log(`The chosen team is: ${gameOptions.team}`);
  console.log(`Favored team: ${listFavoredAndUnfavoredTeams[0]}`);
  console.log(`Unfavored team: ${listFavoredAndUnfavoredTeams[1]}`);
}

// Returns the game score differential information
// RETURN TYPE: object = [int, string, int, int]
async function GetScoreDifferentialList(bettingApiInstance, gameOptions, favoredTeam) {
  try {

    // Retrieve API response
    const apiResponse = await bettingApiInstance.getLines(gameOptions);

    // Identify score of favored team and unfavored team
    const homeTeam = apiResponse[0].homeTeam;
    let favoredTeamScore, unfavoredTeamScore, unfavoredTeam;
    if (homeTeam === favoredTeam) {
      favoredTeamScore = apiResponse[0].homeScore;
      unfavoredTeamScore = apiResponse[0].awayScore;
      unfavoredTeam = apiResponse[0].awayTeam;
    } else {
      favoredTeamScore = apiResponse[0].awayScore;
      unfavoredTeamScore = apiResponse[0].homeScore;
      unfavoredTeam = apiResponse[0].homeTeam;
    }

    // Calculate score differential and format it
    const scoreDiff = unfavoredTeamScore - favoredTeamScore;
    let formattedScoreDiff;
    if (scoreDiff > 0) {
      formattedScoreDiff = `${unfavoredTeam} is winning by ${scoreDiff} points`;
    } else if (scoreDiff === 0) {
      formattedScoreDiff = `${favoredTeam} and ${unfavoredTeam} are tied.`;
    } else {
      const positiveScoreDiff = scoreDiff * -1;
      formattedScoreDiff = `${favoredTeam} is winning by ${positiveScoreDiff} points`;
    }

    // Store score differential and formatted actual spread in a list
    const listScoreInfo = [scoreDiff, formattedScoreDiff, favoredTeamScore, unfavoredTeamScore];

    return listScoreInfo;

  } catch (error) {
    console.error("Exception when calling BettingApi->getLines:", error);
  }
}
  
// Print spread information
async function PrintSpreadBetCurrentScoreInfo(homeVsVisitorScore, listScoreDifferential) {
  console.log(`\nCurrent Score: ${homeVsVisitorScore}`);
  console.log(`Favored team score: ${listScoreDifferential[2]}`);
  console.log(`Unfavored team score: ${listScoreDifferential[3]}`);
  console.log(`${listScoreDifferential[1]}`);
}
  
// Calculate cash based on spread bet
// RETURN TYPE: integer
function CalculateCashFromSpreadBet(currentCash, betAmount, betOnFavoredTeam, betSpread, scoreDiff) {
  let newCash;

  // Update currentCash based on bets
  if (scoreDiff < betSpread && betOnFavoredTeam) {      // Won bet
    newCash = currentCash + parseInt(betAmount);
  } else if (scoreDiff > betSpread && betOnFavoredTeam) {    // Lost bet
    newCash = currentCash - parseInt(betAmount);
  } else if (scoreDiff < betSpread && !betOnFavoredTeam) {   // Lost bet
    newCash = currentCash - parseInt(betAmount);
  } else if (scoreDiff > betSpread && !betOnFavoredTeam) {   // Won bet
    newCash = currentCash + parseInt(betAmount);
  } else {                                                    // Pushed bet
    newCash = currentCash;
  }

  return newCash;
}

  
  module.exports = {
    GetFavoredAndUnfavoredTeamList,
    GetUserBetOnFavoredOrUnfavoredTeam,
    GetUserSpreadLine,
    PrintSpreadBettingInfo,
    GetScoreDifferentialList,
    PrintSpreadBetCurrentScoreInfo,
    CalculateCashFromSpreadBet,
  };
  