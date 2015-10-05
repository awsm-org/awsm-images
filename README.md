# awsm-images

This awsm does image modifications (resizing, etc.) and showcases many of the features and integration points of JAWS:

*  browserify optimization
*  including own version of the `aws-sdk`
*  ENV var integration into code and exposing via the `awsm.json:lambda.envVars` extension point
*  Leverage awsm CloudFormation extension points (creates s3 bucket AND sets up fine grain perms)

## Quickstart

Goal: Given image url, creates a thumbnail and saves to s3 bucket with the `JAWS_DATA_MODEL_STAGE` prefix (default jaws env var) and an env var defined by this awsm (`IMAGE_RESIZE_BUCKET`)

1.  Create a new jaws project.  Commit your files to version control so we can do diff later (trust me this is worth it)
1.  Run `npm install --save awsm-org/awsm-images`
  1. This downloads the module, installs its dependencies (via npm), replicates the AWSM module to the `aws_modules` directory, merges in CF resources to project `resources-cf.json`, merges in CF lambda IAM rules to project `resources-cf.json`. Cool right?
1.  Run `jaws env list <stage> all`  You will notice how `IMAGE_RESIZE_BUCKET` is not set.
1.  Run `jaws env set <stage> all IMAGE_RESIZE_BUCKET <imgresize.yourdomain.from.new.jaws.project.prompt>`
1.  Cd into `aws_modules/awsm-images/thumbnail` and run `jaws deploy lambda`.  Note how small the lambda code size is ;). Most of the size is the aws-sdk that [can't currently be browserified](https://github.com/aws/aws-sdk-js/issues/696).
1.  Find an image that is > 100x100 and test the lambda sending json `{"url":"url here"}`
