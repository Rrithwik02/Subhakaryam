import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock, User } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface ProviderCalendarProps {
  providerId: string;
  isPublic?: boolean; // For public viewing vs provider management
}

const ProviderCalendar = ({ providerId, isPublic = false }: ProviderCalendarProps) => {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['provider-bookings', providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles!inner (
            full_name
          )
        `)
        .eq('provider_id', providerId)
        .in('status', ['confirmed', 'pending'])
        .order('service_date', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!providerId,
  });

  const { data: availability } = useQuery({
    queryKey: ['provider-availability', providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_provider_availability')
        .select('*')
        .eq('provider_id', providerId)
        .eq('is_available', true);

      if (error) throw error;
      return data;
    },
    enabled: !!providerId,
  });

  // Convert bookings to calendar events
  const events = bookings?.map(booking => {
    const startDate = new Date(`${booking.service_date}T${booking.time_slot || '10:00'}`);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 2); // Default 2-hour duration

    return {
      id: booking.id,
      title: isPublic 
        ? `${booking.status === 'confirmed' ? 'Booked' : 'Tentative'}`
        : `${booking.profiles.full_name} - ${booking.status}`,
      start: startDate,
      end: endDate,
      resource: booking,
      status: booking.status
    };
  }) || [];

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#3174ad';
    let borderColor = '#3174ad';

    switch (event.status) {
      case 'confirmed':
        backgroundColor = '#10b981'; // Green
        borderColor = '#10b981';
        break;
      case 'pending':
        backgroundColor = '#f59e0b'; // Yellow
        borderColor = '#f59e0b';
        break;
      case 'cancelled':
        backgroundColor = '#ef4444'; // Red
        borderColor = '#ef4444';
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const CustomEvent = ({ event }: { event: any }) => (
    <div className="p-1">
      <div className="text-xs font-medium truncate">{event.title}</div>
      {!isPublic && (
        <div className="text-xs opacity-75">
          {format(event.start, 'HH:mm')}
        </div>
      )}
    </div>
  );

  const getAvailableSlots = (selectedDate: Date) => {
    const dayOfWeek = getDay(selectedDate);
    const dayAvailability = availability?.filter(slot => slot.day_of_week === dayOfWeek);
    
    if (!dayAvailability || dayAvailability.length === 0) {
      return [];
    }

    // Check if date has existing bookings
    const dateBookings = bookings?.filter(booking => 
      format(new Date(booking.service_date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    ) || [];

    return dayAvailability.map(slot => ({
      ...slot,
      isBooked: dateBookings.some(booking => 
        booking.time_slot === slot.start_time && 
        ['confirmed', 'pending'].includes(booking.status)
      )
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Availability Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {isPublic ? 'Availability Calendar' : 'Booking Calendar'}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={view === Views.MONTH ? "default" : "outline"}
                onClick={() => setView(Views.MONTH)}
              >
                Month
              </Button>
              <Button
                size="sm"
                variant={view === Views.WEEK ? "default" : "outline"}
                onClick={() => setView(Views.WEEK)}
              >
                Week
              </Button>
              <Button
                size="sm"
                variant={view === Views.DAY ? "default" : "outline"}
                onClick={() => setView(Views.DAY)}
              >
                Day
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span>Available</span>
            </div>
          </div>

          <div style={{ height: '500px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              eventPropGetter={eventStyleGetter}
              components={{
                event: CustomEvent
              }}
              views={[Views.MONTH, Views.WEEK, Views.DAY]}
              step={60}
              showMultiDayTimes
            />
          </div>
        </CardContent>
      </Card>

      {/* Availability Details for Selected Date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Available Time Slots - {format(date, 'PPP')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const slots = getAvailableSlots(date);
            
            if (slots.length === 0) {
              return (
                <p className="text-gray-500 text-center py-8">
                  No availability set for this day
                </p>
              );
            }

            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {slots.map((slot, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg text-center ${
                      slot.isBooked 
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : 'bg-green-50 border-green-200 text-green-700'
                    }`}
                  >
                    <div className="font-medium">
                      {slot.start_time} - {slot.end_time}
                    </div>
                    <Badge 
                      variant={slot.isBooked ? "destructive" : "secondary"}
                      className="mt-1"
                    >
                      {slot.isBooked ? 'Booked' : 'Available'}
                    </Badge>
                  </div>
                ))}
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderCalendar;