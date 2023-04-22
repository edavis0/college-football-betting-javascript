const CliTable = require("cli-table3");

// Print all game information based on conference and week
async function PrintAllGamesBettingData(bettingApiInstance, gameOptions) {
    try {

        // Retrieve API response
        const apiResponse = await bettingApiInstance.getLines(gameOptions);

        // Create a table using cli-table3 to print the available games and their lnes
        const table = new CliTable({
            head: ["Home Team", "Away Team", "Bet Provider", "Spread", "Over/Under"],
            colWidths: [20, 20, 20, 20, 20],
        });

        // Iterate through each game in the apiResponse
        for (const game of apiResponse) {
            const homeTeam = game.homeTeam;
            const awayTeam = game.awayTeam;

            // Iterate through each line in the games from the apiResponse
            for (const line of game.lines) {
                const betProvider = line.provider;
                const formattedSpread = line.formattedSpread;
                const overUnder = line.overUnder;

                table.push([homeTeam, awayTeam, betProvider, formattedSpread, overUnder]);
            }
        }

        console.log(`\nYear: ${gameOptions.year}\tWeek: ${gameOptions.week}\t\tConference: ${gameOptions.conference}\n`);
        console.log(table.toString());
    } catch (e) {
        console.error(`Exception when calling BettingApi->get_lines: ${e}\n`);
    }
}

module.exports = { 
    PrintAllGamesBettingData,
};