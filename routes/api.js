var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var multer = require('multer');
var upload = multer({dest:"public/img/",
                     limits:{
                         fileSize: (1024 * 1024 * 5)
                     },
                     fileFilter: function(req, file, cb){
                         if(file.mimetype === "image/jpeg"){
                             cb(null, true);
                         }else{
                             cb(null, false);
                         }
                     }

                 });


function getAPIRoutes(db){
    var product_backlog = db.collection('producto_backlog');

    router.get('/do', function(req, res) {
      res.status(500).json({"error":"No Implementado"});
    });

    router.get('/getbacklog', function(req, res) {
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

    router.get("/getOneBacklog/:backlogId", function(req,res){
        var query = {_id: new ObjectID(req.params.backlogId)};
        product_backlog.findOne(query,function(err, doc){
            if(err){
                res.status(500).json({"error":"Error al extraer el Backlog"});
            }else{
                res.status(200).json(doc);
            }
        });
    });

    router.post("/upload",
                upload.single('userpic'),
                function(req,res){
                        console.log(req.file);
                        console.log(req.body);
                        var query = {_id: new ObjectID(req.body.backlogid)};
                        product_backlog.updateOne(
                            query,
                            {"$push":{"evidences":("img/" + req.file.filename)}},
                            {w:1},
                            function(err,result){
                                if(err){
                                    res.status(500).json({"error":err});
                                }else{
                                    res.status(200).json({"path":("img/"+req.file.filename)});
                                }
                            }
                        );
                });
    return router;
} //getAPIRoutes

module.exports = getAPIRoutes;
