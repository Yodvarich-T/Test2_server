var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var multer = require("multer");
var fs = require("fs");
var path = require("path");
var app = express();

var profile = null;

app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: [
      'http://localhost:4200',
      '*'
    ],
    credentials: true
  }));

  const storage = multer.diskStorage(
    {
        destination: ((req, file, callback) => {
            callback(null, './storage/')
        }),
        filename: ((req, file, callback) => {
            callback(null, file.originalname)
        })
    }
);

const upload = multer({storage: storage});

app.get("/profile", (req,res,next) => {
    try{
        res.json(profile);
    }catch{
        res.sendStatus(500);
    }
})
    .post("/profile", (req,res,next) => {
        try{
        console.log(req.body);
        profile = req.body;
        res.json({message: "ok"});
        }catch{
            res.sendStatus(500);
        }
    })

app.post('/image', upload.single('image'), (req, res) => {
    if (!req.file) {
      console.log("No file received");
      return res.send({
        success: false
      });
  
    } else {
    res.send({
        success: true
      })
    }
  })
    .get("/image", (req, res) => {
        fs.readFile('./storage/image.png', function (err, content) {
            if (err) {
                res.writeHead(400, { 'Content-type': 'text/html' })
                console.log(err);
                res.end("No such image");
            } else {
                res.writeHead(200, { 'Content-type': 'image/jpg' });
                res.end(content);
            }
        });
    })

    app.post('/cover', upload.single('image'), (req, res) => {
        if (!req.file) {
          console.log("No file received");
          return res.send({
            success: false
          });
      
        } else {
        res.send({
            success: true
          })
        }
      })
        .get("/cover", (req, res) => {
            fs.readFile('./storage/cover.png', function (err, content) {
                if (err) {
                    res.writeHead(400, { 'Content-type': 'text/html' })
                    console.log(err);
                    res.end("No such image");
                } else {
                    res.writeHead(200, { 'Content-type': 'image/jpg' });
                    res.end(content);
                }
            });
        })

app.listen(3000, () => {
 console.log("Server running on port 3000");
});