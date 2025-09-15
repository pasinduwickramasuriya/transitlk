import { Loader2 } from 'lucide-react'

export default function SignUpLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
        <p className="text-gray-600">Loading sign up page...</p>
      </div>
    </div>
  )
}
