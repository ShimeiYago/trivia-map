import * as cdk from 'aws-cdk-lib';
import { TriviaMapStagingStack } from '../lib/staging-stack';
import { TriviaMapStagingV2Stack } from '../lib/staging-v2-stack';

const app = new cdk.App();
new TriviaMapStagingStack(app, 'TriviaMapStaging', { env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'ap-northeast-1' } });
new TriviaMapStagingV2Stack(app, 'TriviaMapStagingV2', { env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'ap-northeast-1' } });
