"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Home,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  Star,
  MapPin,
  Calendar,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"

// Mock services data
const mockServices = [
  {
    id: "1",
    title: "Serena Hotel",
    type: "accommodation",
    location: "Gilgit City",
    price: "$200/night",
    status: "active",
    image: "/placeholder.svg?height=100&width=100",
    views: 245,
    bookings: 12,
    rating: 4.8,
    createdAt: "2023-10-15",
  },
  {
    id: "2",
    title: "Family Suite",
    type: "accommodation",
    location: "Hunza Valley",
    price: "$350/night",
    status: "active",
    image: "/placeholder.svg?height=100&width=100",
    views: 180,
    bookings: 8,
    rating: 4.7,
    createdAt: "2023-11-02",
  },
  {
    id: "3",
    title: "Standard Room",
    type: "accommodation",
    location: "Skardu",
    price: "$120/night",
    status: "inactive",
    image: "/placeholder.svg?height=100&width=100",
    views: 95,
    bookings: 3,
    rating: 4.5,
    createdAt: "2023-09-20",
  },
  {
    id: "4",
    title: "Mountain View Restaurant",
    type: "food",
    location: "Hunza Valley",
    price: "$$",
    status: "active",
    image: "/placeholder.svg?height=100&width=100",
    views: 320,
    bookings: 45,
    rating: 4.6,
    createdAt: "2023-08-15",
  },
  {
    id: "5",
    title: "Jeep Tour to Fairy Meadows",
    type: "tours",
    location: "Fairy Meadows",
    price: "$150/person",
    status: "draft",
    image: "/placeholder.svg?height=100&width=100",
    views: 0,
    bookings: 0,
    rating: 0,
    createdAt: "2023-12-01",
  },
]

export function ServiceManagement() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [services, setServices] = useState(mockServices)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is authenticated and is a provider
    if (!user || user.role !== "provider") {
      router.push("/login")
      return
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleDeleteService = (id: string) => {
    setServiceToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (serviceToDelete) {
      // Filter out the service to delete
      const updatedServices = services.filter((service) => service.id !== serviceToDelete)
      setServices(updatedServices)

      toast({
        title: "Service deleted",
        description: "The service has been deleted successfully.",
      })

      setDeleteDialogOpen(false)
      setServiceToDelete(null)
    }
  }

  const handleDuplicateService = (id: string) => {
    const serviceToDuplicate = services.find((service) => service.id === id)
    if (serviceToDuplicate) {
      const duplicatedService = {
        ...serviceToDuplicate,
        id: `${Number.parseInt(serviceToDuplicate.id) + 100}`, // Generate a new ID
        title: `${serviceToDuplicate.title} (Copy)`,
        status: "draft",
        views: 0,
        bookings: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }

      setServices([duplicatedService, ...services])

      toast({
        title: "Service duplicated",
        description: "A copy of the service has been created as a draft.",
      })
    }
  }

  const handleToggleStatus = (id: string) => {
    const updatedServices = services.map((service) => {
      if (service.id === id) {
        const newStatus = service.status === "active" ? "inactive" : "active"
        return { ...service, status: newStatus }
      }
      return service
    })

    setServices(updatedServices)

    const service = services.find((s) => s.id === id)
    const newStatus = service?.status === "active" ? "inactive" : "active"

    toast({
      title: `Service ${newStatus === "active" ? "activated" : "deactivated"}`,
      description: `The service has been ${newStatus === "active" ? "activated" : "deactivated"} successfully.`,
    })
  }

  // Filter services based on search query and filters
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || service.status === statusFilter
    const matchesType = typeFilter === "all" || service.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/provider/settings">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start py-6 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        {/* Sidebar - Desktop */}
        <aside className="fixed top-0 z-30 hidden h-screen w-full shrink-0 border-r md:sticky md:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <div className="flex h-14 items-center border-b px-4 py-2">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Image
                  src="/placeholder.svg?height=30&width=30"
                  alt="GBConnect Logo"
                  width={30}
                  height={30}
                  className="rounded"
                />
                <span>GBConnect</span>
              </Link>
            </div>
            <div className="flex items-center gap-4 px-4 py-2">
              <Avatar>
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
            </div>
            <nav className="grid gap-1 px-2 pt-4">
              <Link
                href="/dashboard/provider"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/provider/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </nav>
            <div className="mt-auto">
              <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex w-full flex-col gap-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Services</h1>
              <p className="text-muted-foreground">Manage your services and listings.</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/provider/services/new" className="gap-1">
                <Plus className="h-4 w-4" />
                Add New Service
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-[200px]">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="inactive">Inactive</TabsTrigger>
                  </TabsList>
                </Tabs>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTypeFilter("all")}>All Types</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("accommodation")}>Accommodation</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("food")}>Food & Dining</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("transport")}>Transportation</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTypeFilter("tours")}>Tours & Activities</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-4 text-sm text-muted-foreground">Loading services...</p>
                </div>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-lg border bg-card p-8 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No services found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your filters or search criteria"
                    : "Get started by adding your first service"}
                </p>
                <Button className="mt-6" asChild>
                  <Link href="/dashboard/provider/services/new">Add New Service</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr]">
                        <div className="relative h-full">
                          <Image
                            src={service.image || "/placeholder.svg"}
                            alt={service.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="mb-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{service.title}</h3>
                              <Badge
                                className={
                                  service.status === "active"
                                    ? "bg-green-500 hover:bg-green-600"
                                    : service.status === "draft"
                                      ? "bg-yellow-500 hover:bg-yellow-600"
                                      : "bg-gray-500 hover:bg-gray-600"
                                }
                              >
                                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                              </Badge>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/services/${service.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/provider/services/${service.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDuplicateService(service.id)}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleToggleStatus(service.id)}
                                  className={
                                    service.status === "active"
                                      ? "text-amber-600 hover:text-amber-700"
                                      : "text-green-600 hover:text-green-700"
                                  }
                                >
                                  {service.status === "active" ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteService(service.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            <span>{service.location}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                            <div className="flex items-center">
                              <span className="font-medium text-primary">{service.price}</span>
                            </div>
                            <div className="flex items-center">
                              <Star className="mr-1 h-3 w-3 fill-primary text-primary" />
                              <span>{service.rating > 0 ? service.rating : "No ratings"}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>Created {service.createdAt}</span>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/provider/services/${service.id}/edit`}>Edit</Link>
                            </Button>
                            <Button size="sm" asChild>
                              <Link href={`/services/${service.id}`}>View</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
