/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  let id1, id2;

  suite("POST /api/issues/{project} => object with issue data", () => {
    test("Every field filled in", done => {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA"
        })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.property(res.body, "issue_title");
          assert.strictEqual(res.body.issue_title, "Title");
          assert.property(res.body, "issue_text");
          assert.strictEqual(res.body.issue_text, "text");
          assert.property(res.body, "created_by");
          assert.strictEqual(
            res.body.created_by,
            "Functional Test - Every field filled in"
          );
          assert.property(res.body, "assigned_to");
          assert.strictEqual(res.body.assigned_to, "Chai and Mocha");
          assert.property(res.body, "status_text");
          assert.strictEqual(res.body.status_text, "In QA");
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          assert.property(res.body, "open");
          assert.strictEqual(res.body.open, true);
          assert.property(res.body, "_id");
          id1 = res.body._id;
          done();
        });
    });

    test("Required fields filled in", done => {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title 2",
          issue_text: "More text",
          created_by: "The other guys"
        })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.property(res.body, "issue_title");
          assert.strictEqual(res.body.issue_title, "Title 2");
          assert.property(res.body, "issue_text");
          assert.strictEqual(res.body.issue_text, "More text");
          assert.property(res.body, "created_by");
          assert.strictEqual(res.body.created_by, "The other guys");
          assert.property(res.body, "assigned_to");
          assert.strictEqual(res.body.assigned_to, "");
          assert.property(res.body, "status_text");
          assert.strictEqual(res.body.status_text, "");
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          assert.property(res.body, "open");
          assert.strictEqual(res.body.open, true);
          assert.property(res.body, "_id");
          id2 = res.body._id;
          done();
        });
    });

    test("Missing required fields", done => {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title 3",
          issue_text: "We don't know who created this one",
          status_text: "Confused"
        })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "Missing required inputs");
          done();
        });
    });
  });

  suite("PUT /api/issues/{project} => text", () => {
    test("No body", done => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({ _id: id1 })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "no updated field sent");
          done();
        });
    });

    test("One field to update", done => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({ _id: id1, issue_text: "An updated text" })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "successfully updated");
          done();
        });
    });

    test("Multiple fields to update", done => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: id2,
          issue_text: "More updated text",
          status_text: "Nailed it",
          open: "false"
        })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "successfully updated");
          done();
        });
    });
  });

  suite("GET /api/issues/{project} => Array of objects with issue data", () => {
    test("No filter", done => {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "_id");
          done();
        });
    });

    test("One filter", done => {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ status_text: "In QA" })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.strictEqual(res.body[0].issue_text, "An updated text");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "status_text");
          assert.strictEqual(res.body[0].status_text, "In QA");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "_id");
          done();
        });
    });

    test("Multiple filters (test for multiple fields you know will be in the db for a return)", done => {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ open: false })
        .end((err, res) => {
          assert.strictEqual(res.status, 200, "Status isn't 200");
          assert.isArray(res.body, "res.body isn't an array");
          assert.property(res.body[0], "issue_title", "issue_title isn't there");
          assert.property(res.body[0], "issue_text", "issue_text isn't there");
          assert.property(res.body[0], "created_by", "created_by isn't there");
          assert.property(res.body[0], "assigned_to", "assigned_to isn't there");
          assert.property(res.body[0], "status_text", "status_text isn't there");
          assert.strictEqual(res.body[0].status_text, "Nailed it", "status_text isn't correct");
          assert.property(res.body[0], "created_on", "created_on isn't there");
          assert.property(res.body[0], "updated_on", "updated_on isn't there");
          assert.property(res.body[0], "open", "open isn't there");
          assert.strictEqual(res.body[0].open, false, "open isn't correct");
          assert.property(res.body[0], "_id", "_id isn't there");
          done();
        });
    });
  });

  suite("DELETE /api/issues/{project} => text", () => {
    test("No _id", done => {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({})
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "_id error");
          done();
        });
    });

    test("Valid _id", done => {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({ _id: id1 })
        .end((err, res) => {
          assert.strictEqual(res.status, 200);
          assert.strictEqual(res.text, "deleted " + id1);
          done();
        });
    });
  });
});
