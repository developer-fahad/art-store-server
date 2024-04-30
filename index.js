const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
// https://art-store-53fcb.web.app
// art-store-server.vercel.app/paintings
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174','https://art-store-53fcb.web.app'],
    credentials: true,
    optionSuccessStatus: 200,
  }
  app.use(cors(corsOptions))
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pbz3kui.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    const paintingsCollection = client.db('paintingsDB').collection('paintings');
    const catCollection = client.db('catDB').collection('cat');

    app.post('/allcat', async(req, res) =>{
      const newCat = req.body;
      console.log(newCat);
      const result = await catCollection.insertOne(newCat);
      res.send(result)
  })


    app.get('/allcat', async(req, res) =>{
    const cursor = catCollection.find();
    const result = await cursor.toArray();
    res.send(result)
    })

    app.get('/allcat/:cat', async(req, res) =>{
      const cat = req.params.cat;
      const query = {category: cat}
      const result = await catCollection.findOne(query)
      res.send(result)
   })


    app.get('/paintings', async(req, res) =>{
        const cursor = paintingsCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })


    app.get('/paintings/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await paintingsCollection.findOne(query)
        res.send(result)
    })


    


    app.put('/paintings/:id', async(req, res) =>{
      const id = req.params.id;
      const updatedPainting = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const painting = {
        $set: {
          name: updatedPainting.name,
          category: updatedPainting.category,
          description: updatedPainting.description,
          price: updatedPainting.price,
          rating: updatedPainting.rating,
          process: updatedPainting.process,
          user: updatedPainting.user,
          email: updatedPainting.email,
          photo: updatedPainting.photo,
          customization: updatedPainting.customization,
          stock: updatedPainting.stock,
        }
      }
      const result = await paintingsCollection.updateOne(filter, painting, options);
      res.send(result)

    })


    app.delete('/paintings/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await paintingsCollection.deleteOne(query);
        res.send(result);
    })

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error

  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send("Art store server is running....")
})

app.listen(port, () =>{
    console.log(`Art store server is running on port: ${port}`);
})