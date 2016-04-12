/**
 * Created by COMP on 12-04-2016.
 */

var express = require('express');

var router=express.Router();
var mongoose = require('mongoose');

//  model
var Query= require('../../models/dbConfig').queryModel;


// save the query Using Post call

router.post('/', function (req,res){

    console.log("Inside the post save Query Function");

    return Query.create(req.body,function(err,newQueryCreated){
        console.log('Inside CreateQuery');
        if(err){
            console.log("Error");
            res.status(500).send(err);
        }

        console.log("su" + JSON.stringify(newQueryCreated));
        return res.status(201).json(newQueryCreated);
    });

});


router.get('/:id', function(req, res) {
    return querySchema.findById('req.params.id', function(err, retreivedQuery) {
        if(err) { return res.status(500).send(); }
        if(!retreivedQuery) { return res.status(404); }
        return res.status(200).json(retreivedQuery);
    });
});
module.exports = router;
