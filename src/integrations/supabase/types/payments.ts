
export interface PaymentsTable {
  id: string;
  booking_id: string;
  amount: number;
  payment_type: 'advance' | 'final';
  status: 'pending' | 'completed' | 'failed';
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  admin_verified: boolean;
  created_at: string;
  updated_at: string;
}
