const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const allowedOrigins = require('./configs/allowedOrigins.config.json');
require('dotenv').config({ path: "./configs/.env" });
const routes = require('./routes/index');
const tenantMiddleware = require('./middleware/tenantMiddleware');
const errorHandlerMiddleware = require('./middleware/errorHandlerMiddleware');

//Express Server Setup
const app = express();
const port = process.env.PORT || 5123;
const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const origins = allowedOrigins[env];
const corsOptions = {
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
    credentials: true,
};

//Express Middlewares
app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api/stripe/webhooks')) {
        express.raw({ type: 'application/json' })(req, res, next);
    } else {
        express.json()(req, res, next);
    }
});
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/static', express.static(path.join(__dirname, 'static')));

//Server status endpoint
app.get('/', (req, res) => {
    res.send('Client server is running...!');
});

// Routes
app.use("/api", tenantMiddleware, routes);

//Error Handler
app.use(errorHandlerMiddleware);

app.listen(port, () => {
    console.log(`Node/Express Server is Up......\nPort: localhost:${port}`);
});