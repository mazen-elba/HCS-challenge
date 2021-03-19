import DBManager from "../testUtils/db-manager";
import Patient from "./Patient";
import Email from "./Email";

const dbManager = new DBManager();

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

describe("findById", () => {
  test("should return correct patient document by ID", async () => {
    const { patient1 } = await createPatients();
    const result = await patient.findById(patient1._id);
    expect(result).toMatchObject(patient1);
  });

  test("should return null if document with provided ID not be found", async () => {
    const result = await patient.findById("1234");
    expect(result).toBeNull();
  });

  test("should verify patient WITH first name", async () => {
    const { patient1 } = await createPatients();
    const result = await patient.findById(patient1._id);
    expect(result.firstName).not.toBe("");
  });

  test("should verify patient WITHOUT first name", async () => {
    const { patient2 } = await createPatients();
    const result = await patient.findById(patient2._id);
    expect(result.firstName).toBe("");
    console.log(
      `ALERT: patient missing first name | Patient ID: ${result.memberId}`
    );
  });

  test("should verify emails created in EMAIL collection for patients WITH consent YES", async () => {
    const { patient3 } = await createPatients();
    const result = await patient.findById(patient3._id);
    expect(result.emailAddress).not.toBe("");

    if (result.consent === "Y") {
      // [] add email address to collection
      const { email5 } = await createEmails();
      await email.addEmailToCollection(email5);
      console.log(
        `NEW email added to Email collection | Patient ID: ${result.memberId}`
      );

      // [] trigger email scheduler
    }
  });

  test("should verify emails for each patient scheduled correctly", async () => {
    const { email5 } = await createEmails();
    const emailObj = await email.findById(email5._id);
    expect(emailObj).toMatchObject(email5);
    console.log(emailObj);
  });

  test("should verify patient WITHOUT email address", async () => {
    const { patient4 } = await createPatients();
    const result = await patient.findById(patient4._id);
    expect(result.emailAddress).toBe("");

    if (result.consent === "Y") {
      console.log(
        `ALERT: patient missing email address with YES consent | Patient ID: ${result.memberId}`
      );
    }
  });
});

async function createEmails() {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const countDays = () => {
    let iniDate = new Date();
    let endDate = new Date();

    let diff = endDate.getTime() - iniDate.getTime();

    return diff;
  };

  const email1 = await dbManager.createDoc(email.collectionName, {
    name: "Day 1",
    scheduled_date: `${countDays() + 1} day(s)`,
  });

  const email2 = await dbManager.createDoc(email.collectionName, {
    name: "Day 2",
    scheduled_date: `${countDays() + 2} day(s)`,
  });

  const email3 = await dbManager.createDoc(email.collectionName, {
    name: "Day 3",
    scheduled_date: `${countDays() + 3} day(s)`,
  });

  const email4 = await dbManager.createDoc(email.collectionName, {
    name: "Day 4",
    scheduled_date: `${countDays() + 4} day(s)`,
  });

  const email5 = await dbManager.createDoc(email.collectionName, {
    name: "Day 5",
    scheduled_date: `${countDays() + 5} day(s)`,
  });

  return { email1, email2, email3, email4, email5 };
}

// Insert Patients Data into DB
async function createPatients() {
  const patient1 = await dbManager.createDoc(patient.collectionName, {
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
  });

  const patient2 = await dbManager.createDoc(patient.collectionName, {
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
  });

  const patient3 = await dbManager.createDoc(patient.collectionName, {
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
    emailAddress: "test2@humancaresystems.com",
    consent: "Y",
    mobilePhone: 6177504302,
  });

  const patient4 = await dbManager.createDoc(patient.collectionName, {
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
  });

  const patient5 = await dbManager.createDoc(patient.collectionName, {
    programId: 50777445,
    dataSource: "WEB 3RD PARTY",
    cardNumber: 564232343,
    memberId: 12445,
    firstName: "LOAD",
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
  });

  const patient6 = await dbManager.createDoc(patient.collectionName, {
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
  });

  return { patient1, patient2, patient3, patient4, patient5, patient6 };
}
