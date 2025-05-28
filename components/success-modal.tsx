"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  formTitle: string
  submittedData: any
}

export default function SuccessModal({ isOpen, onClose, formTitle, submittedData }: SuccessModalProps) {
  const generateReferenceNumber = () => {
    return `REF${Date.now().toString().slice(-8)}`
  }

  const referenceNumber = generateReferenceNumber()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-center">Form Submitted Successfully!</DialogTitle>
          <DialogDescription className="text-center">
            Your {formTitle.toLowerCase()} has been submitted and is being processed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Reference Number:</span>
              <Badge variant="secondary" className="font-mono">
                {referenceNumber}
              </Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Form Type:</span>
              <span className="text-sm text-gray-900">{formTitle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Submitted:</span>
              <span className="text-sm text-gray-900">
                {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your form will be reviewed within 2-3 business days</li>
              <li>• You will receive an email confirmation shortly</li>
              <li>• Updates will be sent to your registered contact details</li>
              <li>• Keep your reference number for future inquiries</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button variant="outline" className="flex-1">
              <Mail className="w-4 h-4 mr-2" />
              Email Receipt
            </Button>
          </div>

          <Button onClick={onClose} className="w-full">
            Submit Another Form
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
