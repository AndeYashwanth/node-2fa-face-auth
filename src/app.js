/* imports */

// npm modules
import express from 'express';

// local modules
import config from './config/index.js';
import loaders from './loaders/index.js';

const init = async () => {
  const app = express();
  await loaders(app);
  app.listen(config.port, config.host, () => {
    console.log(`server started on port ${config.port}`);
  });
};

init();
