const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const fs = require("fs");

// config (You only need to edit this part)
const SSM = new AWS.SSM({
  region: "eu-west-3", // Specify AWS region
  accessKeyId: undefined, // If AWS IAM isn't configured on this machine, set this with proper AWS access key id
  secretAccessKey: undefined, // If AWS IAM isn't configured on this machine, set this with proper AWS secret access key
});
const nameProject = "project"; // Specify a name project
const secureStringPerfix = "-"; // Sepcify a prefix to indicate a paramter is a SecureString (the prefix will be excluded from the parameter name)
const keyID = "224f0c6a-3ab3-4735-8cce-9p7fd95f11a9"; // Specify a proper KMS key ID

const envsFiles = [".env.development", ".env.production"];
const environment = envsFiles.map((file) => {
  const parts = file.split(".");
  return parts.pop();
});

for (let i = 0; i < envsFiles.length; i++) {
  let path = `/${nameProject}/${environment[i]}/`; // Optionally setup a path for the parameter, otherwise leave empty

  // load .env and parse parameters
  const Buffer = fs.readFileSync("./.env", (err) => {
    if (err) throw err;
  });
  const env = dotenv.parse(Buffer);

  // prepare parameters in objects with paramters store options
  let envArr = [];
  for (let key in env) {
    path = path ? path : "";
    let Type =
      key.substr(0, secureStringPerfix.length) === secureStringPerfix
        ? "SecureString"
        : "String";
    let Name =
      Type === "SecureString"
        ? path + key.substr(secureStringPerfix.length)
        : path + key;
    let KeyId = Type === "SecureString" ? keyID : undefined;
    envArr.push({
      Name,
      Type,
      KeyId,
      Value: env[key],
      Tier: "Standard",
      DataType: "text",
      Overwrite: false,
    });
  }

  // push paramters to SSM paramter store one by one
  console.log("\x1b[8m%s\x1b[0m"); // console log separator
  envArr.map((param) => {
    SSM.putParameter(param, function (err) {
      if (err) {
        if (err.code === "ParameterAlreadyExists")
          console.error(
            "\x1b[91m%s\x1b[0m",
            param.Name +
              " already exists. To overwrite current value, set overwrite option to true"
          );
        else
          console.log(
            "\x1b[91m%s\x1b[0m",
            param.Name,
            err.code,
            ":",
            err.message
          );
      } else console.log("\x1b[92m%s\x1b[0m", param.Name + " pushed successfully.");
      console.log("\x1b[8m%s\x1b[0m"); // console log separator
    });
  });
}
