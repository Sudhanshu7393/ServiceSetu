// ServiceSetu Data Store & Audit Log Engine
const { vehicles, servicePackages, oilOptions, verifiedMechanics, bookings, barcodeUsageRegistry } = require('./db');

// Global duplicate barcode security incident logs for Admin Audit
const duplicateAlertLogs = [
  {
    id: 'ALT-901',
    attemptedBarcode: 'BAR-MOT-44129',
    bookingId: 'SS-2026-9022',
    mechanicId: 'mech-102',
    mechanicName: 'Suresh Verma',
    originalBookingId: 'SS-2026-8801',
    timestamp: '2026-08-04T14:30:00.000Z',
    status: 'Flagged & Blocked'
  }
];

module.exports = {
  vehicles,
  servicePackages,
  oilOptions,
  verifiedMechanics,
  bookings,
  barcodeUsageRegistry,
  duplicateAlertLogs
};
