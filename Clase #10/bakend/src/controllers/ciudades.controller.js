import * as cityService from '../services/ciudades.service.js';
import { sendNoContent, sendSuccess } from '../utils/api-response.js';
import {
  validateCityId,
  validateCityListQuery,
  validateCreateCity,
  validatePatchCity,
} from '../validators/ciudades.validator.js';

export async function listCities(request, response, next) {
  try {
    const filters = validateCityListQuery(request.query);
    const result = await cityService.listCities(filters);
    return sendSuccess(response, result.data, 200, result.meta);
  } catch (error) {
    return next(error);
  }
}

export async function getCity(request, response, next) {
  try {
    const id = validateCityId(request.params.id);
    const city = await cityService.getCityById(id);
    return sendSuccess(response, city);
  } catch (error) {
    return next(error);
  }
}

export async function createCity(request, response, next) {
  try {
    const payload = validateCreateCity(request.body);
    const city = await cityService.createCity(payload);
    return sendSuccess(response, city, 201);
  } catch (error) {
    return next(error);
  }
}

export async function replaceCity(request, response, next) {
  try {
    const id = validateCityId(request.params.id);
    const payload = validateCreateCity(request.body);
    const city = await cityService.replaceCity(id, payload);
    return sendSuccess(response, city);
  } catch (error) {
    return next(error);
  }
}

export async function updateCity(request, response, next) {
  try {
    const id = validateCityId(request.params.id);
    const payload = validatePatchCity(request.body);
    const city = await cityService.updateCity(id, payload);
    return sendSuccess(response, city);
  } catch (error) {
    return next(error);
  }
}

export async function deleteCity(request, response, next) {
  try {
    const id = validateCityId(request.params.id);
    await cityService.deleteCity(id);
    return sendNoContent(response);
  } catch (error) {
    return next(error);
  }
}
