all: react bootstrap sass

astro:
	npm create astro@latest

react:
	npx astro add react
	npm i @tanstack/react-query

bootstrap:
	npm i bootstrap@5.2.3

sass:
	npm install --save-dev sass