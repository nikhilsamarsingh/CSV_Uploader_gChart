var express	=	require("express");
var multer	=	require('multer');
var csv 	=	require('csv-parse'); 
var fs		=	require('fs');


var app	=	express();      
var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage}).single('userFile');

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});
app.get('/charts',function(req,res){
      res.sendFile(__dirname + "/charts.html");
});

app.get('/api/GraphData',function(req,res){
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("marks").find({}).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
    db.close();
  });
});
});



app.post('/api/file',function(req,res){
	upload(req,res,function(err) {
		if(err) {
			return res.end("Error uploading file.");
		}
		
		var file = req.file;
		fs.createReadStream(file.path).pipe(csv()).on('data', function (data){
		i=0;
		var fdata=[];
		data.forEach(function (marks){
			if(marks !=="" && Object.keys(data).length > 0)
			{
			fdata.push(marks);
			//console.log(marks);
			}
		}); 
					
		
		if(Object.keys(fdata).length>1)
		{
console.log(typeof(fdata));
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
		MongoClient.connect(url, function(err, db) {
  				if (err) throw err;
				 collName = "marks";
				ddata = {1:fdata}
  				db.collection(collName).insert(ddata, function(err, res) {
    				if (err) throw err;
    				console.log("1 record inserted");
    				db.close();
  				});
			});
		}
		});

		res.end("File is uploaded");

	});
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});

