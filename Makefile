.PHONY: build test publish

test:
	meteor test-packages --velocity --driver-package respondly:test-reporter@1.0.1 ./

publish:
	meteor publish

documentation:
	sed -n '/#API/q;p' README.md > README.md
	markdox client/*.js -o api.md
	cat README.md api.md > README.md
