const { generate } = require('nest-openapi-gen');

generate({ prefix: '/v1', filePath: './openapi.json', tsConfigFilePath: './tsconfig.build.json' });
