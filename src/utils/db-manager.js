const { MongoClient } = require("mongodb");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Extend default timeout to allow MongoDB binary download
// jest.setTimeout(60000);
jest.useFakeTimers();

export default class DBManager {
  constructor() {
    this.server = new MongoMemoryServer();
    this.connection = null;
    this.db = null;
  }

  // Start Server and Establish Connection
  async start() {
    const url = await this.server.getUri();
    this.connection = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.db = this.connection.db(await this.server.getDbName());
  }

  // Close Connection and Stop Server
  stop() {
    this.connection.close();
    return this.server.stop();
  }

  // Delete All Collections and Indexes
  async cleanup() {
    const collections = await this.db.listCollections().toArray();
    return Promise.all(
      collections
        .map(({ name }) => name)
        .map((collection) => this.db.collection(collection).drop())
    );
  }

  /**
   * Manually Insert a Document into DB and Return Created Document
   * @param {string} collectionName
   * @param {Object} document
   */
  async createDocs(collectionName, documents) {
    const { ops } = await this.db
      .collection(collectionName)
      .insertMany(documents);
    // .insertMany(document); // insertMany takes an array of objects

    return ops; // all documents
    // return ops[0]; // first document only
  }
}
