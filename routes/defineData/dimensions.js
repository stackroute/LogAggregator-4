var express = require('express');
var dimensionRouter = express.Router();
var mongoose = require('mongoose');
var Namespace = require('../../models/dbConfig').namespaceModel;



/* POST Dimension */

dimensionRouter.post('/addDimension', function(req, res) {
  Namespace.findNamespaceName(req.body.data.namespaceName, function(err, namespace) {
    if (namespace != null) {
      namespace.dimensions.push({
        displayName: req.body.data.displayName,
        fieldName: req.body.data.fieldname
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

/*delete*/
dimensionRouter.post('/delete', function(req, res) {
  console.log("deleted value is", req.body.data.dimName);
  console.log(req.body.data.namespaceName);
  var namespaceID;
  Namespace.findNamespaceName(req.body.data.namespaceName, function(err, namespace) {
    console.log(namespace);
    namespaceID=namespace._id;
    console.log(namespaceID);
    Namespace.findByIdAndUpdate(namespaceID, {
      $pull: {
        dimensions: {
          displayName: req.body.data.dimName
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
  // console.log(namespaceID);
  // Namespace.findByIdAndUpdate(namespaceID, {
  //   $pull: {
  //     dimensions: {
  //       displayName: req.body.data.dimName
  //     }
  //   }
  // }, function(err) {
  //   console.log(err);
  // });


    // Namespace.findAndModify(req.body.data.namespaceName, {
    //   $pull: {
    //     dimensions: {
    //       displayName: req.body.data.dimName
    //     }
    //   }
    // }, function(err) {
    //   console.log(err);
    // });
});
module.exports = dimensionRouter;
