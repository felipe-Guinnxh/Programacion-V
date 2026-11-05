import * as clientService from '../services/clientes.service.js';
import { sendNoContent, sendSuccess } from '../utils/api-response.js';
import {
  validateClientId,
  validateClientListQuery,
  validateCreateClient,
  validatePatchClient,
} from '../validators/clientes.validator.js';

export async function listClients(request, response, next) {
  try {
    const filters = validateClientListQuery(request.query);
    const result = await clientService.listClients(filters);
    return sendSuccess(response, result.data, 200, result.meta);
  } catch (error) { return next(error); }
}

export async function getClient(request, response, next) {
  try {
    return sendSuccess(response, await clientService.getClientById(validateClientId(request.params.id)));
  } catch (error) { return next(error); }
}

export async function createClient(request, response, next) {
  try {
    return sendSuccess(response, await clientService.createClient(validateCreateClient(request.body)), 201);
  } catch (error) { return next(error); }
}

export async function replaceClient(request, response, next) {
  try {
    const client = await clientService.replaceClient(
      validateClientId(request.params.id),
      validateCreateClient(request.body),
    );
    return sendSuccess(response, client);
  } catch (error) { return next(error); }
}

export async function updateClient(request, response, next) {
  try {
    const client = await clientService.updateClient(
      validateClientId(request.params.id),
      validatePatchClient(request.body),
    );
    return sendSuccess(response, client);
  } catch (error) { return next(error); }
}

export async function deleteClient(request, response, next) {
  try {
    await clientService.deleteClient(validateClientId(request.params.id));
    return sendNoContent(response);
  } catch (error) { return next(error); }
}
