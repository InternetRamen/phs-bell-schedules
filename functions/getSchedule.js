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
            (val) => val[parseInt(today.charAt(today.indexOf("FT") + 2))  - 1]
        );
    } else if (today.includes("Adv.")) {
        schedule = periodArray.map((val) => val[7]);
    } else if (today.includes("(HR schedule)")) {
        schedule = "Homeroom Schedule";
    } else if (today.includes("Early Release")) {
        schedule = "Early Release";
    } else if (today.includes("CHANGED")) {
        schedule = periodArray.map((val) => val[8]);
    } 
    else {
        schedule = "No class today!";
    }
    if (typeof schedule === "string") {
        console.log(today);
        return schedule;
    } else {
        let temp = 0;
        // 1: period 1, 2: period 2, 3: homeroom, 4: period 3, 5: period 4, 6: Lunch, 7: period 5,
        console.log(schedule);
        schedule = schedule.map((val) => {
            temp++;
            if (temp === 3) {
                return "**Homeroom:** " + val;
            } else if (temp < 3) {
                return "**Period " + temp + ":** " + val;
            } else if (temp === 6) {
                return "**Lunch:** " + val;
            } else if (temp > 3 && temp < 6) {
                return "**Period " + (temp - 1) + ":** " + val;
            } else if (temp > 6) {
                return "**Period " + (temp - 2) + ":** " + val;
            }
            
        });
        for (let pd of schedule) {
            if (pd.includes("0:00 - 0:00")) {
                schedule[schedule.indexOf(pd)] = undefined;
            }
        }
        for (let pd of schedule) {
            if (pd === undefined) {
                schedule.splice(schedule.indexOf(pd), 1);
            }
        }

        const weekDay = DateTime.fromFormat(dateFormatted, "M/d");
        if (schedule.length == 0) return schedule = "No class today!";
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`${weekDay.weekdayLong} ${today}`)
            .setDescription(schedule.join("\n"));
        
        return { embeds: [embed] };
    }
};
