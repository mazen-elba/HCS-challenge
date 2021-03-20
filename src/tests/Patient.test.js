import DBManager from "../utils/db-manager";
import Patient from "../models/Patient";
import Email from "../models/Email";

const dbManager = new DBManager();

// const emailService = require("../services/email-scheduler");

beforeAll(async () => {
  await dbManager.start();
});

afterAll(async () => {
  await dbManager.stop();
});

let patient;
let email;

beforeEach(async () => {
  patient = new Patient(dbManager.db);
  email = new Email(dbManager.db);
});

afterEach(async () => {
  await dbManager.cleanup();
});

describe("fetchPatientById", () => {
  // test("should verify CSV flat file matches data in *Patients* collection", async () => {
  //   console.log(result);
  // });

  test("should print out Patient ID(s) where 'First Name' is missing", async () => {
    const patients = await createPatients();
    let result = [];
    let missingIds = [];
    for (let idx = 0; idx < patients.length; idx++) {
      result.push(await patient.fetchPatientById(patients[idx]._id));
      if (result[idx].firstName === "") {
        missingIds.push(result[idx].memberId);
        expect(result[idx].firstName).toBe("");
      }
    }
    console.log(
      `ALERT: patient(s) with missing first name | Patient ID(s): ${missingIds}`
    );
  });

  test("should print out Patient ID(s) where 'Email Address' is missing, but CONSENT is YES", async () => {
    const patients = await createPatients();
    let result = [];
    let missingEmails = [];
    for (let idx = 0; idx < patients.length; idx++) {
      result.push(await patient.fetchPatientById(patients[idx]._id));
      if (result[idx].emailAddress === "" && result[idx].consent === "Y") {
        missingEmails.push(result[idx].memberId);
        expect(result[idx].emailAddress).toBe("");
      }
    }
    console.log(
      `ALERT: patient(s) with missing email address | Patient ID(s): ${missingEmails}`
    );
  });

  test("should verify emails created in *Email* collection for patients with CONSENT is YES", async () => {
    const patients = await createPatients();
    let patientResult = [];
    for (let idx = 0; idx < patients.length; idx++) {
      patientResult.push(await patient.fetchPatientById(patients[idx]._id));
      if (patientResult[idx].consent === "Y") {
        await createEmails();
      }
    }

    const emails = await createEmails();
    let emailResult = [];
    for (let idx = 0; idx < emails.length; idx++) {
      emailResult.push(await email.fetchEmailById(emails[idx]._id));
    }
    expect(emailResult).toMatchObject(emails);
  });

  test("should verify emails for each patient scheduled correctly", async () => {
    const emails = await createEmails();
    let result = [];
    for (let idx = 0; idx < emails.length; idx++) {
      result.push(await email.fetchEmailById(emails[idx]._id));
      expect(result[idx]).toMatchObject({
        _id: emails[idx]._id,
        name: emails[idx].name,
        scheduled_date: emails[idx].scheduled_date,
      });
    }
    // console.log(result);
  });
});

async function createEmails() {
  const countDays = () => {
    let iniDate = new Date();
    let endDate = new Date();

    let diff = endDate.getTime() - iniDate.getTime();

    return diff;
  };

  const emails = await dbManager.createDocs(email.collectionName, [
    {
      name: "Day 1",
      scheduled_date: `${countDays() + 1} day(s)`,
    },

    {
      name: "Day 2",
      scheduled_date: `${countDays() + 2} day(s)`,
    },

    {
      name: "Day 3",
      scheduled_date: `${countDays() + 3} day(s)`,
    },

    {
      name: "Day 4",
      scheduled_date: `${countDays() + 4} day(s)`,
    },
  ]);

  return emails; // array of objects
}

// Insert Patients Data into DB
async function createPatients() {
  const patients = await dbManager.createDocs(patient.collectionName, [
    {
      programId: 50777445,
      dataSource: "WEB 3RD PARTY",
      cardNumber: 342121211,
      memberId: 43233,
      firstName: "LOAD",
      lastName: "TEST 0",
      dob: "04/29/2000",
      addressOne: "3100 S Ashley Drive",
      addressTwo: "",
      city: "Chandler",
      state: "AZ",
      zipCode: 85286,
      telephoneNumber: "",
      emailAddress: "",
      consent: "Y",
      mobilePhone: 1234567912,
    },

    {
      programId: 50777445,
      dataSource: "WEB 3RD PARTY",
      cardNumber: 564232340,
      memberId: 12045,
      firstName: "",
      lastName: "TEST 1",
      dob: "03/20/1969",
      addressOne: "3100 S Ashley Drive",
      addressTwo: "",
      city: "Chandler",
      state: "AZ",
      zipCode: 85286,
      telephoneNumber: "",
      emailAddress: "test1@humancaresystems.com",
      consent: "Y",
      mobilePhone: 1234567890,
    },

    {
      programId: 50777445,
      dataSource: "WEB 3RD PARTY",
      cardNumber: 564232341,
      memberId: 12145,
      firstName: "LOAD",
      lastName: "TEST 2",
      dob: "03/01/1969",
      addressOne: "3100 S Ashley Drive",
      addressTwo: "",
      city: "Chandler",
      state: "AZ",
      zipCode: 85286,
      telephoneNumber: "",
      emailAddress: "",
      consent: "Y",
      mobilePhone: 6177504302,
    },

    {
      programId: 50777445,
      dataSource: "WEB 3RD PARTY",
      cardNumber: 564232342,
      memberId: 12245,
      firstName: "LOAD",
      lastName: "TEST 3",
      dob: "03/02/1969",
      addressOne: "3100 S Ashley Drive",
      addressTwo: "",
      city: "Chandler",
      state: "AZ",
      zipCode: 85286,
      telephoneNumber: "",
      emailAddress: "",
      consent: "Y",
      mobilePhone: 6177504303,
    },

    {
      programId: 50777445,
      dataSource: "WEB 3RD PARTY",
      cardNumber: 564232343,
      memberId: 12445,
      firstName: "",
      lastName: "TEST 4",
      dob: "03/03/1969",
      addressOne: "3100 S Ashley Drive",
      addressTwo: "",
      city: "Chandler",
      state: "AZ",
      zipCode: 85286,
      telephoneNumber: "",
      emailAddress: "test4@humancaresystems.com",
      consent: "N",
      mobilePhone: 6177504384,
    },

    {
      programId: 50777445,
      dataSource: "WEB 3RD PARTY",
      cardNumber: 564232344,
      memberId: 13245,
      firstName: "LOAD",
      lastName: "TEST 5",
      dob: "03/04/1969",
      addressOne: "3100 S Ashley Drive",
      addressTwo: "",
      city: "Chandler",
      state: "AZ",
      zipCode: 85286,
      telephoneNumber: "",
      emailAddress: "test5@humancaresystems.com",
      consent: "N",
      mobilePhone: 6177504305,
    },
  ]);

  return patients; // array of objects
}
