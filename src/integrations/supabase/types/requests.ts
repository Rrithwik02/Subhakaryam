
import { Database } from '../types';

export type ServiceRequestsTable = Database['public']['Tables']['service_requests']['Row'];
export type ServiceSuggestionsTable = Database['public']['Tables']['service_suggestions']['Row'];

// Extended type for ServiceRequests with additional fields
export interface ExtendedServiceRequest extends ServiceRequestsTable {
  city?: string;
  preferred_date?: string | null;
  preferred_time?: string | null;
  budget_range?: string | null;
  user_email?: string;
  user_name?: string;
}
