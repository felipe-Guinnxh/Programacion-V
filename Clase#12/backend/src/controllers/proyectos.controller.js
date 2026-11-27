import * as projectService from '../services/proyectos.service.js';
import { sendNoContent, sendSuccess } from '../utils/api-response.js';
import {
  validateCreateProject,
  validatePatchProject,
  validateProjectId,
  validateProjectListQuery,
} from '../validators/proyectos.validator.js';

export async function listProjects(request, response, next) {
  try {
    const result = await projectService.listProjects(validateProjectListQuery(request.query));
    return sendSuccess(response, result.data, 200, result.meta);
  } catch (error) { return next(error); }
}
export async function getProject(request, response, next) {
  try { return sendSuccess(response, await projectService.getProjectById(validateProjectId(request.params.id))); }
  catch (error) { return next(error); }
}
export async function createProject(request, response, next) {
  try { return sendSuccess(response, await projectService.createProject(validateCreateProject(request.body)), 201); }
  catch (error) { return next(error); }
}
export async function replaceProject(request, response, next) {
  try {
    const project = await projectService.replaceProject(
      validateProjectId(request.params.id),
      validateCreateProject(request.body, { requireStart: true }),
    );
    return sendSuccess(response, project);
  } catch (error) { return next(error); }
}
export async function updateProject(request, response, next) {
  try {
    const project = await projectService.updateProject(
      validateProjectId(request.params.id),
      validatePatchProject(request.body),
    );
    return sendSuccess(response, project);
  } catch (error) { return next(error); }
}
export async function deleteProject(request, response, next) {
  try { await projectService.deleteProject(validateProjectId(request.params.id)); return sendNoContent(response); }
  catch (error) { return next(error); }
}
