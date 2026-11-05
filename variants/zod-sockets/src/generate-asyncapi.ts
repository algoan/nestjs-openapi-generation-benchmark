import { writeFileSync } from 'node:fs';
import { Documentation } from 'zod-sockets/dist/documentation';
import { actions, config } from './events/events.asyncapi';

writeFileSync('asyncapi.yaml', new Documentation({ config, actions, title: 'Petstore events', version: '1.0.0' }).getSpecAsYaml());
