import * as path from 'node:path';
import * as cdk from 'aws-cdk-lib';
import { Duration, RemovalPolicy, Tags } from 'aws-cdk-lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class TriviaMapStagingStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    Tags.of(this).add('Project', 'TriviaMap'); Tags.of(this).add('Environment', 'stg'); Tags.of(this).add('ManagedBy', 'CDK');
    const tables = ['Users', 'Articles', 'Markers', 'Likes', 'Goods', 'SpecialMaps', 'SpecialMapMarkers'].map((name) => new dynamodb.Table(this, name, { tableName: `TriviaMap-stg-${name}`, partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }, billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true }, removalPolicy: RemovalPolicy.RETAIN }));
    const images = new s3.Bucket(this, 'Images', { encryption: s3.BucketEncryption.S3_MANAGED, blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, enforceSSL: true, removalPolicy: RemovalPolicy.RETAIN });
    const frontend = new s3.Bucket(this, 'Frontend', { encryption: s3.BucketEncryption.S3_MANAGED, blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, enforceSSL: true, removalPolicy: RemovalPolicy.RETAIN });
    const distribution = new cloudfront.Distribution(this, 'FrontendDistribution', { defaultRootObject: 'index.html', defaultBehavior: { origin: origins.S3BucketOrigin.withOriginAccessControl(frontend), viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS, cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED }, errorResponses: [{ httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: Duration.seconds(10) }, { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: Duration.seconds(10) }] });
    const secret = secretsmanager.Secret.fromSecretNameV2(this, 'BackendSecret', 'triviamap/stg/backend');
    const api = new NodejsFunction(this, 'Api', { runtime: lambda.Runtime.NODEJS_24_X, architecture: lambda.Architecture.ARM_64, entry: path.join(__dirname, '../../apps/api/src/handler.ts'), handler: 'handler', timeout: Duration.seconds(30), memorySize: 512, environment: { IMAGE_BUCKET: images.bucketName, BACKEND_SECRET_ARN: secret.secretArn, ...Object.fromEntries(tables.map((table) => [`TABLE_${table.node.id.toUpperCase()}`, table.tableName])) }, bundling: { minify: true, sourceMap: true } });
    images.grantReadWrite(api); secret.grantRead(api); tables.forEach((table) => table.grantReadWriteData(api));
    const httpApi = new apigwv2.HttpApi(this, 'HttpApi', { apiName: 'triviamap-stg-api', corsPreflight: { allowOrigins: [`https://${distribution.distributionDomainName}`], allowMethods: [apigwv2.CorsHttpMethod.ANY], allowHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'], allowCredentials: true } });
    httpApi.addRoutes({ path: '/{proxy+}', methods: [apigwv2.HttpMethod.ANY], integration: new integrations.HttpLambdaIntegration('ApiIntegration', api) });
    new cdk.CfnOutput(this, 'ApiUrl', { value: httpApi.apiEndpoint }); new cdk.CfnOutput(this, 'ImageBucket', { value: images.bucketName }); new cdk.CfnOutput(this, 'FrontendBucket', { value: frontend.bucketName }); new cdk.CfnOutput(this, 'FrontendUrl', { value: `https://${distribution.distributionDomainName}` }); new cdk.CfnOutput(this, 'FrontendDistributionId', { value: distribution.distributionId });
  }
}
