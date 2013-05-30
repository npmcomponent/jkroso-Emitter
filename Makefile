GRAPH=node_modules/.bin/sourcegraph -p nodeish,mocha
COMPILE=node_modules/.bin/bigfile -p nodeish
REPORTER=dot

all: test/built.js

test:
	@node_modules/.bin/mocha test/*.test.js \
		--reporter $(REPORTER) \
		--bail

clean:
	@rm -f test/built.js

test/built.js: index.js test/*
	@$(GRAPH) test/browser.js | $(COMPILE) -x null > $@

.PHONY: all test clean
