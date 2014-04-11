MOCHA = mocha

test:
	@NODE_ENV=test $(MOCHA) tests \
		-r should \
		-R spec

.PHONY: test