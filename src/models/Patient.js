export default class Patient {
  constructor(db) {
    this.db = db;
    this.collectionName = "patients";
    this.collection = db.collection(this.collectionName);
  }

  /**
   * Find a Specific Patient Document by Member ID
   * @param {ObjectID} id
   */
  findById(id) {
    return this.collection.findOne({ _id: id });
  }

  /**
   * Find a List of Patient Documents by IDs
   * @param {Object[]} ids
   */
  findByIds(ids) {
    return this.collection.find({ _id: { $in: ids } }).toArray();
  }

  /**
   * Return a Custom Patient Object
   * @param {ObjectID} patientId
   */
  async serialize(id) {
    const patient = await this.findById(id);
    // const patientId = await this.findById(patient.memberId);
    // const name = await this.findByIds(patient.name);
    // const emailAddress = await this.findByIds(patient.emailAddress);
    // const consentChoice = await this.findByIds(patient.consentChoice);

    return {
      id: patient._id.toString(),
      patientId: patient.memberId,
    };
  }
}
