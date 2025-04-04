import express from "express";
import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByClientId,
  getAppointmentsByCounselorId,
  updateAppointmentNotes
} from "../controller/appointments.controller.js"; // Rename controller if needed

import { checkUserAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes protected
router.use(checkUserAuth);

// Create an appointment
router.post("/", createAppointment);

// Update an appointment
router.put("/:id", updateAppointment);

// Delete an appointment
router.delete("/:id", deleteAppointment);

// Get appointments by client ID
router.get("/client/:id", getAppointmentsByClientId);

// Get appointments by counselor ID
router.get("/counselor/:id", getAppointmentsByCounselorId);

// Update Notes by appointment ID
router.put("/:appointmentId/notes", checkUserAuth, updateAppointmentNotes);


export default router;
