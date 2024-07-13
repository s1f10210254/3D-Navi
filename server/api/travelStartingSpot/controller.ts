import { travelSpotUseCase } from 'domain/travelSpot/useCase/travelSpotUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: 'Hello' }),
  post: ({ body }) => ({
    status: 200,
    body: travelSpotUseCase.test(body.destination),
  }),
}));
