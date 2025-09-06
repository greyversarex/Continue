import { Request, Response } from 'express';
import { PriceCalculatorModel } from '../models';

/**
 * Get all pricing components
 */
export const getAllComponents = async (req: Request, res: Response) => {
  try {
    const components = await PriceCalculatorModel.findAll();
    
    res.json({
      success: true,
      data: components
    });
  } catch (error) {
    console.error('Error fetching pricing components:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке компонентов цен'
    });
  }
};

/**
 * Get pricing component by ID
 */
export const getComponentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const allComponents = await PriceCalculatorModel.findAll();
    const component = allComponents.find(c => c.id === parseInt(id));
    
    if (!component) {
      res.status(404).json({
        success: false,
        message: 'Компонент не найден'
      });
      return;
    }
    
    res.json({
      success: true,
      data: component
    });
  } catch (error) {
    console.error('Error fetching pricing component by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке компонента'
    });
  }
};

/**
 * Get pricing component by key
 */
export const getComponentByKey = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const component = await PriceCalculatorModel.findByKey(key);
    
    if (!component) {
      res.status(404).json({
        success: false,
        message: 'Компонент не найден'
      });
      return;
    }
    
    res.json({
      success: true,
      data: component
    });
  } catch (error) {
    console.error('Error fetching pricing component by key:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке компонента'
    });
  }
};

/**
 * Create a new pricing component
 */
export const createComponent = async (req: Request, res: Response) => {
  try {
    const { key, category, name, price, unit, description, sortOrder } = req.body;
    
    if (!key || !category || !name || price === undefined || !unit) {
      res.status(400).json({
        success: false,
        message: 'Все обязательные поля должны быть заполнены'
      });
      return;
    }
    
    const component = await PriceCalculatorModel.create({
      key,
      category,
      name,
      price: parseFloat(price),
      unit,
      description,
      sortOrder: sortOrder || 0
    });
    
    res.status(201).json({
      success: true,
      data: component,
      message: 'Компонент успешно создан'
    });
  } catch (error) {
    console.error('Error creating pricing component:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании компонента'
    });
  }
};

/**
 * Update a pricing component with retry mechanism
 */
export const updateComponent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, unit, description, sortOrder, isActive } = req.body;
  
  console.log(`🔄 Attempting to update component ${id} with price ${price}`);
  
  let retryCount = 0;
  const maxRetries = 3;
  
  while (retryCount <= maxRetries) {
    try {
      const component = await PriceCalculatorModel.update(parseInt(id), {
        name,
        price: price !== undefined ? parseFloat(price) : undefined,
        unit,
        description,
        sortOrder,
        isActive
      });
      
      console.log(`✅ Component ${id} updated successfully on attempt ${retryCount + 1}`);
      
      res.json({
        success: true,
        data: component,
        message: 'Компонент успешно обновлен'
      });
      return;
      
    } catch (error: any) {
      retryCount++;
      console.error(`❌ Attempt ${retryCount} failed for component ${id}:`, error.message);
      
      // Check if it's a database connection error
      const isDbError = error.message?.includes('connection') || 
                       error.message?.includes('terminating') ||
                       error.code === 'P1001' || error.code === 'P1017';
      
      if (isDbError && retryCount <= maxRetries) {
        console.log(`🔄 Retrying in ${retryCount * 1000}ms... (attempt ${retryCount}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
        continue;
      }
      
      // If all retries failed or it's not a DB error, return error
      console.error('❌ All retry attempts failed or non-retryable error');
      res.status(500).json({
        success: false,
        message: retryCount > maxRetries ? 
          `Ошибка соединения с базой данных. Попробовано ${maxRetries} раз.` : 
          'Ошибка при обновлении компонента'
      });
      return;
    }
  }
};

/**
 * Delete a pricing component
 */
export const deleteComponent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await PriceCalculatorModel.delete(parseInt(id));
    
    res.json({
      success: true,
      message: 'Компонент успешно удален'
    });
  } catch (error) {
    console.error('Error deleting pricing component:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении компонента'
    });
  }
};

/**
 * Initialize default pricing components
 */
export const initializeDefaults = async (req: Request, res: Response) => {
  try {
    const components = await PriceCalculatorModel.initializeDefaults();
    
    res.json({
      success: true,
      data: components,
      message: `Инициализировано ${components.length} компонентов по умолчанию`
    });
  } catch (error) {
    console.error('Error initializing default components:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при инициализации компонентов по умолчанию'
    });
  }
};

/**
 * Calculate tour price based on selected components
 */
export const calculateTourPrice = async (req: Request, res: Response) => {
  try {
    const { components } = req.body; // Array of {key, quantity}
    
    if (!components || !Array.isArray(components)) {
      res.status(400).json({
        success: false,
        message: 'Необходимо передать массив компонентов'
      });
      return;
    }
    
    let totalPrice = 0;
    const calculation = [];
    
    for (const comp of components) {
      const component = await PriceCalculatorModel.findByKey(comp.key);
      if (component) {
        const componentTotal = component.price * (comp.quantity || 1);
        totalPrice += componentTotal;
        calculation.push({
          component: component.name,
          price: component.price,
          quantity: comp.quantity || 1,
          unit: component.unit,
          total: componentTotal
        });
      }
    }
    
    res.json({
      success: true,
      data: {
        totalPrice: Math.round(totalPrice * 100) / 100, // Round to 2 decimal places
        currency: 'TJS',
        calculation
      }
    });
  } catch (error) {
    console.error('Error calculating tour price:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при расчете стоимости тура'
    });
  }
};