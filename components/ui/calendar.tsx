"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      disabled={{ before: new Date() }}
      classNames={{
        months: "w-full",
        month: "w-full",
        table: "w-full",
        head_row: "flex w-full",
        head_cell: "w-full rounded-md font-normal text-sm text-gray-400",
        row: "flex w-full mt-2",
        cell: "w-full h-12 text-center text-sm relative [&:has([aria-selected])]:bg-[#40b7ff]/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-12 w-full p-0 font-normal text-white aria-selected:opacity-100 hover:bg-[#40b7ff]/20 rounded-md",
        day_selected:
          "bg-[#40b7ff] text-black hover:bg-[#40b7ff] hover:text-black focus:bg-[#40b7ff] focus:text-black",
        day_today: "bg-white/5 text-white",
        day_outside: "text-gray-600",
        day_disabled: "text-gray-600",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 text-gray-400 hover:text-white hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        caption:
          "flex justify-center pt-1 relative items-center text-white mb-4",
        caption_label: "text-sm font-medium text-white",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
