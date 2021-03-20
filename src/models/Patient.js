export default class Patient {
  constructor(db) {
    this.db = db;
    this.collectionName = "patients";
    this.collection = db.collection(this.collectionName);
  }

  fetchPatientById(id) {
    return this.collection.findOne({ _id: id });
  }
}
