"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Eye, Edit, Copy, Trash2, MoreHorizontal, Users, Calendar, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function FormsPage() {
  const forms = [
    {
      id: 1,
      title: "Customer Feedback Survey",
      description: "Collect feedback from customers about our products and services",
      responses: 234,
      status: "Active",
      created: "2024-01-15",
      lastResponse: "2024-01-20",
      category: "Survey",
    },
    {
      id: 2,
      title: "Product Registration Form",
      description: "Register new products and collect warranty information",
      responses: 89,
      status: "Active",
      created: "2024-01-10",
      lastResponse: "2024-01-19",
      category: "Registration",
    },
    {
      id: 3,
      title: "Event Registration",
      description: "Sign up for our upcoming webinar series",
      responses: 156,
      status: "Draft",
      created: "2024-01-12",
      lastResponse: "2024-01-18",
      category: "Event",
    },
    {
      id: 4,
      title: "Newsletter Signup",
      description: "Subscribe to our monthly newsletter",
      responses: 445,
      status: "Active",
      created: "2024-01-05",
      lastResponse: "2024-01-20",
      category: "Marketing",
    },
    {
      id: 5,
      title: "Job Application Form",
      description: "Apply for open positions at our company",
      responses: 67,
      status: "Paused",
      created: "2024-01-08",
      lastResponse: "2024-01-17",
      category: "HR",
    },
    {
      id: 6,
      title: "Contact Us Form",
      description: "Get in touch with our support team",
      responses: 123,
      status: "Active",
      created: "2024-01-01",
      lastResponse: "2024-01-20",
      category: "Support",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                OneForm Hub
              </Link>
            </div>
            <Button asChild>
              <Link href="/forms/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Form
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forms</h1>
          <p className="text-gray-600">Manage all your forms in one place</p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search forms..." className="pl-10" />
                </div>
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="survey">Survey</SelectItem>
                    <SelectItem value="registration">Registration</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{form.title}</CardTitle>
                    <CardDescription className="text-sm">{form.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={form.status === "Active" ? "default" : form.status === "Draft" ? "secondary" : "outline"}
                    >
                      {form.status}
                    </Badge>
                    <Badge variant="outline">{form.category}</Badge>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        Responses
                      </span>
                      <span className="font-medium">{form.responses}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Created
                      </span>
                      <span>{new Date(form.created).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/forms/${form.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" asChild>
                      <Link href={`/forms/${form.id}/edit`}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (if no forms) */}
        {forms.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first form</p>
              <Button asChild>
                <Link href="/forms/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Form
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
