/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const expect = require("chai").expect;
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const dbName = "issuetracker";

module.exports = app => {
  app
    .route("/api/issues/:project")

    // Get issues for a project
    .get(async (req, res) => {
      // Extract filters from form
      let filters = req.query;
      if (filters._id) {
        filters._id = new ObjectId(filters._id);
      }
      if (filters.open) {
        filters.open = filters.open == "true";
      }
      if (filters.created_on) {
        filters.created_on = new Date(filters.created_on);
      }
      if (filters.updated_on) {
        filters.updated_on = new Date(filters.updated_on);
      }

      // Find and return filtered results
      const client = new MongoClient(process.env.DB, {
        useUnifiedTopology: true
      });
      try {
        await client.connect();
        const db = client.db(dbName);

        const issues = await db
          .collection(req.params.project)
          .find(filters, { sort: [["updated_on", -1]] })
          .toArray();
        res.json(issues);
      } catch (e) {
        console.log(e);
        res.send("Database error");
      }

      client.close();
    })

    // Add new issue
    .post(async (req, res) => {
      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.send("Missing required inputs");
      }

      const client = new MongoClient(process.env.DB, {
        useUnifiedTopology: true
      });
      try {
        await client.connect();
        const db = client.db(dbName);

        const r = await db.collection(req.params.project).insertOne({
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || "",
          status_text: req.body.status_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          open: true
        });
        res.json(r.ops[0]);
      } catch (e) {
        console.log(e);
        res.send("Database error");
      }

      client.close();
    })

    // Update issues
    .put(async (req, res) => {
      // Extract updates from form
      let updates = Object.assign({}, req.body);
      delete updates._id;
      for (let e in updates) {
        if (!updates[e]) {
          delete updates[e];
        }
      }
      if (updates.open) {
        updates.open = updates.open == "true";
      }

      // Handle no updated fields
      if (Object.keys(updates).length === 0) {
        return res.send("no updated field sent");
      }

      // Update issue in database
      updates.updated_on = new Date();

      const client = new MongoClient(process.env.DB, {
        useUnifiedTopology: true
      });
      try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(req.params.project);

        const result = await col.updateOne(
          { _id: new ObjectId(req.body._id) },
          { $set: updates }
        );
        if (result.modifiedCount === 1) {
          res.send("successfully updated");
        } else {
          res.send("_id " + req.body._id + " does not exist");
        }
      } catch (e) {
        console.log(e);
        res.send("could not update " + req.body._id);
      }

      client.close();
    })

    // Delete issues
    .delete(async (req, res) => {
      if (!req.body._id) {
        return res.send("_id error");
      }

      const client = new MongoClient(process.env.DB, {
        useUnifiedTopology: true
      });
      try {
        await client.connect();
        const db = client.db(dbName);

        const result = await db
          .collection(req.params.project)
          .deleteOne({ _id: new ObjectId(req.body._id) });
        if (result.deletedCount === 1) {
          res.send("deleted " + req.body._id);
        } else {
          res.send("_id " + req.body._id + " does not exist");
        }
      } catch (e) {
        console.log(e);
        res.send("could not delete " + req.body._id);
      }

      client.close();
    });
};
