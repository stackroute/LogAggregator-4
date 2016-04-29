var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Namespace = require('../../models/dbConfig').namespaceModel;


/* POST Measures */
router.post('/addMeasure', function(req, res) {
    Namespace.findNamespaceName(req.body.data.namespaceName, function(err, namespace) {
      if (namespace != null) {
        var fieldEvent;
        if (req.body.data.measure == "fieldMeasure") {
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
          // res.send(200).send();
        });
      }
    });
  //}
  res.send(req.body)
});

/* Delete Measure */

router.post('/delete', function(req, res) {
  console.log("deleted value is", req.body.data.measName);
  console.log(req.body.data.namespaceName);
  var namespaceID;
  Namespace.findNamespaceName(req.body.data.namespaceName, function(err, namespace) {
    console.log(namespace);
    namespaceID=namespace._id;
    console.log(namespaceID);
    Namespace.findByIdAndUpdate(namespaceID, {
      $pull: {
        measures: {
          displayName: req.body.data.measName
        }
      }
    }, function(err) {
      if (err) {
return res.send(500).json(err);
}
console.log(err + "error");
return res.send(200).send();
    });
  });
});

module.exports = router;
