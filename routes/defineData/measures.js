var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Namespace = require('../../models/dbConfig').namespaceModel;
// var measureList = [{
//   "dispName": "No of Hits"
// }, {
//   "dispName": "Failed Requests"
// }, {
//   "dispName": "Average Visitor Stay Length"
// }, {
//   "dispName": "Average Bandwidth per Day"
// }]
// /* GET Measures */
// measureRouter.get('/', function(req, res){
//  res.send(measureList);
//  });
/* GET Measures */
router.get('/', function(req, res) {
  if (req.session.oid !== null) {
    Namespace.findNamespace(req.session.oid, function(err, namespace) {
      if (namespace != null) {
        res.send(namespace.measures);
      }
    });
  }
});

/* POST Measures */
router.post('/addMeasure', function(req, res) {
  if (req.session.oid !== null) {
    Namespace.findNamespace(req.session.oid, function(err, namespace) {
      if (namespace != null) {
        var fieldEvent;
      //  console.log("radiovalue",req.body.measure);
        if (req.body.data.measure == "radioField") {
          fieldEvent = req.body.data.measureFieldSelector;
          fieldValue="";
        } else {
          fieldEvent = req.body.data.measField;
          fieldValue=req.body.data.measValue;
        }
        namespace.measures.push({
          displayName: req.body.data.displaymeasurename,
          measureType:req.body.data.measure,
          eventField: fieldEvent,
          eventValue: fieldValue
        });
        namespace.save(function(err, namespace) {
          console.log('namespace saved:', namespace);
        });
      }
    });
  }
  res.send(req.body)
  //res.redirect('/#/defineData');
});

/* Delete Measure */

router.post('/:id', function(req, res) {
  console.log("deleted value is", req.params.id);
  res.redirect('/');
});

module.exports = router;
