export default class Patient {
  constructor(db) {
    this.db = db;
    this.collectionName = "patients";
    this.collection = db.collection(this.collectionName);
  }

  findByPatientId(id) {
    return this.collection.findOne({ memberId: id });
  }

  findByFirstName(name) {
    return this.collection.findOne({ firstName: name });
  }

  findByEmailAddress(email) {
    return this.collection.findOne({ emailAddress: email });
  }

  findByConsent(consentChoice) {
    return this.collection.findOne({ consent: consentChoice });
  }

  /**
   * Return a Custom Patient Object
   * @param {ObjectID} patientId
   */
  // async serialize(id) {
  //   const patient = await this.findById(id);
  //   // const patientId = await this.findById(patient.memberId);
  //   // const name = await this.findByIds(patient.name);
  //   // const emailAddress = await this.findByIds(patient.emailAddress);
  //   // const consentChoice = await this.findByIds(patient.consentChoice);

  //   return {
  //     id: patient._id.toString(),
  //     patientId: patient.memberId,
  //   };
  // }
}
