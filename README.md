# lily

TODO(raghav): write project description

TODO(raghav): update usage instructions

### Build Application image
```
docker build -t lily .
```

### Start mongo container with authentication enabled
```
docker run -d -p 27017:27017 --restart unless-stopped -v $HOME/workspace/data/mongo:/data/db --name mongo_container mongo:3.4.5 --auth
```

### Start application container
#### On Development
```
docker run --rm -it -v $(pwd)/application:/lily/application -v $(pwd)/package.json:/lily/package.json -p 17883:17883 -p 17884:17884 --name=lily_1 lily bash
```
#### On Production
```
docker run --rm -it -d --link mongo_container:mongo --env-file production.env -p 17883:17883 -p 17884:17884 --name=lily_1 lily
```

### Mongo Backup:
```
docker run --rm --link mongo_local:mongo -v $HOME/workspace/data/backup/mongo:/backup mongo:3.4.5 bash -c 'mongodump -u {user} -p {user_password} --out /backup --host $MONGO_PORT_27017_TCP_ADDR'
```

### Mongo Restore:
#### Run mongo container without auth enabled
```
docker run -d --rm -p 27017:27017 -v $HOME/workspace/data/mongo:/data/db --name mongo_local mongo:3.4.5
```
#### Run restore command
```
docker run --rm --link mongo_local:mongo -v $HOME/workspace/data/backup/mongo:/backup mongo:3.4.5 bash -c 'mongorestore -u admin -p admin /backup --host $MONGO_PORT_27017_TCP_ADDR'
```
#### Start Mongo with authentication enabled
