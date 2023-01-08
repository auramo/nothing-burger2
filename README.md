# Template for TypeScript Vite client and Node Server

## Run Vite dev client

```
cd client
npx vite
```

## Build client and test "in place":

```
cd client
npm run build
cd dist && python3 -m http.server 8081
```

## Run server

```
cd server
npx nodemon
```
