export default class Patient {
  constructor(db) {
    this.db = db;
    this.collectionName = "patients";
    this.collection = db.collection(this.collectionName);
  }

  /**
   * Find a specific patient object by ID
   * @param {ObjectID} patientId
   */
  fetchPatientById(patientId) {
    return this.collection.findOne({ _id: patientId });
  }
}
