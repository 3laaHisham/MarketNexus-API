const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://3laaHisham:uk6Ccw8eJPc6uweU@mydb.05umcq2.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb://localhost:27017/test";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function callback() {

    const collection = client.db('test').collection('users');
    const document = {
        name: 'test1',
        email: 'test1@gmail.com',
        password: '123456789',
        phone: '12345678911',
        address: {
            country: "Egypt",
            city: 'dam',
            street: 'abc',
            flatNumber: '0',
        },
        role: "admin"
    };
    console.log("8888");
    await collection.insertOne(document, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Document inserted successfully!');
    });
    console.log("Ffffffff");
}




async function run(callback) {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
        await callback();
    } finally {
        // Ensures that the client will close when you finish/error
        console.log("jjjj")
        await client.close();
    }
}
run(callback).catch(console.dir);
