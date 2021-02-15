const express = require('express');
const path = require('path');
let app = express();

app.get('/', (req, res) => { 
  res.sendFile(path.join('./', 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));