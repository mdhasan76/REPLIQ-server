const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config()

const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middware 
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("REPLIQ server running");
})


const verifyjwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send("protomei error khaiso")
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.USER_JWT, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Forbiden access" })
        }
        req.decoded = decoded;
        // console.log('supply decoded', req.decoded)
        next()
    })
}

const uri = `mongodb+srv://${process.env.SECRET_DB_id}:${process.env.SECRET_DB_pass}@cluster0.dof2kcq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    const productsCollection = client.db('REPLIQ_Task').collection("Products");
    const users = client.db('REPLIQ_Task').collection("users");
    const cart = client.db('REPLIQ_Task').collection("Cart");
    const orders = client.db('REPLIQ_Task').collection("Orders");



    //jwt Token
    app.get('/jwt', async (req, res) => {
        const userMail = req.query.email;
        const query = { email: userMail };
        const user = await users.findOne(query);
        if (user) {
            const token = jwt.sign({ userMail }, process.env.USER_JWT, { expiresIn: '24h' });
            return res.send({ accessToken: token })
        }
        res.status(403).send({ accessToken: "" })
    })


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
        const result = await users.find({}).toArray();
        res.send(result);
    })

    // ALl cart view
    app.get('/cart/:email', async (req, res) => {
        const email = req.params.email;
        const result = await cart.find({orderBy: email}).toArray();
        res.send(result);
    })

    // Customer Dtails
    app.get('/users/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await users.findOne(query);
        res.send(result);
    })

    // Check Admin
    app.get('/users/admin/:email', async (req, res) => {
        const email = req.params.email;
        const query = {email: email};
        const result = await users.findOne(query);
        res.send({isAdmin: result?.type === "Admin"});
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


    // Add  New Order
    app.post('/orders', async(req, res) =>{
        const data = req.body;
        const result = await orders.insertOne(data);
        res.send(result);
    })

    // Add new Product 
    app.post('/addproduct', async (req, res) => {
        const data = req.body;
        const result = await productsCollection.insertOne(data);
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