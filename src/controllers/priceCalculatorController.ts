import { Request, Response } from 'express';
import { PriceCalculatorModel } from '../models/index';

export const priceCalculatorController = {
  /**
   * Get all price calculator components
   * GET /api/price-calculator
   */
  async getAll(req: Request, res: Response) {
    try {
      const components = await PriceCalculatorModel.findAll();
      
      return res.json({
        success: true,
        data: components
      });
    } catch (error) {
      console.error('Error fetching price calculator components:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch price calculator components',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Get price calculator component by key
   * GET /api/price-calculator/:key
   */
  async getByKey(req: Request, res: Response) {
    try {
      const { key } = req.params;
      const component = await PriceCalculatorModel.findByKey(key);
      
      if (!component) {
        return res.status(404).json({
          success: false,
          message: 'Price calculator component not found'
        });
      }

      return res.json({
        success: true,
        data: component
      });
    } catch (error) {
      console.error('Error fetching price calculator component:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch price calculator component',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Create a new price calculator component
   * POST /api/price-calculator
   */
  async create(req: Request, res: Response) {
    try {
      const { componentKey, componentName, basePrice, category, isActive } = req.body;

      if (!componentKey || !componentName || basePrice === undefined || !category) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: componentKey, componentName, basePrice, category'
        });
      }

      // Check if component with this key already exists
      const existingComponent = await PriceCalculatorModel.findByKey(componentKey);
      if (existingComponent) {
        return res.status(400).json({
          success: false,
          message: 'Component with this key already exists'
        });
      }

      const component = await PriceCalculatorModel.create({
        componentKey,
        componentName,
        basePrice,
        category,
        isActive
      });

      return res.status(201).json({
        success: true,
        data: component,
        message: 'Price calculator component created successfully'
      });
    } catch (error) {
      console.error('Error creating price calculator component:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create price calculator component',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Update a price calculator component
   * PUT /api/price-calculator/:id
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const component = await PriceCalculatorModel.update(parseInt(id), updateData);
      
      if (!component) {
        return res.status(404).json({
          success: false,
          message: 'Price calculator component not found'
        });
      }

      return res.json({
        success: true,
        data: component,
        message: 'Price calculator component updated successfully'
      });
    } catch (error) {
      console.error('Error updating price calculator component:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update price calculator component',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Delete a price calculator component
   * DELETE /api/price-calculator/:id
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const deleted = await PriceCalculatorModel.delete(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Price calculator component not found'
        });
      }

      return res.json({
        success: true,
        message: 'Price calculator component deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting price calculator component:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete price calculator component',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Initialize default price calculator components
   * POST /api/price-calculator/initialize
   */
  async initializeDefaults(req: Request, res: Response) {
    try {
      await PriceCalculatorModel.initializeDefaults();
      
      return res.json({
        success: true,
        message: 'Default price calculator components initialized successfully'
      });
    } catch (error) {
      console.error('Error initializing default components:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to initialize default components',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};