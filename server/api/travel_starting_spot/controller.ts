import { travel_starting_spotUseCase } from 'domain/travel_starting_spot/travel_starting_spotUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: 'Hello' }),
  post: ({ body }) => ({ status: 200, body: travel_starting_spotUseCase.test(body.destination) }),
}));
