# Week X — Cleanup

## Complete static build

## load build to s3 for cloudfront serving

(instructor's solution: https://github.com/teacherseat/aws-s3-website-sync)

```sh
aws s3 sync $FRONTEND_REACT_JS_PATH/build/ s3://$FRONTEND_BUCKET/ --recursive

# get the cloudfront distribution id
CF_DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Aliases.Items, 'cruddur.n5n.org')].Id" --output text)
echo $CF_DISTRIBUTION_ID

# invalidate the cloudfront cache
aws cloudfront create-invalidation --distribution-id $CF_DISTRIBUTION_ID --paths "/*"
```

It would be better to create an invalidation batch file with the exact files, but I am skipping that for now

### skipping setting up github actions
