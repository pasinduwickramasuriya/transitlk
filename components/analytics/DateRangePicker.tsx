
'use client'

import * as React from "react"
import { format, startOfMonth, endOfMonth, subMonths, subDays } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
    className?: string
    date: DateRange | undefined
    setDate: (date: DateRange | undefined) => void
}

export function DatePickerWithRange({
    className,
    date,
    setDate,
}: DatePickerWithRangeProps) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={1}
                        captionLayout="dropdown"
                        fromYear={2020}
                        toYear={new Date().getFullYear() + 1}
                    />
                    <div className="p-3 border-t grid grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDate({
                                from: subDays(new Date(), 7),
                                to: new Date()
                            })}
                        >
                            Last 7 Days
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDate({
                                from: subDays(new Date(), 30),
                                to: new Date()
                            })}
                        >
                            Last 30 Days
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDate({
                                from: startOfMonth(new Date()),
                                to: endOfMonth(new Date())
                            })}
                        >
                            This Month
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDate({
                                from: startOfMonth(subMonths(new Date(), 1)),
                                to: endOfMonth(subMonths(new Date(), 1))
                            })}
                        >
                            Last Month
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}
