clean:
	@rm -rf dist

build: clean
	@bigfile -e src/index.js -w dist/Emitter.js -pc

test:
	@mocha -R spec test/Emitter.test.js

docs:
	@cat docs/head.md > Readme.md
	@dox --api < src/index.js >> Readme.md
	@cat docs/tail.md >> Readme.md

.PHONY: clean test build docs