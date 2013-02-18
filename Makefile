
test:
	@mocha -R spec test/*.test.js

Readme.md:
	@cat docs/head.md > Readme.md
	@cat src/index.js \
	| sed s/proto\.publish.*// \
	| sed s/^proto/Emitter.prototype/ \
	| dox --api >> Readme.md
	@cat docs/tail.md >> Readme.md

.PHONY: test