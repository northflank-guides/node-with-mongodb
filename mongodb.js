require("dotenv").config();
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

(async () => {
  try {
    await client.connect();

    const dbRole = await client.db().command({ hello: 1 });

    console.log(
      `Role of database - Host: ${dbRole.me}  Is primary: ${dbRole.isWritablePrimary}`
    );

    // Accessing ‘movies’ collection object
    const moviesCollection = await client.db().collection("movies");

    console.log("Collection name: ", moviesCollection.collectionName);

    // Inserting new document into the ‘movies’ collection
    const result = await moviesCollection.insertOne({
      name: "Spider-Man: No Way Home",
      year: 2021,
    });

    const { insertedId } = result;
    console.log("Result: ", insertedId);

    // Fetching a document based on ObjectId
    const document = await moviesCollection.findOne({ _id: insertedId });
    console.log("Document from db: ", document);

    // Getting the number of documents in the collection.
    console.log(
      "Number of documents: ",
      await moviesCollection.estimatedDocumentCount()
    );

    await client.close();
  } catch (e) {
    console.log("Error: ", e.message);
  }
})();
