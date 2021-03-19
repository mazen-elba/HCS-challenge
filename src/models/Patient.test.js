import DBManager from "../testUtils/db-manager";
import Patient from "./Patient";

const dbManager = new DBManager();

beforeAll(async () => {
  await dbManager.start();
});

afterAll(async () => {
  await dbManager.stop();
});

let patient;
beforeEach(async () => {
  patient = new Patient(dbManager.db);
});

afterEach(async () => {
  await dbManager.cleanup();
});

describe("findByPatientId", () => {
  test("should return the correct document by ID", async () => {
    const { patient2 } = await createPatients();
    const result = await patient.findByPatientId(patient2.memberId);
    expect(result).toMatchObject(patient2);
  });
});

describe("findByFirstName", () => {
  test("should verify patient WITH first name", async () => {
    const { patient2 } = await createPatients();
    const result = await patient.findByFirstName(patient2.firstName);
    expect(result).toMatchObject({ firstName: "LOAD" });
  });

  test("should verify patient WITHOUT first name", async () => {
    const { patient1 } = await createPatients();
    const result = await patient.findByFirstName(patient1.firstName);
    expect(result).toMatchObject({ firstName: "" });
  });
});

describe("findByEmailAddress", () => {
  test("should verify patient WITH email address", async () => {
    const { patient3 } = await createPatients();
    const result = await patient.findByEmailAddress(patient3.emailAddress);
    expect(result).toMatchObject({
      emailAddress: "test2@humancaresystems.com",
    });
  });

  test("should verify patient WITHOUT email address", async () => {
    const { patient1 } = await createPatients();
    const result = await patient.findByEmailAddress(patient1.emailAddress);
    expect(result).toMatchObject({ emailAddress: "" });
  });
});

describe("findByConsent", () => {
  test("should verify patient with consent YES", async () => {
    const { patient3 } = await createPatients();
    const result = await patient.findByConsent(patient3.consent);
    expect(result).toMatchObject({ consent: "Y" });
  });

  test("should verify patient with consent NO", async () => {
    const { patient5 } = await createPatients();
    const result = await patient.findByConsent(patient5.consent);
    expect(result).toMatchObject({ consent: "N" });
  });
});

// Insert Patients Data into DB
async function createPatients() {
  const patient1 = await dbManager.createDoc(patient.collectionName, {
    programId: 50777445,
    dataSource: "WEB 3RD PARTY",
    cardNumber: 342121211,
    memberId: 43233,
    firstName: "",
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
    firstName: "LOAD",
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
