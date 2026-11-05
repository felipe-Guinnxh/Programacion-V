import * as officeService from '../services/oficinas.service.js';
import { sendNoContent, sendSuccess } from '../utils/api-response.js';
import {
  validateCreateOffice,
  validateOfficeId,
  validateOfficeListQuery,
  validatePatchOffice,
} from '../validators/oficinas.validator.js';

export async function listOffices(request, response, next) {
  try {
    const result = await officeService.listOffices(validateOfficeListQuery(request.query));
    return sendSuccess(response, result.data, 200, result.meta);
  } catch (error) { return next(error); }
}
export async function getOffice(request, response, next) {
  try { return sendSuccess(response, await officeService.getOfficeById(validateOfficeId(request.params.id))); }
  catch (error) { return next(error); }
}
export async function createOffice(request, response, next) {
  try { return sendSuccess(response, await officeService.createOffice(validateCreateOffice(request.body)), 201); }
  catch (error) { return next(error); }
}
export async function replaceOffice(request, response, next) {
  try {
    return sendSuccess(response, await officeService.replaceOffice(
      validateOfficeId(request.params.id), validateCreateOffice(request.body),
    ));
  } catch (error) { return next(error); }
}
export async function updateOffice(request, response, next) {
  try {
    return sendSuccess(response, await officeService.updateOffice(
      validateOfficeId(request.params.id), validatePatchOffice(request.body),
    ));
  } catch (error) { return next(error); }
}
export async function deleteOffice(request, response, next) {
  try { await officeService.deleteOffice(validateOfficeId(request.params.id)); return sendNoContent(response); }
  catch (error) { return next(error); }
}
