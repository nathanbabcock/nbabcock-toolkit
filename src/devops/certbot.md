# Install Certbot for Route53 on Amazon Linux 2

## 1. Install certbot and route53 plugin:

```sh
sudo amazon-linux-extras install epel
sudo yum install certbot python2-certbot-dns-route53 -y
certbot --version
```

## 2. Add AWS credentials to `~/.bash_profile`:

```sh
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
```

## 3. Run certbot to generate certs on host machine

```sh
sudo \
  --preserve-env=AWS_ACCESS_KEY_ID \
  --preserve-env=AWS_SECRET_ACCESS_KEY \
  certbot certonly \
  --dns-route53 \
  -d domain.com \
  -d www.domain.com
```

## 4. Mount certs to NGINX docker container:

```sh
docker run -d \
  #...
  -v /etc/letsencrypt/:/etc/ssl/cert/ \
  #...
  nginx
```

_**Note:** don't mount the child folder containing symlinks. See: <https://stackoverflow.com/a/66171816>_

## 5. Install mounted certs in NGINX config:

```nginx
listen 443 ssl;
ssl_certificate /etc/ssl/cert/live/domain.com/fullchain.pem;
ssl_certificate_key /etc/ssl/cert/live/domain.com/privkey.pem;
```

## 6. (later) Renew certs

```sh
sudo \
  --preserve-env=AWS_ACCESS_KEY_ID \
  --preserve-env=AWS_SECRET_ACCESS_KEY \
  certbot renew
```
