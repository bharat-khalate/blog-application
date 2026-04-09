/**
 * Swagger/OpenAPI configuration
 */

export const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clean Architecture API',
      version: '1.0.0',
      description: 'API built with clean architecture principles',
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Products',
        description: 'Product management endpoints',
      },
    ],
    paths: {
      '/api/v1/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          responses: {
            '200': {
              description: 'API is healthy',
            },
          },
        },
      },
    },
  },
  apis: ['./src/app/api/**/*.ts'],
};
