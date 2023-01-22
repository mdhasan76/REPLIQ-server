const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()

const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middware 
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("REPLIQ server running");
})



const uri = `mongodb+srv://${process.env.SECRET_DB_id}:${process.env.SECRET_DB_pass}@cluster0.dof2kcq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    const productsCollection = client.db('REPLIQ_Task').collection("Products");
    const users = client.db('REPLIQ_Task').collection("users");
    const cart = client.db('REPLIQ_Task').collection("Cart");
    const orders = client.db('REPLIQ_Task').collection("Orders");

    //all Product
    app.get('/products', async (req, res) => {
        const result = await productsCollection.find({}).toArray();
        res.send(result);
    })

    // Single Product
    app.get('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await productsCollection.findOne(query);
        res.send(result);
    })

    // All Users 
    app.get('/users', async(req, res) =>{
        const result = await users.find({title: "user"}).toArray();
        res.send(result);
    })

    // ALl cart view
    app.get('/cart', async (req, res) => {
        const result = await cart.find({}).toArray();
        res.send(result);
    })

    // Customer Dtails
    app.get('/users/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await users.findOne(query);
        res.send(result);
    })

    // Admin Order List
    app.get('/orders', async (req, res) => {
        const result = await orders.find({}).toArray();
        res.send(result);
    })

    // Admin Order Dtails
    app.get('/orders/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await orders.findOne(query);
        res.send(result);
    })

    // Add New User
    app.post('/users', async (req, res) => {
        const data = req.body;
        const result = await users.insertOne(data);
        res.send(result)
    });

    // Add To Cart
    app.post('/cart', async(req, res) =>{
        const data = req.body;
        const result = await cart.insertOne(data);
        res.send(result);
    })

    // Add new Product 
    app.post('/addproduct', async (req, res) => {
        const data = req.body;
        const result = await users.insertOne(data);
        res.send(result)
    });

    //Delete Product
    app.delete('/product/:id', async (req, res) => {
        const id = req.params.id;
        const result = await productsCollection.deleteOne({ _id: ObjectId(id) });
        res.send(result)
    })

    // Delete from Cart Product
    app.delete('/cart/:id', async (req, res) => {
        const id = req.params.id;
        const result = await cart.deleteOne({ _id: ObjectId(id) });
        res.send(result)
    })
}
run().catch(err => console.log(err))


app.listen(port, () => {
    console.log("REPLIQ server running in ", port)
})