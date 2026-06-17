// ==========================================================
// SIGMA(T) LOG-SPLINE NUEVO
// No pisa sigma_model_log_spline_v2.js antiguo
// ==========================================================

window.SIGMA_MODEL_LOG_SPLINE_NUEVO = {
  "version": "sigma_log_spline_nuevo",
  "description": "Conductividad sigma(T) mediante spline c\u00fabico natural sobre log10(sigma) usando nodos COMSOL.",
  "T_nodes_C": [
    700.0,
    750.0,
    800.0,
    850.0
  ],
  "sigma_nodes_S_m": [
    0.3,
    1.0,
    10.0,
    1200.0
  ],
  "log10_sigma_nodes": [
    -0.5228787452803376,
    0.0,
    1.0,
    3.0791812460476247
  ],
  "spline_bc_type": "natural",
  "spline_coeffs": [
    [
      4.422953455098813e-07,
      1.6054933102078951e-06,
      -2.047788655717786e-06
    ],
    [
      -6.776263578034403e-20,
      6.634430182648216e-05,
      0.0003071682983576675
    ],
    [
      0.009351836541832052,
      0.012669051633156155,
      0.031344681642363585
    ],
    [
      -0.5228787452803376,
      0.0,
      1.0
    ]
  ],
  "log10_delta": 0.3,
  "clip_temperature": true,
  "T_min_C": 700.0,
  "T_max_C": 850.0
};


window.calcularSigmaLogSplineNuevo = function(T_C) {
  const M = window.SIGMA_MODEL_LOG_SPLINE_NUEVO;

  let T = Number(T_C);

  if (M.clip_temperature) {
    if (T < M.T_min_C) T = M.T_min_C;
    if (T > M.T_max_C) T = M.T_max_C;
  }

  const xs = M.T_nodes_C;
  const coeffs = M.spline_coeffs;

  let intervalIndex = xs.length - 2;

  for (let i = 0; i < xs.length - 1; i++) {
    if (T >= xs[i] && T <= xs[i + 1]) {
      intervalIndex = i;
      break;
    }
  }

  const dx = T - xs[intervalIndex];

  const c0 = coeffs[0][intervalIndex];
  const c1 = coeffs[1][intervalIndex];
  const c2 = coeffs[2][intervalIndex];
  const c3 = coeffs[3][intervalIndex];

  const log10_sigma = c0 * dx * dx * dx + c1 * dx * dx + c2 * dx + c3;
  const sigma = Math.pow(10, log10_sigma);

  return sigma;
};

window.calcularRangoSigmaLogSplineNuevo = function(T_C) {
  const M = window.SIGMA_MODEL_LOG_SPLINE_NUEVO;
  const sigmaObj = window.calcularSigmaLogSplineNuevo(T_C);
  const delta = M.log10_delta;

  const sigmaMin = sigmaObj * Math.pow(10, -delta);
  const sigmaMax = sigmaObj * Math.pow(10, +delta);

  return {
    sigma_obj: sigmaObj,
    sigma_min: sigmaMin,
    sigma_max: sigmaMax,
    log10_delta: delta
  };
};
