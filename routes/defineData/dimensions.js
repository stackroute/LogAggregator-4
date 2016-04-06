var express = require('express');
var dimensionRouter = express.Router();
// var mongoose = require('mongoose');
// var Namespace = require('../model/db').namespaceModel;

var dimList = [{
  "dispName": "Path",
  "fieldName": "request"
}, {
  "dispName": "User",
  "fieldName": "username"
}, {
  "dispName": "Browser",
  "fieldName": "user_agent"
}, {
  "dispName": "Timestamp",
  "fieldName": "datetime"
}];

dimensionRouter.get('/', function(req, res) {
  res.send(dimList);
});

// /* GET Dimensions */
// dimensionRouter.get('/', function(req, res) {
//   if(req.session.oid!==null){
//   Namespace.findNamespace(req.session.oid, function(err, namespace) {
//     if (namespace != null) {
//       res.send(namespace.dimensions);
//     }
//   });
// }
// });
//
// /* POST Dimension */
//
// dimensionRouter.post('/addDimension', function(req, res) {
//   if (req.session.oid !== null) {
//   Namespace.findNamespace(req.session.oid, function(err, namespace) {
//     if (namespace != null) {
//       namespace.dimensions.push({
//         displayName: req.body.displayname,
//         fieldName: req.body.fieldname
//       });
//
//       namespace.save(function(err, namespace) {
//         console.log('namespace saved:', namespace);
//       });
//     }
//   });
// }
//   res.redirect('/');
// });
//
// /*delete*/
// dimensionRouter.post('/delete/:id', function(req, res) {
//   console.log("deleted value is", req.params.id);
//   // Namespace.findNamespace('test_namespace', function(err, namespace) {
//   //   if (namespace != null) {
//   //     var length = namespace.dimensions.length;
//   //     for(var i =0 ;i<length-1;i++)
//   //     {
//   //       if(namespace.dimensions[i].displayname===req.params.id)
//   //       {
//   //
//   //       }
//   //       break;
//   //     }
//   //   }
//   // });
//   res.redirect('/');
// });
// /*update*/
// dimensionRouter.post('/update/:id', function(req, res) {
//   //console.log("updated value is", req.params.id);
//     if (req.session.oid !== null) {
//
//       Namespace.update({'dimensions._id': req.params.id}, {'$set': {
//       'dimensions.$.displayName': 'updated item2'
//       }},function(err, dimension){
//         if(!err)
//         {
//           console.log('updated dimension'+ dimension);
//         }
//         else
//           {
//             console.log('error in update');
//           }
//       });
//     }
//
//
//   res.redirect('/');
// });


module.exports = dimensionRouter;
