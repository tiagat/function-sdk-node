const functionName = process.env.FUNCTION_NAME;

export default {
  environment: process.env.NODE_ENV || 'production',
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  },
  function: {
    name: functionName,
    revision: process.env.REVISION_NAME,
    revisionUID: process.env.REVISION_UID
  },
  grpc: {
    // url: functionName ? `dns:///${functionName}.crossplane:9443` : 'localhost:9443',
    url: functionName ? `0.0.0.0:9443` : 'localhost:9443',
    tlsCertsDir: process.env.TLS_SERVER_CERTS_DIR,
    checkClientCertificate: false,
    shutdownTimeout: 10000
  }
};
