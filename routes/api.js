'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connect mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// schema for issue
const issueSchema = new Schema({
  project_name: {type: String},
  assigned_to: {type: String},
  status_text: {type: String},
  open: {type: Boolean, default: true},
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_by: {type: String, required: true},
  created_on: {type: String},
  updated_on: {type: String}
});
// model for issue
const Issue = mongoose.model('Issue', issueSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let query = req.query;
      query.project_name = project;
      Issue.find(query, (err, docs) => {
        if (err) {
          return console.log("error getting issue");
        }
        return res.send(docs);
      })
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let project_name = project;
      let assigned_to = req.body.assigned_to ? req.body.assigned_to : "";
      let status_text = req.body.status_text ? req.body.status_text : "";
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_by = req.body.created_by;
      let open = true;
      let created_on = new Date().toISOString();
      let updated_on = new Date().toISOString();
      let newIssue = new Issue({project_name, assigned_to, status_text, issue_title, issue_text, created_by, created_on, updated_on, open});
      newIssue.save((err, issue) => {
        if (err) {
          return res.send({ error: 'required field(s) missing' });
        } else {
          let response = {
            assigned_to: issue.assigned_to,
            status_text: issue.status_text,
            open: issue.open,
            _id: issue._id,
            issue_title: issue.issue_title,
            issue_text: issue.issue_text,
            created_by: issue.created_by,
            created_on: issue.created_on,
            updated_on: issue.updated_on
          }
          return res.json(response);
        }
      });
    })
    
    .put(function (req, res){
      // {  result: 'successfully updated', '_id': _id }
      // { error: 'missing _id' }
      // { error: 'no update field(s) sent', '_id': _id }
      // { error: 'could not update', '_id': _id }

      let project = req.params.project;
      let query = req.body;
      console.log("query");
      console.log(query);=
      let _id = query._id;
      delete query._id;
      let filtered_query = {};
      for (let key in query) {
        if (query[key] != "") {
          filtered_query[key] = query[key];
        }
      }
      console.log(filtered_query);
      if (_id == "") {
        console.log("no id");
        return res.send({ error: 'missing _id' });
      } else if (Object.keys(filtered_query).length == 0) {
        console.log("no field");
        return res.send({ error: 'no update field(s) sent', '_id': _id });
      } else {
        // const findEditThenSave = (personId, done) => {
        //   const foodToAdd = "hamburger";
        //   Person.findById(personId, (err, individual) => {
        //     if (err) {
        //       return done(err);
        //     }
        //     individual.favoriteFoods.push(foodToAdd);
        //     individual.save((err, individual) => {
        //       if (err) {
        //         return done(err);
        //       }
        //       done(null, individual);
        //     })
        //   });
        // };
        Issue.findById(_id).exec((err, issue) => {
          if (err) {
            console.log("no update");
            console.log("id: " + _id);
            return res.send({ error: 'could not update', '_id': _id });
          } else {
            for (let key in filtered_query) {
              issue[key] = filtered_query[key];
            }
            issue.save((err, doc) => {
              if (err) {
                console.log("no update 2");
                return res.send({ error: 'could not update', '_id': _id });
              } else {
                return res.send({  result: 'successfully updated', '_id': _id });
              }
            })
          }
        });
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
    });
    
};
