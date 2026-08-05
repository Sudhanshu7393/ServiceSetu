const { vehicles } = require('../data/db');

exports.getVehicles = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getModelsByMake = (req, res) => {
  try {
    const { make } = req.params;
    const vehicle = vehicles.find(v => v.make.toLowerCase() === make.toLowerCase());
    if (!vehicle) {
      return res.status(404).json({ success: false, message: `Make ${make} not found` });
    }
    return res.status(200).json({
      success: true,
      make: vehicle.make,
      models: vehicle.models
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
