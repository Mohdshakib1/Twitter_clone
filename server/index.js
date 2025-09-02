const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt"); // for password hashing

const uri =
  "mongodb+srv://admin:admin@twitter.6iuh4wk.mongodb.net/?retryWrites=true&w=majority&appName=Twitter";
const port = 5000;

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri);

// password generator (only A-Z + a-z)
function generateRandomPassword(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

async function run() {
  try {
    await client.connect();
    const postcollection = client.db("database").collection("posts");
    const usercollection = client.db("database").collection("users");

    // Register new user
    app.post("/register", async (req, res) => {
      const user = req.body;
      const result = await usercollection.insertOne(user);
      res.send(result);
    });

    // Get logged in user by email
    app.get("/loggedinuser", async (req, res) => {
      const email = req.query.email;
      const user = await usercollection.findOne({ email: email });
      res.send(user);
    });

    // Forgot Password route
    app.post("/forgot-password", async (req, res) => {
      try {
        const { email, phone } = req.body;

        // Find user by email or phone
        const user = await usercollection.findOne({
          $or: [{ email: email }, { phone: phone }],
        });

        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        const now = new Date();
        if (user.lastPasswordReset) {
          const diffHours = (now - new Date(user.lastPasswordReset)) / (1000 * 60 * 60);
          if (diffHours < 24) {
            return res
              .status(403)
              .send({ message: "Password reset allowed only once per day!" });
          }
        }

        // Generate new random password
        const newPass = generateRandomPassword();
        const hashed = await bcrypt.hash(newPass, 10);

        // Update in DB
        await usercollection.updateOne(
          { _id: user._id },
          { $set: { password: hashed, lastPasswordReset: now } }
        );

        // Send email with new password
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL,
          to: user.email,
          subject: "Your New Password - Twiller Clone",
          html: `
            <h3>Hello ${user.email},</h3>
            <p>Your new password is: <b>${newPass}</b></p>
            <p>Please login and change it immediately.</p>
          `,
        });

        res.send({ message: "New password sent to your email." });
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
      }
    });

    // Post tweet
    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postcollection.insertOne(post);
      res.send(result);
    });

    // Get all posts
    app.get("/post", async (req, res) => {
      const post = (await postcollection.find().toArray()).reverse();
      res.send(post);
    });

    // Get posts of specific user
    app.get("/userpost", async (req, res) => {
      const email = req.query.email;
      const post = (await postcollection.find({ email: email }).toArray()).reverse();
      res.send(post);
    });

    // Get all users
    app.get("/user", async (req, res) => {
      const user = await usercollection.find().toArray();
      res.send(user);
    });

    // Update user
    app.patch("/userupdate/:email", async (req, res) => {
      const filter = { email: req.params.email };
      const profile = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: profile };
      const result = await usercollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Twiller is working");
});

app.listen(port, () => {
  console.log(`Twiller clone is working on ${port}`);
});
