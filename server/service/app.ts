import cookie from '@fastify/cookie';
import fastifyEtag from '@fastify/etag';
import helmet from '@fastify/helmet';
import fastifyHttpProxy from '@fastify/http-proxy';
import { IS_PROD } from 'common/constants';
import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import server from '../$server';
import { API_BASE_PATH, SERVER_PORT } from './envValues';

export const init = (): FastifyInstance => {
  const fastify = Fastify();

  fastify.register(helmet);
  fastify.register(fastifyEtag, { weak: true });
  fastify.register(cookie);

  if (IS_PROD) {
    fastify.register(fastifyHttpProxy, {
      upstream: `http://localhost:${SERVER_PORT + 1}`,
      replyOptions: {
        rewriteHeaders: (headers) => ({ ...headers, 'content-security-policy': undefined }),
      },
    });
  }

  server(fastify, { basePath: API_BASE_PATH });

  return fastify;
};
