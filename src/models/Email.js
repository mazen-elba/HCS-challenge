export default class Email {
  constructor(db) {
    this.db = db;
    this.collectionName = "emails";
    this.collection = db.collection(this.collectionName);
  }

  fetchEmailById(id) {
    return this.collection.findOne({ _id: id });
  }

  uploadEmails(emailId) {
    const email = this.fetchEmailById(emailId);

    return this.collection.insertOne({
      id: email._id,
      name: email.name,
      scheduled_date: email.scheduled_date,
    });
  }
}
