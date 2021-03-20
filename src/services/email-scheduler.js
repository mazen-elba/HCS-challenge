import DBManager from "../utils/db-manager";

const dbManager = new DBManager();

const cron = require("node-cron");

const emailService = cron.schedule("*/5 8-18/2 * * *", () => {
  //   console.log("running a task every two hours between 8 a.m. and 5:58 p.m.");

  const countDays = () => {
    let iniDate = new Date();
    let endDate = new Date();

    let diff = endDate.getTime() - iniDate.getTime();
    return diff;
  };

  async function createEmails() {
    const email1 = await dbManager.createDocs(email.collectionName, {
      name: "Day 1",
      scheduled_date: `${countDays() + 1} day(s)`,
    });

    return { email1 };
  }

  let i = 1;
  while (i < 6) {
    const email = dbManager.createDocs(email.collectionName, {
      name: `Day ${i}`,
      scheduled_date: `${countDays() + i} day(s)`,
    });
    i++;
  }
});

emailService.start();
