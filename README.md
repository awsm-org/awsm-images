# Image resizing JAWS awsm module

This is a sample awsm (in node.js) that showcases many of the features and integration points of JAWS:

*  browserify optimization
*  including own version of the `aws-sdk`
*  ENV var integration into code and exposing via the `awsm.json:lambda.envVars` extension point
*  Leverage awsm CloudFormation extension points (creates s3 bucket AND sets up fine grain perms)

## Quickstart

**Note**: at the time of writing this, you need to be running `master` branch of jaws cli (key fixes in > v1.1.0)

Goal: Given image url, creates a thumbnail and saves to s3 bucket with the `JAWS_DATA_MODEL_STAGE` prefix (default jaws env var) and an env var defined by this awsm (`IMAGE_RESIZE_BUCKET`)

1.  Create a new jaws project.  Commit your files to version control so we can do diff later (trust me this is worth it) 
1.  Run `jaws module install https://github.com/awsm-org/img-resize`
  1. This downloads the module, installs its dependencies (via npm), merges in CF resources to project `resources-cf.json`, merges in CF lambda IAM rules to project `resources-cf.json`. Cool right?
1.  Run `jaws env list <stage> all`  You will notice how `IMAGE_RESIZE_BUCKET` is not set.
1.  Run `jaws env set <stage> all IMAGE_RESIZE_BUCKET <imgresize.yourdomain.from.new.jaws.project.prompt>`
1.  Cd into `back/aws_modules/imgresize/thumbnail` and run `jaws deploy lambda`.  Note how small the lambda code size is ;). Most of the size is the aws-sdk that [can't currently be browserified](https://github.com/aws/aws-sdk-js/issues/696).
1.  Find an image that is > 100x100 and test the lambda sending json `{"url":"url here"}`

**Note**: at the time of writing this, we are having issues with [API gateway permissions](https://github.com/awslabs/aws-apigateway-swagger-importer/issues/41#issuecomment-143066855) so `jaws deploy endpoint` isn't working correctly.  You can use tha APIG web UI to hookup to your lambda using the following integration template:

```
{
    "url" : "$util.urlDecode($input.params('url'))"
}
```



