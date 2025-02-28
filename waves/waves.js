const wave_canvas = document.getElementById('waves');
const wave_ctx = wave_canvas.getContext('2d');

let wave_frame = 0;

// Drawing config
const position = 20
const shift = 30
const shiftFactor = 0.1

// Utility for random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Set color constants for each wave:
const signalColor = "red";
const pulsingColor = "orange";
const sineColor = "green";
const squareColor = "blue";
const triangleColor = getRandomColor()
const sawtoothColor = getRandomColor()
const noiseColor = getRandomColor()
const doubleSineColor = getRandomColor()
const rippleColor = getRandomColor()
const staggeredColor = getRandomColor()
const exponentialDecayColor = getRandomColor()
const spiralColor = getRandomColor()
const harmonicColor = getRandomColor()
const elasticColor = getRandomColor()
const fractalColor = getRandomColor()
const quantumColor = getRandomColor()
const lorenzColor = getRandomColor()
const mobiusColor = getRandomColor()
const paradoxColor = getRandomColor()
const tunnelingColor = getRandomColor()
const fractalDimensionColor = getRandomColor()

//set wave positions
let offset = 30
const signalPosition = 0
const pulsingPosition = 30 
const sinePosition = 60
const squarePosition = 90


// Draw oscillating signal line at the bottom
function drawSignal(position) {
  wave_ctx.strokeStyle = signalColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    const y = position + Math.sin((x + wave_frame) * 0.1) * 5;
    if (x === 0) wave_ctx.moveTo(x, y);
    else wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Draw sine wave
function drawSineWave(position) {
  wave_ctx.strokeStyle = sineColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    const y = position + Math.sin((x + wave_frame) * 0.1) * 10;
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Draw square wave
function drawSquareWave(position) {
  wave_ctx.strokeStyle = squareColor
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    const y = position + ((x + wave_frame) % 20 < 10 ? 10 : -10);
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Draw triangle wave
function drawTriangleWave(position) {
  wave_ctx.strokeStyle = triangleColor
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    const y = position + Math.abs(((x + wave_frame) % 40) - 20) - 10;
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Draw sawtooth wave
function drawSawtoothWave(position) {
  wave_ctx.strokeStyle = sawtoothColor
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    const y = position + ((x + wave_frame) % 40) - 20;
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Draw noise wave
function drawNoiseWave(position) {
  wave_ctx.strokeStyle = noiseColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    const y = position + (Math.random() - 0.5) * 20;
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Draw double sine wave
function drawDoubleSineWave(position) {
  wave_ctx.strokeStyle = doubleSineColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    const y = position + Math.sin((x + wave_frame) * 0.1) * 10 + Math.sin((x + wave_frame) * 0.05) * 5;
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Draw pulsing wave
function drawPulsingWave(position) {
  wave_ctx.strokeStyle = pulsingColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  const amplitude = 10 + Math.sin(wave_frame * 0.1) * 5;
  for (let x = 0; x < wave_canvas.width; x++) {
    const y = position + Math.sin((x + wave_frame) * 0.1) * amplitude;
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Draw ripple wave
function drawRippleWave(position) {
  wave_ctx.strokeStyle = rippleColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    const y = position + Math.sin(Math.sqrt((x + wave_frame) * 0.1)) * 10;
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Draw staggered sine waves
function drawStaggeredSineWaves(position) {
  wave_ctx.strokeStyle = staggeredColor;
  wave_ctx.lineWidth = 2;
  for (let offset = -10; offset <= 10; offset += 5) {
    wave_ctx.beginPath();
    for (let x = 0; x < wave_canvas.width; x++) {
      const y = position + Math.sin((x + wave_frame) * 0.1 + offset) * 10;
      x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
    }
    wave_ctx.stroke();
  }
}

// Exponential decay wave
function drawExponentialDecayWave(position) {
  wave_ctx.strokeStyle = exponentialDecayColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    const decay = Math.exp(-x / (wave_canvas.width / 2));
    const y = position + Math.sin((x + wave_frame) * 0.1) * 10 * decay;
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Spiral wave
function drawSpiralWave(position) {
  wave_ctx.strokeStyle = spiralColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    const angle = (x + wave_frame) * 0.1;
    const radius = Math.sin(angle) * 10;
    const y = position + Math.cos(angle) * radius;
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Harmonic wave with multiple frequencies
function drawHarmonicWave(position) {
  wave_ctx.strokeStyle = harmonicColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    const y = position + 
      Math.sin((x + wave_frame) * 0.05) * 10 +      // Low frequency
      Math.sin((x + wave_frame) * 0.1) * 5 +        // Medium frequency
      Math.sin((x + wave_frame) * 0.2) * 2;         // High frequency
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Elastic wave (bouncing effect)
function drawElasticWave(position) {
  wave_ctx.strokeStyle = elasticColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    const bounce = Math.sin(x * 0.05 + wave_frame * 0.1);
    const y = position + Math.sin((x + wave_frame) * 0.1) * 10 * Math.abs(bounce);
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Fractal-like wave
function drawFractalWave(position) {
  wave_ctx.strokeStyle = fractalColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    const y = position + 
      Math.sin((x + wave_frame) * 0.1) * 10 +
      Math.sin((x + wave_frame) * 0.2) * 5 * Math.sin((x + wave_frame) * 0.05);
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Quantum-inspired wave function
function drawQuantumWave(position) {
  wave_ctx.strokeStyle = quantumColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    // Probability-like wave with uncertainty principle simulation
    const uncertainty = Math.sin(wave_frame * 0.05) * 5;
    const y = position + 
      Math.sin((x + wave_frame) * 0.1) * 10 * 
      Math.abs(Math.cos(x * uncertainty * 0.01));
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Chaotic attractor wave
function drawLorenzAttractorWave(position) {
  wave_ctx.strokeStyle = lorenzColor;
  wave_ctx.lineWidth = 2;
  
  // Lorenz system parameters
  const sigma = 10;
  const rho = 28;
  const beta = 8/3;
  
  let x = 0.1, y = 0, z = 0;
  
  wave_ctx.beginPath();
  for (let i = 0; i < wave_canvas.width; i++) {
    // Lorenz attractor differential equations
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;
    
    x += dx * 0.01;
    y += dy * 0.01;
    z += dz * 0.01;
    
    const plotY = position + (z * 3) % 50;
    i === 0 ? wave_ctx.moveTo(i, plotY) : wave_ctx.lineTo(i, plotY);
  }
  wave_ctx.stroke();
}

// Möbius strip-inspired wave
function drawMobiusWave(position) {
  wave_ctx.strokeStyle = mobiusColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    // Twist and transform wave
    const twist = Math.sin(x * 0.1 + wave_frame * 0.05);
    const y = position + 
      Math.sin((x + wave_frame) * 0.1) * 10 * 
      (1 + Math.sin(twist * Math.PI));
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Paradoxical wave (self-referential)
function drawParadoxWave(position) {
  wave_ctx.strokeStyle = paradoxColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    // Wave that influences its own amplitude
    const selfInfluence = Math.sin(x * 0.05 + wave_frame * 0.1);
    const y = position + 
      Math.sin((x + wave_frame) * (1 + Math.abs(selfInfluence)) * 0.1) * 
      (10 + selfInfluence * 5);
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Quantum tunneling simulation wave
function drawQuantumTunnelingWave(position) {
  wave_ctx.strokeStyle = quantumColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    // Simulate quantum tunneling probability
    const barrier = Math.sin(x * 0.05) > 0.5 ? 0.1 : 1;
    const y = position + 
      Math.sin((x + wave_frame) * 0.1) * 10 * 
      Math.exp(-barrier * Math.abs(Math.sin(x * 0.01)));
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

// Fractal dimension wave
function drawFractalDimensionWave(position) {
  wave_ctx.strokeStyle = fractalDimensionColor;
  wave_ctx.lineWidth = 2;
  wave_ctx.beginPath();
  for (let x = 0; x < wave_canvas.width; x++) {
    // Create wave with fractal-like self-similarity
    const fractalDimension = Math.sin(wave_frame * 0.05) * 0.5 + 1.5;
    const y = position + 
      Math.pow(Math.sin((x + wave_frame) * 0.1), fractalDimension) * 20;
    x === 0 ? wave_ctx.moveTo(x, y) : wave_ctx.lineTo(x, y);
  }
  wave_ctx.stroke();
}

function drawFormulaText(formula, position) {
  wave_ctx.fillStyle = "white";
  wave_ctx.font = "12px monospace";
  wave_ctx.textAlign = "left";
  wave_ctx.fillText(formula, 10, position);
}

// Draw dashboard
function drawWaves() {
  wave_ctx.clearRect(0, 0, wave_canvas.width, wave_canvas.height);

  // Signal Wave
  drawSignal(position + 10);
  drawFormulaText(`shift = ${shift}`, position);
  //drawFormulaText("y = pos + sin((x + t) * 0.1) * 5", position);

  // Pulsing Wave
  drawPulsingWave(position + 30);
  drawFormulaText(`shift = ${shift}`, position + 30);
  //drawFormulaText("y = pos + sin((x + t) * 0.1) * A", position + shift);

  // Sine Wave
  drawSineWave(position + 60);
  drawFormulaText(`shift = ${shift}`, position + 60);
  //drawFormulaText("y = pos + sin((x + t) * 0.1) * 10", position + shift);

  // Square Wave
  drawSquareWave(position + 90);
  drawFormulaText(`shift = ${shift}`, position + 90);
  //drawFormulaText("y = pos + ((x + t) % 20 < 10 ? 10 : -10)", position + 100);

  // Triangle Wave
  drawTriangleWave(position + 120);
  drawFormulaText(`shift = ${shift}`, position + 120);
  //drawFormulaText("y = pos + |((x + t) % 40) - 20| - 10", position + 130);

  // Sawtooth Wave
  drawSawtoothWave(position + 160);
  drawFormulaText(`shift = ${shift}`, position + 160);
  //drawFormulaText("y = pos + ((x + t) % 40) - 20", position + 170);

  // Noise Wave
  drawNoiseWave(position + 210);
  drawFormulaText(`shift = ${shift}`, position + 210);
  //drawFormulaText("y = pos + (rand() - 0.5) * 20", position + 220);

  // Double Sine Wave
  drawDoubleSineWave(position + 250);
  //drawFormulaText("y = pos + sin(x * 0.1) * 10 + sin(x * 0.05) * 5", position + 260);

  // Ripple Wave
  drawRippleWave(position + 310);
  //drawFormulaText("y = pos + sin(√(x * 0.1)) * 10", position + 320);

  // Staggered Sine Waves
  drawStaggeredSineWaves(position + 340);
  //drawFormulaText("y = pos + sin((x + t) * 0.1 + offset) * 10", position + 380);

  // Exotic Waves
  
  // Quantum Wave
  drawQuantumWave(position + 620);
  //drawFormulaText("y = pos + sin((x + t) * 0.1) * 10 * |cos(x * u * 0.01)|", position + 630);

  // Lorenz Attractor Wave
  drawLorenzAttractorWave(position + 660);
  //drawFormulaText("dx/dt = σ(y - x), dy/dt = x(ρ - z) - y", position + 670);

  // Möbius Wave
  drawMobiusWave(position + 700);
  //drawFormulaText("y = pos + sin((x + t) * 0.1) * 10 * (1 + sin(twist * π))", position + 710);

  // Paradox Wave
  drawParadoxWave(position + 740);
  //drawFormulaText("y = pos + sin((x + t) * (1 + |si|) * 0.1) * (10 + si * 5)", position + 750);

  // Quantum Tunneling Wave
  drawQuantumTunnelingWave(position + 780);
  //drawFormulaText("y = pos + sin((x + t) * 0.1) * 10 * exp(-b * |sin(x * 0.01)|)", position + 790);

  // Fractal Dimension Wave
  drawFractalDimensionWave(position + 820);
  drawFormulaText("y = pos + sin((x + t) * 0.1)^D * 20", position + 830);

  wave_frame++;
  requestAnimationFrame(drawWaves);
}

drawWaves();
