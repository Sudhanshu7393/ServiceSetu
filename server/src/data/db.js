// ServiceSetu In-Memory PostgreSQL-ready Data Store
// Comprehensive Indian two-wheeler database across all major brands & models

const vehicles = [
  {
    make: 'Honda',
    models: [
      { id: 'honda-activa-6g', name: 'Activa 6G', category: 'Scooter', engine: '110cc', defaultOilQty: '0.8L' },
      { id: 'honda-activa-125', name: 'Activa 125', category: 'Scooter', engine: '125cc', defaultOilQty: '0.8L' },
      { id: 'honda-shine-125', name: 'Shine 125', category: 'Commuter Bike', engine: '125cc', defaultOilQty: '1.0L' },
      { id: 'honda-sp-125', name: 'SP 125 BS6', category: 'Commuter Bike', engine: '125cc', defaultOilQty: '1.0L' },
      { id: 'honda-dio-125', name: 'Dio 125', category: 'Scooter', engine: '125cc', defaultOilQty: '0.8L' },
      { id: 'honda-unicorn', name: 'Unicorn 160', category: 'Commuter Bike', engine: '160cc', defaultOilQty: '1.0L' },
      { id: 'honda-hornet-20', name: 'Hornet 2.0', category: 'Street Bike', engine: '184cc', defaultOilQty: '1.2L' },
      { id: 'honda-cb350', name: 'H\'ness CB350 / RS', category: 'Cruiser Bike', engine: '348cc', defaultOilQty: '1.7L' },
      { id: 'honda-cb300r', name: 'CB300R', category: 'Sports Bike', engine: '286cc', defaultOilQty: '1.5L' }
    ]
  },
  {
    make: 'TVS',
    models: [
      { id: 'tvs-jupiter-110', name: 'Jupiter 110', category: 'Scooter', engine: '109.7cc', defaultOilQty: '0.8L' },
      { id: 'tvs-jupiter-125', name: 'Jupiter 125', category: 'Scooter', engine: '124.8cc', defaultOilQty: '0.8L' },
      { id: 'tvs-apache-160', name: 'Apache RTR 160 4V', category: 'Sports Bike', engine: '159.7cc', defaultOilQty: '1.2L' },
      { id: 'tvs-apache-200', name: 'Apache RTR 200 4V', category: 'Sports Bike', engine: '197.75cc', defaultOilQty: '1.2L' },
      { id: 'tvs-ntorq-125', name: 'Ntorq 125 Race Edition', category: 'Scooter', engine: '124.8cc', defaultOilQty: '0.8L' },
      { id: 'tvs-raider-125', name: 'Raider 125', category: 'Commuter Bike', engine: '124.8cc', defaultOilQty: '1.0L' },
      { id: 'tvs-ronin', name: 'Ronin 225', category: 'Scrambler Bike', engine: '225.9cc', defaultOilQty: '1.3L' },
      { id: 'tvs-iqube', name: 'iQube Electric Scooter', category: 'Electric Scooter', engine: 'Electric (3.4kWh)', defaultOilQty: 'Gear Oil 0.12L' }
    ]
  },
  {
    make: 'Royal Enfield',
    models: [
      { id: 're-classic-350', name: 'Classic 350 (J-Series)', category: 'Cruiser Bike', engine: '349cc', defaultOilQty: '1.7L' },
      { id: 're-hunter-350', name: 'Hunter 350', category: 'Roadster Bike', engine: '349cc', defaultOilQty: '1.7L' },
      { id: 're-bullet-350', name: 'Bullet 350', category: 'Cruiser Bike', engine: '349cc', defaultOilQty: '1.7L' },
      { id: 're-meteor-350', name: 'Meteor 350', category: 'Cruiser Bike', engine: '349cc', defaultOilQty: '1.7L' },
      { id: 're-himalayan-450', name: 'Himalayan 450', category: 'Adventure Bike', engine: '452cc', defaultOilQty: '2.1L' },
      { id: 're-gt-650', name: 'Continental GT 650', category: 'Twin Cylinder', engine: '648cc', defaultOilQty: '3.1L' },
      { id: 're-interceptor-650', name: 'Interceptor 650', category: 'Twin Cylinder', engine: '648cc', defaultOilQty: '3.1L' },
      { id: 're-shotgun-650', name: 'Shotgun 650', category: 'Cruiser Bike', engine: '648cc', defaultOilQty: '3.1L' }
    ]
  },
  {
    make: 'Yamaha',
    models: [
      { id: 'yamaha-fzs-v4', name: 'FZ-S V4 Deluxe', category: 'Street Bike', engine: '149cc', defaultOilQty: '1.0L' },
      { id: 'yamaha-mt-15', name: 'MT-15 V2 Deluxe', category: 'Naked Sports', engine: '155cc', defaultOilQty: '1.05L' },
      { id: 'yamaha-r15-v4', name: 'R15 V4 Racing Edition', category: 'Super Sport', engine: '155cc', defaultOilQty: '1.05L' },
      { id: 'yamaha-rayzr-125', name: 'RayZR 125 Fi Hybrid', category: 'Scooter', engine: '125cc', defaultOilQty: '0.8L' },
      { id: 'yamaha-aerox-155', name: 'Aerox 155 Max Scooter', category: 'Maxi Scooter', engine: '155cc', defaultOilQty: '0.9L' },
      { id: 'yamaha-fascino-125', name: 'Fascino 125 Fi Hybrid', category: 'Scooter', engine: '125cc', defaultOilQty: '0.8L' },
      { id: 'yamaha-fzx-150', name: 'FZ-X 150', category: 'Retro Street', engine: '149cc', defaultOilQty: '1.0L' }
    ]
  },
  {
    make: 'Hero',
    models: [
      { id: 'hero-splendor-plus', name: 'Splendor Plus XTEC', category: 'Commuter Bike', engine: '97.2cc', defaultOilQty: '0.9L' },
      { id: 'hero-hf-deluxe', name: 'HF Deluxe i3S', category: 'Commuter Bike', engine: '97.2cc', defaultOilQty: '0.9L' },
      { id: 'hero-glamour-125', name: 'Glamour XTEC 125', category: 'Commuter Bike', engine: '124.7cc', defaultOilQty: '1.0L' },
      { id: 'hero-passion-plus', name: 'Passion Plus / XTEC', category: 'Commuter Bike', engine: '110cc', defaultOilQty: '0.9L' },
      { id: 'hero-xpulse-200', name: 'Xpulse 200 4V Rally Pro', category: 'Off-Road Bike', engine: '199.6cc', defaultOilQty: '1.3L' },
      { id: 'hero-mavrick-440', name: 'Mavrick 440', category: 'Roadster Bike', engine: '440cc', defaultOilQty: '2.0L' },
      { id: 'hero-destini-125', name: 'Destini 125 XTEC', category: 'Scooter', engine: '124.6cc', defaultOilQty: '0.8L' }
    ]
  },
  {
    make: 'Bajaj',
    models: [
      { id: 'bajaj-pulsar-n160', name: 'Pulsar N160 Dual ABS', category: 'Street Bike', engine: '164.82cc', defaultOilQty: '1.2L' },
      { id: 'bajaj-pulsar-ns200', name: 'Pulsar NS200 USD', category: 'Sports Bike', engine: '199.5cc', defaultOilQty: '1.2L' },
      { id: 'bajaj-pulsar-150', name: 'Pulsar 150 Twin Disc', category: 'Commuter Sports', engine: '149.5cc', defaultOilQty: '1.15L' },
      { id: 'bajaj-freedom-cng', name: 'Freedom 125 CNG Bike', category: 'CNG Commuter', engine: '125cc CNG', defaultOilQty: '1.0L' },
      { id: 'bajaj-chetak-ev', name: 'Chetak EV Premium', category: 'Electric Scooter', engine: 'Electric (3.2kWh)', defaultOilQty: 'Gear Oil 0.12L' },
      { id: 'bajaj-dominar-400', name: 'Dominar 400 Touring', category: 'Tourer Bike', engine: '373.3cc', defaultOilQty: '1.7L' },
      { id: 'bajaj-platina-110', name: 'Platina 110 ABS', category: 'Commuter Bike', engine: '115.45cc', defaultOilQty: '1.0L' },
      { id: 'bajaj-avenger-220', name: 'Avenger Cruise 220', category: 'Cruiser Bike', engine: '220cc', defaultOilQty: '1.2L' }
    ]
  },
  {
    make: 'Suzuki',
    models: [
      { id: 'suzuki-access-125', name: 'Access 125 Ride Connect', category: 'Scooter', engine: '124cc', defaultOilQty: '0.8L' },
      { id: 'suzuki-burgman-125', name: 'Burgman Street EX', category: 'Scooter', engine: '124cc', defaultOilQty: '0.8L' },
      { id: 'suzuki-gixxer-250', name: 'Gixxer SF 250', category: 'Sports Bike', engine: '249cc', defaultOilQty: '1.5L' },
      { id: 'suzuki-avenis-125', name: 'Avenis 125 Race Edition', category: 'Scooter', engine: '124cc', defaultOilQty: '0.8L' }
    ]
  },
  {
    make: 'KTM',
    models: [
      { id: 'ktm-duke-200', name: 'Duke 200 Gen 3', category: 'Naked Bike', engine: '199.5cc', defaultOilQty: '1.5L' },
      { id: 'ktm-duke-390', name: 'Duke 390 Gen 3', category: 'Naked Bike', engine: '399cc', defaultOilQty: '1.7L' },
      { id: 'ktm-rc-200', name: 'RC 200 GP Edition', category: 'Super Sport', engine: '199.5cc', defaultOilQty: '1.5L' },
      { id: 'ktm-rc-390', name: 'RC 390 GP Edition', category: 'Super Sport', engine: '373cc', defaultOilQty: '1.7L' },
      { id: 'ktm-adventure-390', name: 'Adventure 390 SW', category: 'Adventure Bike', engine: '373cc', defaultOilQty: '1.7L' }
    ]
  },
  {
    make: 'Electric & Others (Ather / Ola / Jawa)',
    models: [
      { id: 'ather-450x', name: 'Ather 450X Gen 3', category: 'Electric Scooter', engine: 'Electric (3.7kWh)', defaultOilQty: 'Gear Oil 0.1L' },
      { id: 'ola-s1-pro', name: 'Ola S1 Pro Gen 2', category: 'Electric Scooter', engine: 'Electric (4kWh)', defaultOilQty: 'N/A' },
      { id: 'jawa-350', name: 'Jawa 350 Dual Channel', category: 'Retro Classic', engine: '334cc', defaultOilQty: '1.5L' },
      { id: 'yezdi-roadster', name: 'Yezdi Roadster', category: 'Roadster Bike', engine: '334cc', defaultOilQty: '1.5L' },
      { id: 'bmw-g310r', name: 'BMW G 310 R', category: 'Naked Bike', engine: '313cc', defaultOilQty: '1.7L' }
    ]
  }
];

const servicePackages = [
  {
    id: 'pkg-routine-basic',
    name: 'Basic Doorstep Service',
    tagline: 'Quick 15-point checkup & oil renewal',
    price: 499,
    estimatedMinutes: 45,
    serviceType: 'routine_doorstep',
    popular: false,
    features: [
      'Engine oil drain & refilling (OEM grade included)',
      'Drive chain cleaning & high-viscosity lube',
      'Air filter inspection & compressed air cleaning',
      'Spark plug gap check & cleaning',
      'Brake lever free-play & shoe adjustment',
      'Tyre pressure check & visual inspection',
      '15-point vehicle safety checklist'
    ],
    idealFor: 'Routine 3,000 km maintenance & minor servicing'
  },
  {
    id: 'pkg-routine-standard',
    name: 'Standard Doorstep Service',
    tagline: 'Comprehensive 25-point care + Wash & Polish',
    price: 799,
    estimatedMinutes: 75,
    serviceType: 'routine_doorstep',
    popular: true,
    features: [
      'All Basic Service features included',
      'Carburetor / Throttle body exterior cleaning',
      'Battery terminal cleaning & voltage load testing',
      'Front & rear brake pad / shoe de-glazing',
      'Clutch cable lubrication & free-play tuning',
      'Electrical systems & lighting audit',
      'Eco doorstep foam wash & micro-fiber polish',
      '25-point digital health report'
    ],
    idealFor: 'Regular 5,000 km complete servicing'
  },
  {
    id: 'pkg-routine-comprehensive',
    name: 'Comprehensive Doorstep Care',
    tagline: 'Full synthetic oil option & 35-point audit',
    price: 1299,
    estimatedMinutes: 110,
    serviceType: 'routine_doorstep',
    popular: false,
    features: [
      'All Standard Service features included',
      'Full synthetic high-performance oil included',
      'Brake fluid reservoir top-up (DOT 4)',
      'Air filter replacement (Genuine OEM part included)',
      'Spark plug replacement (NGK Genuine)',
      'Suspension seals & fork leak inspection',
      'Anti-rust coating on exposed metal joints',
      '30-day post-service warranty & emergency SOS cover'
    ],
    idealFor: 'Monsoon/Long ride preparation & 10,000 km care'
  },
  {
    id: 'pkg-heavy-workshop',
    name: 'Heavy Equipment Workshop Service',
    tagline: 'Pickup & drop for wheel alignment, balancing & engine overhauls',
    price: 1499,
    estimatedMinutes: 240,
    serviceType: 'heavy_workshop',
    popular: false,
    features: [
      'Doorstep vehicle pickup & safe drop by assigned mechanic',
      'Wheel alignment & dynamic wheel balancing at partner workshop',
      'Fork hydraulic oil seal replacement & rim truing',
      'Clutch assembly & friction plate replacement',
      'Brake disc rotor skimming / caliper overhaul',
      'Full digital inspection video & workshop report'
    ],
    idealFor: 'Vibration issues, tyre wear, major mechanical repairs'
  },
  {
    id: 'pkg-unclear-diagnosis',
    name: 'Unclear Issue & Noise Diagnosis Visit',
    tagline: 'Expert doorstep mechanic visit to pinpoint fault & quote exact repair',
    price: 199,
    estimatedMinutes: 30,
    serviceType: 'unclear_diagnosis',
    popular: false,
    features: [
      'Verified master mechanic arrives with diagnostic tools',
      'Road test & acoustic noise identification',
      'OBD scanner diagnostic (for EFI/BS6 models)',
      'Exact part identification & upfront spare cost estimate',
      'If part available in kit -> Fixed immediately on site',
      'If part ordered -> Diagnosis fee adjusted in final bill'
    ],
    idealFor: 'Unusual engine noise, starting troubles, unexplained hesitation'
  }
];

const oilOptions = [
  {
    id: 'oil-default',
    brand: 'OEM Standard Grade Oil',
    spec: '10W-30 Mineral API SL JASO MA2',
    priceDifference: 0,
    badge: 'Included in Base Price',
    description: 'Standard manufacturer specification oil suitable for daily commute.',
    recommendedFor: 'Daily city commuting (under 20 km/day)'
  },
  {
    id: 'oil-castrol',
    brand: 'Castrol POWER1 ULTIMATE',
    spec: '10W-30 Full Synthetic 5-in-1 Formula',
    priceDifference: 280,
    badge: 'Most Popular Upgrade',
    description: 'Surging acceleration, 50% better wear protection, stay-cool performance in traffic.',
    recommendedFor: 'High temperature city traffic & spirited riding'
  },
  {
    id: 'oil-motul',
    brand: 'Motul 7100 4T 100% Synthetic Ester',
    spec: '10W-40 Ester Technology JASO MA2',
    priceDifference: 390,
    badge: 'Premium Performance',
    description: 'Esters technology for maximum power output, smooth gear shifting, and extreme shear resistance.',
    recommendedFor: 'Performance bikes, Royal Enfield, Yamaha MT/R15, KTM'
  },
  {
    id: 'oil-shell',
    brand: 'Shell Advance AX7 Semi-Synthetic',
    spec: '10W-40 Active Cleansing Technology',
    priceDifference: 190,
    badge: 'Best Value Upgrade',
    description: 'Protects against engine sludge build-up, reduces engine noise & vibration.',
    recommendedFor: 'Long distance touring & smooth commuting'
  },
  {
    id: 'oil-gulf',
    brand: 'Gulf Pride 4T Plus Premium',
    spec: '20W-40 Oxy-B1 Anti-Thickening Formula',
    priceDifference: 130,
    badge: 'Economy Protection',
    description: 'Prevents oil degradation under extreme summer heat.',
    recommendedFor: 'Older engines & heavy daily load riding'
  }
];

const verifiedMechanics = [
  {
    id: 'mech-101',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    rating: 4.9,
    jobsCompleted: 342,
    experienceYears: 8,
    kycStatus: 'Verified',
    currentLat: 12.9716,
    currentLng: 77.5946,
    city: 'Bengaluru',
    area: 'Indiranagar / Koramangala',
    kitBarcodes: ['BAR-CAST-98213', 'BAR-MOT-44129', 'BAR-FILT-1002', 'BAR-SPK-901']
  },
  {
    id: 'mech-102',
    name: 'Suresh Verma',
    phone: '+91 98123 55678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 4.8,
    jobsCompleted: 215,
    experienceYears: 6,
    kycStatus: 'Verified',
    currentLat: 12.9352,
    currentLng: 77.6245,
    city: 'Bengaluru',
    area: 'HSR Layout / BTM',
    kitBarcodes: ['BAR-SHELL-77210', 'BAR-GULF-33102', 'BAR-FILT-2004', 'BAR-PAD-401']
  },
  {
    id: 'mech-103',
    name: 'Vikramaditya Singh',
    phone: '+91 99887 11223',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4.95,
    jobsCompleted: 512,
    experienceYears: 11,
    kycStatus: 'Verified',
    currentLat: 12.9784,
    currentLng: 77.6408,
    city: 'Bengaluru',
    area: 'MG Road / Whitefield',
    kitBarcodes: ['BAR-MOT-99120', 'BAR-CAST-11204', 'BAR-OILF-889', 'BAR-CHNLUBE-55']
  }
];

const bookings = [];
const barcodeUsageRegistry = new Map();

const seedBookings = [
  {
    id: 'SS-2026-8801',
    customerName: 'Amit Patel',
    customerPhone: '+91 98200 12345',
    vehicle: { make: 'Royal Enfield', model: 'Classic 350 (J-Series)', engine: '349cc' },
    package: servicePackages[1],
    oilOption: oilOptions[2],
    date: '2026-08-04',
    timeSlot: '10:00 AM - 11:30 AM',
    address: 'Flat 402, Royal Palms, Koramangala 4th Block, Bengaluru',
    pincode: '560034',
    locationCoords: { lat: 12.9352, lng: 77.6245 },
    totalPrice: 1285,
    status: 'Completed',
    mechanic: verifiedMechanics[0],
    flowType: 'routine_doorstep',
    otp: '4829',
    otpConfirmed: true,
    beforePhotos: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600'
    ],
    inspectionDetails: {
      odometer: '14,820 km',
      fuelLevel: '50% (Half Tank)',
      batteryVoltage: '12.6 V (Good)',
      frontTyrePressure: '28 psi',
      rearTyrePressure: '35 psi',
      brakePadLife: '65% (Good)',
      scratchNotes: 'Minor scratch on left side mirror stem'
    },
    odometerReading: '14,820 km',
    usedProducts: [
      { name: 'Motul 7100 4T 10W-40 1L Can', barcode: 'BAR-MOT-44129', photo: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400' },
      { name: 'Royal Enfield Genuine Oil Filter', barcode: 'BAR-FILT-1002', photo: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400' }
    ],
    checklist: [
      { item: 'Engine Oil Drainage & Refill', status: 'Completed', note: 'Fresh 100% synthetic oil poured.' },
      { item: 'Chain Lube & Tensioning', status: 'Completed', note: 'Tension adjusted to 25mm play.' },
      { item: 'Brake Pad Inspection', status: 'Completed', note: 'Front pad at 60% life remaining.' },
      { item: 'Spark Plug Cleaning', status: 'Completed', note: 'Cleaned NGK spark plug.' }
    ],
    afterPhotos: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600'
    ],
    createdAt: '2026-08-04T09:15:00.000Z'
  }
];

barcodeUsageRegistry.set('BAR-MOT-44129', { bookingId: 'SS-2026-8801', mechanicId: 'mech-101', timestamp: '2026-08-04T10:45:00.000Z' });
barcodeUsageRegistry.set('BAR-FILT-1002', { bookingId: 'SS-2026-8801', mechanicId: 'mech-101', timestamp: '2026-08-04T10:48:00.000Z' });

bookings.push(...seedBookings);

module.exports = {
  vehicles,
  servicePackages,
  oilOptions,
  verifiedMechanics,
  bookings,
  barcodeUsageRegistry
};
