'use strict';

let express = require('express');

let app = express();

let port = process.env.PORT || 10050;
app.listen(port);
console.log(`server running on http://localhost:${port}`);