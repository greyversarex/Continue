import { Router } from 'express';
import {
    getExchangeRates,
    getExchangeRatesMap,
    updateExchangeRate,
    initializeExchangeRates,
    convertPrice
} from '../controllers/exchangeRateController';

const router = Router();

// Публичные endpoints (доступны без авторизации)
router.get('/', getExchangeRates);
router.get('/map', getExchangeRatesMap);
router.get('/convert', convertPrice);

// Административные endpoints (требуют авторизации)
router.post('/initialize', initializeExchangeRates);
router.put('/:currency', updateExchangeRate);

export default router;