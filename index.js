const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());





const uri = "mongodb+srv://productcrud:rQtwG6GE6jf5WXbC@cluster0.axoxgat.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const productCollection = client.db('productMongoCRUD').collection('products');

        // const product = {
        //     name: "Samsung Mobile",
        //     price: "72000 Taka"
        // }
        // const result = await productCollection.insertOne(product);
        // console.log(result);


        //send products to database (CRUD er Create Operation)
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log(product);

            const result = await productCollection.insertOne(product);
            res.send(result);
            console.log(result);
        })


        //get all products from database (CRUD er Read Operation)
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })


        //delete single product from database and also from client side (CRUD er Delete Operation)
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Trying to Delete ID", id)

            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
            console.log(result);
        })

        //Update single product from client side.. It will also update on the server side (CRUD er Update Operation)
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const product = req.body;
            console.log(product);

            const option = {upsert: true};
            const updatedProduct = {
                $set: {
                    name: product.name,
                    photoURL: product.photoURL,
                    quantity: product.quantity
                }
            }

            const result = await productCollection.updateOne(filter, updatedProduct, option);
            res.send(result);
        })
    }

    finally {

    }
}
run().catch(error => console.log(error))








app.get('/', (req, res) => {
    res.send("Product CRUD server is running")
})

app.listen(port, () => {
    console.log(" Server is running on port", port)
})