FROM  golang:1.22

WORKDIR /app/

COPY . .

RUN apt-get update && apt-get install -y librdkafka-dev && go mod tidy && apt-get install -y netcat-openbsd

EXPOSE 8080

CMD ["go", "run", "./cmd/walletcore/main.go"]