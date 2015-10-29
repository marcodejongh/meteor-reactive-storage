.PHONY: build test publish

test:
	meteor test-packages --velocity --driver-package respondly:test-reporter ./

publish:
	meteor publish

documentation:
	sed -n '/#API/q;p' README.md > README.md
	markdox client/*.js -o api.md
	cat README.md api.md > README.md
