const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { DateTime } = require("luxon");
const getScreenshot = require("../functions/getScreenshot");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("findschedule")
        .setDescription("Finds the schedule for a specific date")
        .addStringOption((option) =>
            option
                .setName("date")
                .setDescription("The date to find the schedule for.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const date = interaction.options.getString("date");
        let response = getScreenshot(DateTime.fromFormat(date, "M/d/yy"));

        interaction.reply(response);
    },
};
