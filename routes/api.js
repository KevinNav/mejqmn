var express = require('express');
var router = express.Router();


function getAPIRoutes(db){
    var product_backlog = db.collection('producto_backlog');

    router.get('/do', function(req, res) {
      res.status(500).json({"error":"No Implementado"});
    });

    router.get('/getorphanbacklog', function(req, res) {
      product_backlog.find({}).toArray(function(err, docs){
          res.status(200).json(docs);
      });
    });

    router.post('/addtobacklog',function(req,res){
        var doc = {
            code:req.body.code,
            description:req.body.description,
            owner:req.body.owner,
            storyPoints:parseInt(req.body.storypoints)
        };
        product_backlog.insertOne(doc, function(err,result){
            if(err){
                res.status(500).json({error:err});
            }else{
                res.status(200).json({resultado:result});
            }
        });
    });

    return router;
} //getAPIRoutes

module.exports = getAPIRoutes;
