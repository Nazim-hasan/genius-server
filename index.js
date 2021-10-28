const express=require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors=require('cors');
const ObjectId=require('mongodb').ObjectId;
const app=express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

//mongo user: mydbuser1 password: 3sPjX6UllYoQ7J9g
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wl8pl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//DB START
async function run() {
    try {
      await client.connect();
      const database = client.db("carMechanic");
      const servicesCollection = database.collection("services");
      // create a document to insert
      app.post('/services', async(req,res)=>{
        const service=req.body;
        console.log("hit the post",req.body);
        const result= await servicesCollection.insertOne(service);
        console.log(result);
        res.json(result);
      })
      //GET 
      app.get('/services',async(req,res)=>{
          const cursor=servicesCollection.find({});
          const services= await cursor.toArray();
          res.send(services);
      })
      //GET Single Data
      app.get('/services/:id', async(req,res)=>{
          const id=req.params.id;
          const query= {_id: ObjectId(id)};
          const service= await servicesCollection.findOne(query);
          res.send(service);
      })

    } finally {
    }
  }
  run().catch(console.dir);

//DB END

app.get('/',(req,res)=>{
    res.send("Hello world");
    console.log("Hi");
})
app.listen(port ,()=>{
    console.log("Running on port ",port);
})