const { oilOptions } = require('../data/db');

exports.getOilOptions = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      count: oilOptions.length,
      data: oilOptions
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
