const express = require('express');
const app = express();
const path = require('path');

// Serve static files
app.use(express.static(path.join(__dirname)));

// Start the server
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
