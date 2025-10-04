FROM golang:1.24.5-alpine as build-stage
WORKDIR /app
COPY . .
# Initialize Go module and download dependencies
RUN go mod tidy && go build -o main .

FROM alpine:latest
WORKDIR /app
COPY --from=build-stage /app/main .
EXPOSE 8080
CMD ["/app/main"]