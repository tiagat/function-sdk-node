const environment = process.env.NODE_ENV || 'production';

export default {
  environment,
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  },
  grpc: {
    url: '0.0.0.0:9443',
    shutdownTimeout: 10000
  }
};
