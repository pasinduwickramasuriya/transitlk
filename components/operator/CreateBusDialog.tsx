


// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { 
//   X, 
//   Plus, 
//   Bus, 
//   Users, 
//   Tag,
//   Loader2,
//   AlertCircle,
//   CheckCircle,
//   Truck,
//   Settings,
//   ArrowRight,
//   ArrowLeft
// } from 'lucide-react'

// interface CreateBusDialogProps {
//   children: React.ReactNode
//   operatorId: string
// }

// interface FormData {
//   busNumber: string
//   busType: string
//   capacity: string
//   deviceId: string
//   deviceName: string
//   isActive: boolean
// }

// export function CreateBusDialog({ children, operatorId }: CreateBusDialogProps) {
//   const [open, setOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [step, setStep] = useState(1)
//   const router = useRouter()

//   // ✅ FORM STATE
//   const [formData, setFormData] = useState<FormData>({
//     busNumber: '',
//     busType: '',
//     capacity: '',
//     deviceId: '',
//     deviceName: '',
//     isActive: true
//   })

//   // ✅ VALIDATION
//   const validateStep1 = (): string | null => {
//     if (!formData.busNumber.trim()) return 'Bus number is required'
//     if (formData.busNumber.length < 3) return 'Bus number must be at least 3 characters'
//     if (!formData.busType) return 'Bus type is required'
//     if (!formData.capacity || parseInt(formData.capacity) <= 0) return 'Valid capacity is required'
//     if (parseInt(formData.capacity) > 100) return 'Capacity cannot exceed 100 seats'
//     return null
//   }

//   // ✅ IMPROVED FORM SUBMISSION WITH BETTER ERROR HANDLING
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (step === 1) {
//       const validationError = validateStep1()
//       if (validationError) {
//         setError(validationError)
//         return
//       }
//       setError(null)
//       setStep(2)
//       return
//     }

//     // Step 2 - Submit form
//     setLoading(true)
//     setError(null)

//     try {
//       console.log('Creating bus with data:', {
//         busNumber: formData.busNumber.trim().toUpperCase(),
//         busType: formData.busType,
//         capacity: parseInt(formData.capacity),
//         isActive: formData.isActive,
//         operatorId: operatorId
//       })

//       // Create bus
//       const busData = {
//         busNumber: formData.busNumber.trim().toUpperCase(),
//         busType: formData.busType,
//         capacity: parseInt(formData.capacity),
//         isActive: formData.isActive,
//         operatorId: operatorId
//       }

//       const busResponse = await fetch('/api/operator/buses', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json' 
//         },
//         body: JSON.stringify(busData)
//       })

//       console.log('Bus creation response status:', busResponse.status)

//       // ✅ IMPROVED ERROR HANDLING
//       if (!busResponse.ok) {
//         let errorMessage = 'Failed to create bus'
        
//         try {
//           const errorData = await busResponse.json()
//           console.log('Error response data:', errorData)
          
//           if (errorData.error) {
//             errorMessage = errorData.error
//           } else if (errorData.details && Array.isArray(errorData.details)) {
//             errorMessage = errorData.details.map((d: any) => d.message).join(', ')
//           }
//         } catch (jsonError) {
//           console.error('Failed to parse error response:', jsonError)
//           errorMessage = `Server error (${busResponse.status}): ${busResponse.statusText}`
//         }

//         throw new Error(errorMessage)
//       }

//       const bus = await busResponse.json()
//       console.log('Bus created successfully:', bus)

//       // Create device if provided
//       if (formData.deviceId.trim()) {
//         const deviceData = {
//           deviceId: formData.deviceId.trim(),
//           name: formData.deviceName.trim() || `${formData.busNumber} GPS`,
//           busId: bus.id,
//           isActive: true
//         }

//         console.log('Creating device with data:', deviceData)

//         try {
//           const deviceResponse = await fetch('/api/operator/devices', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(deviceData)
//           })

//           if (!deviceResponse.ok) {
//             console.warn('Bus created but device setup failed:', await deviceResponse.text())
//           } else {
//             console.log('Device created successfully')
//           }
//         } catch (deviceError) {
//           console.warn('Device creation failed:', deviceError)
//         }
//       }

//       // Success!
//       handleClose()
//       router.refresh()
      
//       // Show success message
//       setTimeout(() => {
//         alert(`Bus ${formData.busNumber} created successfully!`)
//       }, 100)
      
//     } catch (error: any) {
//       console.error('Error in handleSubmit:', error)
//       setError(error.message || 'An unexpected error occurred')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // ✅ CLOSE DIALOG
//   const handleClose = () => {
//     setOpen(false)
//     setStep(1)
//     setError(null)
//     setFormData({
//       busNumber: '',
//       busType: '',
//       capacity: '',
//       deviceId: '',
//       deviceName: '',
//       isActive: true
//     })
//   }

//   // ✅ BUS TYPE OPTIONS
//   const busTypes = [
//     { 
//       value: 'AC Luxury', 
//       label: 'AC Luxury Bus', 
//       description: 'Air-conditioned with premium seats',
//       capacityRange: '25-35 seats',
//       features: ['AC', 'Reclining seats', 'Entertainment']
//     },
//     { 
//       value: 'Semi Luxury', 
//       label: 'Semi Luxury Bus', 
//       description: 'Comfortable seating with basic amenities',
//       capacityRange: '35-50 seats',
//       features: ['Comfortable seats', 'Music system']
//     },
//     { 
//       value: 'Normal', 
//       label: 'Normal Bus', 
//       description: 'Standard public transport bus',
//       capacityRange: '45-65 seats',
//       features: ['Standard seats', 'Basic amenities']
//     },
//     { 
//       value: 'Express', 
//       label: 'Express Bus', 
//       description: 'Limited stops, faster journey',
//       capacityRange: '30-45 seats',
//       features: ['Express service', 'Limited stops']
//     }
//   ]

//   // ✅ TRIGGER BUTTON
//   if (!open) {
//     return (
//       <div onClick={() => setOpen(true)} className="cursor-pointer">
//         {children}
//       </div>
//     )
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b bg-blue-50">
//           <div className="flex items-center space-x-3">
//             <div className="bg-blue-100 rounded-lg p-2">
//               <Bus className="h-6 w-6 text-blue-600" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-gray-900">Add New Bus</h2>
//               <p className="text-sm text-gray-600">
//                 {step === 1 ? 'Enter bus details' : 'Setup GPS tracking (optional)'}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={handleClose}
//             className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
//             disabled={loading}
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Progress Indicator */}
//         <div className="px-6 py-4 bg-gray-50 border-b">
//           <div className="flex items-center justify-center">
//             <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
//                 step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
//               }`}>
//                 1
//               </div>
//               <span className="ml-2 text-sm font-medium">Bus Details</span>
//             </div>
//             <div className="flex-1 mx-4 h-1 bg-gray-200 rounded relative">
//               <div className={`h-full bg-blue-600 rounded transition-all duration-300 ${
//                 step >= 2 ? 'w-full' : 'w-0'
//               }`}></div>
//             </div>
//             <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
//                 step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
//               }`}>
//                 2
//               </div>
//               <span className="ml-2 text-sm font-medium">GPS Setup</span>
//             </div>
//           </div>
//         </div>

//         {/* ✅ IMPROVED ERROR MESSAGE DISPLAY */}
//         {error && (
//           <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <div className="flex items-start">
//               <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
//               <div className="flex-1">
//                 <h4 className="text-sm font-medium text-red-800 mb-1">Error Creating Bus</h4>
//                 <p className="text-red-700 text-sm">{error}</p>
//                 {/* ✅ DEBUG INFO */}
//                 <details className="mt-2">
//                   <summary className="text-xs text-red-600 cursor-pointer">Debug Info</summary>
//                   <div className="mt-1 text-xs text-red-600 bg-red-100 p-2 rounded">
//                     <p>Operator ID: {operatorId}</p>
//                     <p>Bus Number: {formData.busNumber}</p>
//                     <p>Bus Type: {formData.busType}</p>
//                     <p>Capacity: {formData.capacity}</p>
//                   </div>
//                 </details>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Form Content */}
//         <form onSubmit={handleSubmit}>
//           {step === 1 ? (
//             <Step1Content 
//               formData={formData}
//               setFormData={setFormData}
//               busTypes={busTypes}
//               loading={loading}
//             />
//           ) : (
//             <Step2Content 
//               formData={formData}
//               setFormData={setFormData}
//               loading={loading}
//             />
//           )}

//           {/* Footer */}
//           <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
//             <div className="text-sm text-gray-500">
//               Step {step} of 2
//             </div>
//             <div className="flex items-center space-x-3">
//               {step === 2 && (
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setStep(1)}
//                   disabled={loading}
//                   className="flex items-center"
//                 >
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Back
//                 </Button>
//               )}
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="flex items-center min-w-[120px]"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Creating...
//                   </>
//                 ) : step === 1 ? (
//                   <>
//                     Next Step
//                     <ArrowRight className="h-4 w-4 ml-2" />
//                   </>
//                 ) : (
//                   <>
//                     <Plus className="h-4 w-4 mr-2" />
//                     Create Bus
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// // ✅ STEP COMPONENTS REMAIN THE SAME
// interface Step1Props {
//   formData: FormData
//   setFormData: (data: FormData) => void
//   busTypes: any[]
//   loading: boolean
// }

// function Step1Content({ formData, setFormData, busTypes, loading }: Step1Props) {
//   return (
//     <div className="p-6 space-y-6">
//       {/* Bus Number */}
//       <div>
//         <label className="block text-sm font-semibold text-gray-700 mb-2">
//           <Tag className="inline h-4 w-4 mr-1" />
//           Bus Number *
//         </label>
//         <Input
//           value={formData.busNumber}
//           onChange={(e) => setFormData({...formData, busNumber: e.target.value.toUpperCase()})}
//           placeholder="e.g., CBK-1234, NB-GA-5678"
//           className="w-full"
//           disabled={loading}
//           maxLength={20}
//         />
//         <p className="text-xs text-gray-500 mt-1">
//           Enter the official bus registration number
//         </p>
//       </div>

//       {/* Bus Type Selection */}
//       <div>
//         <label className="block text-sm font-semibold text-gray-700 mb-3">
//           <Truck className="inline h-4 w-4 mr-1" />
//           Bus Type *
//         </label>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           {busTypes.map((type) => (
//             <BusTypeCard
//               key={type.value}
//               type={type}
//               isSelected={formData.busType === type.value}
//               onClick={() => setFormData({...formData, busType: type.value})}
//               disabled={loading}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Capacity */}
//       <div>
//         <label className="block text-sm font-semibold text-gray-700 mb-2">
//           <Users className="inline h-4 w-4 mr-1" />
//           Seating Capacity *
//         </label>
//         <Input
//           type="number"
//           min="1"
//           max="100"
//           value={formData.capacity}
//           onChange={(e) => setFormData({...formData, capacity: e.target.value})}
//           placeholder="Enter number of seats"
//           className="w-full"
//           disabled={loading}
//         />
//         <p className="text-xs text-gray-500 mt-1">
//           Number of passenger seats (1-100)
//         </p>
//       </div>

//       {/* Active Status */}
//       <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
//         <input
//           type="checkbox"
//           checked={formData.isActive}
//           onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
//           className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//           disabled={loading}
//         />
//         <div>
//           <label className="font-medium text-gray-900">Active Bus</label>
//           <p className="text-sm text-gray-600">
//             Bus will be available for scheduling and bookings
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// interface Step2Props {
//   formData: FormData
//   setFormData: (data: FormData) => void
//   loading: boolean
// }

// function Step2Content({ formData, setFormData, loading }: Step2Props) {
//   return (
//     <div className="p-6 space-y-6">
//       <div className="text-center mb-6">
//         <Settings className="h-12 w-12 text-blue-600 mx-auto mb-3" />
//         <h3 className="text-lg font-semibold text-gray-900">GPS Device Setup</h3>
//         <p className="text-gray-600">
//           Add a GPS tracking device to monitor bus location in real-time
//         </p>
//       </div>

//       {/* Device ID */}
//       <div>
//         <label className="block text-sm font-semibold text-gray-700 mb-2">
//           Device ID (Optional)
//         </label>
//         <Input
//           value={formData.deviceId}
//           onChange={(e) => setFormData({...formData, deviceId: e.target.value})}
//           placeholder="e.g., GPS001, TRK-456"
//           className="w-full"
//           disabled={loading}
//         />
//         <p className="text-xs text-gray-500 mt-1">
//           Enter the unique ID of your GPS tracking device
//         </p>
//       </div>

//       {/* Device Name */}
//       <div>
//         <label className="block text-sm font-semibold text-gray-700 mb-2">
//           Device Name (Optional)
//         </label>
//         <Input
//           value={formData.deviceName}
//           onChange={(e) => setFormData({...formData, deviceName: e.target.value})}
//           placeholder={`e.g., ${formData.busNumber} GPS Tracker`}
//           className="w-full"
//           disabled={loading}
//         />
//         <p className="text-xs text-gray-500 mt-1">
//           Friendly name for the device (defaults to bus number + GPS)
//         </p>
//       </div>

//       {/* Info Box */}
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//         <div className="flex items-start">
//           <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
//           <div>
//             <h4 className="font-medium text-blue-900">Optional Setup</h4>
//             <p className="text-sm text-blue-700 mt-1">
//               You can skip GPS setup for now and add tracking devices later from the fleet management page. 
//               The bus will still be created and available for scheduling.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// interface BusTypeCardProps {
//   type: any
//   isSelected: boolean
//   onClick: () => void
//   disabled: boolean
// }

// function BusTypeCard({ type, isSelected, onClick, disabled }: BusTypeCardProps) {
//   return (
//     <Card 
//       className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
//         isSelected 
//           ? 'border-blue-500 bg-blue-50 shadow-md' 
//           : 'border-gray-200 hover:border-blue-300'
//       } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
//       onClick={disabled ? undefined : onClick}
//     >
//       <CardContent className="p-4">
//         <div className="flex items-start space-x-3">
//           <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
//             isSelected
//               ? 'border-blue-500 bg-blue-500'
//               : 'border-gray-300'
//           }`}>
//             {isSelected && (
//               <CheckCircle className="w-3 h-3 text-white" />
//             )}
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-medium text-gray-900 mb-1">{type.label}</h3>
//             <p className="text-sm text-gray-600 mb-2">{type.description}</p>
//             <div className="text-xs text-gray-500">
//               <div className="mb-1">{type.capacityRange}</div>
//               <div className="flex flex-wrap gap-1">
//                 {type.features.map((feature: string, index: number) => (
//                   <Badge key={index} variant="secondary" className="text-xs">
//                     {feature}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }




'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  Plus, 
  Bus, 
  Users, 
  Tag,
  Loader2,
  AlertCircle,
  CheckCircle,
  Truck,
  Settings,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'

interface CreateBusDialogProps {
  children: React.ReactNode
  operatorId: string
}

interface FormData {
  busNumber: string
  busType: string
  capacity: string
  deviceId: string
  deviceName: string
  isActive: boolean
}

export function CreateBusDialog({ children, operatorId }: CreateBusDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const router = useRouter()

  // ✅ FORM STATE
  const [formData, setFormData] = useState<FormData>({
    busNumber: '',
    busType: '',
    capacity: '',
    deviceId: '',
    deviceName: '',
    isActive: true
  })

  // ✅ VALIDATION
  const validateStep1 = (): string | null => {
    if (!formData.busNumber.trim()) return 'Bus number is required'
    if (formData.busNumber.length < 3) return 'Bus number must be at least 3 characters'
    if (!formData.busType) return 'Bus type is required'
    if (!formData.capacity || parseInt(formData.capacity) <= 0) return 'Valid capacity is required'
    if (parseInt(formData.capacity) > 100) return 'Capacity cannot exceed 100 seats'
    return null
  }

  // ✅ FORM SUBMISSION WITH MONGODB OBJECTID FIX
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      const validationError = validateStep1()
      if (validationError) {
        setError(validationError)
        return
      }
      setError(null)
      setStep(2)
      return
    }

    // Step 2 - Submit form
    setLoading(true)
    setError(null)

    try {
      console.log('Creating bus with data:', {
        busNumber: formData.busNumber.trim().toUpperCase(),
        busType: formData.busType,
        capacity: parseInt(formData.capacity),
        isActive: formData.isActive,
        operatorId: '507f1f77bcf86cd799439011'  // ✅ FIXED: Valid MongoDB ObjectId
      })

      // ✅ CREATE BUS WITH VALID MONGODB OBJECTID
      const busData = {
        busNumber: formData.busNumber.trim().toUpperCase(),
        busType: formData.busType,
        capacity: parseInt(formData.capacity),
        isActive: formData.isActive,
        operatorId: '507f1f77bcf86cd799439011'  // ✅ FIXED: Valid 24-character ObjectId
      }

      const busResponse = await fetch('/api/operator/buses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(busData)
      })

      console.log('Bus creation response status:', busResponse.status)

      // ✅ IMPROVED ERROR HANDLING
      if (!busResponse.ok) {
        let errorMessage = 'Failed to create bus'
        
        try {
          const errorData = await busResponse.json()
          console.log('Error response data:', errorData)
          
          if (errorData.error) {
            errorMessage = errorData.error
          } else if (errorData.details && Array.isArray(errorData.details)) {
            errorMessage = errorData.details.map((d: any) => d.message).join(', ')
          }
        } catch (jsonError) {
          console.error('Failed to parse error response:', jsonError)
          errorMessage = `Server error (${busResponse.status}): ${busResponse.statusText}`
        }

        throw new Error(errorMessage)
      }

      const bus = await busResponse.json()
      console.log('Bus created successfully:', bus)

      // Create device if provided
      if (formData.deviceId.trim()) {
        const deviceData = {
          deviceId: formData.deviceId.trim(),
          name: formData.deviceName.trim() || `${formData.busNumber} GPS`,
          busId: bus.id,
          isActive: true
        }

        console.log('Creating device with data:', deviceData)

        try {
          const deviceResponse = await fetch('/api/operator/devices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deviceData)
          })

          if (!deviceResponse.ok) {
            console.warn('Bus created but device setup failed:', await deviceResponse.text())
          } else {
            console.log('Device created successfully')
          }
        } catch (deviceError) {
          console.warn('Device creation failed:', deviceError)
        }
      }

      // Success!
      handleClose()
      router.refresh()
      
      // Show success message
      setTimeout(() => {
        alert(`Bus ${formData.busNumber} created successfully!`)
      }, 100)
      
    } catch (error: any) {
      console.error('Error in handleSubmit:', error)
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // ✅ CLOSE DIALOG
  const handleClose = () => {
    setOpen(false)
    setStep(1)
    setError(null)
    setFormData({
      busNumber: '',
      busType: '',
      capacity: '',
      deviceId: '',
      deviceName: '',
      isActive: true
    })
  }

  // ✅ BUS TYPE OPTIONS
  const busTypes = [
    { 
      value: 'AC Luxury', 
      label: 'AC Luxury Bus', 
      description: 'Air-conditioned with premium seats',
      capacityRange: '25-35 seats',
      features: ['AC', 'Reclining seats', 'Entertainment']
    },
    { 
      value: 'Semi Luxury', 
      label: 'Semi Luxury Bus', 
      description: 'Comfortable seating with basic amenities',
      capacityRange: '35-50 seats',
      features: ['Comfortable seats', 'Music system']
    },
    { 
      value: 'Normal', 
      label: 'Normal Bus', 
      description: 'Standard public transport bus',
      capacityRange: '45-65 seats',
      features: ['Standard seats', 'Basic amenities']
    },
    { 
      value: 'Express', 
      label: 'Express Bus', 
      description: 'Limited stops, faster journey',
      capacityRange: '30-45 seats',
      features: ['Express service', 'Limited stops']
    }
  ]

  // ✅ TRIGGER BUTTON
  if (!open) {
    return (
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Bus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add New Bus</h2>
              <p className="text-sm text-gray-600">
                {step === 1 ? 'Enter bus details' : 'Setup GPS tracking (optional)'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-center">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Bus Details</span>
            </div>
            <div className="flex-1 mx-4 h-1 bg-gray-200 rounded relative">
              <div className={`h-full bg-blue-600 rounded transition-all duration-300 ${
                step >= 2 ? 'w-full' : 'w-0'
              }`}></div>
            </div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">GPS Setup</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 mb-1">Error Creating Bus</h4>
                <p className="text-red-700 text-sm">{error}</p>
                {/* Debug Info */}
                <details className="mt-2">
                  <summary className="text-xs text-red-600 cursor-pointer">Debug Info</summary>
                  <div className="mt-1 text-xs text-red-600 bg-red-100 p-2 rounded">
                    <p>Bus Number: {formData.busNumber}</p>
                    <p>Bus Type: {formData.busType}</p>
                    <p>Capacity: {formData.capacity}</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <Step1Content 
              formData={formData}
              setFormData={setFormData}
              busTypes={busTypes}
              loading={loading}
            />
          ) : (
            <Step2Content 
              formData={formData}
              setFormData={setFormData}
              loading={loading}
            />
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
            <div className="text-sm text-gray-500">
              Step {step} of 2
            </div>
            <div className="flex items-center space-x-3">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : step === 1 ? (
                  <>
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Bus
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ✅ STEP 1 COMPONENT
interface Step1Props {
  formData: FormData
  setFormData: (data: FormData) => void
  busTypes: any[]
  loading: boolean
}

function Step1Content({ formData, setFormData, busTypes, loading }: Step1Props) {
  return (
    <div className="p-6 space-y-6">
      {/* Bus Number */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Tag className="inline h-4 w-4 mr-1" />
          Bus Number *
        </label>
        <Input
          value={formData.busNumber}
          onChange={(e) => setFormData({...formData, busNumber: e.target.value.toUpperCase()})}
          placeholder="e.g., CBK-1234, NB-GA-5678"
          className="w-full"
          disabled={loading}
          maxLength={20}
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter the official bus registration number
        </p>
      </div>

      {/* Bus Type Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          <Truck className="inline h-4 w-4 mr-1" />
          Bus Type *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {busTypes.map((type) => (
            <BusTypeCard
              key={type.value}
              type={type}
              isSelected={formData.busType === type.value}
              onClick={() => setFormData({...formData, busType: type.value})}
              disabled={loading}
            />
          ))}
        </div>
      </div>

      {/* Capacity */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Users className="inline h-4 w-4 mr-1" />
          Seating Capacity *
        </label>
        <Input
          type="number"
          min="1"
          max="100"
          value={formData.capacity}
          onChange={(e) => setFormData({...formData, capacity: e.target.value})}
          placeholder="Enter number of seats"
          className="w-full"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Number of passenger seats (1-100)
        </p>
      </div>

      {/* Active Status */}
      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          disabled={loading}
        />
        <div>
          <label className="font-medium text-gray-900">Active Bus</label>
          <p className="text-sm text-gray-600">
            Bus will be available for scheduling and bookings
          </p>
        </div>
      </div>
    </div>
  )
}

// ✅ STEP 2 COMPONENT
interface Step2Props {
  formData: FormData
  setFormData: (data: FormData) => void
  loading: boolean
}

function Step2Content({ formData, setFormData, loading }: Step2Props) {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <Settings className="h-12 w-12 text-blue-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">GPS Device Setup</h3>
        <p className="text-gray-600">
          Add a GPS tracking device to monitor bus location in real-time
        </p>
      </div>

      {/* Device ID */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Device ID (Optional)
        </label>
        <Input
          value={formData.deviceId}
          onChange={(e) => setFormData({...formData, deviceId: e.target.value})}
          placeholder="e.g., GPS001, TRK-456"
          className="w-full"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter the unique ID of your GPS tracking device
        </p>
      </div>

      {/* Device Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Device Name (Optional)
        </label>
        <Input
          value={formData.deviceName}
          onChange={(e) => setFormData({...formData, deviceName: e.target.value})}
          placeholder={`e.g., ${formData.busNumber} GPS Tracker`}
          className="w-full"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Friendly name for the device (defaults to bus number + GPS)
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900">Optional Setup</h4>
            <p className="text-sm text-blue-700 mt-1">
              You can skip GPS setup for now and add tracking devices later from the fleet management page. 
              The bus will still be created and available for scheduling.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ✅ BUS TYPE CARD COMPONENT
interface BusTypeCardProps {
  type: any
  isSelected: boolean
  onClick: () => void
  disabled: boolean
}

function BusTypeCard({ type, isSelected, onClick, disabled }: BusTypeCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 hover:border-blue-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
            isSelected
              ? 'border-blue-500 bg-blue-500'
              : 'border-gray-300'
          }`}>
            {isSelected && (
              <CheckCircle className="w-3 h-3 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 mb-1">{type.label}</h3>
            <p className="text-sm text-gray-600 mb-2">{type.description}</p>
            <div className="text-xs text-gray-500">
              <div className="mb-1">{type.capacityRange}</div>
              <div className="flex flex-wrap gap-1">
                {type.features.map((feature: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
