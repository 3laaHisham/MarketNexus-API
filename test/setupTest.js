const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = ["mongodb://localhost:27017/test", "mongodb+srv://3laaHisham:uk6Ccw8eJPc6uweU@mydb.05umcq2.mongodb.net/?retryWrites=true&w=majority"];
let client;
async function insertCallback(dbName, collectionName, documents) {

    const collection = client.db(dbName).collection(collectionName);
    try {
        const result = await collection.insertMany(documents);
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
    // result.insertedIds => array of found ids ex: [{ _id = ObjectId("61792dab982394f892e6c727") }]
    // result.insertedCount => number
    // result.acknowledged => true or false

}
async function findCallback(dbName, collectionName, filter) {

    const collection = client.db(dbName).collection(collectionName);
    try {
        let found = await collection.find(filter);
        return found.toArray();
    } catch (error) {
        console.log(error);;
        return null;
    }

}
async function updateAndReturnCallback(dbName, collectionName, filter, update) {

    const collection = client.db(dbName).collection(collectionName);
    try {
        await collection.updateMany(filter, update);
        const updatedDocuments = await collection.find(filter).toArray();
        if (!updatedDocuments)
            return null;
        return updatedDocuments;
    } catch (error) {
        return null;
    }
}
async function updateCallback(dbName, collectionName, filter, update) {

    const collection = client.db(dbName).collection(collectionName);
    try {
        return await collection.updateMany(filter, update);
    } catch (error) {
        return null;
    }
    // result.matchedCount => number
    // result.modifiedCount => number
    // result.acknowledged => true or false
    //   result.upsertedCount => true or false
    //   result.upsertedId => []

}
async function deleteCallback(dbName, collectionName, filter) {
    const collection = client.db(dbName).collection(collectionName);
    try {
        return await collection.deleteMany(filter);
    } catch (error) {
        return null;
    }
    // result.deletedCount => number
    // result.acknowledged => true or false
}


async function clearDB(dbName) {

    const collections = await client.db(dbName).listCollections().toArray();
    collections.forEach(async (collection) => {
        await client.db(dbName).collection(collection.name).deleteMany({});
    });



}
async function clearCollection(dbName, collectionName) {

    const collection = client.db(dbName).collection(collectionName);

    try {
        const result = await collection.deleteMany({});
        return result.deletedCount;
    } catch (error) {
        console.log(error);
        return null;
    }




}
async function run(callback, dbDestination) {
    // dbDestination 0 for local
    //               1 for remote
    try {
        client = new MongoClient(uri[dbDestination || 0]);
        await client.connect();
        await callback();
    } finally {
        await client.close();
    }
}
// run(clearDB).catch(console.dir);
module.exports = {
    insertCallback,
    findCallback,
    updateCallback,
    updateAndReturnCallback,
    deleteCallback,
    clearDB,
    clearCollection,
    run
};