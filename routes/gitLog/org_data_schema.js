var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
    commitDate:{
            type:Date,
            required:true
        },
        noOfFiles:{
          type:Number
        },
        insertion:{
          type:Number
        },
        deletion:{
          type:Number
        },
        repo: {
          type: String
        },
        gitRepoId:{
            type: String
        },
        gitUserName: {
          type: String
        },
        reviewers:[{
              name:{
                type:String
              },
              email:{
                type:String
                //match : /.+@.+\..+/
              }
        }],
        committer:{
              name:{
                type:String
              },
              email:{
                type:String
                //match : /.+@.+\..+/
              },
              gitUserId:{
                type:Number
              }
        },
        author:{
              name:{
                type: String
              },
              email:{
                type: String
              //  match : /.+@.+\..+/
              },
              gitUserId:{
                type: Number
              }
        },
        commitId: {
          type: String
        },
        time : {
          type: Date
        }
},{strict:false});
