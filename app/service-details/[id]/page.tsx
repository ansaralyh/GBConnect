import Image from "next/image"
import { MapPin, Star, Calendar, Users, Clock, Heart, Share2, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ServiceDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=800&width=1200"
                alt="Mountain View Resort"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-[190px] rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=400&width=400" alt="Room Interior" fill className="object-cover" />
            </div>
            <div className="relative h-[190px] rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=400&width=400" alt="Bathroom" fill className="object-cover" />
            </div>
            <div className="relative h-[190px] rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=400&width=400" alt="View from Room" fill className="object-cover" />
            </div>
            <div className="relative h-[190px] rounded-lg overflow-hidden group">
              <Image src="/placeholder.svg?height=400&width=400" alt="Restaurant" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" className="text-white border-white hover:bg-white/20 hover:text-white">
                  View All Photos
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2">
            {/* Service Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Deluxe Mountain View Room</h1>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-gray-500">Mountain View Resort, Hunza Valley</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-500">4.8 (56 reviews)</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button variant="outline" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Accommodation</Badge>
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Mountain View</Badge>
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Breakfast Included</Badge>
              </div>
              <p className="text-gray-600 mb-4">
                Experience luxury and comfort in our Deluxe Mountain View Room, featuring breathtaking panoramic views
                of the Hunza Valley and surrounding mountains. Each room is thoughtfully designed with traditional
                elements and modern amenities to ensure a memorable stay.
              </p>
            </div>

            {/* Detailed Information Tabs */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-6">
                  <div className="space-y-4">
                    <p>
                      Our Deluxe Mountain View Room offers a perfect blend of comfort and luxury with stunning views of
                      the majestic Hunza Valley. The room spans 35 square meters and features a private balcony where
                      you can enjoy the breathtaking scenery.
                    </p>
                    <p>
                      The room is furnished with a king-size bed with premium bedding, ensuring a restful night's sleep
                      after a day of exploring. The interior combines traditional Hunza design elements with modern
                      amenities, creating a unique and comfortable atmosphere.
                    </p>
                    <h3 className="text-lg font-semibold mt-4">Room Highlights:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Panoramic mountain views from private balcony</li>
                      <li>King-size bed with premium bedding</li>
                      <li>En-suite bathroom with shower and complimentary toiletries</li>
                      <li>Daily housekeeping service</li>
                      <li>Traditional Hunza-inspired décor</li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="amenities" className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Room Amenities</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-emerald-600 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          King-size bed
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-emerald-600 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Private balcony
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-emerald-600 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          En-suite bathroom
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-emerald-600 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Free Wi-Fi
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-emerald-600 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Flat-screen TV
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Property Amenities</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-emerald-600 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Restaurant
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-emerald-600 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Free parking
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-emerald-600 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          24-hour front desk
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-emerald-600 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Garden
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-emerald-600 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Tour desk
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="location" className="pt-6">
                  <div className="space-y-4">
                    <div className="relative h-[300px] rounded-lg overflow-hidden mb-4">
                      <Image src="/placeholder.svg?height=600&width=1200" alt="Map" fill className="object-cover" />
                    </div>
                    <h3 className="text-lg font-semibold">Location Information</h3>
                    <p>
                      Mountain View Resort is located in the heart of Hunza Valley, offering easy access to major
                      attractions while providing a peaceful retreat with stunning views.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="font-medium mb-2">Nearby Attractions</h4>
                        <ul className="space-y-1">
                          <li className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                            <span>Baltit Fort (2 km)</span>
                          </li>
                          <li className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                            <span>Altit Fort (4 km)</span>
                          </li>
                          <li className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                            <span>Eagle's Nest Viewpoint (7 km)</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Getting There</h4>
                        <ul className="space-y-1">
                          <li className="flex items-start">
                            <Clock className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                            <span>2 hours drive from Gilgit Airport</span>
                          </li>
                          <li className="flex items-start">
                            <Clock className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                            <span>12 hours drive from Islamabad</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="policies" className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Check-in & Check-out</h3>
                      <ul className="space-y-1">
                        <li className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span>Check-in: 2:00 PM - 10:00 PM</span>
                        </li>
                        <li className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span>Check-out: 11:00 AM</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Cancellation Policy</h3>
                      <p className="mb-2">
                        Free cancellation up to 7 days before check-in. Cancellations made within 7 days of check-in are
                        subject to a one-night charge.
                      </p>
                      <p>No-shows will be charged the full amount of the reservation.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">House Rules</h3>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>No smoking inside the rooms</span>
                        </li>
                        <li className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Quiet hours from 10:00 PM to 7:00 AM</span>
                        </li>
                        <li className="flex items-start">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Pets are not allowed</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Provider Profile */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">About the Provider</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-2">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Provider" />
                      <AvatarFallback>MV</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-center">Mountain View Resort</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex mr-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">4.8</span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <p className="text-gray-600 mb-4">
                    Mountain View Resort is a family-owned establishment with over 15 years of experience in
                    hospitality. We pride ourselves on providing authentic local experiences while ensuring the highest
                    standards of comfort and service.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Response Rate</h4>
                      <p className="text-gray-600">98%</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Response Time</h4>
                      <p className="text-gray-600">Within 2 hours</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Languages</h4>
                      <p className="text-gray-600">English, Urdu, Burushaski</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Member Since</h4>
                      <p className="text-gray-600">January 2020</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Reviews</h2>
                <Button className="bg-emerald-600 hover:bg-emerald-700">Write a Review</Button>
              </div>

              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-600 mb-2">4.8</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-500">Based on 56 reviews</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span>Cleanliness</span>
                        <span className="font-medium">4.9</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "98%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span>Comfort</span>
                        <span className="font-medium">4.7</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "94%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span>Location</span>
                        <span className="font-medium">5.0</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span>Value</span>
                        <span className="font-medium">4.6</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="space-y-6">
                    {/* Review 1 */}
                    <div className="border-b pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-xs text-gray-500">May 2, 2025</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 5 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">
                        Amazing views and exceptional service! The room was clean and comfortable, and the staff went
                        above and beyond to make our stay memorable. The breakfast was delicious with a good variety of
                        local and international options.
                      </p>
                    </div>

                    {/* Review 2 */}
                    <div className="border-b pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                            <AvatarFallback>AS</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Alice Smith</p>
                            <p className="text-xs text-gray-500">April 28, 2025</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">
                        Great location with breathtaking views of the mountains. The breakfast was delicious with local
                        specialties. The room was spacious and clean, though the Wi-Fi was a bit spotty at times. Would
                        definitely come back!
                      </p>
                    </div>

                    <Button variant="outline" className="w-full">
                      Load More Reviews
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Services */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Similar Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Similar Service 1 */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Family Suite"
                      fill
                      className="object-cover"
                    />
                    <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm">
                      <Heart className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">Family Suite</h3>
                    <div className="flex items-center mb-2">
                      <MapPin className="h-3 w-3 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">Mountain View Resort, Hunza</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex mr-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">4.7 (32)</span>
                      </div>
                      <span className="font-semibold text-emerald-600">$180/night</span>
                    </div>
                  </div>
                </div>

                {/* Similar Service 2 */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Standard Room"
                      fill
                      className="object-cover"
                    />
                    <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm">
                      <Heart className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">Standard Room</h3>
                    <div className="flex items-center mb-2">
                      <MapPin className="h-3 w-3 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">Mountain View Resort, Hunza</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex mr-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">4.5 (28)</span>
                      </div>
                      <span className="font-semibold text-emerald-600">$90/night</span>
                    </div>
                  </div>
                </div>

                {/* Similar Service 3 */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Luxury Suite"
                      fill
                      className="object-cover"
                    />
                    <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm">
                      <Heart className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">Luxury Suite</h3>
                    <div className="flex items-center mb-2">
                      <MapPin className="h-3 w-3 text-gray-500 mr-1" />
                      <span className="text-xs text-gray-500">Serena Hotel, Gilgit</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex mr-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < 5 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">4.9 (45)</span>
                      </div>
                      <span className="font-semibold text-emerald-600">$250/night</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div>
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">$120</div>
                  <div className="text-sm text-gray-500">per night</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Check-in</label>
                      <div className="border rounded-md p-2 flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <span>May 15, 2025</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Check-out</label>
                      <div className="border rounded-md p-2 flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <span>May 18, 2025</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Guests</label>
                    <div className="border rounded-md p-2 flex items-center">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <span>2 Adults</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-b py-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span>$120 x 3 nights</span>
                    <span>$360</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Service fee</span>
                    <span>$36</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>$396</span>
                  </div>
                </div>

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mb-2">Book Now</Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Host
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">You won't be charged yet</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
