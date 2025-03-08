import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { IndianRupee, Clock, CreditCard, Wallet } from "lucide-react";

type Booking = {
  id: string;
  price?: number;
  payment_type?: "CASH" | "ONLINE";
  booking_date: string;
  clients: {
    name: string;
  };
};

type AnalysisProps = {
  bookings: Booking[];
  todayBookings: Booking[];
};

export default function Analysis({ bookings, todayBookings }: AnalysisProps) {
  // Calculate today's metrics
  const todayRevenue = todayBookings
    .filter((booking) => booking.price && booking.payment_type)
    .reduce((sum, booking) => sum + (booking.price || 0), 0);

  const todayPendingPayments = todayBookings.filter(
    (booking) => !booking.price || !booking.payment_type
  ).length;

  const todayPaymentsCollected = todayBookings.filter(
    (booking) => booking.price && booking.payment_type
  ).length;

  // Calculate total revenue
  const totalRevenue = bookings
    .filter((booking) => booking.price && booking.payment_type)
    .reduce((sum, booking) => sum + (booking.price || 0), 0);

  // Calculate payment type distribution for today
  const todayCashPayments = todayBookings.filter(
    (booking) => booking.payment_type === "CASH"
  ).length;
  const todayOnlinePayments = todayBookings.filter(
    (booking) => booking.payment_type === "ONLINE"
  ).length;

  // Get pending payment details
  const pendingPaymentDetails = todayBookings
    .filter((booking) => !booking.price || !booking.payment_type)
    .map((booking) => ({
      clientName: booking.clients.name,
      status: !booking.price ? "No amount set" : "Payment type not selected",
    }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Revenue */}
        <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-black">
              Today&apos;s Revenue
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-black opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">₹{todayRevenue}</div>
            <p className="text-xs text-gray-600 mt-1">
              {format(new Date(), "MMM d, yyyy")}
            </p>
          </CardContent>
        </Card>

        {/* Today's Payments Collected */}
        <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-black">
              Payments Collected
            </CardTitle>
            <CreditCard className="h-4 w-4 text-black opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {todayPaymentsCollected}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-600">
                Cash: {todayCashPayments} • Online: {todayOnlinePayments}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Pending Payments */}
        <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-black">
              Pending Payments
            </CardTitle>
            <Clock className="h-4 w-4 text-black opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">
              {todayPendingPayments}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {pendingPaymentDetails.length > 0 ? (
                <div className="max-h-20 overflow-auto">
                  {pendingPaymentDetails.map((detail, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 text-xs"
                    >
                      <span className="font-medium">{detail.clientName}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-red-500">{detail.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                "No pending payments"
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-black">
              Total Revenue
            </CardTitle>
            <Wallet className="h-4 w-4 text-black opacity-70" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">₹{totalRevenue}</div>
            <p className="text-xs text-gray-600 mt-1">All time earnings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
