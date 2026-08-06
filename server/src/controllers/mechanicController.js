const supabase = require('../data/database');

// GET all mechanics
exports.getMechanics = async (req, res) => {
  try {
    const { data: mechanics, error } = await supabase
      .from('mechanics')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      count: (mechanics || []).length,
      mechanics: mechanics || []
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET mechanic jobs
exports.getMechanicJobs = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`*, products_used (*)`)
      .eq('mechanic_id', id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const jobs = (bookings || []).map(b => ({
      id: b.id,
      customerName: b.customer_name,
      customerPhone: b.customer_phone,
      vehicle: {
        make: b.vehicle_make,
        model: b.vehicle_model,
        year: b.vehicle_year,
        reg: b.vehicle_reg
      },
      address: b.address,
      serviceType: b.service_type,
      status: b.status,
      totalPrice: b.total_price,
      inspectionDetails: b.inspection_details || {},
      usedProducts: (b.products_used || []).map(p => ({ name: p.name, barcode: p.barcode }))
    }));

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE Mechanic Live GPS Location
exports.updateMechanicLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng, speed, accuracy } = req.body;

    const { error } = await supabase
      .from('mechanics')
      .upsert({
        id,
        lat,
        lng,
        speed: speed || 0,
        accuracy: accuracy || 10,
        last_location_update: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: `Mechanic ${id} GPS location updated!`,
      location: { lat, lng }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
