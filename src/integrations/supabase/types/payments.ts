
export interface PaymentsTable {
  id: string;
  booking_id: string;
  amount: number;
  payment_type: 'advance' | 'final';
  status: 'pending' | 'completed' | 'failed';
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  admin_verified: boolean;
  created_at: string;
  updated_at: string;
}
