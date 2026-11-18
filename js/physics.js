// Pure Physics Engine for Projectile Motion Virtual Lab
// No DOM dependencies - runs in both Browser and Node.js test environment

(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Physics = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const DEFAULT_G = 9.8;
  const DEFAULT_POINTS = 60;

  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function toDeg(rad) {
    return (rad * 180) / Math.PI;
  }

  /**
   * Simulates projectile trajectory given angle (deg), speed (m/s), launch height (m), and g.
   * Assumes flat ground, no air resistance. Range is horizontal distance from launch x=0 to ground landing y=0.
   *
   * @param {number} theta - Launch angle in degrees (0 to 90)
   * @param {number} v - Launch speed in m/s
   * @param {number} h - Launch height in meters (>= 0)
   * @param {number} g - Gravitational acceleration in m/s^2 (default 9.8)
   * @param {number} numPoints - Trajectory resolution (default 60)
   * @returns {object} { theta, v, h, g, vx, vy, T, R, H, path: [{s, x, y}] }
   */
  function simulate(theta, v, h = 0, g = DEFAULT_G, numPoints = DEFAULT_POINTS) {
    const thetaRad = toRad(theta);
    const vx = v * Math.cos(thetaRad);
    const vy = v * Math.sin(thetaRad);

    // Time of flight: solve y(t) = h + vy*t - 0.5*g*t^2 = 0
    // Quadratic formula: 0.5*g*t^2 - vy*t - h = 0
    // t = (vy + sqrt(vy^2 + 2*g*h)) / g
    const disc = vy * vy + 2 * g * h;
    const T = disc >= 0 ? (vy + Math.sqrt(disc)) / g : 0;

    // Horizontal range R
    const R = vx * T;

    // Maximum height above the ground H
    // Peak occurs at t_peak = vy / g if vy > 0. If vy <= 0, peak is launch height h.
    const H = vy > 0 ? h + (vy * vy) / (2 * g) : h;

    // Sample discrete trajectory points for canvas animation and rendering
    const path = [];
    for (let i = 0; i <= numPoints; i++) {
      const s = (T * i) / numPoints;
      const x = vx * s;
      const y = h + vy * s - 0.5 * g * s * s;
      path.push({
        s: Number(s.toFixed(4)),
        x: Number(x.toFixed(4)),
        y: Number(Math.max(0, y).toFixed(4))
      });
    }

    return {
      theta,
      v,
      h,
      g,
      vx,
      vy,
      T,
      R,
      H,
      path
    };
  }

  /**
   * Calculates the theoretical optimal angle (in degrees) that maximizes range
   * for a launch from height h with speed v.
   * θ* = atan( v / sqrt(v^2 + 2*g*h) )
   * Note: Used only for evaluation/checks, NEVER displayed prematurely to the learner.
   *
   * @param {number} v - Launch speed in m/s
   * @param {number} h - Launch height in meters
   * @param {number} g - Gravity (default 9.8)
   * @returns {number} Optimal launch angle in degrees
   */
  function bestAngle(v, h = 0, g = DEFAULT_G) {
    if (h <= 0) {
      return 45;
    }
    const denom = Math.sqrt(v * v + 2 * g * h);
    if (denom === 0) return 45;
    const thetaRad = Math.atan(v / denom);
    return toDeg(thetaRad);
  }

  return {
    toRad,
    toDeg,
    simulate,
    bestAngle
  };
});
