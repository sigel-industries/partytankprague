/* Party Tank Booking V1 configuration.
 * Keep mode="mock" while testing the UX. Switch to "apps-script" only after
 * deploying the Apps Script web app and filling endpoint.
 */
window.PARTY_TANK_BOOKING_CONFIG = Object.freeze({
  mode: "mock", // "mock" | "apps-script"
  endpoint: "",
  vehicleId: "hummer-h2-01",
  timezone: "Europe/Prague",
  slotStepMinutes: 60,
  turnaroundMinutes: 30,
  operatingHours: {
    start: "10:00",
    end: "23:00"
  },
  requestTimeoutMs: 15000
});
