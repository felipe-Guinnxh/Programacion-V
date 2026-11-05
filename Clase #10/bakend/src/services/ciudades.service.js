import * as cityRepository from '../repositories/ciudades.repository.js';
import { HttpError } from '../utils/http-error.js';

export async function listCities(filters) {
  const { cities, total } = await cityRepository.findAll(filters);

  return {
    data: cities,
    meta: {
      page: filters.page,
      limit: filters.limit,
      total,
      pages: Math.ceil(total / filters.limit),
    },
  };
}

export async function getCityById(id) {
  const city = await cityRepository.findById(id);

  if (!city) {
    throw new HttpError(404, 'CITY_NOT_FOUND', 'La ciudad no fue encontrada.');
  }

  return city;
}

export async function createCity(city) {
  return cityRepository.create(city);
}

export async function replaceCity(id, city) {
  await getCityById(id);
  return cityRepository.replace(id, city);
}

export async function updateCity(id, changes) {
  await getCityById(id);
  return cityRepository.patch(id, changes);
}

export async function deleteCity(id) {
  await getCityById(id);
  await cityRepository.remove(id);
}
