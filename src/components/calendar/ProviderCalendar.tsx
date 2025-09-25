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
    <div className="space-y-4">
      {/* Simplified Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ceremonial-maroon">
          {isPublic ? 'Check Availability' : 'Your Calendar'}
        </h3>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={view === Views.MONTH ? "default" : "ghost"}
            onClick={() => setView(Views.MONTH)}
            className="h-8 px-3"
          >
            Month
          </Button>
          <Button
            size="sm"
            variant={view === Views.WEEK ? "default" : "ghost"}
            onClick={() => setView(Views.WEEK)}
            className="h-8 px-3"
          >
            Week
          </Button>
        </div>
      </div>

      {/* Compact Legend */}
      <div className="flex items-center gap-4 text-xs bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-600">Pending</span>
        </div>
      </div>

      {/* Calendar Component */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div style={{ height: view === Views.MONTH ? '400px' : '500px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ 
              height: '100%',
              fontFamily: 'inherit'
            }}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            eventPropGetter={eventStyleGetter}
            components={{
              event: CustomEvent
            }}
            views={[Views.MONTH, Views.WEEK]}
            step={60}
            showMultiDayTimes={false}
            toolbar={false}
            formats={{
              monthHeaderFormat: 'MMMM yyyy',
              dayHeaderFormat: 'EEE M/d',
              timeGutterFormat: 'HH:mm'
            }}
          />
        </div>
      </div>

      {/* Custom Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newDate = new Date(date);
            if (view === Views.MONTH) {
              newDate.setMonth(newDate.getMonth() - 1);
            } else {
              newDate.setDate(newDate.getDate() - 7);
            }
            setDate(newDate);
          }}
          className="h-8"
        >
          Previous
        </Button>
        
        <div className="text-center">
          <div className="font-semibold text-ceremonial-maroon">
            {view === Views.MONTH 
              ? format(date, 'MMMM yyyy')
              : format(date, 'MMM d, yyyy')
            }
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newDate = new Date(date);
            if (view === Views.MONTH) {
              newDate.setMonth(newDate.getMonth() + 1);
            } else {
              newDate.setDate(newDate.getDate() + 7);
            }
            setDate(newDate);
          }}
          className="h-8"
        >
          Next
        </Button>
      </div>

      {/* Simplified Time Slots for Current Date */}
      {view === Views.MONTH && (() => {
        const slots = getAvailableSlots(date);
        
        if (slots.length === 0) {
          return (
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No availability for {format(date, 'MMM d')}</p>
              <p className="text-sm">Try selecting a different date</p>
            </div>
          );
        }

        return (
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-medium text-ceremonial-maroon mb-3">
              Available on {format(date, 'EEE, MMM d')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {slots.map((slot, index) => (
                <Badge
                  key={index}
                  variant={slot.isBooked ? "destructive" : "secondary"}
                  className={`px-3 py-1 ${
                    slot.isBooked 
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : 'bg-green-100 text-green-700 border-green-200'
                  }`}
                >
                  {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                </Badge>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ProviderCalendar;