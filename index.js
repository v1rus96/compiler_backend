const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
      await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });
      console.log('MongoDB connected!!');
  } catch (err) {
      console.log('Failed to connect to MongoDB', err);
  }
};

connectDB();

const { generateFile } = require("./generateFile");

const { addJobToQueue } = require("./jobQueue");
const Job = require("./models/Job");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;

  console.log(language, "Length:", code.length);

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  // need to generate a c++ file with content from the request
  const filepath = await generateFile(language, code);
  console.log("FILE" + filepath.toString())
  // write into DB
  const job = await new Job({ language, filepath }).save();
  const jobId = job["_id"];
  addJobToQueue(jobId);
  res.status(201).json({ jobId });
});

app.get("/status", async (req, res) => {
  const jobId = req.query.id;
  console.log(jobId);
  if (jobId === undefined) {
    return res
      .status(400)
      .json({ success: false, error: "missing id query param" });
  }

  const job = await Job.findById(jobId);

  if (job === undefined) {
    return res.status(400).json({ success: false, error: "couldn't find job" });
  }

  return res.status(200).json({ success: true, job });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Listening on port 5000!`);
});
