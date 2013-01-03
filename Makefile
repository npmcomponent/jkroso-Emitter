SRC = cat src/index.js

clean:
	@rm -rf dist

build: clean
	@bigfile -e src/index.js -w dist/Emitter.js -pc

test:
	@mocha -R spec test/Emitter.test.js

docs:
	@cat docs/head.md > Readme.md
	@cat src/index.js \
	| sed s/proto\.publish.*// \
	| sed s/^proto/Emitter.prototype/ \
	| dox --api >> Readme.md
	@cat docs/tail.md >> Readme.md

.PHONY: clean test build docs