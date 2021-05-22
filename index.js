require("dotenv").config();
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const bodyParser = require("body-parser");
const cors = require("cors");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kbvgg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json());

client.connect((err) => {
  const clientDB = client.db(process.env.DB_NAME);
  const blogsCollection = clientDB.collection("blogs");
  const projectsCollection = clientDB.collection("projects");

  // ============= Blog Collection  ===========//
  // add
  app.post("/addBlog", (req, res) => {
    const data = req.body;
    const admin = req.headers.admin;

    const token = admin.split(" ");

    if (
      token[0] === process.env.API_SECRET_KEY &&
      token[1] === process.env.ADMIN_EMAIL
    ) {
      blogsCollection
        .insertOne(data)
        .then((result) => {
          res.send(result.insertedCount > 0);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.status(401).send("Unauthorize Access");
    }
  });

  // all blogs
  app.get("/blogs", (req, res) => {
    const filter = {};
    const showOnAbout = req.query.showOnAbout;
    console.log(showOnAbout);
    
    if (showOnAbout === "true") {
      filter.showOnAbout = true;
    }

    blogsCollection.find(filter).toArray((err, document) => {
      res.send(document);
    });
  });

  // one blog
  app.get("/blog/:id", (req, res) => {
    const id = req.params.id;

    blogsCollection.find({ _id: ObjectID(id) }).toArray((err, document) => {
      res.send(document[0]);
    });
  });

  // delete
  app.delete("/blogDeleteById/:id", (req, res) => {
    const id = req.params.id;
    const admin = req.headers.admin;

    const token = admin.split(" ");
    if (
      token[0] === process.env.API_SECRET_KEY &&
      token[1] === process.env.ADMIN_EMAIL
    ) {
      blogsCollection
        .deleteOne({ _id: ObjectID(id) })
        .then((result) => {
          res.send(result.deletedCount > 0);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.status(401).send("Unauthorize Access");
    }
  });

  // Update
  /*
    suppose we have {name: 'Rohim', roll: 40}
    we want to update only name to Rohim-Uddin
    if we use PUT // we should provide hole data {name: 'Rohim-Uddin', roll: 40}
    if we use PATCH // we can only name {name: 'Rohim-Uddin'}
    
    PATCH (update)
    PUT (replace)
  */
  app.patch("/blogUpdateById/:id", (req, res) => {
    const id = req.params.id;
    const admin = req.headers.admin;
    const data = req.body;
    // console.log(data);

    const token = admin.split(" ");
    if (
      token[0] === process.env.API_SECRET_KEY &&
      token[1] === process.env.ADMIN_EMAIL
    ) {
      blogsCollection
        .updateOne({ _id: ObjectID(id) }, { $set: data })
        .then((result) => {
          // console.log(result);
          res.send(result.modifiedCount > 0);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.status(401).send("Unauthorize Access");
    }
  });

  // ============= Project Collection  ===========//
  // add
  app.post("/addProject", (req, res) => {
    const data = req.body;
    const admin = req.headers.admin;

    const token = admin.split(" ");
    if (
      token[0] === process.env.API_SECRET_KEY &&
      token[1] === process.env.ADMIN_EMAIL
    ) {
      projectsCollection
        .insertOne(data)
        .then((result) => {
          res.send(result.insertedCount > 0);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.status(401).send("Unauthorize Access");
    }
  });

  // all project
  app.get("/projects/:category", (req, res) => {
    const filter = {};
    const showOnAbout = req.query.showOnAbout;
    const category = req.params.category || "all";
    if (category.toLowerCase() !== "all") {
      filter.category = category;
    }
    if (showOnAbout === "true") {
      filter.showOnAbout = true;
    }
    // console.log(typeof showOnTop);

    projectsCollection.find(filter).toArray((err, document) => {
      res.send(document);
    });
  });

  // one Project
  app.get("/project/:id", (req, res) => {
    const id = req.params.id;

    projectsCollection.find({ _id: ObjectID(id) }).toArray((err, document) => {
      res.send(document[0]);
    });
  });

  // delete
  app.delete("/projectDeleteById/:id", (req, res) => {
    const id = req.params.id;
    const admin = req.headers.admin;

    const token = admin.split(" ");

    if (
      token[0] === process.env.API_SECRET_KEY &&
      token[1] === process.env.ADMIN_EMAIL
    ) {
      projectsCollection
        .deleteOne({ _id: ObjectID(id) })
        .then((result) => {
          res.send(result.deletedCount > 0);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.status(401).send("Unauthorize Access");
    }
  });

  // Update
  /*
    suppose we have {name: 'Rohim', roll: 40}
    we want to update only name to Rohim-Uddin
    if we use PUT // we should provide hole data {name: 'Rohim-Uddin', roll: 40}
    if we use PATCH // we can only name {name: 'Rohim-Uddin'}
    
    PATCH (update)
    PUT (replace)
  */
  app.patch("/projectUpdateById/:id", (req, res) => {
    const id = req.params.id;
    const admin = req.headers.admin;
    const data = req.body;
    // console.log(data);

    const token = admin.split(" ");
    if (
      token[0] === process.env.API_SECRET_KEY &&
      token[1] === process.env.ADMIN_EMAIL
    ) {
      projectsCollection
        .updateOne({ _id: ObjectID(id) }, { $set: data })
        .then((result) => {
          // console.log(result);
          res.send(result.modifiedCount > 0);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.status(401).send("Unauthorize Access");
    }
  });
});

app.get("/", (req, res) => {
  res.send("Portfolio API");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Portfolio app listening at http://localhost:${port}`);
});
