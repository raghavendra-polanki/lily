'use strict';

module.exports = {
    connections: {
      admin: {
        port: 17883,
        label: 'admin',
      },
      api: {
        port: 17884,
        label: 'api',
      },
    },
    plugins: {
      mongodb: {
        development: {
          host: process.env.MONGO_PORT_27017_TCP_ADDR,
          port: process.env.MONGO_PORT_27017_TCP_PORT,
          db: 'viloCounter-dev',
          user: 'elephant-rw',
          pwd: 'elephant',
          authSource: 'admin',
        },
        production: {
          host: process.env.MONGO_PORT_27017_TCP_ADDR,
          port: process.env.MONGO_PORT_27017_TCP_PORT,
          db: process.env.MONGO_COUNTER_DB,
          user: process.env.MONGO_USER,
          pwd: process.env.MONGO_PASSWORD,
          authSource: process.env.MONGO_AUTH_DB,
        },
      },
      mongoose: {
        development: {
          host: process.env.MONGO_PORT_27017_TCP_ADDR,
          port: process.env.MONGO_PORT_27017_TCP_PORT,
          db: 'vilo-dev',
          user: 'elephant-rw',
          pwd: 'elephant',
          authSource: 'admin',
        },
        production: {
          host: process.env.MONGO_PORT_27017_TCP_ADDR,
          port: process.env.MONGO_PORT_27017_TCP_PORT,
          db: process.env.MONGO_DB,
          user: process.env.MONGO_USER,
          pwd: process.env.MONGO_PASSWORD,
          authSource: process.env.MONGO_AUTH_DB,
        },
      },
      services: {},
      log: {},
    },
};
