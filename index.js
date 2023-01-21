const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middware 
app.use(express.json());
app.use(cors());

app.get('/', (req, res) =>{
    res.send("REPLIQ server running");
})

app.listen(port, () =>{
    console.log("REPLIQ server running in ", port)
})