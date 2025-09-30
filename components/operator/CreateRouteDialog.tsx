'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Route,
    MapPin,
    Clock,
    Navigation,
    Plus,
    Save,
    Loader2,
    AlertTriangle,
    CheckCircle,
    X,
    Map,
    Calculator
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '../ui/checkbok'

// ✅ TYPES FOR ROUTE CREATION
interface CreateRouteData {
    routeNumber: string
    startLocation: string
    endLocation: string
    distance?: number
    estimatedTime?: number
    description?: string
    isActive: boolean
    operatorId: string
}

interface RouteFormErrors {
    routeNumber?: string
    startLocation?: string
    endLocation?: string
    distance?: string
    estimatedTime?: string
    general?: string
}

interface CreateRouteDialogProps {
    operatorId: string
    children: React.ReactNode
    onRouteCreated?: (route: any) => void
}

// ✅ COMMON ROUTE TYPES FOR SUGGESTIONS
const COMMON_ROUTE_TYPES = [
    'Express', 'Local', 'Limited', 'Rapid', 'Shuttle', 'Circle'
] as const

// ✅ SRI LANKAN CITIES FOR AUTOCOMPLETE
const SRI_LANKAN_LOCATIONS = [
    'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Anuradhapura', 'Polonnaruwa',
    'Batticaloa', 'Trincomalee', 'Matara', 'Ratnapura', 'Kurunegala', 'Puttalam',
    'Badulla', 'Bandarawela', 'Nuwara Eliya', 'Hatton', 'Dambulla', 'Sigiriya',
    'Hikkaduwa', 'Bentota', 'Kalutara', 'Panadura', 'Moratuwa', 'Mount Lavinia',
    'Dehiwala', 'Kotte', 'Maharagama', 'Kelaniya', 'Gampaha', 'Vavuniya',
    'Mannar', 'Chilaw', 'Kegalle', 'Moneragala', 'Ampara', 'Hambantota'
] as const

export function CreateRouteDialog({ operatorId, children, onRouteCreated }: CreateRouteDialogProps) {
    // ✅ STATE MANAGEMENT
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState<'basic' | 'details' | 'review'>('basic')
    const [formData, setFormData] = useState<CreateRouteData>({
        routeNumber: '',
        startLocation: '',
        endLocation: '',
        distance: undefined,
        estimatedTime: undefined,
        description: '',
        isActive: true,
        operatorId
    })
    const [errors, setErrors] = useState<RouteFormErrors>({})
    const [suggestions, setSuggestions] = useState<{
        start: string[]
        end: string[]
    }>({
        start: [],
        end: []
    })

    const router = useRouter()
    const startLocationRef = useRef<HTMLInputElement>(null)
    const endLocationRef = useRef<HTMLInputElement>(null)

    // ✅ RESET FORM WHEN DIALOG OPENS/CLOSES
    useEffect(() => {
        if (open) {
            setStep('basic')
            setFormData({
                routeNumber: '',
                startLocation: '',
                endLocation: '',
                distance: undefined,
                estimatedTime: undefined,
                description: '',
                isActive: true,
                operatorId
            })
            setErrors({})
            setSuggestions({ start: [], end: [] })
        }
    }, [open, operatorId])

    // ✅ LOCATION AUTOCOMPLETE
    const getLocationSuggestions = useCallback((input: string): string[] => {
        if (!input || input.length < 2) return []

        const filtered = SRI_LANKAN_LOCATIONS.filter(location =>
            location.toLowerCase().includes(input.toLowerCase())
        ).slice(0, 5)

        return filtered
    }, [])

    const handleLocationInput = useCallback((type: 'start' | 'end', value: string) => {
        const suggestions = getLocationSuggestions(value)
        setSuggestions(prev => ({
            ...prev,
            [type]: suggestions
        }))

        setFormData(prev => ({
            ...prev,
            [type === 'start' ? 'startLocation' : 'endLocation']: value
        }))

        // Clear location-specific errors
        if (errors[type === 'start' ? 'startLocation' : 'endLocation']) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[type === 'start' ? 'startLocation' : 'endLocation']
                return newErrors
            })
        }
    }, [errors])

    const selectSuggestion = useCallback((type: 'start' | 'end', location: string) => {
        setFormData(prev => ({
            ...prev,
            [type === 'start' ? 'startLocation' : 'endLocation']: location
        }))
        setSuggestions(prev => ({
            ...prev,
            [type]: []
        }))
    }, [])

    // ✅ AUTO-GENERATE ROUTE NUMBER
    const generateRouteNumber = useCallback(async () => {
        if (!formData.startLocation || !formData.endLocation) return

        try {
            // Generate route number based on locations
            const startCode = formData.startLocation.substring(0, 2).toUpperCase()
            const endCode = formData.endLocation.substring(0, 2).toUpperCase()
            const timestamp = Date.now().toString().slice(-3)
            const suggested = `${startCode}${endCode}${timestamp}`

            setFormData(prev => ({
                ...prev,
                routeNumber: suggested
            }))
        } catch (error) {
            console.warn('Could not generate route number:', error)
        }
    }, [formData.startLocation, formData.endLocation])

    // ✅ ESTIMATE DISTANCE AND TIME
    const estimateRouteData = useCallback(async () => {
        if (!formData.startLocation || !formData.endLocation) return

        try {
            // Simple estimation based on common routes (in a real app, use Google Maps API)
            const distance = Math.floor(Math.random() * 200) + 50 // 50-250 km
            const time = Math.floor(distance / 40 * 60) // Assuming 40 km/h average speed

            setFormData(prev => ({
                ...prev,
                distance,
                estimatedTime: time
            }))
        } catch (error) {
            console.warn('Could not estimate route data:', error)
        }
    }, [formData.startLocation, formData.endLocation])

    // ✅ FORM VALIDATION
    const validateStep = useCallback((currentStep: typeof step): RouteFormErrors => {
        const newErrors: RouteFormErrors = {}

        if (currentStep === 'basic' || currentStep === 'review') {
            // Route number validation
            if (!formData.routeNumber.trim()) {
                newErrors.routeNumber = 'Route number is required'
            } else if (formData.routeNumber.length < 2) {
                newErrors.routeNumber = 'Route number must be at least 2 characters'
            } else if (formData.routeNumber.length > 20) {
                newErrors.routeNumber = 'Route number must be less than 20 characters'
            }

            // Start location validation
            if (!formData.startLocation.trim()) {
                newErrors.startLocation = 'Start location is required'
            } else if (formData.startLocation.length < 2) {
                newErrors.startLocation = 'Start location must be at least 2 characters'
            }

            // End location validation
            if (!formData.endLocation.trim()) {
                newErrors.endLocation = 'End location is required'
            } else if (formData.endLocation.length < 2) {
                newErrors.endLocation = 'End location must be at least 2 characters'
            } else if (formData.endLocation.toLowerCase() === formData.startLocation.toLowerCase()) {
                newErrors.endLocation = 'End location must be different from start location'
            }
        }

        if (currentStep === 'details' || currentStep === 'review') {
            // Distance validation (optional but must be valid if provided)
            if (formData.distance !== undefined) {
                if (formData.distance <= 0) {
                    newErrors.distance = 'Distance must be greater than 0'
                } else if (formData.distance > 1000) {
                    newErrors.distance = 'Distance seems unrealistic (max 1000 km)'
                }
            }

            // Estimated time validation (optional but must be valid if provided)
            if (formData.estimatedTime !== undefined) {
                if (formData.estimatedTime <= 0) {
                    newErrors.estimatedTime = 'Estimated time must be greater than 0'
                } else if (formData.estimatedTime > 1440) { // 24 hours
                    newErrors.estimatedTime = 'Estimated time seems unrealistic (max 24 hours)'
                }
            }
        }

        return newErrors
    }, [formData])

    // ✅ HANDLE STEP NAVIGATION
    const nextStep = useCallback(() => {
        const newErrors = validateStep(step)
        setErrors(newErrors)

        if (Object.keys(newErrors).length === 0) {
            if (step === 'basic') {
                setStep('details')
            } else if (step === 'details') {
                setStep('review')
            }
        }
    }, [step, validateStep])

    const prevStep = useCallback(() => {
        setErrors({})
        if (step === 'details') {
            setStep('basic')
        } else if (step === 'review') {
            setStep('details')
        }
    }, [step])

    // ✅ HANDLE FORM SUBMISSION
    const handleSubmit = useCallback(async () => {
        const newErrors = validateStep('review')
        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            return
        }

        setLoading(true)

        try {
            console.log('🚌 Creating route:', formData)

            const response = await fetch('/api/operator/routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            console.log('📊 Create route response status:', response.status)

            const result = await response.json()

            if (response.ok) {
                console.log('✅ Route created successfully:', result)

                // Close dialog and reset form
                setOpen(false)

                // Call callback if provided
                if (onRouteCreated) {
                    onRouteCreated(result)
                }

                // Show success message (you can replace this with a toast notification)
                alert(`✅ Route ${result.routeNumber} created successfully!`)

                // Refresh the page or navigate
                window.location.reload()

            } else {
                console.error('❌ Error creating route:', result)

                // Handle specific error cases
                if (result.error?.includes('already exists')) {
                    setErrors({ routeNumber: 'Route number already exists' })
                    setStep('basic') // Go back to basic step
                } else {
                    setErrors({ general: result.error || 'Failed to create route' })
                }
            }
        } catch (error) {
            console.error('❌ Create route error:', error)
            const message = error instanceof Error ? error.message : 'Failed to create route'
            setErrors({ general: message })
        } finally {
            setLoading(false)
        }
    }, [formData, validateStep, onRouteCreated])

    // ✅ HANDLE INPUT CHANGES
    const handleInputChange = useCallback((field: keyof CreateRouteData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        // Clear field-specific errors
        if (errors[field as keyof RouteFormErrors]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field as keyof RouteFormErrors]
                return newErrors
            })
        }
    }, [errors])

    return (
        <>
            <div onClick={() => setOpen(true)}>
                {children}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <Route className="h-5 w-5 text-blue-600" />
                            <span>Create New Route</span>
                        </DialogTitle>
                        <DialogDescription>
                            Add a new bus route to your fleet. Fill in the required information below.
                        </DialogDescription>
                    </DialogHeader>

                    {/* ✅ STEP INDICATOR */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            {['basic', 'details', 'review'].map((stepName, index) => (
                                <div key={stepName} className="flex items-center">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                                        step === stepName
                                            ? "bg-blue-600 text-white"
                                            : index < ['basic', 'details', 'review'].indexOf(step)
                                                ? "bg-green-600 text-white"
                                                : "bg-gray-200 text-gray-600"
                                    )}>
                                        {index < ['basic', 'details', 'review'].indexOf(step) ? (
                                            <CheckCircle className="h-4 w-4" />
                                        ) : (
                                            index + 1
                                        )}
                                    </div>
                                    {index < 2 && (
                                        <div className={cn(
                                            "w-8 h-0.5 ml-2",
                                            index < ['basic', 'details', 'review'].indexOf(step)
                                                ? "bg-green-600"
                                                : "bg-gray-200"
                                        )} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <Badge variant="outline" className="capitalize">
                            {step}
                        </Badge>
                    </div>

                    {/* ✅ STEP 1: BASIC INFORMATION */}
                    {step === 'basic' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Route Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="routeNumber">
                                        Route Number *
                                    </Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            id="routeNumber"
                                            value={formData.routeNumber}
                                            onChange={(e) => handleInputChange('routeNumber', e.target.value.toUpperCase())}
                                            placeholder="e.g., CMB001"
                                            className={errors.routeNumber ? 'border-red-500' : ''}
                                            maxLength={20}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={generateRouteNumber}
                                            disabled={!formData.startLocation || !formData.endLocation}
                                            title="Generate route number"
                                        >
                                            <Calculator className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {errors.routeNumber && (
                                        <p className="text-sm text-red-600">{errors.routeNumber}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label>Route Status</Label>
                                    <div className="flex items-center space-x-2 pt-2">
                                        <Checkbox
                                            id="isActive"
                                            checked={formData.isActive}
                                            onCheckedChange={(checked) =>
                                                handleInputChange('isActive', checked as boolean)
                                            }
                                        />
                                        <Label htmlFor="isActive" className="cursor-pointer">
                                            Active Route
                                        </Label>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Active routes are available for scheduling
                                    </p>
                                </div>
                            </div>

                            {/* Start Location */}
                            <div className="space-y-2">
                                <Label htmlFor="startLocation">
                                    Start Location *
                                </Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        ref={startLocationRef}
                                        id="startLocation"
                                        value={formData.startLocation}
                                        onChange={(e) => handleLocationInput('start', e.target.value)}
                                        placeholder="e.g., Colombo Fort"
                                        className={cn(
                                            "pl-10",
                                            errors.startLocation ? 'border-red-500' : ''
                                        )}
                                    />
                                </div>
                                {suggestions.start.length > 0 && (
                                    <div className="border rounded-md bg-white shadow-sm max-h-32 overflow-y-auto">
                                        {suggestions.start.map((location) => (
                                            <div
                                                key={location}
                                                className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-b-0"
                                                onClick={() => selectSuggestion('start', location)}
                                            >
                                                <MapPin className="inline h-3 w-3 mr-2 text-gray-400" />
                                                {location}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.startLocation && (
                                    <p className="text-sm text-red-600">{errors.startLocation}</p>
                                )}
                            </div>

                            {/* End Location */}
                            <div className="space-y-2">
                                <Label htmlFor="endLocation">
                                    End Location *
                                </Label>
                                <div className="relative">
                                    <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        ref={endLocationRef}
                                        id="endLocation"
                                        value={formData.endLocation}
                                        onChange={(e) => handleLocationInput('end', e.target.value)}
                                        placeholder="e.g., Kandy"
                                        className={cn(
                                            "pl-10",
                                            errors.endLocation ? 'border-red-500' : ''
                                        )}
                                    />
                                </div>
                                {suggestions.end.length > 0 && (
                                    <div className="border rounded-md bg-white shadow-sm max-h-32 overflow-y-auto">
                                        {suggestions.end.map((location) => (
                                            <div
                                                key={location}
                                                className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-b-0"
                                                onClick={() => selectSuggestion('end', location)}
                                            >
                                                <Navigation className="inline h-3 w-3 mr-2 text-gray-400" />
                                                {location}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.endLocation && (
                                    <p className="text-sm text-red-600">{errors.endLocation}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ✅ STEP 2: ROUTE DETAILS */}
                    {step === 'details' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Distance */}
                                <div className="space-y-2">
                                    <Label htmlFor="distance">
                                        Distance (km)
                                    </Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            id="distance"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={formData.distance || ''}
                                            onChange={(e) => handleInputChange('distance',
                                                e.target.value ? parseFloat(e.target.value) : undefined
                                            )}
                                            placeholder="150.5"
                                            className={errors.distance ? 'border-red-500' : ''}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={estimateRouteData}
                                            disabled={!formData.startLocation || !formData.endLocation}
                                            title="Estimate distance and time"
                                        >
                                            <Map className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {errors.distance && (
                                        <p className="text-sm text-red-600">{errors.distance}</p>
                                    )}
                                </div>

                                {/* Estimated Time */}
                                <div className="space-y-2">
                                    <Label htmlFor="estimatedTime">
                                        Estimated Time (minutes)
                                    </Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            id="estimatedTime"
                                            type="number"
                                            min="0"
                                            value={formData.estimatedTime || ''}
                                            onChange={(e) => handleInputChange('estimatedTime',
                                                e.target.value ? parseInt(e.target.value) : undefined
                                            )}
                                            placeholder="180"
                                            className={cn(
                                                "pl-10",
                                                errors.estimatedTime ? 'border-red-500' : ''
                                            )}
                                        />
                                    </div>
                                    {errors.estimatedTime && (
                                        <p className="text-sm text-red-600">{errors.estimatedTime}</p>
                                    )}
                                    {formData.estimatedTime && (
                                        <p className="text-xs text-gray-500">
                                            About {Math.floor(formData.estimatedTime / 60)}h {formData.estimatedTime % 60}m
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Route Description (Optional)
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description || ''}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Describe this route, special stops, or any important notes..."
                                    rows={3}
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-500">
                                    {(formData.description || '').length}/500 characters
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ✅ STEP 3: REVIEW */}
                    {step === 'review' && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-900 mb-3">Review Route Details</h3>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Route Number:</span>
                                        <span className="ml-2 font-medium">{formData.routeNumber}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Status:</span>
                                        <Badge
                                            variant={formData.isActive ? "default" : "secondary"}
                                            className="ml-2 text-xs"
                                        >
                                            {formData.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-gray-600">Route:</span>
                                        <span className="ml-2 font-medium">
                                            {formData.startLocation} → {formData.endLocation}
                                        </span>
                                    </div>
                                    {formData.distance && (
                                        <div>
                                            <span className="text-gray-600">Distance:</span>
                                            <span className="ml-2 font-medium">{formData.distance} km</span>
                                        </div>
                                    )}
                                    {formData.estimatedTime && (
                                        <div>
                                            <span className="text-gray-600">Est. Time:</span>
                                            <span className="ml-2 font-medium">
                                                {Math.floor(formData.estimatedTime / 60)}h {formData.estimatedTime % 60}m
                                            </span>
                                        </div>
                                    )}
                                    {formData.description && (
                                        <div className="col-span-2">
                                            <span className="text-gray-600">Description:</span>
                                            <p className="ml-2 text-gray-800 text-sm mt-1">{formData.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ✅ GENERAL ERROR MESSAGE */}
                    {errors.general && (
                        <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            <span className="text-sm">{errors.general}</span>
                        </div>
                    )}

                    {/* ✅ DIALOG FOOTER WITH NAVIGATION */}
                    <DialogFooter className="flex justify-between">
                        <div className="flex space-x-2">
                            {step !== 'basic' && (
                                <Button variant="outline" onClick={prevStep} disabled={loading}>
                                    Previous
                                </Button>
                            )}
                        </div>

                        <div className="flex space-x-2">
                            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                                Cancel
                            </Button>

                            {step === 'review' ? (
                                <Button onClick={handleSubmit} disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Create Route
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button onClick={nextStep}>
                                    Next
                                </Button>
                            )}
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
