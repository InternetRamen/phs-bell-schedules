const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const { writeFileSync, readFileSync } = require("fs");
const path = require("path");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("continuedatechange")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers
        )
        .addStringOption((option) =>
            option
                .setName("date")
                .setDescription("The date to set the schedule for.")
                .setRequired(true)
        )
        .setDescription(
            "Change the schedule to stored schedule for a specific date"
        ),
    async execute(interaction) {
        const source = readFileSync(
            path.resolve(__dirname, "../source/source.json"),
            "utf8"
        );
        const sourceObject = JSON.parse(source);
        const date = interaction.options.getString("date");
        const schedule = sourceObject.findIndex((x) => x.startsWith(date));
        if (!schedule) {
            interaction.reply("No schedule found for that date.");
            return;
        }
        sourceObject[schedule] = date + " - CHANGED";
        writeFileSync(
            path.resolve(__dirname, "../source/source.json"),
            JSON.stringify(sourceObject),
            "utf8"
        );
        interaction.reply("Schedule changed.");
    },
};
