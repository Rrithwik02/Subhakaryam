import { Database } from '../types';

export type AdditionalServicesTable = Database['public']['Tables']['additional_services']['Row'];
export type ServiceProvidersTable = Database['public']['Tables']['service_providers']['Row'];
export type ServiceProviderAvailabilityTable = Database['public']['Tables']['service_provider_availability']['Row'];

// Add specific type for service provider status
export type ServiceProviderStatus = 'pending' | 'verified' | 'rejected';