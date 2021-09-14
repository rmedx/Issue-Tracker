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
      let project = req.params.project;
      let query = req.body;
      if (!query._id) {
        return res.send({ error: 'missing _id' });
      } else if (Object.keys(query).length == 1) {
        return res.send({ error: 'no update field(s) sent', '_id': query._id });
      } else {
        query["updated_on"] = new Date().toISOString();
        Issue.findById(query._id).exec((err, issue) => {
          if (err) {
            return res.send({ error: 'could not update', '_id': query._id });
          } else {
            if (issue == null) {
              return res.send({ error: 'could not update', '_id': query._id });
            }
            for (let key in query) {
              if (key != "_id") {
                issue[key] = query[key];
              }
            }
            issue.save((err, doc) => {
              if (err) {
                return res.send({ error: 'could not update', '_id': query._id });
              } else {
                return res.send({  result: 'successfully updated', '_id': query._id });
              }
            })
          }
        });
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      if (req.body_id == "") {
        return res.send({ error: 'missing _id' });
      } else if (Object.keys(req.body).length == 0) {
        return res.send({ error: 'missing _id' });
      } else {
        Issue.findByIdAndRemove(req.body._id).exec((err, docs) => {
          if (err) {
            return res.send({ error: 'could not delete', '_id': req.body._id });
          } else {
            return docs ? res.send({ result: 'successfully deleted', '_id': req.body._id }) : res.send({ error: 'could not delete', '_id': req.body._id });
          }
        });
      }
    });
};
