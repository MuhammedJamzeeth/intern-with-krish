import weather from "@functions/weather";
import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "serverless-weather",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-domain-manager",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs20.x",
    region: "us-east-1",
    stage: "${opt:stage, 'dev'}",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      OPENWEATHER_API_KEY: "1f4b05c66b38b5d237e084481e81616e",
    },
  },
  // import the function via paths
  functions: { weather },
  package: { individually: true },
  custom: {
    customDomain: {
      domainName: "weather.muhammedjamzeeth.online",
      certificateName: "weather.muhammedjamzeeth.online",
      basePath: "",
      stage: "${self:provider.stage}",
      createRoute53Record: true,
      endpointType: "REGIONAL",
      autoDomain: false,
    },

    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node20",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
