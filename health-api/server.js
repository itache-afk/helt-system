require('dotenv').config();
const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');
const r = require('./routes/routes');

const app = express();
app.use(cors());
app.use(express.json());

// Public
app.use('/api/auth', require('./routes/auth'));

// Protected (token required)
app.use('/api/medicine', auth, r.medicine);
app.use('/api/illness', auth, r.illness);
app.use('/api/users', auth, r.users);
app.use('/api/user-illness', auth, r.userIllness);

app.listen(process.env.PORT, () =>
  console.log(`API running on http://localhost:${process.env.PORT}`)
);