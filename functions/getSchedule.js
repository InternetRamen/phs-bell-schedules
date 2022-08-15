const fs = require("node:fs");
const path = require("node:path");
const {EmbedBuilder} = require("discord.js");
module.exports = (dateFormatted) => {
    
    let dateArray = fs.readFileSync(path.resolve(__dirname, "../source/source.json"), "utf8");
    dateArray = JSON.parse(dateArray);
    let periodArray = fs.readFileSync(
        path.resolve(__dirname, "../source/schedules.json"),
        "utf8"
    );
    periodArray = JSON.parse(periodArray);
    
    let today = dateArray.find((val) => val.startsWith(dateFormatted));

    if (!today) {
        today = "Nothing found for today";
    }
    let schedule;
    if (today.includes("FT")) {
        schedule = periodArray.map(
            (val) => val[parseInt(today.charAt(today.indexOf("FT") + 2))]
        );
    } else if (today.includes("Adv.")) {
        schedule = periodArray.map((val) => val[7]);
    } else if (today.includes("(HR schedule)")) {
        schedule = "Homeroom Schedule";
    } else if (today.includes("Early Release")) {
        schedule = "Early Release";
    } else {
        schedule = "No class today!";
    }
    if (typeof schedule === "string") {
        console.log(today)
        return schedule;
    } else {
        let temp = 0;
        schedule = schedule.map((val) => {
            temp++;
            if (temp === 3) {
                return "**Homeroom:** " + val;
            } else if (temp < 3) {
                return "**Period " + temp + ":** " + val;
            } else if (temp > 3) {
                return "**Period " + (temp + 1) + ":** " + val;
            }
        });

        if (schedule[2].includes("0:00 - 0:00")) schedule.splice(2, 1);

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`${today}`)
            .setDescription(schedule.join("\n"));

        return { embeds: [embed] };
    }
};
