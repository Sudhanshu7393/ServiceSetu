const API_BASE = '/api';

export async function fetchVehicles() {
  const res = await fetch(`${API_BASE}/vehicles`);
  if (!res.ok) throw new Error('Failed to fetch vehicles');
  return res.json();
}

export async function fetchServicePackages() {
  const res = await fetch(`${API_BASE}/packages`);
  if (!res.ok) throw new Error('Failed to fetch service packages');
  return res.json();
}

export async function fetchOilOptions() {
  const res = await fetch(`${API_BASE}/oil-options`);
  if (!res.ok) throw new Error('Failed to fetch oil options');
  return res.json();
}

export async function createBooking(bookingData) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create booking');
  return data;
}

export async function fetchBookings(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/bookings?${query}`);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

export async function fetchBookingById(id) {
  const res = await fetch(`${API_BASE}/bookings/${id}`);
  if (!res.ok) throw new Error('Failed to fetch booking details');
  return res.json();
}

export async function updateBookingStatus(id, updateData) {
  const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update booking status');
  return data;
}

export async function addProductUsed(id, productData) {
  const res = await fetch(`${API_BASE}/bookings/${id}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to verify product barcode');
  return data;
}

export async function removeProductUsed(id, barcode) {
  const res = await fetch(`${API_BASE}/bookings/${id}/products/${encodeURIComponent(barcode)}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to remove scanned item');
  return data;
}

export async function rateBooking(id, ratingData) {
  const res = await fetch(`${API_BASE}/bookings/${id}/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ratingData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to submit rating');
  return data;
}

export async function verifyOtpAndComplete(id, otp) {
  const res = await fetch(`${API_BASE}/bookings/${id}/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to verify OTP');
  return data;
}

export async function createRazorpayOrder(amount, bookingId) {
  const res = await fetch(`${API_BASE}/payments/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, bookingId })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create Razorpay Order');
  return data;
}

export async function verifyRazorpaySignature(paymentData) {
  const res = await fetch(`${API_BASE}/payments/verify-signature`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Razorpay Signature Verification Failed');
  return data;
}

export async function updateMechanicGpsLocation(mechanicId, locationData) {
  const res = await fetch(`${API_BASE}/mechanics/${mechanicId}/location`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(locationData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update mechanic location');
  return data;
}

export async function fetchAuditLogs() {
  const res = await fetch(`${API_BASE}/admin/audit-logs`);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function fetchMechanics() {
  const res = await fetch(`${API_BASE}/mechanics`);
  if (!res.ok) throw new Error('Failed to fetch mechanics');
  return res.json();
}

export async function fetchMechanicJobs(mechanicId) {
  const res = await fetch(`${API_BASE}/mechanics/${mechanicId}/jobs`);
  if (!res.ok) throw new Error('Failed to fetch mechanic jobs');
  return res.json();
}
