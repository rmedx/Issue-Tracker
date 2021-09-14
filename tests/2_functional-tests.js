const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { test } = require('mocha');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);
    let tester_id;
    // Create an issue with every field: POST request to /api/issues/{project}
    test('1 Create an issue with every field: POST request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .post('/api/issues/testproject')
            .type('form')
            .send({
                'issue_title': 'testtitle',
                'issue_text': 'testtext',
                'created_by': 'testcb',
                'assigned_to': 'testat',
                'status_text': 'testst'})
            .end((err, res) => {
                tester_id = res.body._id;
                assert.equal(res.status, 200)
                assert.equal(res.type, "application/json");
                assert.isObject(res.body);
                assert.equal(Object.keys(res.body).length, 9);
                assert.property(res.body, "_id");
                assert.equal(res.body.issue_title, 'testtitle');
                assert.equal(res.body.issue_text, 'testtext'); 
                assert.equal(res.body.created_by, 'testcb');
                assert.equal(res.body.assigned_to, 'testat');
                assert.equal(res.body.status_text, 'testst');
                done();
            })
    });
    // Create an issue with only required fields: POST request to /api/issues/{project}
    test('2 Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .post('/api/issues/testproject')
            .type('form')
            .send({
                'issue_title': 'testtitle',
                'issue_text': 'testtext',
                'created_by': 'testcb'})
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.equal(res.type, "application/json");
                assert.isObject(res.body);
                assert.equal(Object.keys(res.body).length, 9);
                assert.property(res.body, "_id");
                assert.equal(res.body.issue_title, 'testtitle');
                assert.equal(res.body.issue_text, 'testtext');
                assert.equal(res.body.created_by, 'testcb');
                assert.equal(res.body.assigned_to, '');
                assert.equal(res.body.status_text, '');
                done();
            })
    });
    // Create an issue with missing required fields: POST request to /api/issues/{project}
    test('3 Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .post('/api/issues/testproject')
            .type('form')
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.equal(res.type, "application/json");
                assert.isObject(res.body);
                assert.equal(res.body.error, 'required field(s) missing');
                done();
            })
    });
    // View issues on a project: GET request to /api/issues/{project}
    test('4 View issues on a project: GET request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .get('/api/issues/testproject')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.isArray(res.body);
                assert.notEqual(res.body.length, 0);
                done();
            });
    });
    // View issues on a project with one filter: GET request to /api/issues/{project}
    test('5 View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .get('/api/issues/testproject?title=testtitle')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.isArray(res.body);
                assert.notEqual(res.body.length, 0);
                done();
            });
    });
    // View issues on a project with multiple filters: GET request to /api/issues/{project}
    test('6 View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .get('/api/issues/testproject?title=testtitle&created_by=testcb')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.isArray(res.body);
                assert.notEqual(res.body.length, 0);
                done();
            });
    });
    // Update one field on an issue: PUT request to /api/issues/{project}
    test('7 Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .put('/api/issues/testproject')
            .send({_id: tester_id, issue_title: "testtitle2"})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.isObject(res.body);
                assert.equal(res.body.result, "successfully updated");
                done();
            });
    });    
    // Update multiple fields on an issue: PUT request to /api/issues/{project}
    test('8 Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .put('/api/issues/testproject')
            .send({_id: tester_id, issue_title: "testtitle3", issue_text: "testtext3"})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.isObject(res.body);
                assert.equal(res.body.result, "successfully updated");
                done();
            });
    }); 
    // Update an issue with missing _id: PUT request to /api/issues/{project}
    test('9 Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .put('/api/issues/testproject')
            .send({issue_title: "testtitle3", issue_text: "testtext3"})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.isObject(res.body);
                assert.equal(res.body.error, "missing _id");
                done();
            });
    }); 
    // Update an issue with no fields to update: PUT request to /api/issues/{project}
    test('10 Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .put('/api/issues/testproject')
            .send({_id: tester_id})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.isObject(res.body);
                assert.equal(res.body.error, "no update field(s) sent");
                done();
            });
    }); 
    // Update an issue with an invalid _id: PUT request to /api/issues/{project}
    test('11 Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .put('/api/issues/testproject')
            .send({_id: " ", issue_title: "testtitle4", issue_text: "testtext4"})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.isObject(res.body);
                assert.equal(res.body.error, "could not update");
                done();
            });
    }); 
    // Delete an issue: DELETE request to /api/issues/{project}
    test('12 Delete an issue: DELETE request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .delete('/api/issues/testproject')
            .send({_id: tester_id})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.isObject(res.body);
                assert.equal(res.body.result, "successfully deleted");
                done();
            });
    }); 
    // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
    test('13 Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .delete('/api/issues/testproject')
            .send({_id: " "})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.isObject(res.body);
                assert.equal(res.body.error, "could not delete");
                done();
            });
    }); 
    // Delete an issue with missing _id: DELETE request to /api/issues/{project}
    test('14 Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .delete('/api/issues/testproject')
            .send({})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.isObject(res.body);
                assert.equal(res.body.error, "missing _id");
                done();
            });
    });     
});
