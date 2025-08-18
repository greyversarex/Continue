import { Request, Response } from 'express';
import prisma from '../config/database';
import { BookingFormData, OrderData } from '../types/booking';
import { sendBookingConfirmation } from '../services/emailService';

// Generate unique order number
const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BT-${timestamp.slice(-6)}${random}`;
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const bookingData: BookingFormData = req.body;

    // Validate required fields
    if (!bookingData.customerName || !bookingData.customerEmail || !bookingData.customerPhone) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, email, and phone are required',
      });
    }

    if (!bookingData.termsAccepted || !bookingData.paymentRulesAccepted) {
      return res.status(400).json({
        success: false,
        message: 'Both terms and payment rules must be accepted',
      });
    }

    // Check if customer exists, create if not
    let customer = await prisma.customer.findUnique({
      where: { email: bookingData.customerEmail },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          fullName: bookingData.customerName,
          email: bookingData.customerEmail,
          phone: bookingData.customerPhone,
        },
      });
    }

    // Get tour information for pricing
    const tour = await prisma.tour.findUnique({
      where: { id: parseInt(req.body.tourId) },
      include: {
        category: true,
      },
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found',
      });
    }

    // Calculate total amount (basic calculation, can be enhanced)
    const basePrice = parseFloat(tour.price);
    const numberOfTourists = bookingData.tourists.length;
    const totalAmount = basePrice * numberOfTourists;

    // Create order
    const orderNumber = generateOrderNumber();
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        tourId: parseInt(req.body.tourId),
        hotelId: bookingData.selectedHotelId || null,
        guideId: bookingData.selectedGuideId || null,
        tourDate: bookingData.tourDate,
        tourists: JSON.stringify(bookingData.tourists),
        wishes: bookingData.wishes,
        totalAmount,
        status: 'pending',
        paymentStatus: 'unpaid',
      },
      include: {
        customer: true,
        tour: {
          include: {
            category: true,
          },
        },
        hotel: true,
        guide: true,
      },
    });

    // Send confirmation emails (non-blocking)
    try {
      await sendBookingConfirmation({
        order,
        customerEmail: customer.email,
        adminEmail: process.env.ADMIN_EMAIL || 'admin@bunyod-tour.com',
        communityEmail: process.env.COMMUNITY_EMAIL || 'community@bunyod-tour.com',
      });
    } catch (emailError) {
      console.error('Email sending failed (non-critical):', emailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        customer: true,
        tour: {
          include: {
            category: true,
          },
        },
        hotel: true,
        guide: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Parse JSON fields
    const formattedOrder = {
      ...order,
      tourists: JSON.parse(order.tourists),
      tour: {
        ...order.tour,
        title: JSON.parse(order.tour.title),
        description: JSON.parse(order.tour.description),
      },
      hotel: order.hotel ? {
        ...order.hotel,
        name: JSON.parse(order.hotel.name),
        description: order.hotel.description ? JSON.parse(order.hotel.description) : null,
      } : null,
      guide: order.guide ? {
        ...order.guide,
        name: JSON.parse(order.guide.name),
        description: order.guide.description ? JSON.parse(order.guide.description) : null,
      } : null,
    };

    return res.json({
      success: true,
      data: formattedOrder,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        tour: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        hotel: {
          select: {
            id: true,
            name: true,
          },
        },
        guide: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
    });

    const formattedOrders = orders.map(order => ({
      ...order,
      tourists: JSON.parse(order.tourists),
      tour: {
        ...order.tour,
        title: JSON.parse(order.tour.title),
      },
      hotel: order.hotel ? {
        ...order.hotel,
        name: JSON.parse(order.hotel.name),
      } : null,
      guide: order.guide ? {
        ...order.guide,
        name: JSON.parse(order.guide.name),
      } : null,
    }));

    const totalOrders = await prisma.order.count({ where });

    return res.json({
      success: true,
      data: formattedOrders,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: totalOrders,
        totalPages: Math.ceil(totalOrders / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const { status, paymentStatus, paymentMethod, receiptData } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (receiptData) updateData.receiptData = JSON.stringify(receiptData);

    const order = await prisma.order.update({
      where: { orderNumber },
      data: updateData,
      include: {
        customer: true,
        tour: true,
      },
    });

    return res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const { reason } = req.body;

    const order = await prisma.order.update({
      where: { orderNumber },
      data: {
        status: 'cancelled',
        wishes: reason ? `${reason} (ОТМЕНЁН)` : 'ОТМЕНЁН',
      },
    });

    return res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};