const supabase = require('../data/database');


// GET all bookings for a mechanic
const getMechanicJobs = async (req, res) => {
  try {
    const { mechanicId } = req.params;

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        products_used (*)
      `)
      .eq('mechanic_id', mechanicId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedBookings = (bookings || []).map(b => ({
      id: b.id,
      customerName: b.customer_name,
      customerPhone: b.customer_phone,
      customerEmail: b.customer_email,
      vehicle: {
        make: b.vehicle_make,
        model: b.vehicle_model,
        year: b.vehicle_year,
        reg: b.vehicle_reg
      },
      address: b.address,
      serviceType: b.service_type,
      status: b.status,
      mechanicId: b.mechanic_id,
      totalPrice: b.total_price,
      inspectionDetails: b.inspection_details || {},
      paymentStatus: b.payment_status,
      usedProducts: (b.products_used || []).map(p => ({
        name: p.name,
        barcode: p.barcode
      })),
      createdAt: b.created_at
    }));

    res.json({ jobs: formattedBookings });
  } catch (err) {
    console.error('getMechanicJobs error:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET all bookings (Admin)
const getAllBookings = async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`*, products_used (*)`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedBookings = (bookings || []).map(b => ({
      id: b.id,
      customerName: b.customer_name,
      customerPhone: b.customer_phone,
      customerEmail: b.customer_email,
      vehicle: {
        make: b.vehicle_make,
        model: b.vehicle_model,
        year: b.vehicle_year,
        reg: b.vehicle_reg
      },
      address: b.address,
      serviceType: b.service_type,
      status: b.status,
      mechanicId: b.mechanic_id,
      totalPrice: b.total_price,
      inspectionDetails: b.inspection_details || {},
      paymentStatus: b.payment_status,
      usedProducts: (b.products_used || []).map(p => ({ name: p.name, barcode: p.barcode })),
      createdAt: b.created_at
    }));

    res.json({ bookings: formattedBookings });
  } catch (err) {
    console.error('getAllBookings error:', err);
    res.status(500).json({ error: err.message });
  }
};

// CREATE new booking
const createBooking = async (req, res) => {
  try {
    const {
      customerName, customerPhone, customerEmail,
      vehicleMake, vehicleModel, vehicleYear, vehicleReg,
      address, serviceType, mechanicId, totalPrice
    } = req.body;

    const bookingId = 'BK-' + Date.now();
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        id: bookingId,
        customer_name: customerName || 'Customer',
        customer_phone: customerPhone || '',
        customer_email: customerEmail || '',
        vehicle_make: vehicleMake || '',
        vehicle_model: vehicleModel || '',
        vehicle_year: vehicleYear || '',
        vehicle_reg: vehicleReg || '',
        address: address || '',
        service_type: serviceType || 'General Service',
        status: 'Confirmed',
        mechanic_id: mechanicId || 'mech-101',
        total_price: totalPrice || 0,
        payment_status: 'Pending',
        otp,
        inspection_details: {}
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      booking: {
        id: data.id,
        customerName: data.customer_name,
        status: data.status,
        otp: data.otp
      }
    });
  } catch (err) {
    console.error('createBooking error:', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE booking status + inspection
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, inspectionDetails } = req.body;

    const updateData = {
      updated_at: new Date().toISOString()
    };
    if (status) updateData.status = status;
    if (inspectionDetails) updateData.inspection_details = inspectionDetails;

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select(`*, products_used (*)`)
      .single();

    if (error) throw error;

    res.json({
      booking: {
        id: data.id,
        customerName: data.customer_name,
        status: data.status,
        inspectionDetails: data.inspection_details,
        usedProducts: (data.products_used || []).map(p => ({ name: p.name, barcode: p.barcode }))
      }
    });
  } catch (err) {
    console.error('updateBookingStatus error:', err);
    res.status(500).json({ error: err.message });
  }
};

// ADD product used (barcode scan)
const addProductUsed = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, barcode } = req.body;

    if (!barcode) {
      return res.status(400).json({ error: 'Barcode is required' });
    }

    // Check for duplicate barcode across ALL bookings
    const { data: existing } = await supabase
      .from('products_used')
      .select('booking_id')
      .eq('barcode', barcode)
      .maybeSingle();

    if (existing && existing.booking_id !== id) {
      return res.status(409).json({
        error: `SECURITY ALERT: Barcode [${barcode}] was already used in booking ${existing.booking_id}. Possible counterfeit product!`
      });
    }

    if (existing && existing.booking_id === id) {
      return res.status(409).json({
        error: `DUPLICATE: Barcode [${barcode}] is already added to this booking.`
      });
    }

    // Insert new product
    await supabase
      .from('products_used')
      .insert([{ booking_id: id, name: name || 'Product', barcode }]);

    // Fetch updated products list
    const { data: products } = await supabase
      .from('products_used')
      .select('*')
      .eq('booking_id', id);

    res.json({
      usedProducts: (products || []).map(p => ({ name: p.name, barcode: p.barcode }))
    });
  } catch (err) {
    console.error('addProductUsed error:', err);
    res.status(500).json({ error: err.message });
  }
};

// REMOVE product used (barcode release)
const removeProductUsed = async (req, res) => {
  try {
    const { id, barcode } = req.params;

    await supabase
      .from('products_used')
      .delete()
      .eq('booking_id', id)
      .eq('barcode', barcode);

    const { data: products } = await supabase
      .from('products_used')
      .select('*')
      .eq('booking_id', id);

    res.json({
      usedProducts: (products || []).map(p => ({ name: p.name, barcode: p.barcode }))
    });
  } catch (err) {
    console.error('removeProductUsed error:', err);
    res.status(500).json({ error: err.message });
  }
};

// VERIFY OTP and complete booking
const verifyOtpAndComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    const { data: booking } = await supabase
      .from('bookings')
      .select('otp')
      .eq('id', id)
      .single();

    if (!booking || booking.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
    }

    const { data: updated } = await supabase
      .from('bookings')
      .update({ status: 'Completed', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select(`*, products_used (*)`)
      .single();

    res.json({
      booking: {
        id: updated.id,
        status: updated.status,
        usedProducts: (updated.products_used || []).map(p => ({ name: p.name, barcode: p.barcode }))
      }
    });
  } catch (err) {
    console.error('verifyOtpAndComplete error:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET all bookings (alias for routes)
const getBookings = getAllBookings;

// GET single booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('bookings')
      .select(`*, products_used (*)`)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Booking not found' });

    res.json({
      booking: {
        id: data.id,
        customerName: data.customer_name,
        customerPhone: data.customer_phone,
        vehicle: { make: data.vehicle_make, model: data.vehicle_model, year: data.vehicle_year, reg: data.vehicle_reg },
        address: data.address,
        serviceType: data.service_type,
        status: data.status,
        totalPrice: data.total_price,
        paymentStatus: data.payment_status,
        otp: data.otp,
        inspectionDetails: data.inspection_details || {},
        usedProducts: (data.products_used || []).map(p => ({ name: p.name, barcode: p.barcode }))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// RATE a booking
const rateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    await supabase.from('bookings').update({ rating, review, updated_at: new Date().toISOString() }).eq('id', id);
    res.json({ success: true, message: 'Rating submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET audit logs (all product scans)
const getAuditLogs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products_used')
      .select('*, bookings(customer_name, vehicle_make, vehicle_model)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json({ auditLogs: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getMechanicJobs,
  getAllBookings,
  createBooking,
  updateBookingStatus,
  addProductUsed,
  removeProductUsed,
  verifyOtpAndComplete,
  getBookings,
  getBookingById,
  rateBooking,
  getAuditLogs
};
