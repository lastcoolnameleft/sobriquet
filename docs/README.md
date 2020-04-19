# Building

```sh
docker build -t lastcoolnameleft/sobriquet .
docker push lastcoolnameleft/sobriquet
```

# Running

```sh
docker kill sobriquet
sudo docker pull lastcoolnameleft/sobriquet
sudo docker run --name sobriquet -p 8080:3000 -it --rm lastcoolnameleft/sobriquet
```