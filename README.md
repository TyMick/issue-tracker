# Issue tracker microservice

I created this app as a requirement for [my freeCodeCamp Information Security and Quality Assurance Certification](https://www.freecodecamp.org/certification/tywmick/information-security-and-quality-assurance), using [Node.js](https://nodejs.org/en/), [Express](https://expressjs.com/), [MongoDB](https://mongodb.github.io/node-mongodb-native/), [Chai](https://www.chaijs.com/), and [Helmet](https://helmetjs.github.io/). The front end API tests on the home page also use [Bootstrap](https://getbootstrap.com/), [jQuery](https://jquery.com/), and [highlight.js](https://highlightjs.org/).

You can read the functional tests I wrote on [GitHub](https://github.com/tywmick/issue-tracker/tree/glitch/tests/2_functional-tests.js) or [Glitch](https://glitch.com/edit/#!/ty-issue-tracker?path=tests/2_functional-tests.js). To run the tests yourself, create a MongoDB database, fork/remix this project, create a `.env` file with `DB="{your MongoDB URI}"` and `NODE_ENV="test"`, start the server, and look at the server console logs.

This project fulfills the following user stories:

1.  Prevent cross site scripting(XSS attack).
2.  I can **POST** `/api/issues/{projectname}` with form data containing required `issue_title`, `issue_text`, `created_by`, and optional `assigned_to` and `status_text`.
3.  The object saved (and returned) will include all of those fields (blank for optional no input) and also include `created_on` (date/time), `updated_on` (date/time), `open` (boolean, `true` for open, `false` for closed), and `_id`.
4.  I can **PUT** `/api/issues/{projectname}` with a `_id` and any fields in the object with a value to object said object. Returned will be `"successfully updated"` or `"could not update " + _id`. This should always update `updated_on`. If no fields are sent return `"no updated field sent"`.
5.  I can **DELETE** `/api/issues/{projectname}` with a `_id` to completely delete an issue. If no `_id` is sent return `"_id error"`, success: `"deleted " + _id`, failed: `"could not delete " + _id`.
6.  I can **GET** `/api/issues/{projectname}` for an array of all issues on that specific project with all the information for each issue as was returned when posted.
7.  I can filter my get request by also passing along any field and value in the query (e.g., `/api/issues/{project}?open=false`). I can pass along as many fields/values as I want.
8.  All 11 functional tests are complete and passing.
