import type { AWS } from '@serverless/typescript';

import greeting from '@functions/greeting';

const serverlessConfiguration: AWS = {
  service: 'serverless',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-domain-manager'],
  provider: {
    name: 'aws',
    profile: 'sls',
    stage: 'dev',
    stackName: '${self:service}-self-${self:provider.stage}',
    region: 'us-east-1',
    runtime: 'nodejs20.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: { greeting },
  package: { individually: true },
  custom: {
    customDomain :{
    domainName: 'muhammedjamzeeth.online',
    certificateName: 'muhammedjamzeeth.online',
    createRoute53Record: true,
    endpointType: 'REGIONAL',
    autoDomain: false
    },
 
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node20',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
