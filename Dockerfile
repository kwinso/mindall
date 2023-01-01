FROM golang:1.19-alpine as builder

# Install deps for build
RUN apk add --update nodejs yarn

# Build client static files
WORKDIR /app/client
COPY client/ /app/client/

RUN yarn; yarn build

# Build backend binary
WORKDIR /app/backend

COPY backend/ ./

RUN go mod download
RUN GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o ./mindall-backend .


FROM golang:1.19-alpine as prod

WORKDIR /app/backend

COPY --from=builder /app/client/dist ../client/dist
COPY --from=builder /app/backend/mindall-backend /app/backend/mindall-backend 
COPY assets /app/assets

EXPOSE 8080

CMD [ "/app/backend/mindall-backend" ]