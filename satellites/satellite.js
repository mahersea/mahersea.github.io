// app.js (Node/Express server)
const express = require('express');
const satellite = require('satellite.js');

const app = express();
const port = 2000;

// Example TLE for ISS
const tleLine1 = '1 25544U 98067A   21275.51084722  .00001560  00000-0  34528-4 0  9993';
const tleLine2 = '2 25544  51.6441  10.5432 0004583 118.1426  41.9673 15.48932877299968';
const satrec = satellite.twoline2satrec(tleLine1, tleLine2);

app.get('/satellite', (req, res) => {
  const now = new Date();
  const positionAndVelocity = satellite.propagate(satrec, now);
  const positionEci = positionAndVelocity.position;
  if (positionEci) {
    const gmst = satellite.gstime(now);
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);
    res.json({
      timestamp: now.toISOString(),
      position: {
        latitude: satellite.degreesLat(positionGd.latitude),
        longitude: satellite.degreesLong(positionGd.longitude),
        altitude: positionGd.height  // in kilometers
      }
    });
  } else {
    res.status(500).json({ error: "Propagation error" });
  }
});

app.use(express.static('public')); // serve static files

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
