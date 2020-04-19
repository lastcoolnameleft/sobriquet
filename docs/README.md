# Building

```sh
docker build -t lastcoolnameleft/sobriquet .
docker push lastcoolnameleft/sobriquet
```

# Running

```sh
docker kill sobriquet
docker rm sobriquet
docker pull lastcoolnameleft/sobriquet
docker run --name sobriquet -p 8080:3000 -it --rm lastcoolnameleft/sobriquet
docker run --name sobriquet -p 8080:3000 -it lastcoolnameleft/sobriquet
```