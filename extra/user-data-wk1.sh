#!/bin/bash
yum update -y
yum install -y docker git
systemctl enable docker
systemctl start docker
groupadd docker
usermod -aG docker ec2-user
newgrp docker

# bring in compose
curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose

docker-compose version

#switch to a regular user
su - ec2-user

whoami

mkdir ~/work
cd ~/work

git clone https://github.com/dnachman/aws-bootcamp-cruddur-2023.git
cd aws-bootcamp-cruddur-2023

# get the public hostname to be used by compose
HOSTNAME=$(curl -s http://169.254.169.254/latest/meta-data/public-hostname)

echo "===> HOSTNAME=$HOSTNAME"

/usr/local/bin/docker-compose --file extra/docker-compose-ec2.yml up -d
