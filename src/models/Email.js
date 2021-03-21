export default class Email {
  constructor(db) {
    this.db = db;
    this.collectionName = "emails";
    this.collection = db.collection(this.collectionName);
  }

  /**
   * Find a specific email object by ID
   * @param {ObjectID} emailId
   */
  fetchEmailById(emailId) {
    return this.collection.findOne({ _id: emailId });
  }
}
