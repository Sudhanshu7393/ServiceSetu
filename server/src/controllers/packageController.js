const { servicePackages } = require('../data/db');

exports.getServicePackages = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      count: servicePackages.length,
      data: servicePackages
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
