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

describe("findById", () => {
  test("should return the correct document by ID", async () => {
    const { patient2 } = await createPatients();
    const result = await patient.findById(patient2._id);
    expect(result).toMatchObject(patient2);
  });

  test("should return null if a document with the provided ID could not be found", async () => {
    const result = await patient.findById("12045");
    expect(result).toBeNull();
  });
});

describe("findByIds", () => {
  test("should return the correct documents by ID", async () => {
    const { patient1, patient5 } = await createPatients();
    const result = await patient.findByIds([patient1._id, patient5._id]);
    expect(result).toMatchObject([patient1, patient5]);
  });

  test("should return empty array if documents with the provided IDs could not be found", async () => {
    const result = await patient.findByIds(["512351532"]);
    expect(result).toEqual([]);
  });
});

describe("serialize", () => {
  //   test("should return the correct shape", async () => {
  //     const { patient4 } = await createPatients();
  //     const result = await patient.serialize(patient4._id);

  //     expect(result).toMatchObject({
  //       id: String(patient4._id),
  //       memberId: 12245,
  //       firstName: "LOAD",
  //       emailAddress: "test3@humancaresystems.com",
  //       consent: "Y",
  //     });
  //   });

  test("should return Patient ID", async () => {
    const { patient4 } = await createPatients();
    const { patientId } = await patient.serialize(patient4._Id);
    expect(patientId).toBe(12245);
  });

  // test("should return null if no Patient ID found", async () => {
  //   const { patient4 } = await createPatients();
  //   const { patientId } = await patient.serialize(patient4._id);
  //   expect(patientId).toEqual([]);
  // });
});

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
    emailAddress: "test0@humancaresystems.com",
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
    emailAddress: "test3@humancaresystems.com",
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
