import * as clientRepository from '../repositories/clientes.repository.js';
import * as officeRepository from '../repositories/oficinas.repository.js';
import * as projectRepository from '../repositories/proyectos.repository.js';
import { HttpError } from '../utils/http-error.js';

async function ensureRelations(project) {
  if (project.clientId !== undefined && !(await clientRepository.findById(project.clientId))) {
    throw new HttpError(422, 'CLIENT_NOT_FOUND', 'El cliente relacionado no existe.');
  }
  if (project.officeId !== undefined && !(await officeRepository.findById(project.officeId))) {
    throw new HttpError(422, 'OFFICE_NOT_FOUND', 'La oficina relacionada no existe.');
  }
}

export async function listProjects(filters) {
  const { projects, total } = await projectRepository.findAll(filters);
  return {
    data: projects,
    meta: { page: filters.page, limit: filters.limit, total, pages: Math.ceil(total / filters.limit) },
  };
}

export async function getProjectById(id) {
  const project = await projectRepository.findById(id);
  if (!project) throw new HttpError(404, 'PROJECT_NOT_FOUND', 'El proyecto no fue encontrado.');
  return project;
}

export async function createProject(project) {
  await ensureRelations(project);
  return projectRepository.create(project);
}

export async function replaceProject(id, project) {
  await getProjectById(id);
  await ensureRelations(project);
  return projectRepository.replace(id, project);
}

export async function updateProject(id, changes) {
  await getProjectById(id);
  await ensureRelations(changes);
  return projectRepository.patch(id, changes);
}

export async function deleteProject(id) {
  await getProjectById(id);
  await projectRepository.remove(id);
}
