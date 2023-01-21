const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()

const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

//middware 
app.use(express.json());
app.use(cors());

app.get('/', (req, res) =>{
    res.send("REPLIQ server running");
})



const uri = `mongodb+srv://${process.env.SECRET_DB_id}:${process.env.SECRET_DB_pass}@cluster0.dof2kcq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () =>{
    const productsCollection = client.db('REPLIQ_Task').collection("Products");
    const users = client.db('REPLIQ_Task').collection("users");

    app.get('/hasan', (req,res) =>{
        res.send( {name: "Hasan"})
    })


    app.post('/users', async (req, res) => {
        const data = req.body;
        const result = await users.insertOne(data);
        res.send(result)
    });

}
run().catch(err=> console.log(err))


app.listen(port, () =>{
    console.log("REPLIQ server running in ", port)
})