build:
	docker build . -t saadbruno/yoichi-bot

run:
	docker-compose up -d

logs:
	docker-compose logs -f