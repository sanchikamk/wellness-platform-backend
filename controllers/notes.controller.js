import Note from '../models/Note.js';

export const createNote = async (req, res) => {
  try {
    const note = new Note(req.body);
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNotesByAppointment = async (req, res) => {
  try {
    const notes = await Note.find({ appointmentId: req.params.appointmentId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};