const express = require('express');
const cors = require('cors');
const app = express();
const ObjectId = require('mongodb').ObjectID; //this is needed to delete from mongodb or get single object

require('dotenv').config();
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const port = process.env.PORT || 5050;

app.use(express.json());
app.use(express.urlencoded()); // need this for getting form data
app.use(cors());

app.listen(port, () => {
    console.log("I am listening on port : ", port);
})

//general api not database related. 
app.get('/', (req, res) => {
    res.send("This is the server root, Howdy mkm")
})

//mongodb connection
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.lroqv.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS: 40000, keepAlive: 1 });

//api for mongodb related collections
client.connect(err => {
    console.log("DB ERROR:", err);
    console.log("mongodb connected: OK");
    const fruitsCollection = client.db("desifruits").collection("fruits");
    const ordersCollection = client.db("desifruits").collection("orders");

    // perform actions on the collection object

    //GET : get all fruits from fruits collection objects
    app.get('/allFruits', (req, res) => {
        fruitsCollection.find({}).toArray()
            .then((items) => {
                //console.log("All-Fruits: ", items);
                res.send(items);
            })
    })

    //GET : get single fruit from database
    app.get('/fruit/:id', (req, res) => {
        const objId = req.params.id;
        fruitsCollection.find({ _id: ObjectId(objId) }).toArray()
            .then((doc) => {
                res.send(doc[0]);
            })
    })


    //POST : add one fruit to fruits collection objects
    app.post('/addFruit', (req, res) => {
        const newFruit = req.body;
        //console.log(newFruit);
        fruitsCollection.insertOne(newFruit)
            .then(result => {
                res.send(result.insertedCount > 0);
                console.log(result.insertedCount);
            })
    })

    //POST : add one order to order collection objects
    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        //console.log(newFruit);
        ordersCollection.insertOne(newOrder)
            .then(result => {
                res.send(result.insertedCount > 0);
                console.log(result.insertedCount);
            })
    })
    //GET : get all orders for specific user  from orders collection object
    app.get('/orders', (req, res) => {
        const userEmail = req.query.email;
        //console.log(userEmail);
        ordersCollection.find({ email: userEmail }).toArray()
            .then((docs) => {
                res.send(docs);
            })
    })


    //DELETE : delete one fruit from fruits collection objects
    app.delete('/deleteFruit/:id', (req, res) => {
        const objId = req.params.id;
        fruitsCollection.deleteOne({ _id: ObjectId(objId) })
            .then((result) => {
                console.log(result);
                res.send(result.deletedCount > 0); //delete is successfull 
            })
        //console.log(req.params.id)
    })

    //Others TODO:

    //client.close();
});

