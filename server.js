// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// app.use("/uploads", express.static("uploads"));
// // Storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });

// const upload = multer({ storage });

// // Upload API
// app.post("/upload", upload.single("image"), (req, res) => {
//   res.json({
//     message: "File uploaded successfully",
//     file: req.file
//   });
// });

// app.listen(3000, () => {
//   console.log("Server running on port 3000");
// });


const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { put } = require("@vercel/blob");

const app = express();

app.use(cors());

// ✅ IMPORTANT: use memory storage (NOT disk)
const upload = multer({
  storage: multer.memoryStorage(),
});

// ✅ Upload API
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // check file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // upload to Vercel Blob
    const blob = await put("uploads/"+req.file.originalname, req.file.buffer, {
      access: "public",
      addRandomSuffix: true,
    });

    return res.json({
      message: "File uploaded successfully",
      url: blob.url, // ✅ THIS IS YOUR IMAGE URL
      imgename:blob.pathname    });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

// ❌ REMOVE THIS (not needed anymore)
// app.use("/uploads", express.static("uploads"));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

module.exports = app;