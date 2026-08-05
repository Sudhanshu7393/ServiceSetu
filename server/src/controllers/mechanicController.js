const { verifiedMechanics, bookings } = require('../data/db');
const db = require('../data/database');

exports.getMechanics = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      count: verifiedMechanics.length,
      mechanics: verifiedMechanics
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMechanicJobs = (req, res) => {
  try {
    const { id } = req.params;
    const mechanic = verifiedMechanics.find(m => m.id === id);
    if (!mechanic) {
      return res.status(404).json({ success: false, message: `Mechanic ${id} not found.` });
    }

    const rows = db.prepare('SELECT * FROM bookings ORDER BY createdAt DESC').all();
    const parsedJobs = rows.map(r => ({
      ...r,
      vehicle: JSON.parse(r.vehicle || '{}'),
      package: JSON.parse(r.package || '{}'),
      oilOption: JSON.parse(r.oilOption || '{}'),
      pricing: JSON.parse(r.pricing || '{}'),
      locationCoords: JSON.parse(r.locationCoords || '{}'),
      mechanic: JSON.parse(r.mechanic || '{}'),
      beforePhotos: JSON.parse(r.beforePhotos || '[]'),
      inspectionDetails: JSON.parse(r.inspectionDetails || '{}'),
      usedProducts: JSON.parse(r.usedProducts || '[]'),
      checklist: JSON.parse(r.checklist || '[]'),
      afterPhotos: JSON.parse(r.afterPhotos || '[]'),
      otpConfirmed: Boolean(r.otpConfirmed)
    }));

    const assignedJobs = parsedJobs.filter(b => b.mechanic && b.mechanic.id === id);

    return res.status(200).json({
      success: true,
      mechanic,
      count: assignedJobs.length,
      jobs: assignedJobs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update Mechanic Live GPS Coordinates (Real Device Geolocation)
exports.updateMechanicLocation = (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng, speed, accuracy } = req.body;

    const mechanic = verifiedMechanics.find(m => m.id === id);
    if (!mechanic) {
      return res.status(404).json({ success: false, message: `Mechanic ${id} not found.` });
    }

    mechanic.currentLat = lat;
    mechanic.currentLng = lng;
    mechanic.lastGpsUpdate = new Date().toISOString();
    mechanic.gpsSpeed = speed || 0;
    mechanic.gpsAccuracy = accuracy || 10;

    return res.status(200).json({
      success: true,
      message: `Mechanic ${mechanic.name} live GPS location updated!`,
      location: {
        lat: mechanic.currentLat,
        lng: mechanic.currentLng,
        lastGpsUpdate: mechanic.lastGpsUpdate
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
