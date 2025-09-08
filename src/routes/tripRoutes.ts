import { Router } from 'express';
import { TripController } from '../controllers/tripController';

const router = Router();

// Get all trips
router.get('/', TripController.getAllTrips);

// Get trip by ID
router.get('/:id', TripController.getTripById);

// Create new trip
router.post('/', TripController.createTrip);

// Update trip
router.put('/:id', TripController.updateTrip);

// Delete trip
router.delete('/:id', TripController.deleteTrip);

export default router;