import DBManager from "../utils/db-manager";
import Patient from "../models/Patient";
import Email from "../models/Email";

const csvToJson = require("convert-csv-to-json");

const dbManager = new DBManager();

// ===================== SETUP ===================== //
// Convert CSV data into JSON array of objects
let json = csvToJson
  .utf8Encoding()
  .fieldDelimiter("|")
  .formatValueByType()
  .getJsonFromCsv("rawData.csv");

let jsonObjects = [];
for (let i = 0; i < json.length; i++) {
  // console.log(json[i]);
  jsonObjects.push(json[i]);
}

// Upload patients data into *Patients* collection
async function createPatients() {
  const patients = await dbManager.createDocs(
    patient.collectionName,
    jsonObjects
  );
  return patients; // array of objects
}

// Upload emails data into *Emails* collection
async function createEmails() {
  const countDays = () => {
    let iniDate = new Date();
    let endDate = new Date();
    let diff = endDate.getTime() - iniDate.getTime();
    return diff;
  };

  // email scheduler (5 notifications sent per patient)
  let emailsArray = [];
  for (let i = 1; i < 6; i++) {
    // console.log(json[i]);
    emailsArray.push({
      name: `Day ${i}`,
      scheduled_date: `${countDays() + i} day(s)`,
    });
  }

  const emails = await dbManager.createDocs(email.collectionName, emailsArray);
  return emails; // array of objects
}

// ===================== TESTING ALGORITHM ===================== //
// Before each test suite, start up an independent MongoDB instance, then create a connection to it
beforeAll(async () => {
  await dbManager.start();
});

// After each test suite, close connection to database, then stop MongoDB instance
afterAll(async () => {
  await dbManager.stop();
});

// Before each test case, instantiate a new Patient and Email model
let patient;
let email;
beforeEach(async () => {
  patient = new Patient(dbManager.db);
  email = new Email(dbManager.db);
});

// After each test case, remove any documents, collections and indexes created in the test case
afterEach(async () => {
  await dbManager.cleanup();
});

// Within each test case...
//... insert the desired documents and collections into database
//... call the method under test
//... make assertions on result
describe("fetchPatientById", () => {
  test("should verify data matches data in *Patients* collection", async () => {
    const patients = await createPatients();
    const rawData = jsonObjects; // original data with JSON objects (converted from CSV file)
    expect(rawData).toMatchObject(patients);
  });

  test("should print out Patient ID(s) where 'First Name' is missing", async () => {
    const patients = await createPatients();
    let result = [];
    let missingIds = [];
    for (let idx = 0; idx < patients.length; idx++) {
      result.push(await patient.fetchPatientById(patients[idx]._id));
      if (result[idx].FirstName === "") {
        missingIds.push(result[idx].MemberID);
        expect(result[idx].FirstName).toBe("");
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
      if (result[idx].EmailAddress === "" && result[idx].CONSENT === "Y") {
        missingEmails.push(result[idx].MemberID);
        expect(result[idx].EmailAddress).toBe("");
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
      if (patientResult[idx].CONSENT === "Y") {
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
  });
});
