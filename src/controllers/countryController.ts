import { Request, Response, NextFunction } from 'express';
import prisma, { withRetry } from '../config/database';
import { ApiResponse } from '../types';

export class CountryController {
  /**
   * Получить все страны
   */
  static async getAllCountries(req: Request, res: Response, next: NextFunction) {
    try {
      const countries = await withRetry(() => prisma.country.findMany({
        where: { isActive: true },
        include: {
          cities: {
            where: { isActive: true },
            orderBy: { nameRu: 'asc' }
          }
        },
        orderBy: { nameRu: 'asc' }
      }));

      const response: ApiResponse = {
        success: true,
        data: countries,
        message: 'Countries retrieved successfully'
      };

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Получить страну по ID
   */
  static async getCountryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const countryId = parseInt(id);

      if (isNaN(countryId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid country ID'
        });
      }

      const country = await withRetry(() => prisma.country.findUnique({
        where: { id: countryId },
        include: {
          cities: {
            where: { isActive: true },
            orderBy: { nameRu: 'asc' }
          }
        }
      }));

      if (!country) {
        return res.status(404).json({
          success: false,
          error: 'Country not found'
        });
      }

      const response: ApiResponse = {
        success: true,
        data: country,
        message: 'Country retrieved successfully'
      };

      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Создать новую страну
   */
  static async createCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, nameRu, nameEn, nameTj, code, isActive = true } = req.body;

      if (!name || !nameRu || !nameEn || !nameTj || !code) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, nameRu, nameEn, nameTj, code'
        });
      }

      const country = await withRetry(() => prisma.country.create({
        data: {
          name,
          nameRu,
          nameEn,
          nameTj,
          code,
          isActive
        }
      }));

      const response: ApiResponse = {
        success: true,
        data: country,
        message: 'Country created successfully'
      };

      return res.status(201).json(response);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({
          success: false,
          error: 'Country with this name or code already exists'
        });
      }
      return next(error);
    }
  }

  /**
   * Обновить страну
   */
  static async updateCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const countryId = parseInt(id);
      const { name, nameRu, nameEn, nameTj, code, isActive } = req.body;

      if (isNaN(countryId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid country ID'
        });
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (nameRu !== undefined) updateData.nameRu = nameRu;
      if (nameEn !== undefined) updateData.nameEn = nameEn;
      if (nameTj !== undefined) updateData.nameTj = nameTj;
      if (code !== undefined) updateData.code = code;
      if (isActive !== undefined) updateData.isActive = isActive;

      const country = await withRetry(() => prisma.country.update({
        where: { id: countryId },
        data: updateData,
        include: {
          cities: {
            where: { isActive: true },
            orderBy: { nameRu: 'asc' }
          }
        }
      }));

      const response: ApiResponse = {
        success: true,
        data: country,
        message: 'Country updated successfully'
      };

      return res.status(200).json(response);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          error: 'Country not found'
        });
      }
      if (error.code === 'P2002') {
        return res.status(400).json({
          success: false,
          error: 'Country with this name or code already exists'
        });
      }
      return next(error);
    }
  }

  /**
   * Удалить страну
   */
  static async deleteCountry(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const countryId = parseInt(id);

      if (isNaN(countryId)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid country ID'
        });
      }

      await withRetry(() => prisma.country.delete({
        where: { id: countryId }
      }));

      const response: ApiResponse = {
        success: true,
        data: null,
        message: 'Country deleted successfully'
      };

      return res.status(200).json(response);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          error: 'Country not found'
        });
      }
      return next(error);
    }
  }
}