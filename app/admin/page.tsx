"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@/lib/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Trash2, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

type Booking = {
  id: string;
  court: "COURT_ONE" | "COURT_TWO";
  booking_date: string;
  start_time: string;
  end_time: string;
  price_per_hour: number;
  total_price: number;
};

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedCourt, setSelectedCourt] = useState<"COURT_ONE" | "COURT_TWO">(
    "COURT_ONE"
  );
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("07:00");
  const [pricePerHour, setPricePerHour] = useState(1000);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // Format time to AM/PM
  const formatTimeToAMPM = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "pm" : "am";
    const displayHours = hours % 12 || 12;
    return `${displayHours}${
      minutes === 0 ? "" : ":" + minutes.toString().padStart(2, "0")
    }${period}`;
  };

  // Generate time slots from 6 AM to 3 AM next day with 30-min intervals
  const timeSlots = Array.from({ length: 42 }, (_, i) => {
    const totalMinutes = i * 30 + 6 * 60; // Start from 6 AM
    const hour = Math.floor(totalMinutes / 60) % 24;
    const minute = totalMinutes % 60;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  }).filter((time) => {
    const hour = parseInt(time.split(":")[0]);
    // Keep times between 6 AM and 3 AM next day
    return hour >= 6 || hour < 3;
  });

  const fetchBookings = async (date: Date) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("court_bookings")
        .select("*")
        .eq("booking_date", format(date, "yyyy-MM-dd"))
        .order("start_time");

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllBookings = async () => {
    setLoadingAll(true);
    try {
      const { data, error } = await supabase
        .from("court_bookings")
        .select("*")
        .order("booking_date", { ascending: false })
        .order("start_time");

      if (error) throw error;
      setAllBookings(data || []);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
    } finally {
      setLoadingAll(false);
    }
  };

  const handleBooking = async () => {
    setSubmitting(true);
    try {
      const startHour = parseInt(startTime.split(":")[0]);
      const endHour = parseInt(endTime.split(":")[0]);
      const hours =
        endHour > startHour ? endHour - startHour : 24 - startHour + endHour;

      const totalPrice = pricePerHour * hours;

      const { error } = await supabase.from("court_bookings").insert({
        court: selectedCourt,
        booking_date: format(selectedDate, "yyyy-MM-dd"),
        start_time: startTime,
        end_time: endTime,
        price_per_hour: pricePerHour,
        total_price: totalPrice,
      });

      if (error) {
        if (error.code === "23514") {
          toast({
            variant: "destructive",
            title: "Invalid Time Range",
            description: "Please ensure the end time is after the start time.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to create booking. Please try again.",
          });
        }
        throw error;
      }

      toast({
        title: "Success",
        description: "Booking created successfully!",
      });

      // Refresh bookings
      await fetchBookings(selectedDate);
    } catch (error) {
      console.error("Error creating booking:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("court_bookings")
        .delete()
        .eq("id", bookingId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete booking. Please try again.",
        });
        throw error;
      }

      toast({
        title: "Success",
        description: "Booking deleted successfully!",
      });

      // Refresh both current day's bookings and all bookings
      await Promise.all([fetchBookings(selectedDate), fetchAllBookings()]);
    } catch (error) {
      console.error("Error deleting booking:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings based on search
  const filteredAllBookings = allBookings.filter((booking) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      booking.court.toLowerCase().includes(searchLower) ||
      booking.booking_date.includes(searchLower) ||
      booking.start_time.includes(searchLower) ||
      booking.end_time.includes(searchLower) ||
      booking.total_price.toString().includes(searchLower)
    );
  });

  // Initial fetch
  useEffect(() => {
    fetchBookings(selectedDate);
    fetchAllBookings();
  }, []);

  const renderBookingsList = (
    bookingsList: Booking[],
    isLoading: boolean,
    isTodayView: boolean = false
  ) => {
    if (isLoading) {
      return <div className="text-center py-4">Loading bookings...</div>;
    }

    if (bookingsList.length === 0) {
      return (
        <div className="text-center py-4 text-gray-400">No bookings found</div>
      );
    }

    if (isTodayView) {
      // Split bookings by court
      const courtOneBookings = bookingsList
        .filter((booking) => booking.court === "COURT_ONE")
        .sort((a, b) => a.start_time.localeCompare(b.start_time));
      const courtTwoBookings = bookingsList
        .filter((booking) => booking.court === "COURT_TWO")
        .sort((a, b) => a.start_time.localeCompare(b.start_time));

      // Get all unique start times from both courts and sort them
      const allStartTimes = Array.from(
        new Set([
          ...courtOneBookings.map((b) => b.start_time),
          ...courtTwoBookings.map((b) => b.start_time),
        ])
      ).sort();

      // Create a map of booked time slots
      const timeSlotMap = new Map<
        string,
        { court1?: Booking; court2?: Booking }
      >();

      // Add bookings to their respective time slots
      courtOneBookings.forEach((booking) => {
        timeSlotMap.set(booking.start_time, {
          ...(timeSlotMap.get(booking.start_time) || {}),
          court1: booking,
        });
      });

      courtTwoBookings.forEach((booking) => {
        timeSlotMap.set(booking.start_time, {
          ...(timeSlotMap.get(booking.start_time) || {}),
          court2: booking,
        });
      });

      const renderBookingCell = (booking?: Booking) => {
        if (!booking) return null;
        return (
          <Card className="border-gray-800 bg-gray-800">
            <CardContent className="py-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">
                  {formatTimeToAMPM(booking.start_time)} -{" "}
                  {formatTimeToAMPM(booking.end_time)}
                </p>
                <div className="flex items-center gap-4">
                  <p className="font-semibold">₹{booking.total_price}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-gray-700"
                    onClick={() => handleDelete(booking.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      };

      return (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <h3 className="font-semibold text-lg text-center">Court One</h3>
            <h3 className="font-semibold text-lg text-center">Court Two</h3>
          </div>
          <div className="space-y-2">
            {allStartTimes.map((time) => {
              const bookings = timeSlotMap.get(time) || {};
              return (
                <div key={time} className="grid grid-cols-2 gap-4">
                  <div>{renderBookingCell(bookings.court1)}</div>
                  <div>{renderBookingCell(bookings.court2)}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Regular list view for "All Bookings" tab
    return (
      <div className="space-y-4">
        {bookingsList.map((booking) => (
          <Card key={booking.id} className="border-gray-800 bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {booking.court === "COURT_ONE" ? "Court One" : "Court Two"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {format(new Date(booking.booking_date), "MMM d, yyyy")} •{" "}
                    {formatTimeToAMPM(booking.start_time)} -{" "}
                    {formatTimeToAMPM(booking.end_time)}
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <p className="font-semibold">₹{booking.total_price}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-gray-700"
                    onClick={() => handleDelete(booking.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="container mx-auto py-10 bg-black text-white">
        <h1 className="text-4xl font-bold mb-8">
          Smash Pro Arena - Court Bookings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Booking Form */}
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle>New Booking</CardTitle>
              <CardDescription>Create a new court booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Court</Label>
                <Select
                  value={selectedCourt}
                  onValueChange={(value: "COURT_ONE" | "COURT_TWO") =>
                    setSelectedCourt(value)
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select court" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COURT_ONE">Court One</SelectItem>
                    <SelectItem value="COURT_TWO">Court Two</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-gray-800 border-gray-700",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                          fetchBookings(date);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>End Time</Label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Price per Hour (₹)</Label>
                <Select
                  value={pricePerHour.toString()}
                  onValueChange={(value) => setPricePerHour(parseInt(value))}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="800">₹800</SelectItem>
                    <SelectItem value="900">₹900</SelectItem>
                    <SelectItem value="1000">₹1000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleBooking}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={submitting}
              >
                {submitting ? "Creating Booking..." : "Create Booking"}
              </Button>
            </CardContent>
          </Card>

          {/* Bookings Display */}
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
              <Tabs defaultValue="today" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="today">Today&apos;s Bookings</TabsTrigger>
                  <TabsTrigger value="all">All Bookings</TabsTrigger>
                </TabsList>
                <TabsContent value="today" className="mt-4">
                  <CardDescription className="mb-4">
                    {format(selectedDate, "MMMM d, yyyy")}
                  </CardDescription>
                  {renderBookingsList(bookings, loading, true)}
                </TabsContent>
                <TabsContent value="all" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <Search className="w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search bookings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <CardDescription className="mb-4">
                      {filteredAllBookings.length} bookings found
                    </CardDescription>
                    {renderBookingsList(filteredAllBookings, loadingAll)}
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
