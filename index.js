const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const fs = require("fs");
//const { dirname } = require("path");
const app = express();

// enable files upload
app.use(fileUpload({ createParentPath: true }));
//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

//start app
const port = process.env.PORT || 2800;

app.listen(port, () => console.log(`App is listening on port ${port}.`));
app.get("/", (req, res) => {
  res.json({ response: "HAAAAAAAAAAAAAAAAAAAAAAAAAA" });
});
app.get("/getAll", async (req, res) => {
  const testFolder = `${__dirname}/uploads`;
  let files = [];

  files = await fs.readdirSync(testFolder);
  res.json(files);
});
app.post("/upload-my-file", async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
        payload: {}
      });
    } else {
      //Use the name of the input field (i.e. "file") to retrieve the uploaded file
      let file = req.files.file;
      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      const uploadLocation=`${__dirname}/uploads/${file.name}`;
      console.log("destnation: ", uploadLocation);
      //file.mv("./uploads/" + file.name);
      file.mv(uploadLocation);
      //send response
      res.send({
        status: true,
        message: "File was uploaded successfully on dui server",
        payload: {
          name: file.name,
          mimetype: file.mimetype,
          size: file.size,
          path: "/files/",
          url: "https://my-ftp-server.com/bjYJGFYgjfVGHVb"
        }
      });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Unspected problem",
      payload: {}
    });
  }
});
app.get("/download/:fileName", function (req, res) {
  try {
   const { fileName } = req.params;
   console.log("file name: ", fileName);
    const file = `${__dirname}/uploads/${fileName}`;
    res.download(file); // Set disposition and send it.
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error on downloading",
      payload: {},
    });
  }
});
