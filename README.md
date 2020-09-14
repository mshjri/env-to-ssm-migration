# env-to-ssm-migration
Migrate your .env file to AWS SSM parameter store

## Steps
1. Clone this project and run `npm i` to install dependencies
2. Copy the .env file you want to migrate to the root of this project
/This app runs on  your machine and  uses official aws-sdk to upload, your parameters won’t go anywhere else/
3. In the .env file, add a dash ‘-‘ before each secure env variable name (or customize this in `app.js`) to encrypt it with the provided KMS key ID.
4. In `app.js` Specify AWS region, SSM parameters path, and KMS key ID encrypt secure strings.
5. If you haven’t used AWS CLI on your machine before and AWS IAM is not configured, specify IAM  `accessKeyId` and `secretAccessKey` in `app.js`.

## Notes
* All Parameters will be of standard tier and and have a `DataType` of text.
* This will not overwrite any existing parameters you have on your AWS region. If You want to overwrite, set the `overwrite` flag in `app.js` to true.

## TODOs
- Add screenshots to README
- Add sample .env
- Add support for parameter description `{{ my paramter Description }}`
