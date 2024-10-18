import express from 'express';
import connectDB from './db/mongoose.js';
import dotenv from 'dotenv';
import grades from "./routes/grades.js";


dotenv.config();

const app = express();
const PORT = 5060;
connectDB();



app.use(express.json());
app.use("/grades", grades);


// Error handling
app.use((err, _req, res, next) => {
  res.status(500).send("There was an Error");
});

app.get("/", (req, res) => {
    res.send("Server is up and RUNNING")
})


app.listen(PORT, () => { console.log(`Server is running on Port: ${PORT}`);
})