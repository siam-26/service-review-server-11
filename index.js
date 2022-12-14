const express = require('express');
var cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//MongoDB

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.iahawou.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const foodServices = client.db("hmasfood").collection("servicesfood");
        const reviewsCollection = client.db("hmasfood").collection("reviews");

        //get 3 services
        app.get('/services', async (req, res) => {
            const limitValue = req.query.limit || 3;
            const skipValue = req.query.skip || 0;

            const query = {};
            const cursor = foodServices.find(query);
            const products = await cursor.skip(skipValue).limit(limitValue).toArray();
            const count = await foodServices.estimatedDocumentCount();

            res.send({ count, products });
        })

        //get all services
        app.get('/allServices', async (req, res) => {
            const query = {};
            const cursor = foodServices.find(query);
            const allServices = await cursor.toArray();
            res.send(allServices);
        })

        //get specific service
        app.get('/allServices/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const viewDetails = await foodServices.findOne(query);
            res.send(viewDetails);
        })

        //review api
        app.post('/reviews', async (req, res) => {
            const allreview = req.body;
            const result = await reviewsCollection.insertOne(allreview);
            res.send(result);
        })

        //get review api
        app.get('/reviews', async (req, res) => {
            console.log(req.query.email);
            const query = {};
            const cursor = reviewsCollection.find(query);
            const allReviews = await cursor.toArray();
            res.send(allReviews);
        })

        //query review api
        app.get('/reviews', async (req, res) => {
            const query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
    }
    finally {

    }
}
run().catch(error => console.log(error));


app.get('/', (req, res) => {
    res.send('HMAS-food server!')
})

app.listen(port, () => {
    console.log(`HMAS-food-server listening on port ${port}`)
})


