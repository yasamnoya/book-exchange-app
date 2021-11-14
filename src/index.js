require('dotenv').config();
const app = require('./app');
const mongooseConnection = require('./config/mongoose');

mongooseConnection.on('error', (e) => console.log('Failed to connect database', e));
mongooseConnection.once('open', () => console.log('Connected to database'));

const port = process.env.PORT;
app.listen(port, () => console.log(`Server listening on port ${port}`));
