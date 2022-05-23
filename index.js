const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p8xdn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db('bookBunndel').collection('product');
        const myItemAdd = client.db('bookBunndel').collection('myItem');

        // Auth

        // product show
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        });
        // product find
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        });
        // update
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const quantitys = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: quantitys.quantity,
                }
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            console.log(result)
            res.send(result);
        });

        // Delete
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });

        app.get('/myItem', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = myItemAdd.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })
        app.delete('/myItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myItemAdd.deleteOne(query);
            res.send(result);
        });

        app.post('/addItem', async (req, res) => {
            const order = req.body;
            const result = await myItemAdd.insertOne(order);
            res.send(result);
        })

    } finally {

    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Running Server');
})

app.listen(port, () => {
    console.log('Listening to port', port)
})