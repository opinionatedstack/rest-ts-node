# rest-node


# Build Prod


# Build Dev
docker build -t [your docker org]/rest-ts-node:latest -f Dockerfile.prod .
docker push [your docker org]/rest-ts-node:latest
docker build -t [your docker org]/rest-ts-node:latest -f Dockerfile.prod . && docker push [your docker org]/rest-node:latest && say done

 docker run --name rest -it --rm -p 3000:3000 [your docker org]/rest-node


# Testing
The web login application should have grant_type=password
