require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_pass}@cluster0.ek5qasv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const touristSpotCollection = client
      .db("RoamVista_DB")
      .collection("tourist_spot");
    const countryCollection = client
      .db("RoamVista_DB")
      .collection("country_info");

    app.get("/", (req, res) => {
      res.send("this is a response from the server");
    });

    app.get("/all-tourist-spot", async (req, res) => {
      const cursor = await touristSpotCollection.find();
      const documents = await cursor.toArray();
      res.send(documents);
    });

    app.get("/country", async (req, res) => {
      const cursor = await countryCollection.find();
      const documents = await cursor.toArray();
      res.send(documents);
    });
    app.get("/spot-in-the-country/:country_name", async (req, res) => {
      const cursor = await touristSpotCollection.find({
        country_name: req.params.country_name,
      });
      const documents = await cursor.toArray();
      res.send(documents);
    });
    app.get("/my-list/:email", async (req, res) => {
      const cursor = await touristSpotCollection.find({
        user_email: req.params.email,
      });
      const documents = await cursor.toArray();
      res.send(documents);
    });

    app.post("/add-tourist-spot", async (req, res) => {
      const spot = req.body;
      const result = await touristSpotCollection.insertOne(spot);
      res.send(result);
    });
    app.get("/update-spot/:id", async (req, res) => {
      const id = req.params.id;
      const documents = await touristSpotCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(documents);
    });

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const documents = await touristSpotCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(documents);
    });
    app.delete("/delete-document", async (req, res) => {
      const id = req.body.id;
      const result = await touristSpotCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.get("/ascending_sort", async (req, res) => {
      const documents = await touristSpotCollection
        .find()
        .sort({ average_cost: 1 })
        .toArray();
      res.send(documents);
    });
    app.get("/descending_sort", async (req, res) => {
      const documents = await touristSpotCollection
        .find()
        .sort({ average_cost: -1 })
        .toArray();
      res.send(documents);
    });
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("server is running at port ", port);
});
