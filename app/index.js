const CatchAllFunctions = require("./CatchAllFunctions.js")
const CreateAPIInstance = require("./CreateAPIInstance.js");
const PrintFunctions = require("./PrintFunctions.js");
const SpreadFunctions = require("./SpreadFunctions.js");
const TotalFunctions = require("./TotalFunctions.js");
const prompt = require("prompt-sync")();
  
async function main() {
  try {

    // Create an API instance for the CFBD data
    const bettingApiInstance = await CreateAPIInstance.GetAPIInstance();

    // Print user information
    const userFirstName = "John";
    const userLastName = "Smith";
    const userCurrentCash = 3000;
    console.log(`\nGambler's name: ${userFirstName} ${userLastName}\nGambler's current cash: $${userCurrentCash}\n`);

    // Input game information
    const year = 2022;
    const conference = prompt("Enter the conference name: ");
    const week = parseInt(prompt("Enter the week: "), 10);
    const gameOptions = {
      conference,
      week,
      year: year,
    };

    // Print betting information to console    
    await PrintFunctions.PrintAllGamesBettingData(bettingApiInstance, gameOptions);

    // Choose team, line provider, spread or over/under, and amount to bet
    console.log();
    const chosenTeam = prompt("Enter the team you would like to bet on: ");
    gameOptions.team = chosenTeam;
    const betProvider = prompt("Enter the name of your bet provider: ");
    const betType = prompt("Spread or O/U? ");
    const userBetAmount = prompt("How many dollars would you like to bet? $");
    let userNewCash;

    // If user chooses a point spread bet
    if (betType === "Spread" || betType === "spread") {
    
      // Get the favored team and chosen spread TODO: The code works up until the commented out lines. More work is needed on SpreadFunctions
      const listFavoredAndUnfavoredTeams = await SpreadFunctions.GetFavoredAndUnfavoredTeamList(bettingApiInstance, betProvider, gameOptions);
      const betOnFavoredTeam = SpreadFunctions.GetUserBetOnFavoredOrUnfavoredTeam(listFavoredAndUnfavoredTeams[0], chosenTeam);
      const betLine = await SpreadFunctions.GetUserSpreadLine(betProvider, bettingApiInstance, gameOptions, listFavoredAndUnfavoredTeams, betOnFavoredTeam);

      // Print chosen bet information
      await SpreadFunctions.PrintSpreadBettingInfo(betLine, listFavoredAndUnfavoredTeams, gameOptions);

      // Get current score (home vs. vistor) and score differential
      const homeVsVistorScore = await CatchAllFunctions.GetHomeVsVisitorScore(bettingApiInstance, gameOptions);
      const listScoreDifferential = await SpreadFunctions.GetScoreDifferentialList(bettingApiInstance, gameOptions, listFavoredAndUnfavoredTeams[0]);

      // Print score information
      await SpreadFunctions.PrintSpreadBetCurrentScoreInfo(homeVsVistorScore, listScoreDifferential);

      // // Calculate current cash
      userNewCash = SpreadFunctions.CalculateCashFromSpreadBet(userCurrentCash, userBetAmount, betOnFavoredTeam, betLine, listScoreDifferential[0]);
    
    // If user chooses a point total O/U bet
    } else if (betType === "O/U" || betType === "o/u") {
      
      // Get user's choice of over or under
      const userInputOverOrUnder = prompt("Over or under? ");
      const listUserOverOrUnder = TotalFunctions.GetUserBetOnOverOrUnder(userInputOverOrUnder);

      // Get the chosen total
      const betLine = await TotalFunctions.GetUserTotalLine(betProvider, bettingApiInstance, gameOptions);

      // Print chosen bet information
      console.log(`\nThe chosen bet is ${listUserOverOrUnder[1]} ${betLine}`);

      // Get current score (home vs. visitor) and current total score
      const homeVsVisitorScore = await CatchAllFunctions.GetHomeVsVisitorScore(bettingApiInstance, gameOptions);
      const totalScore = await TotalFunctions.GetTotalScore(bettingApiInstance, gameOptions);

      // Print score information
      TotalFunctions.PrintTotalBetCurrentScoreInfo(homeVsVisitorScore, totalScore);

      // Calculate current cash
      userNewCash = TotalFunctions.CalculateCashFromTotalBet(userCurrentCash, userBetAmount, betLine, listUserOverOrUnder[0], totalScore);
    }

    // Print final cash amount
    console.log(`\n${userFirstName} ${userLastName} currently has $${userNewCash}\n`);

  } catch (error) {
  console.error("Error: ", error);
  }
}
  
// Run the main function
main();