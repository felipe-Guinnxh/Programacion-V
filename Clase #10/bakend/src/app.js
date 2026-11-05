import express from 'express';
import { fileURLToPath } from 'node:url';

import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import cityRouter from './routes/ciudades.routes.js';
import clientRouter from './routes/clientes.routes.js';
import healthRouter from './routes/health.routes.js';
import officeRouter from './routes/oficinas.routes.js';
import projectRouter from './routes/proyectos.routes.js';

const app = express();
const frontDirectory = fileURLToPath(new URL('../../front', import.meta.url));
const initialFrontDirectory = fileURLToPath(
  new URL('../../frontInicial', import.meta.url),
);

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));
app.use(express.static(frontDirectory));
app.use('/inicial', express.static(initialFrontDirectory));

app.use('/api/v1/health', healthRouter);
app.use('/api/v1/ciudades', cityRouter);
app.use('/api/v1/clientes', clientRouter);
app.use('/api/v1/oficinas', officeRouter);
app.use('/api/v1/proyectos', projectRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
