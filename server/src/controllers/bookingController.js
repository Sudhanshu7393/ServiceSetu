const db = require('../data/database');
const { verifiedMechanics, servicePackages, oilOptions } = require('../data/db');

// Helper function to auto-assign nearest mechanic
function autoAssignMechanic(lat, lng) {
  if (!verifiedMechanics || verifiedMechanics.length === 0) return null;
  let nearestMech = verifiedMechanics[0];
  let minDistance = Infinity;

  verifiedMechanics.forEach(mech => {
    const d = Math.sqrt(Math.pow(mech.currentLat - lat, 2) + Math.pow(mech.currentLng - lng, 2));
    if (d < minDistance) {
      minDistance = d;
      nearestMech = mech;
    }
  });
  return nearestMech;
}

// Parse JSON fields from DB row
function parseBookingRow(row) {
  if (!row) return null;
  return {
    ...row,
    vehicle: JSON.parse(row.vehicle || '{}'),
    package: JSON.parse(row.package || '{}'),
    oilOption: JSON.parse(row.oilOption || '{}'),
    pricing: JSON.parse(row.pricing || '{}'),
    locationCoords: JSON.parse(row.locationCoords || '{}'),
    mechanic: JSON.parse(row.mechanic || '{}'),
    beforePhotos: JSON.parse(row.beforePhotos || '[]'),
    inspectionDetails: JSON.parse(row.inspectionDetails || '{}'),
    usedProducts: JSON.parse(row.usedProducts || '[]'),
    checklist: JSON.parse(row.checklist || '[]'),
    afterPhotos: JSON.parse(row.afterPhotos || '[]'),
    diagnosisDetails: row.diagnosisDetails ? JSON.parse(row.diagnosisDetails) : null,
    workshopDetails: row.workshopDetails ? JSON.parse(row.workshopDetails) : null,
    otpConfirmed: Boolean(row.otpConfirmed)
  };
}

// Create new booking in SQLite DB
exports.createBooking = (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      vehicle,
      packageId,
      oilOptionId,
      date,
      timeSlot,
      address,
      pincode,
      locationCoords,
      paymentMethod
    } = req.body;

    if (!customerName || !customerPhone || !vehicle || !packageId || !date || !timeSlot || !address) {
      return res.status(400).json({ success: false, message: 'Please provide all required booking details.' });
    }

    const selectedPkg = servicePackages.find(p => p.id === packageId) || servicePackages[0];
    const selectedOil = oilOptions.find(o => o.id === oilOptionId) || oilOptions[0];

    const basePrice = selectedPkg.price;
    const oilUpgradeCost = selectedOil.priceDifference;
    const subtotal = basePrice + oilUpgradeCost;
    const gstAmount = Math.round(subtotal * 0.18);
    const totalPrice = subtotal + gstAmount;

    let flowType = 'routine_doorstep';
    if (selectedPkg.serviceType === 'heavy_workshop') {
      flowType = 'heavy_workshop_pickup';
    } else if (selectedPkg.serviceType === 'unclear_diagnosis') {
      flowType = 'unclear_diagnosis_visit';
    }

    const lat = locationCoords?.lat || 12.9716;
    const lng = locationCoords?.lng || 77.5946;
    const assignedMechanic = autoAssignMechanic(lat, lng);

    const bookingId = `SS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const createdAt = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO bookings (
        id, customerName, customerPhone, vehicle, package, oilOption, pricing,
        totalPrice, date, timeSlot, address, pincode, locationCoords, status,
        flowType, mechanic, otp, otpConfirmed, beforePhotos, odometerReading,
        inspectionDetails, usedProducts, checklist, afterPhotos, paymentMethod, createdAt
      ) VALUES (
        @id, @customerName, @customerPhone, @vehicle, @package, @oilOption, @pricing,
        @totalPrice, @date, @timeSlot, @address, @pincode, @locationCoords, @status,
        @flowType, @mechanic, @otp, @otpConfirmed, @beforePhotos, @odometerReading,
        @inspectionDetails, @usedProducts, @checklist, @afterPhotos, @paymentMethod, @createdAt
      )
    `);

    insertStmt.run({
      id: bookingId,
      customerName,
      customerPhone,
      vehicle: JSON.stringify(vehicle),
      package: JSON.stringify(selectedPkg),
      oilOption: JSON.stringify(selectedOil),
      pricing: JSON.stringify({ basePrice, oilUpgradeCost, subtotal, gstAmount, totalPrice }),
      totalPrice,
      date,
      timeSlot,
      address,
      pincode: pincode || '560001',
      locationCoords: JSON.stringify({ lat, lng }),
      status: 'Assigned',
      flowType,
      mechanic: JSON.stringify(assignedMechanic),
      otp,
      otpConfirmed: 0,
      beforePhotos: JSON.stringify([]),
      odometerReading: '',
      inspectionDetails: JSON.stringify({}),
      usedProducts: JSON.stringify([]),
      checklist: JSON.stringify(selectedPkg.features.map(f => ({ item: f, status: 'Pending', note: '' }))),
      afterPhotos: JSON.stringify([]),
      paymentMethod: paymentMethod || 'Razorpay Online',
      createdAt
    });

    const createdRow = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
    const newBooking = parseBookingRow(createdRow);

    return res.status(201).json({
      success: true,
      message: 'Booking created and saved in SQLite Persistent Database!',
      booking: newBooking
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get bookings from SQL
exports.getBookings = (req, res) => {
  try {
    const { status, phone } = req.query;
    let sql = 'SELECT * FROM bookings';
    const params = [];

    if (status && phone) {
      sql += ' WHERE LOWER(status) = LOWER(?) AND customerPhone = ?';
      params.push(status, phone);
    } else if (status) {
      sql += ' WHERE LOWER(status) = LOWER(?)';
      params.push(status);
    } else if (phone) {
      sql += ' WHERE customerPhone = ?';
      params.push(phone);
    }

    sql += ' ORDER BY createdAt DESC';

    const rows = db.prepare(sql).all(...params);
    const parsedBookings = rows.map(parseBookingRow);

    return res.status(200).json({
      success: true,
      count: parsedBookings.length,
      bookings: parsedBookings
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get single booking
exports.getBookingById = (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    if (!row) {
      return res.status(404).json({ success: false, message: `Booking ${id} not found.` });
    }
    return res.status(200).json({ success: true, booking: parseBookingRow(row) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, odometerReading, beforePhotos, afterPhotos, checklist, inspectionDetails, diagnosisDetails, workshopDetails } = req.body;

    const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    if (!row) {
      return res.status(404).json({ success: false, message: `Booking ${id} not found.` });
    }

    const currentBooking = parseBookingRow(row);

    const updatedStatus = status || currentBooking.status;
    const updatedOdo = odometerReading !== undefined ? odometerReading : currentBooking.odometerReading;
    const updatedBefore = beforePhotos ? JSON.stringify(beforePhotos) : JSON.stringify(currentBooking.beforePhotos);
    const updatedAfter = afterPhotos ? JSON.stringify(afterPhotos) : JSON.stringify(currentBooking.afterPhotos);
    const updatedChecklist = checklist ? JSON.stringify(checklist) : JSON.stringify(currentBooking.checklist);
    const updatedInspection = inspectionDetails ? JSON.stringify(inspectionDetails) : JSON.stringify(currentBooking.inspectionDetails);
    const updatedDiag = diagnosisDetails ? JSON.stringify(diagnosisDetails) : (currentBooking.diagnosisDetails ? JSON.stringify(currentBooking.diagnosisDetails) : null);
    const updatedShop = workshopDetails ? JSON.stringify(workshopDetails) : (currentBooking.workshopDetails ? JSON.stringify(currentBooking.workshopDetails) : null);

    db.prepare(`
      UPDATE bookings SET 
        status = ?, odometerReading = ?, beforePhotos = ?, afterPhotos = ?,
        checklist = ?, inspectionDetails = ?, diagnosisDetails = ?, workshopDetails = ?
      WHERE id = ?
    `).run(updatedStatus, updatedOdo, updatedBefore, updatedAfter, updatedChecklist, updatedInspection, updatedDiag, updatedShop, id);

    const updatedRow = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);

    return res.status(200).json({
      success: true,
      message: `Booking ${id} updated in SQLite DB.`,
      booking: parseBookingRow(updatedRow)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Add product used & duplicate barcode check via SQL
exports.addProductUsed = (req, res) => {
  try {
    const { id } = req.params;
    const { name, barcode, photo } = req.body;

    if (!name || !barcode) {
      return res.status(400).json({ success: false, message: 'Product name and barcode are required.' });
    }

    const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    if (!row) {
      return res.status(400).json({ success: false, message: `Booking ${id} not found.` });
    }

    const cleanBarcode = barcode.trim().toUpperCase();
    const existingBarcode = db.prepare('SELECT * FROM barcode_registry WHERE barcode = ?').get(cleanBarcode);

    if (existingBarcode && existingBarcode.bookingId !== id) {
      const alertId = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;
      const bookingObj = parseBookingRow(row);
      
      db.prepare(`
        INSERT INTO audit_logs (id, attemptedBarcode, bookingId, mechanicId, mechanicName, originalBookingId, timestamp, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        alertId,
        cleanBarcode,
        id,
        bookingObj.mechanic?.id || 'mech-101',
        bookingObj.mechanic?.name || 'Mechanic',
        existingBarcode.bookingId,
        new Date().toISOString(),
        'Flagged & Blocked'
      );

      return res.status(409).json({
        success: false,
        duplicateDetected: true,
        errorCode: 'DUPLICATE_BARCODE_REUSED',
        message: `SECURITY ALERT: Barcode "${cleanBarcode}" was ALREADY registered in Booking #${existingBarcode.bookingId}. Duplicate barcode reuse is flagged and prohibited for customer proof verification.`,
        usageDetails: existingBarcode
      });
    }

    const bookingObj = parseBookingRow(row);
    const productRecord = {
      name,
      barcode: cleanBarcode,
      photo: photo || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400',
      timestamp: new Date().toISOString()
    };

    const updatedUsedProducts = [...bookingObj.usedProducts, productRecord];

    db.prepare('UPDATE bookings SET usedProducts = ? WHERE id = ?').run(JSON.stringify(updatedUsedProducts), id);
    db.prepare('INSERT OR IGNORE INTO barcode_registry (barcode, bookingId, mechanicId, timestamp) VALUES (?, ?, ?, ?)').run(
      cleanBarcode,
      id,
      bookingObj.mechanic?.id || 'mech-101',
      new Date().toISOString()
    );

    return res.status(200).json({
      success: true,
      message: `Product "${name}" with barcode [${cleanBarcode}] registered in SQLite DB.`,
      usedProducts: updatedUsedProducts
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Remove scanned product item & release barcode from SQL
exports.removeProductUsed = (req, res) => {
  try {
    const { id, barcode } = req.params;

    const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    if (!row) {
      return res.status(404).json({ success: false, message: `Booking ${id} not found.` });
    }

    const cleanBarcode = barcode.trim().toUpperCase();
    const bookingObj = parseBookingRow(row);

    const updatedProducts = bookingObj.usedProducts.filter(p => p.barcode !== cleanBarcode);

    db.prepare('UPDATE bookings SET usedProducts = ? WHERE id = ?').run(JSON.stringify(updatedProducts), id);
    db.prepare('DELETE FROM barcode_registry WHERE barcode = ?').run(cleanBarcode);

    return res.status(200).json({
      success: true,
      message: `Product [${cleanBarcode}] removed and barcode released from SQLite DB.`,
      usedProducts: updatedProducts
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Rate booking in SQL
exports.rateBooking = (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;

    const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    if (!row) {
      return res.status(404).json({ success: false, message: `Booking ${id} not found.` });
    }

    db.prepare('UPDATE bookings SET rating = ?, feedback = ? WHERE id = ?').run(rating, feedback || '', id);
    const updatedRow = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);

    return res.status(200).json({
      success: true,
      message: 'Rating saved in SQLite DB!',
      booking: parseBookingRow(updatedRow)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verify OTP & Complete booking in SQL
exports.verifyOtpAndComplete = (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    if (!row) {
      return res.status(404).json({ success: false, message: `Booking ${id} not found.` });
    }

    if (row.otp !== otp.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP entered. Please check the customer phone message.' });
    }

    db.prepare('UPDATE bookings SET otpConfirmed = 1, status = "Completed" WHERE id = ?').run(id);
    const updatedRow = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);

    return res.status(200).json({
      success: true,
      message: 'OTP verified! Service completed & saved in SQLite DB.',
      booking: parseBookingRow(updatedRow)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Audit Logs from SQL
exports.getAuditLogs = (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC').all();
    return res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
