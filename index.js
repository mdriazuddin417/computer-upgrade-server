// Mp8kKPh3ABIUUk5S

const cors = require("cors");
const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();
app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://computerUpgrade:Mp8kKPh3ABIUUk5S@cluster0.we6w6.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const partsCollection = client
      .db("computerUpgrade")
      .collection("all-Parts");
    const orderCollection = client.db("computerUpgrade").collection("Order");

    app.get("/all-parts", async (req, res) => {
      const result = await partsCollection.find({}).toArray();
      res.send(result);
    });
    app.get("/all-reviews", async (req, res) => {
      const result = await partsCollection.find({}).toArray();
      res.send(result);
    });
    app.post("/order-parts", async (req, res) => {
      const parts = req.body;
      const result = await orderCollection.insertOne({ ...parts });
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("hello Computer upgrade Person");
});
app.listen(port, () => {
  console.log(port, "Example port is secure running");
});
