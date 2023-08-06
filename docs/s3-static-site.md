# Simple Storage Service Static Site Setup

## S3

- [ ] Create S3 bucket
  - [ ] Enable public access
  - [ ] Enable static site hosting
  - [ ] Add bucket policy like:

```json
{
  "Version": "2008-10-17",
  "Id": "Policy1547311985882",
  "Statement": [
    {
      "Sid": "Stmt1548311884279",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::hypetrigger-site/*"
    }
  ]
}
```

## ACM

- [ ] Create (free) public cert
- [ ] Deploy Route53 record for domain name and wait for automatic validation

## CloudFront

- [ ] Create a deployment with the origin as the **public URL** of the s3 bucket
- [ ] Add cert from ACM
- [ ] Add alternate domain name after adding cert

## Route53

- [ ] Quick create record/Edit existing type A record
  - [ ] Alias=true
  - [ ] Alias to CloudFront distribution
  - [ ] Choose distribution

## (optional) Next.js

- [ ] Add `trailingSlash: true` to `next.config.js`

## (optional) Third party DNS

- [ ] Add custom nameservers in the third-party hosting provider
- [ ] Copy the 4 nameservers from Route53
- [ ] Also add a AAAA record aliased to CloudFront distribution for IPv6 support

[source](https://dev.to/cindyledev/configure-third-party-domain-name-and-https-for-cloudfront-distribution-cloud-resume-challenge-part-3n-2nhp#use-route-53-as-the-dns-service-to-manage-your-dns-records)

## Deployment/updates

- [ ] Build locally (e.g. `vite build` or `next build`)
- [ ] Use `aws s3 sync` to upload contents of `out`/`dist` folder to bucket
