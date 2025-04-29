const express = require('express');
const app = express();
const routes = require('./routes/routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/api-pay', routes);

const PORT = process.env.PORT || 3001;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
}

module.exports = app;
