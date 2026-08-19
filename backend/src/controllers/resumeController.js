const Resume = require('../models/Resume');

exports.getAll = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).select('-data').sort('-updatedAt');
    res.json(resumes);
  } catch (err) {
    console.error('getAll error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    console.error('getOne error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const VALID_TEMPLATES = ['minimal', 'modern', 'professional'];

exports.create = async (req, res) => {
  try {
    const { title, data, template } = req.body;
    if (!data) return res.status(400).json({ message: 'Resume data is required' });
    if (template && !VALID_TEMPLATES.includes(template))
      return res.status(400).json({ message: 'Invalid template' });
    const resume = await Resume.create({ user: req.user.id, title: title || 'My Resume', data, template });
    res.status(201).json(resume);
  } catch (err) {
    console.error('create error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, data, template } = req.body;
    if (template && !VALID_TEMPLATES.includes(template))
      return res.status(400).json({ message: 'Invalid template' });
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, data, template },
      { new: true }
    );
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    console.error('update error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('remove error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
