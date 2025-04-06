import Appointment from "../models/appointments.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { decodeToken } from "../utils/jwtUtils.js";
import User from "../models/users.model.js";

// @desc    Create a new appointment
// @route   POST /api/appointments
// export const createAppointment = async (req, res) => {
//   try {
//     const { clientId, counselorId, appointmentTimings, sessionType, notes, paymentId, paymentStatus } = req.body;

//     const newAppointment = await Appointment.create({
//       clientId,
//       counselorId,
//       appointmentTimings,
//       sessionType,
//       notes,
//       paymentId,
//       paymentStatus,
//     });

//     // const token = req.headers.authorization?.split(" ")[1];
//     // const { id, role } = decodeToken(token) || {};
//     // if (!id) return res.status(403).json({ msg: "Invalid token" });

//     const user = await User.findById(clientId);
//     const counselor = await User.findById(counselorId);

//     await sendEmail(user.email, "Appointment Confirmation", "templates/appointmentCreated.html", {
//       name: user.name,
//       counselor: counselor.name,
//       day: appointmentTimings.day,
//       from: appointmentTimings.from,
//       to: appointmentTimings.to,
//       sessionType: counselor.specialization,
//     });
//     await sendEmail(counselor.email, "Appointment Confirmation", "templates/appointmentCreated.html", {
//       name: counselor.name,
//       counselor: user.name,
//       day: appointmentTimings.day,
//       from: appointmentTimings.from,
//       to: appointmentTimings.to,
//       sessionType: counselor.specialization,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Appointment created successfully",
//       data: newAppointment,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to create appointment",
//       error: error.message,
//     });
//   }
// };

export const createAppointment = async (req, res) => {
  try {
    const { clientId, counselorId, appointmentTimings, sessionType, notes, paymentId, paymentStatus, join_url } = req.body;

    if (!clientId || !counselorId) {
      return res.status(400).json({ success: false, message: "Client ID and Counselor ID are required" });
    }

    const [client, counselor] = await Promise.all([User.findById(clientId), User.findById(counselorId)]);

    if (!client || !counselor) {
      return res.status(404).json({ success: false, message: "Client or Counselor not found" });
    }

    const newAppointment = await Appointment.create({
      clientId,
      counselorId,
      appointmentTimings,
      sessionType,
      notes,
      paymentId,
      paymentStatus,
      join_url
    });

    const emailTemplateData = {
      day: appointmentTimings.day,
      from: appointmentTimings.from,
      to: appointmentTimings.to,
      sessionType: counselor.specialization,
      join_url
    };

    const emailsToSend = [
      {
        to: client.email,
        subject: "Appointment Confirmation",
        template: "templates/appointmentCreated.html",
        data: {
          ...emailTemplateData,
          name: client.name,
          counselor: counselor.name,
        },
      },
      {
        to: counselor.email,
        subject: "Appointment Confirmation",
        template: "templates/appointmentCreated.html",
        data: {
          ...emailTemplateData,
          name: counselor.name,
          counselor: client.name,
        },
      },
    ];

    await Promise.all(emailsToSend.map(({ to, subject, template, data }) => sendEmail(to, subject, template, data)));

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message,
    });
  }
};

// @desc    Update an appointment by ID
// @route   PUT /api/appointments/:id
export const updateAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const [client, counselor] = await Promise.all([User.findById(updatedAppointment.clientId), User.findById(updatedAppointment.counselorId)]);

    if (!client || !counselor) {
      return res.status(404).json({ success: false, message: "Client or Counselor not found" });
    }

    const { day, from, to } = updatedAppointment.appointmentTimings;

    const emailTemplateData = {
      day,
      from,
      to,
      sessionType: counselor.specialization,
    };

    const emailsToSend = [
      {
        to: client.email,
        subject: "Appointment Updated",
        template: "templates/appointmentUpdated.html",
        data: {
          ...emailTemplateData,
          name: client.name,
          counselor: counselor.name,
        },
      },
      {
        to: counselor.email,
        subject: "Appointment Updated",
        template: "templates/appointmentUpdated.html",
        data: {
          ...emailTemplateData,
          name: counselor.name,
          counselor: client.name,
        },
      },
    ];

    await Promise.all(emailsToSend.map(({ to, subject, template, data }) => sendEmail(to, subject, template, data)));

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update appointment",
      error: error.message,
    });
  }
};

// @desc    Delete an appointment by ID
// @route   DELETE /api/appointments/:id
// soft delete - update status to "cancelled"
export const deleteAppointment = async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, { status: "cancelled" }, { new: true });

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const [client, counselor] = await Promise.all([User.findById(updatedAppointment.clientId), User.findById(updatedAppointment.counselorId)]);

    if (!client || !counselor) {
      return res.status(404).json({
        success: false,
        message: "Client or Counselor not found",
      });
    }

    const { day, from, to } = updatedAppointment.appointmentTimings;

    const emailTemplateData = {
      day,
      from,
      to,
    };

    const emailsToSend = [
      {
        to: client.email,
        subject: "Appointment Cancelled",
        template: "templates/appointmentCancelled.html",
        data: {
          ...emailTemplateData,
          name: client.name,
          counselor: counselor.name,
        },
      },
      {
        to: counselor.email,
        subject: "Appointment Cancelled",
        template: "templates/appointmentCancelled.html",
        data: {
          ...emailTemplateData,
          name: counselor.name,
          counselor: client.name,
        },
      },
    ];

    await Promise.all(emailsToSend.map(({ to, subject, template, data }) => sendEmail(to, subject, template, data)));

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel appointment",
      error: error.message,
    });
  }
};

// @desc    Get appointments by client ID
// @route   GET /api/appointments/client/:id
export const getAppointmentsByClientId = async (req, res) => {
  try {
    const appointments = await Appointment.find({ clientId: req.params.id }).populate("counselorId", "name email specialization").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments for client",
      error: error.message,
    });
  }
};

// @desc    Get appointments by counselor ID
// @route   GET /api/appointments/counselor/:id
export const getAppointmentsByCounselorId = async (req, res) => {
  try {
    const appointments = await Appointment.find({ counselorId: req.params.id }).populate("clientId", "name email").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments for counselor",
      error: error.message,
    });
  }
};

export const updateAppointmentNotes = async (req, res) => {
  try {
    console.log(req.params);
    const { appointmentId } = req.params;
    const { text, attachments } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        $set: {
          "notes.text": text,
          "notes.attachments": attachments || [],
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Notes updated successfully",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating notes",
      error: error.message,
    });
  }
};
