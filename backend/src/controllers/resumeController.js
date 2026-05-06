const Resume = require('../models/Resume');

exports.getAll = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).select('-data').sort('-updatedAt');
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, data, template } = req.body;
    const resume = await Resume.create({ user: req.user.id, title, data, template });
    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, data, template } = req.body;
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, data, template },
      { new: true }
    );
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
