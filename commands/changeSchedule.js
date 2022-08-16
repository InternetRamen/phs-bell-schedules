const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { writeFileSync, readFileSync } = require("fs");
const { DateTime, Duration } = require("luxon");
const path = require("path");
const getSchedule = require("../functions/getSchedule");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("changeschedule")
        .setDescription("Change the schedule for a specific date")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers
        )
        .addStringOption((option) =>
            option
                .setName("date")
                .setDescription("The date to find the schedule for.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("schedule")
                .setDescription("The new schedule for the date.")
                .setRequired(true)
        ),
    async execute(interaction) {
        let response = interaction.options.getString("schedule");
        response = response.trim();

        let spit = response.split(",");
        spit = spit.map((x) => x.trim());

        spit = spit.map((val) => {
            return val.split(";").map((x) => x.trim());
        });

        spit = new Map(spit);
        spit = Object.fromEntries(spit);
        let arrayToMatch = [
            "1",
            "2",
            "Homeroom",
            "3",
            "4",
            "Lunch",
            "5",
            "6",
            "7",
            "8",
        ];
        arrayToMatch.forEach((val) => {
            if (!spit[val]) {
                spit[val] = "0:00 - 0:00";
            }
        });
        console.log(spit);
        let source = readFileSync(
            path.resolve(__dirname, "../source/source.json"),
            "utf8"
        );
        source = JSON.parse(source);
        let ar = source.findIndex((val) =>
            val.startsWith(interaction.options.getString("date"))
        );
        if (!ar) return interaction.reply("Date not found :/");

        source[ar] = interaction.options.getString("date") + " - CHANGED";
        writeFileSync(
            path.resolve(__dirname, "../source/source.json"),
            JSON.stringify(source),
            "utf8"
        );
        let schedules = readFileSync(
            path.resolve(__dirname, "../source/schedules.json"),
            "utf8"
        );
        schedules = JSON.parse(schedules);
        console.log(spit);
        // spit =
        //     Object.entries(spit).sort((a, b) => {
        //         a = a[1]
        //         b = b[1]
        //         let aSplit = a.split(":").map((x) => parseInt(x));
        //         let bSplit = b.split(":").map((x) => parseInt(x));
        //         if (a !== "0:00" && parseInt(aSplit[0]) < 6) aSplit[0] += 12
        //         if (b !== "0:00" && parseInt(bSplit[0]) < 6) bSplit[0] += 12

        //         let timeA = Duration.fromObject({
        //             hours: aSplit[0],
        //             minutes: aSplit[1],
        //         }).as("milliseconds");
        //         let timeB = Duration.fromObject({
        //             hours: bSplit[0],
        //             minutes: bSplit[1],
        //         }).as("milliseconds");

        //         return timeA - timeB;
        //     })

        
        for (let i = 0; i < arrayToMatch.length;i++) {
            schedules[i][8] = spit[arrayToMatch[i]];
            console.log(schedules[i]);
        }


        writeFileSync(
            path.resolve(__dirname, "../source/schedules.json"),
            JSON.stringify(schedules),
            "utf8"
        );
        let rep = getSchedule(interaction.options.getString("date"));
        interaction.reply(rep);
    },
};
