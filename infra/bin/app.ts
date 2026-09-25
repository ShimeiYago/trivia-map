import * as cdk from 'aws-cdk-lib';
import { TriviaMapStagingStack } from '../lib/staging-stack';

const app = new cdk.App();
new TriviaMapStagingStack(app, 'TriviaMapStaging', { env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'ap-northeast-1' } });
