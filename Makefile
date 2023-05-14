install:
		npm ci

link:
		npm link

test:
		NODE_OPTIONS=--experimental-vm-modules npx jest

test-coverage:
		NODE_OPTIONS=--experimental-vm-modules npx jest --coverage