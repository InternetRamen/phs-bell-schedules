const fs = require("node:fs");
const path = require("node:path");
const { EmbedBuilder } = require("discord.js");
const { DateTime } = require("luxon");

module.exports = (dateFormatted) => {
    let dateArray = fs.readFileSync(
        path.resolve(__dirname, "../source/source.json"),
        "utf8"
    );
    dateArray = JSON.parse(dateArray);

    let today = dateArray.find((val) => val.startsWith(dateFormatted));

    if (!today) {
        today = "Nothing found for today";
    }
    if (today.includes("FT")) {
        let ft = today.substring(today.indexOf("FT"), today.indexOf("FT") + 3);
        return {
            files: [
                {
                    attachment: path.join(
                        __dirname,
                        `../source/schedules/${ft.toLowerCase()}.png`
                    ),
                    name: "Schedule.png",
                    description: `Schedule for ${dateFormatted}`,
                },
            ],
        };
    } else if (today.includes("Adv.")) {
        return {
            files: [
                {
                    attachment: path.join(
                        __dirname,
                        `../source/schedules/Adv.png`
                    ),
                    name: "Schedule.png",
                    description: `Schedule for ${dateFormatted}`,
                },
            ],
        };
    } else {
        const change = today.split(" - ")[1];
        const specialSchedule = fs.readFileSync(
            path.resolve(__dirname, "../source/specialSchedules/specialSchedules.json"),
            "utf8"
        );
        const specialScheduleArray = JSON.parse(specialSchedule);
        const sched = specialScheduleArray.find((val) => val.name === change);
        if (sched) {
            return {
                files: [
                    {
                        attachment: sched.url,
                        name: "Schedule.png",
                        description: `Schedule for ${dateFormatted}`,
                    },
                ],
            };
        } else {
            return "No class today!";
        }
    }
};
