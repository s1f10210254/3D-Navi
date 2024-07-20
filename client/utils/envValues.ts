import { z } from 'zod';

const NEXT_PUBLIC_API_BASE_PATH = z.string().parse(process.env.NEXT_PUBLIC_API_BASE_PATH);

const NEXT_PUBLIC_SERVER_PORT = z.string().optional().parse(process.env.NEXT_PUBLIC_SERVER_PORT);

const NEXT_PUBLIC_MAPBOX_API_KEY = z.string().parse(process.env.NEXT_PUBLIC_MAPBOX_API_KEY);

export { NEXT_PUBLIC_API_BASE_PATH, NEXT_PUBLIC_MAPBOX_API_KEY, NEXT_PUBLIC_SERVER_PORT };
