const config = require('./config/config');
const express = require('express');
var SwaggerExpress = require('swagger-express-mw');
const app = express();
const log = require('color-logs')(true, true, __filename);

const apiSubPath = express();

const cors = require('cors');

const SwaggerParser = require('swagger-parser');

const { authenticate } = require('./middleware/authenticate').authenticate;
const { authorize } = require('./middleware/authorize').authorize;

// Validate swagger definition
SwaggerParser.validate(config.swaggerFile)
  .then((result) => {
    log.info('Validation OK', result.info);
  })
  .catch((err) => {
    log.info('Swagger Error:', err);
  });

// Initialise swagger definition
SwaggerParser.bundle(config.swaggerFile)
  .then((api) => {
    const swaggerConfig = {
      appRoot: __dirname,
      swagger: api,
      swaggerSecurityHandlers: {
        userSecurity: authenticate,
        roles: authorize,
      },
    };

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  app.use(cors({
    origin: '*',
    exposedHeaders: ['Content-Range', 'X-Content-Range', 'Content-Disposition', 'Content-Error'],
    credentials: true,
  }));
  app.use(SwaggerUi(swaggerExpress.runner.swagger));
  app.use(express.static(path.join(__dirname, 'public')));

  apiSubPath.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'EOS');
    next();
  });
  apiSubPath.get('/v1/swagger.json', (req, res) => {
    res.json(api);
  });
  // install middleware
  swaggerExpress.register(apiSubPath);

  app.use(apiSubPath);
  app.listen(config.env.port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
  });
