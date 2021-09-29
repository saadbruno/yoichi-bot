build:
	docker build . -t saadbruno/yoichi-bot

push:
	docker push saadbruno/yoichi-bot:latest

run:
	docker-compose up -d

logs:
	docker-compose logs -f