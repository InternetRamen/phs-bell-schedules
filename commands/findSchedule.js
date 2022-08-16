const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { DateTime } = require("luxon");
const getSchedule = require("../functions/getSchedule");

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
        let response = getSchedule(interaction.options.getString("date"));
        interaction.reply(response);
    },
};
