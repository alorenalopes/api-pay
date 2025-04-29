const express = require('express');
const app = express();
const providerOneRoutes = require('./routes/providerOneRoutes');
const providerTwoRoutes = require('./routes/providerTwoRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/', providerOneRoutes);
app.use('/', providerTwoRoutes);

const PORT = 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
}

module.exports = app;