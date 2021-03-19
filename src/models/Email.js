export default class Email {
  constructor(db) {
    this.db = db;
    this.collectionName = "emails";
    this.collection = db.collection(this.collectionName);
  }

  findById(id) {
    return this.collection.findOne({ _id: id });
  }

  addEmailToCollection(emailId) {
    const email = this.findById(emailId);

    return this.collection.insertOne({
      id: email._id,
      name: email.name,
      scheduled_date: email.scheduled_date,
    });
  }
}
