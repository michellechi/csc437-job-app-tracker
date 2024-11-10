# Job Application Tracker
Michelle Chi

CSC 437 - Dynamic Web Development

### Lab 1 Miro Board 
https://miro.com/app/board/uXjVLbVR6yA=/?share_link_id=962656289527

### VPS Link
https://mgchi.csse.dev/


### Running
To start build the Express server for production:
```
npm run build
```

To start the server without a frontend:
```
npm run start
```

To start the server with the Prototype as the frontend:
```
npm run start:proto
```

To start the server in development mode with the Prototype as the frontend:
```
npm run dev
```

### Deployment
To deploy to production:
```
ssh mgchi@mgchi-host.csse.dev
```

Checkout main and pull:
```
git checkout main
git pull
```

Checkout prod and pull:
```
git checkout prod
git pull origin prod
```

Run server in production:
```
ps -eaf
// look for http-server process
kill process_id
npm run start:proto
nohup npm run start:proto
```