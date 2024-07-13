import { travelStartingSpotUseCase } from 'domain/travelStartingSpot/useCase/travelStartingSpotUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: 'Hello' }),
  post: ({ body }) => ({
    status: 200,
    body: travelStartingSpotUseCase.test(body.destination),
  }),
}));
