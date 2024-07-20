import { config } from 'dotenv';
import { z } from 'zod';

config({ path: '../client/.env' });
config();

const SERVER_PORT = +z.string().regex(/^\d+$/).parse(process.env.NEXT_PUBLIC_SERVER_PORT);
const API_BASE_PATH = z.string().startsWith('/').parse(process.env.NEXT_PUBLIC_API_BASE_PATH);

export { API_BASE_PATH, SERVER_PORT };
