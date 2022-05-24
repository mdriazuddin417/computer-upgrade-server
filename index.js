// Mp8kKPh3ABIUUk5S

const cors = require("cors");
const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();
app.use(express.json());
app.use(cors());
const stripe = require("stripe")(
  "sk_test_51L1CCDGNqDr1x0jXfD1ulRKMbmTfNHYqb7xn3ZfkWdJSPbcLbe6HuvVoLLgQrPgaFNoqPpwvNeBoAqeCpJEprUam00bKzpYKvs"
);

app.use(express.static("public"));
app.use(express.json());

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
    const reviewCollection = client
      .db("computerUpgrade")
      .collection("all-reviews");
    const userCollection = client.db("computerUpgrade").collection("users");
    const paymentCollection = client
      .db("computerUpgrade")
      .collection("payments");

    ////Payment Methods
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    app.get("/users", async (req, res) => {
      const query = req.query;
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/add-user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne({ ...user });
      res.send(result);
    });

    app.get("/all-parts", async (req, res) => {
      const result = await partsCollection.find({}).toArray();
      res.send(result);
    });
    app.post("/part", async (req, res) => {
      const part = req.body;
      const result = await partsCollection.insertOne({ ...part });
      res.send(result);
    });

    app.get("/part/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await partsCollection.findOne(query);
      res.send(result);
    });

    app.get("/all-reviews", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
    });
    app.post("/add-review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne({ ...review });
      res.send(result);
    });

    app.get("/order", async (req, res) => {
      const query = req.query;
      const result = await orderCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/order", async (req, res) => {
      const parts = req.body;

      const result = await orderCollection.insertOne({
        ...parts,
      });
      res.send(result);
    });
    app.get("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.findOne(query);
      res.send(result);
    });
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };

      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
    app.patch("/order/:id", async (req, res) => {
      const id = req.params.id;
      const payment = req.body;
      const filter = { _id: ObjectId(id) };

      const updatedDoc = {
        $set: {
          ...payment,
        },
      };
      const updatedOrder = await orderCollection.updateOne(filter, updatedDoc);
      const result = await paymentCollection.insertOne(payment);
      res.send(updatedOrder);
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
