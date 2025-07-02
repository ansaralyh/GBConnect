"use client"

import { useState } from "react"
import { Calendar, DollarSign, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"

// Mock data for analytics
const analyticsData = {
  totalBookings: 124,
  totalRevenue: 345000, // in PKR
  totalCustomers: 98,
  conversionRate: 68,
  monthlyBookings: [12, 18, 22, 15, 24, 33, 28, 19, 25, 32, 38, 42],
  monthlyRevenue: [32000, 48000, 58000, 42000, 65000, 85000, 72000, 52000, 68000, 82000, 95000, 110000],
}

export function BusinessAnalytics() {
  const [activeTab, setActiveTab] = useState("overview")

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalBookings}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analyticsData.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">+4% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>Your booking and revenue trends for the past year</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <div className="flex h-full items-end gap-2">
                  {months.map((month, i) => (
                    <div key={month} className="relative flex h-full w-full flex-col justify-end">
                      <div
                        className="bg-primary w-full animate-in"
                        style={{
                          height: `${(analyticsData.monthlyBookings[i] / Math.max(...analyticsData.monthlyBookings)) * 35}%`,
                        }}
                      />
                      <span className="mt-2 text-center text-xs text-muted-foreground">{month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Analytics</CardTitle>
              <CardDescription>Detailed breakdown of your bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <div className="flex h-full items-end gap-2">
                  {months.map((month, i) => (
                    <div key={month} className="relative flex h-full w-full flex-col justify-end">
                      <div
                        className="bg-primary w-full animate-in"
                        style={{
                          height: `${(analyticsData.monthlyBookings[i] / Math.max(...analyticsData.monthlyBookings)) * 70}%`,
                        }}
                      />
                      <span className="mt-2 text-center text-xs">{month}</span>
                      <span className="text-center text-xs font-medium">{analyticsData.monthlyBookings[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
                <CardDescription>Your most booked services</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span>Hunza Valley Tour</span>
                    <span className="text-sm font-medium">42 bookings</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Fairy Meadows Trek</span>
                    <span className="text-sm font-medium">38 bookings</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Skardu Adventure</span>
                    <span className="text-sm font-medium">26 bookings</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Naltar Valley Tour</span>
                    <span className="text-sm font-medium">18 bookings</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Sources</CardTitle>
                <CardDescription>Where your bookings come from</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span>Direct Website</span>
                    <span className="text-sm font-medium">68%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Mobile App</span>
                    <span className="text-sm font-medium">22%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Partner Referrals</span>
                    <span className="text-sm font-medium">8%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Other Sources</span>
                    <span className="text-sm font-medium">2%</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Detailed breakdown of your revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <div className="flex h-full items-end gap-2">
                  {months.map((month, i) => (
                    <div key={month} className="relative flex h-full w-full flex-col justify-end">
                      <div
                        className="bg-primary w-full animate-in"
                        style={{
                          height: `${(analyticsData.monthlyRevenue[i] / Math.max(...analyticsData.monthlyRevenue)) * 70}%`,
                        }}
                      />
                      <span className="mt-2 text-center text-xs">{month}</span>
                      <span className="text-center text-xs font-medium">
                        {formatCurrency(analyticsData.monthlyRevenue[i])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service</CardTitle>
                <CardDescription>Your highest earning services</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span>Hunza Valley Tour</span>
                    <span className="text-sm font-medium">{formatCurrency(120000)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Fairy Meadows Trek</span>
                    <span className="text-sm font-medium">{formatCurrency(95000)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Skardu Adventure</span>
                    <span className="text-sm font-medium">{formatCurrency(78000)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Naltar Valley Tour</span>
                    <span className="text-sm font-medium">{formatCurrency(52000)}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>How customers pay for your services</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span>Credit/Debit Card</span>
                    <span className="text-sm font-medium">45%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Bank Transfer</span>
                    <span className="text-sm font-medium">30%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>EasyPaisa/JazzCash</span>
                    <span className="text-sm font-medium">20%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Cash on Arrival</span>
                    <span className="text-sm font-medium">5%</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
