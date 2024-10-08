
import { CreateBooking, DeleteBooking, GetBooking, GetUserEvents, UpdateBooking } from '../Controller/Booking.controller.js';
import express from 'express'
const router = express.Router()
router.post('/Create', CreateBooking)
router.get('/Get', GetBooking)
router.get('/Get/:id', GetUserEvents)
router.put('/Update/:id', UpdateBooking)
router.delete('/Delete/:id', DeleteBooking)

export default router;