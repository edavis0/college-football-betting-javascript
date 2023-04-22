const CatchAllFunctions = require("./CatchAllFunctions.js")
const CreateAPIInstance = require("./CreateAPIInstance.js");
const PrintFunctions = require("./PrintFunctions.js");
const SpreadFunctions = require("./SpreadFunctions.js");
const TotalFunctions = require("./TotalFunctions.js");


async function main() {

    const bettingApiInstance = await CreateAPIInstance.GetAPIInstance();

    var gameOptions = { 
        'year': 2021, // {Number} Year/season filter for games
        'week': 7, // {Number} Week filter
        'seasonType': "regular", // {String} Season type filter (regular or postseason)
        'conference': 'SEC'
      };

      PrintFunctions.PrintAllGamesBettingData(bettingApiInstance, gameOptions)

}

// Run the main function
main();