import assert from 'node:assert/strict';
import { test } from 'node:test';

import app from '../src/app.js';
import { pool } from '../src/config/database.js';

async function startServer() {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  return server;
}

function url(server, path) {
  return `http://127.0.0.1:${server.address().port}${path}`;
}

async function request(server, path, options = {}) {
  const response = await fetch(url(server, path), {
    ...options,
    headers: { 'content-type': 'application/json', ...options.headers },
  });
  return {
    response,
    body: response.status === 204 ? null : await response.json(),
  };
}

test('CRUD de clientes, oficinas y proyectos conserva los datos originales', {
  timeout: 20000,
}, async () => {
  const server = await startServer();
  const suffix = Date.now();
  let clientId;
  let officeId;
  let projectId;

  try {
    const [[counts]] = await pool.execute(
      `SELECT
         (SELECT COUNT(*) FROM clientes) AS clientes,
         (SELECT COUNT(*) FROM oficinas) AS oficinas,
         (SELECT COUNT(*) FROM proyectos) AS proyectos`,
    );

    const officeCreated = await request(server, '/api/v1/oficinas', {
      method: 'POST', body: JSON.stringify({ nombre: `Oficina temporal ${suffix}` }),
    });
    assert.equal(officeCreated.response.status, 201);
    officeId = officeCreated.body.data.id;
    assert.equal((await request(server, `/api/v1/oficinas/${officeId}`)).response.status, 200);
    assert.equal((await request(server, `/api/v1/oficinas?search=${suffix}`)).body.meta.total, 1);
    assert.equal((await request(server, `/api/v1/oficinas/${officeId}`, {
      method: 'PUT', body: JSON.stringify({ nombre: `Oficina reemplazada ${suffix}` }),
    })).response.status, 200);
    assert.equal((await request(server, `/api/v1/oficinas/${officeId}`, {
      method: 'PATCH', body: JSON.stringify({ nombre: `Oficina actualizada ${suffix}` }),
    })).body.data.nombre, `Oficina actualizada ${suffix}`);

    const clientCreated = await request(server, '/api/v1/clientes', {
      method: 'POST',
      body: JSON.stringify({
        ciudadId: 1,
        nombre: `Cliente temporal ${suffix}`,
        telefono: '5551234',
        segmento: 'empresa',
      }),
    });
    assert.equal(clientCreated.response.status, 201);
    clientId = clientCreated.body.data.id;
    assert.equal(clientCreated.body.data.ciudad.id, 1);
    assert.equal((await request(server, `/api/v1/clientes/${clientId}`)).response.status, 200);
    assert.equal((await request(server, `/api/v1/clientes?search=${suffix}&segmento=empresa`)).body.meta.total, 1);
    assert.equal((await request(server, `/api/v1/clientes/${clientId}`, {
      method: 'PUT',
      body: JSON.stringify({ ciudadId: 2, nombre: `Cliente reemplazado ${suffix}`, telefono: null, segmento: 'persona' }),
    })).body.data.ciudadId, 2);
    assert.equal((await request(server, `/api/v1/clientes/${clientId}`, {
      method: 'PATCH', body: JSON.stringify({ telefono: '9999999', segmento: 'empresa' }),
    })).body.data.telefono, '9999999');

    const projectCreated = await request(server, '/api/v1/proyectos', {
      method: 'POST',
      body: JSON.stringify({
        clienteId: clientId,
        oficinaId: officeId,
        proyecto: `Proyecto temporal ${suffix}`,
        fechaFinProyecto: '2026-12-31',
        costoProyecto: 1500.25,
      }),
    });
    assert.equal(projectCreated.response.status, 201);
    projectId = projectCreated.body.data.id;
    assert.equal(projectCreated.body.data.cliente.id, clientId);
    assert.equal((await request(server, `/api/v1/proyectos/${projectId}`)).response.status, 200);
    assert.equal((await request(server, `/api/v1/proyectos?search=${suffix}&clienteId=${clientId}&oficinaId=${officeId}`)).body.meta.total, 1);
    assert.equal((await request(server, `/api/v1/proyectos/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify({
        clienteId: clientId,
        oficinaId: officeId,
        proyecto: `Proyecto reemplazado ${suffix}`,
        fechaInicioProyecto: '2026-10-29 10:00:00',
        fechaFinProyecto: null,
        costoProyecto: 2000,
      }),
    })).body.data.proyecto, `Proyecto reemplazado ${suffix}`);
    assert.equal((await request(server, `/api/v1/proyectos/${projectId}`, {
      method: 'PATCH', body: JSON.stringify({ costoProyecto: 2500.75 }),
    })).body.data.costoProyecto, 2500.75);

    const blockedClientDelete = await request(server, `/api/v1/clientes/${clientId}`, { method: 'DELETE' });
    assert.equal(blockedClientDelete.response.status, 409);
    assert.equal(blockedClientDelete.body.error.code, 'CLIENT_IN_USE');

    assert.equal((await request(server, `/api/v1/proyectos/${projectId}`, { method: 'DELETE' })).response.status, 204);
    projectId = null;
    assert.equal((await request(server, `/api/v1/clientes/${clientId}`, { method: 'DELETE' })).response.status, 204);
    clientId = null;
    assert.equal((await request(server, `/api/v1/oficinas/${officeId}`, { method: 'DELETE' })).response.status, 204);
    officeId = null;

    const [[finalCounts]] = await pool.execute(
      `SELECT
         (SELECT COUNT(*) FROM clientes) AS clientes,
         (SELECT COUNT(*) FROM oficinas) AS oficinas,
         (SELECT COUNT(*) FROM proyectos) AS proyectos`,
    );
    assert.deepEqual(finalCounts, counts);
  } finally {
    if (projectId) await pool.execute('DELETE FROM proyectos WHERE id = ?', [projectId]);
    if (clientId) await pool.execute('DELETE FROM clientes WHERE id = ?', [clientId]);
    if (officeId) await pool.execute('DELETE FROM oficinas WHERE id = ?', [officeId]);
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    await pool.end();
  }
});
