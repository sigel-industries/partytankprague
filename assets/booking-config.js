/* Party Tank Booking configuration.
 *
 * DEV connection:
 * - availability is read from Party Tank DEV Google Calendar
 * - submitted requests are written to Party Tank Bookings DEV
 * - pricing remains optional and disabled until real prices are agreed
 */
window.PARTY_TANK_BOOKING_CONFIG = Object.freeze({
  mode: "apps-script", // "mock" | "apps-script"
  endpoint: "https://script.google.com/macros/s/AKfycbwV-EVVVpS9VFwxOuonpUyPVL4Z5Cdj2R48vxBoRLzeKMtrSNFVygNC3_ypbNGiRdK_/exec",
  vehicleId: "hummer-h2-01",
  timezone: "Europe/Prague",
  slotStepMinutes: 30,
  turnaroundMinutes: 30,
  operatingHours: {
    start: "10:00",
    end: "23:00"
  },
  pricing: {
    enabled: false,
    currency: "CZK",
    displayMode: "from", // "from" | "exact"
    byDurationMinutes: {
      60: null,
      120: null,
      180: null,
      240: null
    }
  },
  requestTimeoutMs: 20000
});
