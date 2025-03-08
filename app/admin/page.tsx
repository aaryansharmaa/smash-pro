"use client";

import { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from "@/lib/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Trash2, Search, LogOut } from "lucide-react";
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
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const [selectedCourt, setSelectedCourt] = useState<"COURT_ONE" | "COURT_TWO">(
    "COURT_ONE"
  );
  const [newBookingDate, setNewBookingDate] = useState<Date>(new Date());
  const [todayDate, setTodayDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [pricePerHour, setPricePerHour] = useState<number>(1000);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const router = useRouter();

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
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("court_bookings")
        .select("*")
        .order("booking_date", { ascending: true });

      if (error) throw error;
      setAllBookings(data || []);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
    } finally {
      setLoading(false);
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
        booking_date: format(newBookingDate, "yyyy-MM-dd"),
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
        className: "bg-[#88aaee] border-2 border-black text-black",
        title: "Success!",
        description: "Booking created successfully.",
      });

      // Reset form
      setStartTime("");
      setEndTime("");

      // Refresh bookings if the new booking is for today
      if (
        format(newBookingDate, "yyyy-MM-dd") === format(todayDate, "yyyy-MM-dd")
      ) {
        await fetchBookings(todayDate);
      }

      // Always refresh all bookings
      await fetchAllBookings();
    } catch (error) {
      console.error("Error creating booking:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bookingId: string) => {
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
        className: "bg-[#88aaee] border-2 border-black text-black",
        title: "Success!",
        description: "Booking deleted successfully.",
      });

      // Refresh both current day's bookings and all bookings
      await Promise.all([fetchBookings(todayDate), fetchAllBookings()]);
    } catch (error) {
      console.error("Error deleting booking:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings based on search query
  const filteredAllBookings = useMemo(() => {
    if (!searchQuery.trim()) return allBookings;

    return allBookings.filter((booking) => {
      const searchString = `${booking.court} ${format(
        new Date(booking.booking_date),
        "yyyy-MM-dd"
      )} ${booking.start_time} ${booking.end_time} ${
        booking.total_price
      }`.toLowerCase();
      return searchString.includes(searchQuery.toLowerCase());
    });
  }, [allBookings, searchQuery]);

  // Initial fetch
  useEffect(() => {
    fetchBookings(todayDate);
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
          <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-black font-bold">
                    {formatTimeToAMPM(booking.start_time)} -{" "}
                    {formatTimeToAMPM(booking.end_time)}
                  </p>
                  <p className="text-sm text-gray-600">
                    ₹{booking.total_price}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-red-100 text-red-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-red-200 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-black">
                        Delete Booking
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600">
                        Are you sure you want to delete this booking? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-2 border-black bg-white text-black hover:bg-gray-100">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(booking.id)}
                        className="bg-red-100 text-red-600 border-2 border-black hover:bg-red-200"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-gray-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-black">
                          Delete Booking
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                          Are you sure you want to delete this booking? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-2 border-black bg-white text-black hover:bg-gray-100">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(booking.id)}
                          className="bg-red-100 text-red-600 border-2 border-black hover:bg-red-200"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/login");
      router.refresh();
    }
  };

  const handleTabChange = (value: string) => {
    if (value === "all") {
      fetchAllBookings();
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div className="min-h-screen bg-[#dfe5f2] p-8">
        {/* Header with Logout */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black">Smash Pro Dashboard</h1>
          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#4d80e6] text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>

        {/* Booking Form */}
        <Card className="mb-8 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-black">
              New Booking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-black font-bold">Court</Label>
                  <Select
                    value={selectedCourt}
                    onValueChange={(value: "COURT_ONE" | "COURT_TWO") =>
                      setSelectedCourt(value)
                    }
                  >
                    <SelectTrigger className="bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <SelectValue placeholder="Select court" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COURT_ONE">Court One</SelectItem>
                      <SelectItem value="COURT_TWO">Court Two</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-black font-bold">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newBookingDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newBookingDate}
                        onSelect={(date) => date && setNewBookingDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-black font-bold">Start Time</Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {formatTimeToAMPM(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-black font-bold">End Time</Label>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger className="bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {formatTimeToAMPM(time)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={handleBooking}
                disabled={submitting}
                className="w-full bg-[#88aaee] text-black font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                {submitting ? "Creating booking..." : "Create Booking"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Bookings Tabs */}
        <Tabs
          defaultValue="today"
          className="space-y-4"
          onValueChange={handleTabChange}
        >
          <TabsList className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <TabsTrigger
              value="today"
              className="data-[state=active]:bg-[#88aaee] data-[state=active]:text-black"
            >
              Today&apos;s Bookings
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-[#88aaee] data-[state=active]:text-black"
            >
              All Bookings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="today">
            <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="pb-3">
                <CardDescription className="text-black font-bold">
                  {format(todayDate, "MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderBookingsList(bookings, loading, true)}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="all">
            <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAllBookings.map((booking) => (
                    <Card
                      key={booking.id}
                      className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-black font-bold">
                              {booking.court === "COURT_ONE"
                                ? "Court One"
                                : "Court Two"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {format(
                                new Date(booking.booking_date),
                                "MMM d, yyyy"
                              )}{" "}
                              • {formatTimeToAMPM(booking.start_time)} -{" "}
                              {formatTimeToAMPM(booking.end_time)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              ₹{booking.total_price}
                            </p>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 bg-red-100 text-red-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-red-200 transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-black">
                                  Delete Booking
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600">
                                  Are you sure you want to delete this booking?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-2 border-black bg-white text-black hover:bg-gray-100">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(booking.id)}
                                  className="bg-red-100 text-red-600 border-2 border-black hover:bg-red-200"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
