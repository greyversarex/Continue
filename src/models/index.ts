import prisma from '../config/database';
import { MultilingualContent, CreateTourData, CreateCategoryData } from '../types';

export class TourModel {
  /**
   * Get all tours with their categories
   */
  static async findAll() {
    return await prisma.tour.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Get a tour by ID
   */
  static async findById(id: number) {
    return await prisma.tour.findUnique({
      where: { id },
      include: {
        category: true
      }
    });
  }

  /**
   * Create a new tour
   */
  static async create(data: CreateTourData) {
    // Validate that the category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return await prisma.tour.create({
      data: {
        title: JSON.stringify(data.title),
        description: JSON.stringify(data.description),
        duration: data.duration,
        price: data.price,
        categoryId: data.categoryId
      },
      include: {
        category: true
      }
    });
  }

  /**
   * Update a tour
   */
  static async update(id: number, data: Partial<CreateTourData>) {
    const updateData: any = {};

    if (data.title) updateData.title = JSON.stringify(data.title);
    if (data.description) updateData.description = JSON.stringify(data.description);
    if (data.duration) updateData.duration = data.duration;
    if (data.price) updateData.price = data.price;
    if (data.categoryId) {
      // Validate that the category exists
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId }
      });
      if (!category) {
        throw new Error('Category not found');
      }
      updateData.categoryId = data.categoryId;
    }

    return await prisma.tour.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    });
  }

  /**
   * Delete a tour
   */
  static async delete(id: number) {
    return await prisma.tour.delete({
      where: { id }
    });
  }
}

export class CategoryModel {
  /**
   * Get all categories
   */
  static async findAll() {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { tours: true }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });
  }

  /**
   * Get a category by ID
   */
  static async findById(id: number) {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        tours: true,
        _count: {
          select: { tours: true }
        }
      }
    });
  }

  /**
   * Create a new category
   */
  static async create(data: CreateCategoryData) {
    return await prisma.category.create({
      data: {
        name: JSON.stringify(data.name)
      }
    });
  }

  /**
   * Update a category
   */
  static async update(id: number, data: Partial<CreateCategoryData>) {
    const updateData: any = {};
    if (data.name) updateData.name = JSON.stringify(data.name);

    return await prisma.category.update({
      where: { id },
      data: updateData
    });
  }

  /**
   * Delete a category
   */
  static async delete(id: number) {
    return await prisma.category.delete({
      where: { id }
    });
  }
}
