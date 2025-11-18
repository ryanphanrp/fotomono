"use client";

import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  type View,
  Views,
} from "react-big-calendar";
import { trpc } from "@/utils/trpc";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  onEventClick?: (showId: string) => void;
}

export default function CalendarView({ onEventClick }: CalendarViewProps) {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH);

  // Get current month and year
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();

  // Fetch calendar data for current month
  const { data, isLoading, error } = trpc.shows.calendar.useQuery(
    {
      year: currentYear,
      month: currentMonth,
      view:
        view === Views.MONTH ? "month" : view === Views.WEEK ? "week" : "day",
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  // Transform events for react-big-calendar
  const events = useMemo(() => {
    if (!data?.events) return [];
    return data.events.map((event) => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      resource: {
        status: event.status,
        shootType: event.shootType,
        clientName: event.clientName,
        location: event.location,
      },
    }));
  }, [data]);

  // Event style based on status
  const eventStyleGetter = useCallback((event: any) => {
    const status = event.resource?.status;
    let backgroundColor = "#3174ad";
    let borderColor = "#265985";

    switch (status) {
      case "pending":
        backgroundColor = "#f59e0b";
        borderColor = "#d97706";
        break;
      case "confirmed":
        backgroundColor = "#3b82f6";
        borderColor = "#2563eb";
        break;
      case "completed":
        backgroundColor = "#10b981";
        borderColor = "#059669";
        break;
      case "delivered":
        backgroundColor = "#8b5cf6";
        borderColor = "#7c3aed";
        break;
      case "cancelled":
        backgroundColor = "#ef4444";
        borderColor = "#dc2626";
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "4px",
        opacity: 0.9,
        color: "white",
        display: "block",
      },
    };
  }, []);

  // Handle event click
  const handleSelectEvent = useCallback(
    (event: any) => {
      if (onEventClick) {
        onEventClick(event.id);
      } else {
        router.push(`/dashboard/shows/${event.id}`);
      }
    },
    [onEventClick, router]
  );

  // Navigate to previous period
  const handlePrevious = () => {
    const newDate = new Date(date);
    if (view === Views.MONTH) {
      newDate.setMonth(date.getMonth() - 1);
    } else if (view === Views.WEEK) {
      newDate.setDate(date.getDate() - 7);
    } else {
      newDate.setDate(date.getDate() - 1);
    }
    setDate(newDate);
  };

  // Navigate to next period
  const handleNext = () => {
    const newDate = new Date(date);
    if (view === Views.MONTH) {
      newDate.setMonth(date.getMonth() + 1);
    } else if (view === Views.WEEK) {
      newDate.setDate(date.getDate() + 7);
    } else {
      newDate.setDate(date.getDate() + 1);
    }
    setDate(newDate);
  };

  // Navigate to today
  const handleToday = () => {
    setDate(new Date());
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Shows Calendar</CardTitle>
            <CardDescription>
              {data?.total || 0} show{data?.total !== 1 ? "s" : ""} this month
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrevious} size="sm" variant="outline">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button onClick={handleToday} size="sm" variant="outline">
              Today
            </Button>
            <Button onClick={handleNext} size="sm" variant="outline">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">
            Loading calendar...
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-500">
            Error loading calendar: {error.message}
          </div>
        ) : (
          <div className="calendar-container" style={{ height: "600px" }}>
            <Calendar
              date={date}
              defaultView={Views.MONTH}
              endAccessor="end"
              eventPropGetter={eventStyleGetter}
              events={events}
              localizer={localizer}
              onNavigate={setDate}
              onSelectEvent={handleSelectEvent}
              onView={setView}
              popup
              startAccessor="start"
              style={{ height: "100%" }}
              tooltipAccessor={(event: any) => {
                const { clientName, location, status, shootType } =
                  event.resource || {};
                return `${event.title}\nClient: ${clientName}\n${location ? `Location: ${location}\n` : ""}Status: ${status}\nType: ${shootType}`;
              }}
              view={view}
              views={[Views.MONTH, Views.WEEK, Views.DAY]}
            />
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded"
              style={{ backgroundColor: "#f59e0b" }}
            />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded"
              style={{ backgroundColor: "#3b82f6" }}
            />
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded"
              style={{ backgroundColor: "#10b981" }}
            />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded"
              style={{ backgroundColor: "#8b5cf6" }}
            />
            <span>Delivered</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded"
              style={{ backgroundColor: "#ef4444" }}
            />
            <span>Cancelled</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
