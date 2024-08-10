const Portfolio = require('../models/Portfolio');

// Create a new portfolio
exports.createPortfolio = async (req, res) => {
  const { title, description, projects, education, professionalHistory, portfolioLinks } = req.body;
  try {
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    if (portfolio) return res.status(400).json({ msg: 'Portfolio already exists' });

    portfolio = new Portfolio({ 
        user: req.user.id, 
        title, 
        description, 
        projects,
        education: education.map(edu => ({
            ...edu,
            yearOfJoining: new Date(edu.yearOfJoining),
            yearOfPassing: new Date(edu.yearOfPassing),
        })),
        professionalHistory: professionalHistory.map(hist => ({
            ...hist,
            yearOfJoining: new Date(hist.yearOfJoining),
            yearOfLeaving: new Date(hist.yearOfLeaving),
        })),
        portfolioLinks 
    });
    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updatePortfolio = async (req, res) => {
  const { title, description, projects, education, professionalHistory, portfolioLinks } = req.body;
  try {
    let portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) return res.status(400).json({ msg: 'Portfolio not found' });

    portfolio.title = title;
    portfolio.description = description;
    portfolio.projects = projects;
    portfolio.education = education.map(edu => ({
        ...edu,
        yearOfJoining: new Date(edu.yearOfJoining),
        yearOfPassing: new Date(edu.yearOfPassing),
    }));
    portfolio.professionalHistory = professionalHistory.map(hist => ({
        ...hist,
        yearOfJoining: new Date(hist.yearOfJoining),
        yearOfLeaving: new Date(hist.yearOfLeaving),
    }));
    portfolio.portfolioLinks = portfolioLinks;

    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get a portfolio
exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) return res.status(400).json({ msg: 'Portfolio not found' });
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Check if a portfolio exists
exports.checkPortfolioExists = async (req, res) => {
  try {
    console.log('Request user ID:', req.user.id); // Log user ID for debugging
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (portfolio) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error('Error checking portfolio existence:', err.message);
    res.status(500).send('Server error');
  }
};

// Get a public portfolio
exports.getPublicPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.params.userId })
      .populate('user', 'name'); // Populate with user name

    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }

    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
