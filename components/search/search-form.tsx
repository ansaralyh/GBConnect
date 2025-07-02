"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Calendar, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

export function SearchForm({
  className,
  variant = "default",
}: { className?: string; variant?: "default" | "minimal" }) {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [guests, setGuests] = useState(2)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Build query parameters
    const params = new URLSearchParams()
    if (location) params.append("location", location)
    if (serviceType) params.append("type", serviceType)
    if (startDate) params.append("startDate", startDate.toISOString())
    if (endDate) params.append("endDate", endDate.toISOString())
    if (guests) params.append("guests", guests.toString())

    router.push(`/services?${params.toString()}`)
  }

  if (variant === "minimal") {
    return (
      <form onSubmit={handleSearch} className={`flex w-full gap-2 ${className}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search locations or services..."
            className="pl-9"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
    )
  }

  return (
    <form
      onSubmit={handleSearch}
      className={`flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg sm:flex-row ${className}`}
    >
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Where are you going?"
          className="pl-10 h-12 bg-background text-foreground"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <Select value={serviceType} onValueChange={setServiceType}>
        <SelectTrigger className="h-12 sm:w-[180px]">
          <SelectValue placeholder="Service Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Services</SelectItem>
          <SelectItem value="accommodation">Accommodation</SelectItem>
          <SelectItem value="food">Food & Dining</SelectItem>
          <SelectItem value="transport">Transportation</SelectItem>
          <SelectItem value="tours">Tours & Activities</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-12 justify-start text-left font-normal sm:w-[150px]">
              <Calendar className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : "Check-in"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-12 justify-start text-left font-normal sm:w-[150px]">
              <Calendar className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : "Check-out"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
              disabled={(date) => date < (startDate || new Date())}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="relative flex items-center h-12 rounded-md border bg-background px-3 text-foreground sm:w-[120px]">
  <Users className="absolute left-3 h-4 w-4 text-muted-foreground" />
  <select
    className="w-full h-full pl-5 bg-transparent appearance-none focus:outline-none text-xs"
    value={guests}
    onChange={(e) => setGuests(Number.parseInt(e.target.value))}
  >
    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
      <option key={num} value={num} className="text-foreground bg-background">
        {num} {num === 1 ? "Guest" : "Guests"}
      </option>
    ))}
  </select>
</div>

      <Button type="submit" className="h-12">
        Search
      </Button>
    </form>
  )
}
