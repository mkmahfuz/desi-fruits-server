const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const port = process.env.PORT || 5050;

app.use(express.json());
app.use(cors());

app.listen(port,()=>{
    console.log("I am listening on port : ",port);
})

//general api not database related. 
app.get('/',(req, res)=>{
    res.send("This is the server root, Howdy")
})


//mongodb connection
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.lroqv.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true ,connectTimeoutMS: 30000, keepAlive: 1 });

//api for mongodb related collections
client.connect(err => {
    console.log(err);
    console.log("mongodb connected: OK");
  const fruitsCollection = client.db("desifruits").collection("fruits");
  // perform actions on the collection object

  //client.close();
});

