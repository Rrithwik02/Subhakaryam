import { Database } from '../types';

export type AdditionalServicesTable = Database['public']['Tables']['additional_services']['Row'];
export type ServiceProvidersTable = Database['public']['Tables']['service_providers']['Row'];
export type ServiceProviderAvailabilityTable = Database['public']['Tables']['service_provider_availability']['Row'];