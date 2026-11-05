import * as officeRepository from '../repositories/oficinas.repository.js';
import { HttpError } from '../utils/http-error.js';

export async function listOffices(filters) {
  const { offices, total } = await officeRepository.findAll(filters);
  return {
    data: offices,
    meta: { page: filters.page, limit: filters.limit, total, pages: Math.ceil(total / filters.limit) },
  };
}

export async function getOfficeById(id) {
  const office = await officeRepository.findById(id);
  if (!office) throw new HttpError(404, 'OFFICE_NOT_FOUND', 'La oficina no fue encontrada.');
  return office;
}

export async function createOffice(office) { return officeRepository.create(office); }
export async function replaceOffice(id, office) {
  await getOfficeById(id);
  return officeRepository.replace(id, office);
}
export async function updateOffice(id, changes) { return replaceOffice(id, changes); }
export async function deleteOffice(id) {
  await getOfficeById(id);
  await officeRepository.remove(id);
}
