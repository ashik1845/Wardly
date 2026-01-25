const express = require("express");
const Patient = require("../models/Patient");
const auth = require("../middleware/authMiddleware");
const makeCall = require("../utils/callService");

const router = express.Router();

const wardState = new Map();

router.post("/add", auth, async (req, res) => {
  try {
    const patient = new Patient({
      ...req.body,
      wardId: req.wardId
    });

    await patient.save();
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: "Failed to add patient" });
  }
});


router.get("/", auth, async (req, res) => {
  const patients = await Patient.find({ wardId: req.wardId });
  res.json(patients);
});

router.post("/call", auth, (req, res) => {
  const { patient } = req.body;
  const wardId = req.wardId;

  if (!wardState.has(wardId)) {
    wardState.set(wardId, { activePatients: {} });
  }

  const state = wardState.get(wardId);

  if (state.activePatients[patient._id]) {
    return res.json({ message: "Patient already active" });
  }

  const timer = setTimeout(async () => {
    console.log("Calling:", patient.patientName);

    await makeCall(patient.contact1, patient.patientName);

    if (patient.contact2) {
      setTimeout(() => {
        makeCall(patient.contact2, patient.patientName);
      }, 30000);
    }

  }, 120000);

  state.activePatients[patient._id] = {
    patient,
    timer
  };

  global.io.to(wardId).emit(
    "alert",
    Object.values(state.activePatients).map(p => p.patient)
  );

  res.json({ message: "Patient alert started" });
});


function triggerAlert(wardId) {
  const state = wardState.get(wardId);
  if (!state || state.queue.length === 0) return;

  global.io.to(wardId).emit("alert", state.queue);

  if (state.timer) clearTimeout(state.timer);

  state.timer = setTimeout(async () => {
    const current = state.queue[0];

    await makeCall(current.contact1, current.patientName);

    if (current.contact2) {
      setTimeout(() => {
        makeCall(current.contact2, current.patientName);
      }, 30000);
    }

    state.queue.shift();

    triggerAlert(wardId);

  }, 120000);
}



router.post("/cancel", auth, (req, res) => {
  const { patientId } = req.body;
  const wardId = req.wardId;

  const state = wardState.get(wardId);
  if (!state || !state.activePatients[patientId]) {
    return res.json({ message: "Patient not active" });
  }

  clearTimeout(state.activePatients[patientId].timer);
  delete state.activePatients[patientId];

  
  global.io.to(wardId).emit(
    "alert",
    Object.values(state.activePatients).map(p => p.patient)
  );

  res.json({ message: "Patient cancelled" });
});




router.delete("/:id", auth, async (req, res) => {
  try {
    const wardId = req.wardId;
    const patientId = req.params.id;

    console.log("DELETE REQUEST:", { wardId, patientId });

    
    if (!patientId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid patient ID" });
    }

   
    const state = wardState.get(wardId);

    if (state && state.activePatients && state.activePatients[patientId]) {
      return res.status(400).json({
        message: "Cannot delete patient while call is active"
      });
    }

    const deleted = await Patient.findByIdAndDelete(patientId);

    if (!deleted) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json({ message: "Patient deleted successfully" });

  } catch (err) {
    console.error("DELETE PATIENT ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = router;
