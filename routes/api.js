'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connect mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// schema for issue
const issueSchema = new Schema({
  assigned_to: {type: String},
  status_text: {type: String},
  open: {type: Boolean},
  issue_title: {type: String, unique: true, required: true},
  issue_text: {type: String, required: true},
  created_by: {type: String, required: true},
  created_on: {type: String},
  updated_on: {type: String},
});
// model for issue
const Issue = mongoose.model('Issue', issueSchema);

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      console.log("get");
      console.log(project);
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let assigned_to = req.body.assigned_to;
      let status_text = req.body.status_text;
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_by = req.body.created_by;
      let open = true;
      let created_on = new Date().toISOString();
      let updated_on = new Date().toISOString();
      let newIssue = new Issue({assigned_to, status_text, issue_title, issue_text, created_by, created_on, updated_on, open});
      newIssue.save((err, issue) => {
        if (err) {
          return console.log("error saving issue");
        } else {
          console.log("issue =>");
          console.log(issue);
          return res.json(issue);
        }
      });
      console.log("post");
      console.log(req.body);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      console.log("put");
      console.log(project.title);
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      console.log("del");
      console.log(project);
    });
    
};
