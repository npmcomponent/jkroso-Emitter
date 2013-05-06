spec=dot

test:
	@node_modules/mocha/bin/_mocha -R $(spec) test/*.test.js

.PHONY: test