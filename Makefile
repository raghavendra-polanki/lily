DOCKER:=$(shell grep docker /proc/self/cgroup)

GULP = ./node_modules/gulp/bin/gulp.js
NODEMON = ./node_modules/nodemon/bin/nodemon.js

install:
	@echo Running make install...
	@npm config set unsafe-perm true
	@npm install

run:
	@echo Running make run...
ifdef DOCKER
ifeq ($(NODE_ENV), production)
	@node application/index.js
else
	@echo Setting up environment...
	@echo "Waiting for linked containers to start..."
	@sleep 2
	@echo Starting gulp watch in background...
	@nohup $(GULP) watch &
	@echo Starting server via nodemon...
	@$(NODEMON) -e js,json,yaml application/index.js
endif
else
	@echo Error: Project is configured to only run inside a docker container!
	@echo Refer to README.md for usage instructions.
endif

# to catch all default targets and do nothing
.DEFAULT: ;

.PHONY: install run
