const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hxno4y0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)


        const toyCollection = client.db('robotGalaxy').collection('toy');
        const toysCollection = client.db('robotGalaxy').collection('toys');

        app.get('/toy', async (req, res) => {
            const cursor = toyCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/toy/:id', async (req, res) => {
            const id = req.params.id;
            console.log('40', id)
            const query = { _id: new ObjectId(id) }
            const user = await toyCollection.findOne(query);
            res.send(user)
        })


        app.get('/toys', async (req, res) => {
            const cursor = toysCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/toys', async (req, res) => {
            const toys = req.body;
            console.log('new users', toys)
            const result = await toysCollection.insertOne(toys);
            res.send(result)
        });


        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            console.log('62', id)
            const query = { _id: new ObjectId(id) }
            const user = await toysCollection.findOne(query);
            res.send(user)
        })

        app.get("/toyss/:email", async (req, res) => {
            console.log(req.params.email);
            const toys = await toysCollection
                .find({
                    email: req.params.email,
                })
                .toArray();
            res.send(toys);
        });

        app.put('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedToys = req.body;
            console.log(updatedToys);
            const updateDoc = {
                $set: {
                    status: updatedToys.status
                },
            };
            const result = await toysCollection.updateOne(filter, updateDoc);
            res.send(result);
        })


        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(query);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('robot is running')
})

app.listen(port, () => {
    console.log(`Robot Galaxy is running on port ${port}`)
})