"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  Circle,
  List,
  Star,
  FileText,
  Save,
  Eye,
} from "lucide-react"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface FormField {
  id: string
  type: string
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
}

export default function CreateFormPage() {
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([])

  const fieldTypes = [
    { type: "text", label: "Text Input", icon: Type },
    { type: "email", label: "Email", icon: Mail },
    { type: "phone", label: "Phone", icon: Phone },
    { type: "date", label: "Date", icon: Calendar },
    { type: "textarea", label: "Long Text", icon: FileText },
    { type: "select", label: "Dropdown", icon: List },
    { type: "radio", label: "Multiple Choice", icon: Circle },
    { type: "checkbox", label: "Checkboxes", icon: CheckSquare },
    { type: "rating", label: "Rating", icon: Star },
  ]

  const addField = (type: string) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `New ${type} field`,
      required: false,
      ...(type === "select" || type === "radio" || type === "checkbox" ? { options: ["Option 1", "Option 2"] } : {}),
    }
    setFields([...fields, newField])
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id))
  }

  const renderFieldPreview = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "phone":
        return <Input placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`} disabled />
      case "date":
        return <Input type="date" disabled />
      case "textarea":
        return <Textarea placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`} disabled />
      case "select":
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
          </Select>
        )
      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="radio" disabled />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        )
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input type="checkbox" disabled />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        )
      case "rating":
        return (
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-6 w-6 text-gray-300" />
            ))}
          </div>
        )
      default:
        return <Input disabled />
    }
  }

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
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Form
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Form Builder */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Form Builder</CardTitle>
                <CardDescription>Design your form by adding and configuring fields</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Form Settings */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Form Title</Label>
                    <Input
                      id="title"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Enter form title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Enter form description"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Form Fields</h3>

                  {fields.map((field, index) => (
                    <Card key={field.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <Badge variant="outline">{field.type}</Badge>
                            {field.required && (
                              <Badge variant="destructive" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeField(field.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label>Field Label</Label>
                            <Input
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Placeholder (optional)</Label>
                            <Input
                              value={field.placeholder || ""}
                              onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                            />
                          </div>
                        </div>

                        {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
                          <div className="mb-4">
                            <Label>Options</Label>
                            <div className="space-y-2">
                              {field.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...(field.options || [])]
                                      newOptions[optionIndex] = e.target.value
                                      updateField(field.id, { options: newOptions })
                                    }}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newOptions = field.options?.filter((_, i) => i !== optionIndex)
                                      updateField(field.id, { options: newOptions })
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newOptions = [
                                    ...(field.options || []),
                                    `Option ${(field.options?.length || 0) + 1}`,
                                  ]
                                  updateField(field.id, { options: newOptions })
                                }}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Option
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, { required: e.target.checked })}
                            />
                            <Label>Required field</Label>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-gray-700">Preview</Label>
                            <div className="mt-2 p-3 bg-gray-50 rounded-md">
                              <Label className="block text-sm font-medium mb-2">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </Label>
                              {renderFieldPreview(field)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {fields.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <Plus className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No fields yet</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by adding your first field</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Field Types Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Field Types</CardTitle>
                <CardDescription>Drag or click to add fields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {fieldTypes.map((fieldType) => {
                    const Icon = fieldType.icon
                    return (
                      <Button
                        key={fieldType.type}
                        variant="outline"
                        className="w-full justify-start h-auto p-3"
                        onClick={() => addField(fieldType.type)}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">{fieldType.label}</div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
