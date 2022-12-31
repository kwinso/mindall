FROM golang:1.16-alpine as build

WORKDIR /app/client
COPY client/ /app/client/

RUN apk add --update nodejs npm
RUN npm install
RUN npm run build

WORKDIR /app/backend

COPY backend/ ./

RUN apk add --no-cache libc6-compat

RUN go mod download


RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o ./mindall-backend .

FROM golang:1.16-alpine as prod

WORKDIR /app/backend
COPY --from=build /app/client/build /app/client/build

COPY --from=build /app/backend/mindall-backend .
COPY --from=build /app/backend/elements.json .


EXPOSE 8080

CMD [ "/app/backend/mindall-backend" ]