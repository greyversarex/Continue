import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTripData {
  direction: string;
  pickupTime: string;
  pickupLocation: string;
  routeFrom: string;
  routeTo: string;
  dropoffLocation: string;
  dropoffTime: string;
  driverId?: number | null;
  status?: string;
}

export class TripModel {
  /**
   * Get all trips with driver information
   */
  static async findAll() {
    try {
      const trips = await prisma.trip.findMany({
        include: {
          driver: {
            select: {
              id: true,
              name: true,
              photo: true,
              contact: true,
              vehicleTypes: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return trips.map(trip => ({
        ...trip,
        driverName: trip.driver?.name || null
      }));
    } catch (error) {
      console.error('Error finding all trips:', error);
      throw error;
    }
  }

  /**
   * Find trip by ID
   */
  static async findById(id: number) {
    try {
      const trip = await prisma.trip.findUnique({
        where: { id },
        include: {
          driver: {
            select: {
              id: true,
              name: true,
              photo: true,
              contact: true,
              vehicleTypes: true,
              licenseCategory: true
            }
          }
        }
      });

      if (!trip) {
        return null;
      }

      return {
        ...trip,
        driverName: trip.driver?.name || null
      };
    } catch (error) {
      console.error('Error finding trip by ID:', error);
      throw error;
    }
  }

  /**
   * Create new trip
   */
  static async create(data: CreateTripData) {
    try {
      const trip = await prisma.trip.create({
        data: {
          direction: data.direction,
          pickupTime: data.pickupTime,
          pickupLocation: data.pickupLocation,
          routeFrom: data.routeFrom,
          routeTo: data.routeTo,
          dropoffLocation: data.dropoffLocation,
          dropoffTime: data.dropoffTime,
          driverId: data.driverId,
          status: data.status || 'scheduled'
        },
        include: {
          driver: {
            select: {
              id: true,
              name: true,
              photo: true,
              contact: true
            }
          }
        }
      });

      return {
        ...trip,
        driverName: trip.driver?.name || null
      };
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  }

  /**
   * Update trip
   */
  static async update(id: number, data: Partial<CreateTripData>) {
    try {
      const trip = await prisma.trip.update({
        where: { id },
        data: {
          ...(data.direction && { direction: data.direction }),
          ...(data.pickupTime && { pickupTime: data.pickupTime }),
          ...(data.pickupLocation && { pickupLocation: data.pickupLocation }),
          ...(data.routeFrom && { routeFrom: data.routeFrom }),
          ...(data.routeTo && { routeTo: data.routeTo }),
          ...(data.dropoffLocation && { dropoffLocation: data.dropoffLocation }),
          ...(data.dropoffTime && { dropoffTime: data.dropoffTime }),
          ...(data.driverId !== undefined && { driverId: data.driverId }),
          ...(data.status && { status: data.status })
        },
        include: {
          driver: {
            select: {
              id: true,
              name: true,
              photo: true,
              contact: true
            }
          }
        }
      });

      return {
        ...trip,
        driverName: trip.driver?.name || null
      };
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  }

  /**
   * Delete trip
   */
  static async delete(id: number) {
    try {
      await prisma.trip.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  }

  /**
   * Find trips by driver ID
   */
  static async findByDriverId(driverId: number) {
    try {
      const trips = await prisma.trip.findMany({
        where: { driverId },
        include: {
          driver: {
            select: {
              id: true,
              name: true,
              photo: true,
              contact: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return trips.map(trip => ({
        ...trip,
        driverName: trip.driver?.name || null
      }));
    } catch (error) {
      console.error('Error finding trips by driver ID:', error);
      throw error;
    }
  }

  /**
   * Update trip status
   */
  static async updateStatus(id: number, status: string) {
    try {
      const trip = await prisma.trip.update({
        where: { id },
        data: { status },
        include: {
          driver: {
            select: {
              id: true,
              name: true,
              photo: true,
              contact: true
            }
          }
        }
      });

      return {
        ...trip,
        driverName: trip.driver?.name || null
      };
    } catch (error) {
      console.error('Error updating trip status:', error);
      throw error;
    }
  }
}