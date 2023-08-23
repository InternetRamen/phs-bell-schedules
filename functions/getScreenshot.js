const fs = require("node:fs");
const path = require("node:path");
const { DateTime } = require("luxon");

module.exports = (date) => {
    let scheduleArray = fs.readFileSync(
        path.resolve(__dirname, "../source/special.json"),
        "utf8"
    );
    scheduleArray = JSON.parse(scheduleArray);
    scheduleArray = scheduleArray.map((val) => ({
        name: val.name,
        date: DateTime.fromISO(val.date),
        type: val.type,
    }));
    let specialDay = scheduleArray.find((val) => date.hasSame(val.date, "day"));
    if (specialDay) {
        if (specialDay.type === "closed") {
            return specialDay.name;
        } else if (specialDay.type === "early") {
            return {
                files: [
                    {
                        attachment: path.join(
                            __dirname,
                            `../source/specialSchedules/early.png`
                        ),
                        name: "Schedule.png",
                        description: `Schedule for ${date.toFormat("MMMM d")}`,
                    },
                ],
            };
        }
    }
    console.log(date.weekday)
    if (date.weekday <= 5 && date.weekday !== 3) {
        return {
            files: [
                {
                    attachment: path.join(
                        __dirname,
                        `../source/schedules/reg.png`
                    ),
                    name: "Schedule.png",
                    description: `Schedule for ${date.toFormat("MMMM d")}`,
                },
            ],
        };
    } else if (date.weekday === 3) {
        return {
            files: [
                {
                    attachment: path.join(
                        __dirname,
                        `../source/schedules/ft.png`
                    ),
                    name: "Schedule.png",
                    description: `Schedule for ${date.toFormat("MMMM d")}`,
                },
            ],
        };
    }
};
