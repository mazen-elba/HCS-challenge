export default class Email {
  constructor(db) {
    this.db = db;
    this.collectionName = "emails";
    this.collection = db.collection(this.collectionName);
  }

  fetchEmailById(id) {
    return this.collection.findOne({ _id: id });
  }
}
