"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import Analysis from "@/components/admin/Analysis";

type Client = {
  id: string;
  name: string;
};

type Booking = {
  id: string;
  court: "COURT_ONE" | "COURT_TWO";
  booking_date: string;
  start_time: string;
  end_time: string;
  client_id: string;
  clients: {
    name: string;
  };
  price?: number;
  total_price?: number;
  price_per_hour?: number;
  payment_type?: "CASH" | "ONLINE";
  created_at: string;
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
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingPrice, setBookingPrice] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"CASH" | "ONLINE">("CASH");
  const [showRefreshModal, setShowRefreshModal] = useState(false);

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

  const fetchBookings = useCallback(
    async (date: Date) => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("court_bookings")
          .select("*, clients(name)")
          .eq("booking_date", format(date, "yyyy-MM-dd"))
          .order("start_time");

        if (error) throw error;
        setBookings(data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  const fetchAllBookings = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("court_bookings")
        .select("*, clients(name)")
        .order("booking_date", { ascending: true });

      if (error) throw error;
      setAllBookings(data || []);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const fetchClients = useCallback(async () => {
    try {
      console.log("Fetching clients");
      const { data, error } = await supabase.from("clients").select("*");

      if (error) {
        console.error("Error fetching clients:", error);
        throw error;
      }
      console.log("Fetched clients:", data);
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch clients. Please try again.",
      });
    }
  }, [supabase, toast]);

  const createClient = async () => {
    try {
      // First close the dialog to prevent UI freezing
      setShowClientDialog(false);

      const { data, error } = await supabase
        .from("clients")
        .insert({ name: newClientName })
        .select()
        .single();

      if (error) throw error;

      // Reset the new client name input
      setNewClientName("");

      // Show the refresh modal instead of updating the UI directly
      // This prevents the UI from freezing when a new client is added
      setShowRefreshModal(true);
      toast({
        className: "bg-[#88aaee] border-2 border-black text-black",
        title: "Success!",
        description: "Client created successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create client. Please try again.",
      });
    }
  };

  const updateBookingPayment = async () => {
    if (!selectedBooking) return;

    try {
      const { error } = await supabase
        .from("court_bookings")
        .update({
          price: parseFloat(bookingPrice),
          payment_type: paymentType,
        })
        .eq("id", selectedBooking.id);

      if (error) throw error;

      toast({
        className: "bg-[#88aaee] border-2 border-black text-black",
        title: "Success!",
        description: "Payment details updated successfully.",
      });

      setShowPaymentDialog(false);
      fetchBookings(todayDate);
      fetchAllBookings();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update payment details. Please try again.",
      });
    }
  };

  const handleBooking = async () => {
    if (!selectedClient) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a client.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("court_bookings").insert({
        court: selectedCourt,
        booking_date: format(newBookingDate, "yyyy-MM-dd"),
        start_time: startTime,
        end_time: endTime,
        client_id: selectedClient.id,
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
      setSelectedClient(null);

      // Refresh bookings if the new booking is for today
      if (
        format(newBookingDate, "yyyy-MM-dd") === format(todayDate, "yyyy-MM-dd")
      ) {
        await fetchBookings(todayDate);
      }
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
    return allBookings.filter((booking) => {
      const searchString = searchQuery.toLowerCase();
      return (
        booking.court.toLowerCase().includes(searchString) ||
        booking.booking_date.toLowerCase().includes(searchString) ||
        booking.start_time.toLowerCase().includes(searchString) ||
        booking.end_time.toLowerCase().includes(searchString) ||
        (booking.price?.toString() || "").toLowerCase().includes(searchString)
      );
    });
  }, [allBookings, searchQuery]);

  // Initial fetch
  useEffect(() => {
    fetchBookings(todayDate);
    fetchAllBookings();
  }, [fetchBookings, fetchAllBookings, todayDate]);

  // Update the effect to fetch clients on component mount only
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

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
          <Card
            className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            onClick={() => {
              setSelectedBooking(booking);
              setBookingPrice(booking.price?.toString() || "");
              setPaymentType(booking.payment_type || "CASH");
              setShowPaymentDialog(true);
            }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-black font-bold">
                    {formatTimeToAMPM(booking.start_time)} -{" "}
                    {formatTimeToAMPM(booking.end_time)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {booking.clients.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.price
                      ? `₹${booking.price} • ${booking.payment_type}`
                      : "Payment pending"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(booking.id);
                  }}
                  className="h-8 w-8 bg-red-100 text-red-600 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:bg-red-200 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      };

      return (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <h3 className="font-semibold text-lg text-black text-center">
              Court One
            </h3>
            <h3 className="font-semibold text-lg text-black text-center">
              Court Two
            </h3>
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
                  <p className="text-sm text-gray-600 mt-1">
                    {booking.clients.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.price ? `₹${booking.price}` : "Payment pending"}
                  </p>
                </div>
                <div className="flex items-start gap-4">
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
      <div className="min-h-screen bg-[#dfe5f2] p-4 md:p-8">
        {/* Header with Logout */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-black">
            Smash Pro Dashboard
          </h1>
          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#4d80e6] text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8">
          {/* New Booking Form */}
          <div className="lg:col-span-1">
            <Card className="h-full border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-bold text-black">
                  New Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-black font-bold">
                        Client Name
                      </Label>
                      <Select
                        value={selectedClient?.id || undefined}
                        onValueChange={(value) => {
                          const client = clients.find((c) => c.id === value);
                          if (client) {
                            setSelectedClient(client);
                          }
                        }}
                      >
                        <SelectTrigger className="bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                          <div className="p-2 border-t border-gray-200">
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                setShowClientDialog(true);
                              }}
                              className="w-full bg-[#88aaee] text-black font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                              Create New Client
                            </Button>
                          </div>
                        </SelectContent>
                      </Select>
                    </div>
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
                          <SelectValue placeholder="Start" />
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
                          <SelectValue placeholder="End" />
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
          </div>

          {/* Bookings Display Section */}
          <div className="lg:col-span-2">
            <Card className="h-full border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-bold text-black">
                  Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="today"
                  className="space-y-4"
                  onValueChange={handleTabChange}
                >
                  <TabsList className="w-full bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <TabsTrigger
                      value="today"
                      className="flex-1 data-[state=active]:bg-[#88aaee] data-[state=active]:text-black"
                    >
                      Today&apos;s Bookings
                    </TabsTrigger>
                    <TabsTrigger
                      value="all"
                      className="flex-1 data-[state=active]:bg-[#88aaee] data-[state=active]:text-black"
                    >
                      All Bookings
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="today" className="mt-4">
                    {renderBookingsList(bookings, loading, true)}
                  </TabsContent>
                  <TabsContent value="all" className="mt-4">
                    <div className="space-y-4">
                      <Input
                        placeholder="Search bookings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                      />
                      {renderBookingsList(filteredAllBookings, loading)}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Components Grid */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:gap-8">
          {/* Analysis Component */}
          <Analysis bookings={allBookings} todayBookings={bookings} />
        </div>

        {/* New Client Dialog */}
        <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
          <DialogContent className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <DialogHeader>
              <DialogTitle className="text-black">
                Create New Client
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Add a new client to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-black font-bold">Client Name</Label>
                <Input
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowClientDialog(false)}
                className="border-2 border-black bg-white text-black hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={createClient}
                className="bg-[#88aaee] text-black font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Create Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <DialogHeader>
              <DialogTitle className="text-black">
                Update Payment Details
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Enter the payment amount and select payment type.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-black font-bold">Amount</Label>
                <Input
                  type="number"
                  value={bookingPrice}
                  onChange={(e) => setBookingPrice(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-black font-bold">Payment Type</Label>
                <Select
                  value={paymentType}
                  onValueChange={(value: "CASH" | "ONLINE") =>
                    setPaymentType(value)
                  }
                >
                  <SelectTrigger className="bg-white border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="ONLINE">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowPaymentDialog(false)}
                className="border-2 border-black bg-white text-black hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                onClick={updateBookingPayment}
                className="bg-[#88aaee] text-black font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Update Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster />

        {/* Refresh Modal */}
        <Dialog open={showRefreshModal} onOpenChange={setShowRefreshModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Refresh Required</DialogTitle>
              <DialogDescription>
                A new client has been added successfully. Refresh the page to
                see the updated list.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button
                type="button"
                variant="default"
                onClick={() => window.location.reload()}
              >
                Refresh Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
