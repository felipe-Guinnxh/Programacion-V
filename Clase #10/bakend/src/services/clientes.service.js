import * as cityRepository from '../repositories/ciudades.repository.js';
import * as clientRepository from '../repositories/clientes.repository.js';
import { HttpError } from '../utils/http-error.js';

async function ensureCityExists(cityId) {
  if (!(await cityRepository.findById(cityId))) {
    throw new HttpError(422, 'CITY_NOT_FOUND', 'La ciudad relacionada no existe.');
  }
}

export async function listClients(filters) {
  const { clients, total } = await clientRepository.findAll(filters);
  return {
    data: clients,
    meta: {
      page: filters.page,
      limit: filters.limit,
      total,
      pages: Math.ceil(total / filters.limit),
    },
  };
}

export async function getClientById(id) {
  const client = await clientRepository.findById(id);
  if (!client) throw new HttpError(404, 'CLIENT_NOT_FOUND', 'El cliente no fue encontrado.');
  return client;
}

export async function createClient(client) {
  await ensureCityExists(client.cityId);
  return clientRepository.create(client);
}

export async function replaceClient(id, client) {
  await getClientById(id);
  await ensureCityExists(client.cityId);
  return clientRepository.replace(id, client);
}

export async function updateClient(id, changes) {
  await getClientById(id);
  if (changes.cityId !== undefined) await ensureCityExists(changes.cityId);
  return clientRepository.patch(id, changes);
}

export async function deleteClient(id) {
  await getClientById(id);
  await clientRepository.remove(id);
}
