install
	npm ci

publish
	npm publish --dry-run

test
	NODE_OPTIONS=--experimental-vm-module npx jest

test-coverage
	NODE_OPTIONS=--experimental-vm-module npx jest --coverage