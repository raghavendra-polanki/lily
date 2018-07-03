# TODO(surenderthakran): use our own image instead
FROM node:8

ADD . /lily

WORKDIR /lily

RUN make install

CMD make run
