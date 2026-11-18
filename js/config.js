// Projectile Virtual Lab - Global Configuration
// All key parameters, limits, step sizes, and constants live here for rapid viva adjustments.

const CONFIG = {
  ROLL_NO: '23B2456',
  APP_TITLE: 'Projectile Virtual Lab',
  G: 9.8, // Acceleration due to gravity in m/s^2

  // Variable boundaries and increments for steppers
  LIMITS: {
    theta: { min: 0, max: 90, step: 1, default: 45, unit: '°', name: 'Launch Angle' },
    v: { min: 5, max: 40, step: 1, default: 20, unit: 'm/s', name: 'Launch Speed' },
    h: { min: 0, max: 30, step: 1, default: 0, unit: 'm', name: 'Launch Height' }
  },

  // Tolerances
  TOLERANCE: {
    hit: 2.0,       // Target hit tolerance in meters (+/- 2m)
    m2Ratio: 0.10,  // 10% tolerance for M2 misconception check
    angleOpt: 2.0   // Degrees within optimum for stretch challenge
  },

  // Trajectory simulation resolution
  PATH_POINTS: 60,

  // Mobile constraint (C3)
  TARGET_WIDTH: 360,

  // Storage key
  STORAGE_KEY: 'et617_23b2456_lab_state'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
