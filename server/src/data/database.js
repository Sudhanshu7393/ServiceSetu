const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

let dbPath;
if (process.env.VERCEL) {
  dbPath = path.join('/tmp', 'servicesetu.db');
} else {
  dbPath = path.join(__dirname, 'servicesetu.db');
}

let db;
try {
  db = new Database(dbPath);
  try {
    db.pragma('journal_mode = WAL');
  } catch (err) {
    // Memory / Vercel fallback
  }
} catch (e) {
  console.warn('SQLite Vercel fallback to in-memory:', e.message);
  db = new Database(':memory:');
}

// Initialize SQL Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    customerName TEXT NOT NULL,
    customerPhone TEXT NOT NULL,
    vehicle TEXT NOT NULL,
    package TEXT NOT NULL,
    oilOption TEXT NOT NULL,
    pricing TEXT NOT NULL,
    totalPrice INTEGER NOT NULL,
    date TEXT NOT NULL,
    timeSlot TEXT NOT NULL,
    address TEXT NOT NULL,
    pincode TEXT NOT NULL,
    locationCoords TEXT NOT NULL,
    status TEXT NOT NULL,
    flowType TEXT NOT NULL,
    mechanic TEXT,
    otp TEXT NOT NULL,
    otpConfirmed INTEGER DEFAULT 0,
    beforePhotos TEXT,
    odometerReading TEXT,
    inspectionDetails TEXT,
    usedProducts TEXT,
    checklist TEXT,
    afterPhotos TEXT,
    rating INTEGER,
    feedback TEXT,
    diagnosisDetails TEXT,
    workshopDetails TEXT,
    paymentMethod TEXT,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS barcode_registry (
    barcode TEXT PRIMARY KEY,
    bookingId TEXT NOT NULL,
    mechanicId TEXT NOT NULL,
    timestamp TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    attemptedBarcode TEXT NOT NULL,
    bookingId TEXT NOT NULL,
    mechanicId TEXT NOT NULL,
    mechanicName TEXT NOT NULL,
    originalBookingId TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    status TEXT NOT NULL
  );
`);

// Seed initial booking if table empty
try {
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM bookings');
  const { count } = countStmt.get();

  if (count === 0) {
    const seedBooking = {
      id: 'SS-2026-8801',
      customerName: 'Amit Patel',
      customerPhone: '+91 98200 12345',
      vehicle: JSON.stringify({ make: 'Royal Enfield', model: 'Classic 350 (J-Series)', engine: '349cc' }),
      package: JSON.stringify({
        id: 'pkg-routine-standard',
        name: 'Standard Doorstep Service',
        price: 799,
        estimatedMinutes: 75,
        serviceType: 'routine_doorstep'
      }),
      oilOption: JSON.stringify({
        id: 'oil-motul',
        brand: 'Motul 7100 4T 100% Synthetic Ester',
        spec: '10W-40 Ester Technology JASO MA2',
        priceDifference: 390
      }),
      pricing: JSON.stringify({ basePrice: 799, oilUpgradeCost: 390, subtotal: 1189, gstAmount: 96, totalPrice: 1285 }),
      totalPrice: 1285,
      date: '2026-08-04',
      timeSlot: '10:00 AM - 11:30 AM',
      address: 'Flat 402, Royal Palms, Koramangala 4th Block, Bengaluru',
      pincode: '560034',
      locationCoords: JSON.stringify({ lat: 12.9352, lng: 77.6245 }),
      status: 'Completed',
      flowType: 'routine_doorstep',
      mechanic: JSON.stringify({
        id: 'mech-101',
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
        rating: 4.9,
        jobsCompleted: 342,
        kycStatus: 'Verified'
      }),
      otp: '4829',
      otpConfirmed: 1,
      beforePhotos: JSON.stringify(['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600']),
      odometerReading: '14,820 km',
      inspectionDetails: JSON.stringify({
        odometer: '14,820 km',
        fuelLevel: '50% (Half Tank)',
        batteryVoltage: '12.6 V (Healthy)',
        frontTyrePressure: '28 psi',
        rearTyrePressure: '35 psi',
        brakePadLife: '65% (Good)'
      }),
      usedProducts: JSON.stringify([
        { name: 'Motul 7100 4T 10W-40 1L Can', barcode: 'BAR-MOT-44129', photo: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400' },
        { name: 'Royal Enfield Genuine Oil Filter', barcode: 'BAR-FILT-1002', photo: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400' }
      ]),
      checklist: JSON.stringify([
        { item: 'Engine Oil Drainage & Refill', status: 'Completed', note: 'Fresh 100% synthetic oil poured.' },
        { item: 'Chain Lube & Tensioning', status: 'Completed', note: 'Tension adjusted to 25mm play.' }
      ]),
      afterPhotos: JSON.stringify(['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600']),
      rating: 5,
      feedback: 'Excellent doorstep service!',
      paymentMethod: 'Razorpay Online',
      createdAt: new Date().toISOString()
    };

    const insertStmt = db.prepare(`
      INSERT INTO bookings (
        id, customerName, customerPhone, vehicle, package, oilOption, pricing,
        totalPrice, date, timeSlot, address, pincode, locationCoords, status,
        flowType, mechanic, otp, otpConfirmed, beforePhotos, odometerReading,
        inspectionDetails, usedProducts, checklist, afterPhotos, rating, feedback,
        paymentMethod, createdAt
      ) VALUES (
        @id, @customerName, @customerPhone, @vehicle, @package, @oilOption, @pricing,
        @totalPrice, @date, @timeSlot, @address, @pincode, @locationCoords, @status,
        @flowType, @mechanic, @otp, @otpConfirmed, @beforePhotos, @odometerReading,
        @inspectionDetails, @usedProducts, @checklist, @afterPhotos, @rating, @feedback,
        @paymentMethod, @createdAt
      )
    `);

    insertStmt.run(seedBooking);

    const barStmt = db.prepare('INSERT OR IGNORE INTO barcode_registry (barcode, bookingId, mechanicId, timestamp) VALUES (?, ?, ?, ?)');
    barStmt.run('BAR-MOT-44129', 'SS-2026-8801', 'mech-101', new Date().toISOString());
    barStmt.run('BAR-FILT-1002', 'SS-2026-8801', 'mech-101', new Date().toISOString());
  }
} catch (err) {
  console.error('Seed DB Error:', err);
}

module.exports = db;
