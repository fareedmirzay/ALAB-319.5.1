import express from "express";
import Grade from "../models/Grade.js";


const router = express.Router();




// Get the weighted average of a specified learner's grades, per class
router.get("/learner/:id/avg-class", async (req, res) => {
  let collection = await db.collection("grades");

  let result = await collection
    .aggregate([
      {
        $match: { learner_id: Number(req.params.id) },
      },
      {
        $unwind: { path: "$scores" },
      },
      {
        $group: {
          _id: "$class_id",
          quiz: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "quiz"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          exam: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "exam"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
          homework: {
            $push: {
              $cond: {
                if: { $eq: ["$scores.type", "homework"] },
                then: "$scores.score",
                else: "$$REMOVE",
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          class_id: "$_id",
          avg: {
            $sum: [
              { $multiply: [{ $avg: "$exam" }, 0.5] },
              { $multiply: [{ $avg: "$quiz" }, 0.3] },
              { $multiply: [{ $avg: "$homework" }, 0.2] },
            ],
          },
        },
      },
    ])
    .toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// GET all grades
router.get('/', async (req, res) => {
  try {
    const grades = await Grade.find();
    res.status(200).json(grades);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// GET a specific grade by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const grade = await Grade.findById(id);
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    res.status(200).json(grade);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// POST create a new grade
router.post('/', async (req, res) => {
  const grade = req.body;

  const newGrade = new Grade(grade);

  try {
    await newGrade.save();
    res.status(201).json(newGrade);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});


// PUT update an existing grade by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedGrade = req.body;
  try {
    const grade = await Grade.findByIdAndUpdate(id, updatedGrade, { new: true });

    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }
    res.status(200).json(grade);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

// DELETE a grade by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const grade = await Grade.findByIdAndDelete(id);

    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }

    res.status(200).json({ message: "Grade deleted successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

export default router;