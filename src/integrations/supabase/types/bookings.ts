
import { Database } from '../types';

export type BookingsTable = Database['public']['Tables']['bookings']['Row'] & {
  payment_preference: 'pay_now' | 'pay_on_delivery';
};
