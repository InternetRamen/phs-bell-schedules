const fs = require("fs");
const puppeteer = require("puppeteer");
const { DateTime } = require("luxon");

const events = [];
(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(
        "https://www2.montgomeryschoolsmd.org/schools/poolesvillehs/calendar-index/",
        { waitUntil: "networkidle2" }
    );

    await page.click(".fc-listMonth-button");
    const schoolMonths = [
        "August",
        "September",
        "October",
        "November",
        "December",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
    ];

    let currentMonth = await page.$(".fc-center h2");
    while (
        (await page.evaluate((el) => el.textContent, currentMonth)) !==
        "August 2023"
    ) {
        await page.click(".fc-prev-button");
        currentMonth = await page.$(".fc-center h2");
    }

    for (const month of schoolMonths) {
        await page.waitForSelector(".fc-list-table");
        const trs = await page.$$(".fc-list-table tbody tr");
        const monthEvents = [];
        for (const i in trs) {
            const tr = trs[i];
            const dataset = await page.evaluate(
                (el) => Object.assign({}, el.dataset),
                tr
            );
            if (dataset.date) {
                monthEvents.push({
                    name: "",
                    date: DateTime.fromISO(dataset.date),
                    type: "",
                });
            } else if (dataset.id) {
                let title = await page.evaluate(
                    (el) => el.innerText,
                    await tr.$("td a")
                );
                const titleSafe = title.toLowerCase();
                const index = monthEvents.length - 1;
                if (titleSafe.includes("early")) {
                    monthEvents[index].type = "early";
                } else if (
                    titleSafe.includes("closed") ||
                    titleSafe.includes("no school")
                ) {
                    monthEvents[index].type = "closed";
                } else {
                    monthEvents[index].type = "normal";
                }
                monthEvents[index].name = title;
            }
        }
        console.log(monthEvents);
        events.push(...monthEvents);
        await page.click(".fc-next-button");
        await delay(3000)
        console.log("next");
    }
    await browser.close();
    fs.writeFileSync("source/special.json", JSON.stringify(events));
})();

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
