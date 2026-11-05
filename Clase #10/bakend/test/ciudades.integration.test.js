import assert from 'node:assert/strict';
import { test } from 'node:test';

import app from '../src/app.js';
import { pool } from '../src/config/database.js';

async function startServer() {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  return server;
}

function baseUrl(server) {
  const address = server.address();
  return `http://127.0.0.1:${address.port}`;
}

async function apiRequest(server, path, options = {}) {
  const response = await fetch(`${baseUrl(server)}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...options.headers,
    },
  });
  const body = response.status === 204 ? null : await response.json();
  return { response, body };
}

test('CRUD completo de ciudades sin dejar datos temporales', {
  timeout: 15000,
}, async () => {
  const server = await startServer();
  const suffix = Date.now();
  let cityId;

  try {
    const [[initialCount]] = await pool.execute(
      'SELECT COUNT(*) AS total FROM ciudades',
    );

    const health = await apiRequest(server, '/api/v1/health');
    assert.equal(health.response.status, 200);
    assert.equal(health.body.data.database, 'connected');

    const invalid = await apiRequest(server, '/api/v1/ciudades', {
      method: 'POST',
      body: JSON.stringify({ ciudad: '', pais: 'Prueba' }),
    });
    assert.equal(invalid.response.status, 422);
    assert.equal(invalid.body.error.code, 'VALIDATION_ERROR');

    const created = await apiRequest(server, '/api/v1/ciudades', {
      method: 'POST',
      body: JSON.stringify({
        ciudad: `Ciudad Codex ${suffix}`,
        pais: 'País temporal',
      }),
    });
    assert.equal(created.response.status, 201);
    cityId = created.body.data.id;

    const found = await apiRequest(server, `/api/v1/ciudades/${cityId}`);
    assert.equal(found.response.status, 200);
    assert.equal(found.body.data.ciudad, `Ciudad Codex ${suffix}`);

    const listed = await apiRequest(
      server,
      `/api/v1/ciudades?search=${suffix}&pais=Pa%C3%ADs%20temporal&page=1&limit=10&sort=id&order=desc`,
    );
    assert.equal(listed.response.status, 200);
    assert.equal(listed.body.meta.total, 1);
    assert.equal(listed.body.data[0].id, cityId);

    const replaced = await apiRequest(server, `/api/v1/ciudades/${cityId}`, {
      method: 'PUT',
      body: JSON.stringify({
        ciudad: `Ciudad reemplazada ${suffix}`,
        pais: 'País reemplazado',
      }),
    });
    assert.equal(replaced.response.status, 200);
    assert.equal(replaced.body.data.pais, 'País reemplazado');

    const updated = await apiRequest(server, `/api/v1/ciudades/${cityId}`, {
      method: 'PATCH',
      body: JSON.stringify({ pais: 'País actualizado' }),
    });
    assert.equal(updated.response.status, 200);
    assert.equal(updated.body.data.ciudad, `Ciudad reemplazada ${suffix}`);
    assert.equal(updated.body.data.pais, 'País actualizado');

    const deleted = await apiRequest(server, `/api/v1/ciudades/${cityId}`, {
      method: 'DELETE',
    });
    assert.equal(deleted.response.status, 204);
    cityId = null;

    const missing = await apiRequest(
      server,
      `/api/v1/ciudades/${created.body.data.id}`,
    );
    assert.equal(missing.response.status, 404);
    assert.equal(missing.body.error.code, 'CITY_NOT_FOUND');

    const [[finalCount]] = await pool.execute(
      'SELECT COUNT(*) AS total FROM ciudades',
    );
    assert.equal(finalCount.total, initialCount.total);
  } finally {
    if (cityId) {
      await pool.execute('DELETE FROM ciudades WHERE id = ?', [cityId]);
    }

    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    await pool.end();
  }
});
