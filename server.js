const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());

app.use("/uploads", express.static("uploads"));
// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Upload API
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    message: "File uploaded successfully",
    file: req.file
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});