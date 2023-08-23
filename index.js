const fs = require("node:fs");
const path = require("node:path");
const {
    Client,
    Collection,
    GatewayIntentBits,
    EmbedBuilder,
} = require("discord.js");
require("dotenv").config();

const token = process.env.TOKEN;

const deployCommands = require("./deploy-commands");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const CronJob = require("cron").CronJob;
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}
// 0 6 * * 1-5
const { DateTime } = require("luxon");

const getSchedule = require("./functions/getSchedule");
const getScreenshot = require("./functions/getScreenshot");
client.once("ready", () => {

    console.log("Ready!");
    const job = new CronJob(
        "0 6 * * 1-5",
        function () {
            const date = DateTime.now().setZone("America/New_York");
            let response = getScreenshot(date);
            client.channels.cache
                .get("1008509546358112328")
                .send(response)
                .then((m) => m.crosspost());
        },
        null,
        true,
        "America/New_York"
    );
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
});

client.login(token);
