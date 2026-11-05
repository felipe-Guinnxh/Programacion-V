import { HttpError } from '../utils/http-error.js';

export function notFoundHandler(_request, _response, next) {
  next(new HttpError(404, 'ROUTE_NOT_FOUND', 'Ruta no encontrada.'));
}

export function errorHandler(error, request, response, _next) {
  const isJsonSyntaxError =
    error instanceof SyntaxError && error.status === 400 && 'body' in error;

  if (isJsonSyntaxError) {
    return response.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JSON',
        message: 'El cuerpo JSON enviado no es válido.',
      },
    });
  }

  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    const resource = request.originalUrl.split('/')[3];
    const codes = {
      ciudades: 'CITY_IN_USE',
      clientes: 'CLIENT_IN_USE',
      oficinas: 'OFFICE_IN_USE',
    };
    return response.status(409).json({
      success: false,
      error: {
        code: codes[resource] || 'RECORD_IN_USE',
        message: 'El registro no puede eliminarse porque tiene registros relacionados.',
      },
    });
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return response.status(422).json({
      success: false,
      error: {
        code: 'RELATED_RECORD_NOT_FOUND',
        message: 'Uno de los registros relacionados no existe.',
      },
    });
  }

  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_ERROR';
  const message =
    statusCode >= 500 ? 'Error interno del servidor.' : error.message;

  if (statusCode >= 500) {
    console.error('Error no controlado:', error.message);
  }

  return response.status(statusCode).json({
    success: false,
    error: { code, message },
  });
}
