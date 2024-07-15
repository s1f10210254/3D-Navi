import { travelSpotUseCase } from 'domain/travelSpot/useCase/travelSpotUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: 'Hello' }),
  post: async ({ body }) => ({
    status: 201,
    body: await travelSpotUseCase.fetchTravelSpots(body.destination),
  }),
}));
