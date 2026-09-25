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

const retain = RemovalPolicy.RETAIN;
const makeTable = (scope: Construct, name: string, indexes: Array<{ name: string; partition: string; sort?: string }> = [], ttlAttribute?: string) => {
  const resource = new dynamodb.Table(scope, name, { tableName: `TriviaMap-stg-v2-${name}`, partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }, billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, pointInTimeRecoverySpecification: { pointInTimeRecoveryEnabled: true }, removalPolicy: retain, ...(ttlAttribute ? { timeToLiveAttribute: ttlAttribute } : {}) });
  indexes.forEach(({ name: indexName, partition, sort }) => resource.addGlobalSecondaryIndex({ indexName, partitionKey: { name: partition, type: dynamodb.AttributeType.STRING }, ...(sort ? { sortKey: { name: sort, type: dynamodb.AttributeType.STRING } } : {}), projectionType: dynamodb.ProjectionType.ALL }));
  return resource;
};

export class TriviaMapStagingV2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    Tags.of(this).add('Project', 'TriviaMap'); Tags.of(this).add('Environment', 'stg'); Tags.of(this).add('ManagedBy', 'CDK'); Tags.of(this).add('Version', 'v2');
    const users = makeTable(this, 'Users', [{ name: 'email-index', partition: 'email', sort: 'id' }]);
    const articles = makeTable(this, 'Articles', [{ name: 'author-index', partition: 'authorId', sort: 'postId' }, { name: 'marker-index', partition: 'markerId', sort: 'postId' }, { name: 'public-index', partition: 'publicKey', sort: 'createdAt' }]);
    const markers = makeTable(this, 'Markers', [{ name: 'park-index', partition: 'park', sort: 'markerId' }]);
    const likes = makeTable(this, 'Likes', [{ name: 'user-index', partition: 'userId', sort: 'postId' }]);
    const goods = makeTable(this, 'Goods', [{ name: 'article-index', partition: 'postId', sort: 'id' }]);
    const maps = makeTable(this, 'SpecialMaps', [{ name: 'author-index', partition: 'authorId', sort: 'specialMapId' }, { name: 'public-index', partition: 'publicKey', sort: 'specialMapId' }]);
    const mapMarkers = makeTable(this, 'SpecialMapMarkers', [{ name: 'map-index', partition: 'specialMapId', sort: 'specialMapMarkerId' }]);
    // GSI sort keys are strings; keep the numeric TTL in a distinct attribute.
    const sessions = makeTable(this, 'Sessions', [{ name: 'user-index', partition: 'userId', sort: 'expiresAt' }], 'expiresAt');
    const tokens = makeTable(this, 'AuthTokens', [{ name: 'user-index', partition: 'userId', sort: 'expiresAt' }], 'expiresAt');
    const images = new s3.Bucket(this, 'Images', { encryption: s3.BucketEncryption.S3_MANAGED, blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, enforceSSL: true, removalPolicy: retain });
    const frontend = new s3.Bucket(this, 'Frontend', { encryption: s3.BucketEncryption.S3_MANAGED, blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, enforceSSL: true, removalPolicy: retain });
    const basicAuthorizationHash = new cdk.CfnParameter(this, 'BasicAuthorizationHash', { type: 'String', noEcho: true, description: 'SHA-256 hex digest of the expected Basic authorization header from triviamap/stg/access.' });
    const originToken = new cdk.CfnParameter(this, 'OriginToken', { type: 'String', noEcho: true, description: 'CloudFront-to-API origin verifier.' });
    const backendSecret = secretsmanager.Secret.fromSecretNameV2(this, 'BackendSecret', 'triviamap/stg/backend');
    const mailSecret = secretsmanager.Secret.fromSecretNameV2(this, 'MailSecret', 'triviamap/stg/mail');
    const api = new NodejsFunction(this, 'Api', { runtime: lambda.Runtime.NODEJS_24_X, architecture: lambda.Architecture.ARM_64, entry: path.join(__dirname, '../../apps/api/src/handler.ts'), handler: 'handler', timeout: Duration.seconds(30), memorySize: 512, environment: { STAGE: 'stg-v2', IMAGE_BUCKET: images.bucketName, BACKEND_SECRET_ARN: backendSecret.secretArn, MAIL_SECRET_ARN: mailSecret.secretArn, JWT_SECRET: backendSecret.secretValueFromJson('jwtSecret').unsafeUnwrap(), GOOD_SALT: backendSecret.secretValueFromJson('jwtSecret').unsafeUnwrap(), FRONTEND_ORIGIN: 'https://stg.triviamap.jp', ORIGIN_VERIFY_TOKEN: originToken.valueAsString, ...Object.fromEntries([users, articles, markers, likes, goods, maps, mapMarkers, sessions, tokens].map((item) => [`TABLE_${item.node.id.toUpperCase()}`, item.tableName])) }, bundling: { minify: true, sourceMap: true } });
    images.grantReadWrite(api); backendSecret.grantRead(api); mailSecret.grantRead(api); [users, articles, markers, likes, goods, maps, mapMarkers, sessions, tokens].forEach((item) => item.grantReadWriteData(api));
    const httpApi = new apigwv2.HttpApi(this, 'HttpApi', { apiName: 'triviamap-stg-v2-api' });
    httpApi.addRoutes({ path: '/{proxy+}', methods: [apigwv2.HttpMethod.ANY], integration: new integrations.HttpLambdaIntegration('ApiIntegration', api) });
    const basic = new cloudfront.Function(this, 'BasicAuth', { code: cloudfront.FunctionCode.fromInline(`var crypto = require('crypto'); function handler(event) { var request = event.request; var value = request.headers.authorization && request.headers.authorization.value; if (value && crypto.createHash('sha256').update(value).digest('hex') === '${basicAuthorizationHash.valueAsString}') return request; return { statusCode: 401, statusDescription: 'Unauthorized', headers: { 'www-authenticate': { value: 'Basic realm="TriviaMap staging"' } } }; }`), runtime: cloudfront.FunctionRuntime.JS_2_0 });
    const distribution = new cloudfront.Distribution(this, 'FrontendDistribution', { defaultRootObject: 'index.html', defaultBehavior: { origin: origins.S3BucketOrigin.withOriginAccessControl(frontend), viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS, functionAssociations: [{ eventType: cloudfront.FunctionEventType.VIEWER_REQUEST, function: basic }] }, additionalBehaviors: { '/images/*': { origin: origins.S3BucketOrigin.withOriginAccessControl(images), viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS, functionAssociations: [{ eventType: cloudfront.FunctionEventType.VIEWER_REQUEST, function: basic }] }, '/api/*': { origin: new origins.HttpOrigin(cdk.Fn.select(2, cdk.Fn.split('/', httpApi.apiEndpoint)), { protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY, customHeaders: { 'x-triviamap-origin': originToken.valueAsString } }), viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS, cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED, originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER, allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL, functionAssociations: [{ eventType: cloudfront.FunctionEventType.VIEWER_REQUEST, function: basic }] } }, errorResponses: [{ httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: Duration.seconds(0) }, { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html', ttl: Duration.seconds(0) }] });
    new cdk.CfnOutput(this, 'ApiUrl', { value: httpApi.apiEndpoint }); new cdk.CfnOutput(this, 'ImageBucket', { value: images.bucketName }); new cdk.CfnOutput(this, 'FrontendBucket', { value: frontend.bucketName }); new cdk.CfnOutput(this, 'FrontendDistributionId', { value: distribution.distributionId }); new cdk.CfnOutput(this, 'FrontendUrl', { value: `https://${distribution.distributionDomainName}` });
  }
}
