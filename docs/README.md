# Building

```sh
docker build -t lastcoolnameleft/sobriquet:latest .
docker push lastcoolnameleft/sobriquet:latest
```

# Running

```sh
docker kill sobriquet
docker rm sobriquet
docker pull lastcoolnameleft/sobriquet:latest
docker run --name sobriquet -p 80:3000 -d --restart always lastcoolnameleft/sobriquet:latest
##
docker run --name sobriquet -p 80:3000 -it --rm lastcoolnameleft/sobriquet:latest
docker logs sobriquet -f
```