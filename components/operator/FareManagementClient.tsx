'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  DollarSign, Plus, Edit, Trash2, Search, Filter, MapPin, Route,
  TrendingUp, Calculator, Activity, RefreshCw, Save, X, AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Fare {
  id: string
  routeId: string
  busType: string
  basePrice: number
  currency: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  route: {
    id: string
    routeNumber: string
    startLocation: string
    endLocation: string
    distance: number | null
  }
}

interface Route {
  id: string
  routeNumber: string
  startLocation: string
  endLocation: string
  distance: number | null
}

interface Operator {
  id: string
  name: string
}

interface FareFormData {
  routeId: string
  busType: string
  basePrice: number
  currency: string
  isActive: boolean
}

interface FareManagementClientProps {
  operator: Operator
  initialFares: Fare[]
  routes: Route[]
}

const busTypes = [
  'AC Luxury Bus ',
  'Semi Luxury Bus',
  'Normal Bus'
]

export function FareManagementClient({ operator, initialFares, routes }: FareManagementClientProps) {
  const [fares, setFares] = useState<Fare[]>(initialFares)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBusType, setSelectedBusType] = useState<string>('all')
  const [selectedRoute, setSelectedRoute] = useState<string>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingFare, setEditingFare] = useState<Fare | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const [formData, setFormData] = useState<FareFormData>({
    routeId: '',
    busType: '',
    basePrice: 0,
    currency: 'LKR',
    isActive: true
  })

  // Memoized calculations
  const stats = useMemo(() => {
    const activeFares = fares.filter(f => f.isActive)
    const totalRevenue = activeFares.reduce((sum, f) => sum + f.basePrice, 0)
    const avgFare = activeFares.length > 0 ? totalRevenue / activeFares.length : 0

    return {
      totalFares: fares.length,
      activeFares: activeFares.length,
      avgFare: avgFare,
      totalRoutes: new Set(fares.map(f => f.routeId)).size
    }
  }, [fares])

  const filteredFares = useMemo(() => {
    return fares.filter(fare => {
      const matchesSearch = !searchTerm || 
        fare.route.routeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fare.route.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fare.route.endLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fare.busType.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesBusType = selectedBusType === 'all' || fare.busType === selectedBusType
      const matchesRoute = selectedRoute === 'all' || fare.routeId === selectedRoute

      return matchesSearch && matchesBusType && matchesRoute
    })
  }, [fares, searchTerm, selectedBusType, selectedRoute])

  const resetForm = () => {
    setFormData({
      routeId: '',
      busType: '',
      basePrice: 0,
      currency: 'LKR',
      isActive: true
    })
    setEditingFare(null)
  }

  const openEditForm = (fare: Fare) => {
    setFormData({
      routeId: fare.routeId,
      busType: fare.busType,
      basePrice: fare.basePrice,
      currency: fare.currency,
      isActive: fare.isActive
    })
    setEditingFare(fare)
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingFare 
        ? `/api/operator/fare/${editingFare.id}`
        : '/api/operator/fare'

      const method = editingFare ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to save fare')
      }

      const result = await response.json()

      if (editingFare) {
        setFares(fares.map(f => f.id === editingFare.id ? result.fare : f))
        toast.success('Fare updated successfully')
      } else {
        setFares([result.fare, ...fares])
        toast.success('Fare created successfully')
      }

      setIsFormOpen(false)
      resetForm()
    } catch (error) {
      toast.error('Failed to save fare')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (fareId: string) => {
    setLoading(true)

    try {
      const response = await fetch(`/api/operator/fare/${fareId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete fare')
      }

      setFares(fares.filter(f => f.id !== fareId))
      toast.success('Fare deleted successfully')
      setDeleteConfirm(null)
    } catch (error) {
      toast.error('Failed to delete fare')
    } finally {
      setLoading(false)
    }
  }

  const refreshFares = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/operator/fare')
      if (response.ok) {
        const data = await response.json()
        setFares(data.fares)
        toast.success('Fares refreshed')
      }
    } catch (error) {
      toast.error('Failed to refresh fares')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Fare Management
              </h1>
              <p className="text-sm text-slate-600">Operator: {operator.name}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.totalFares}</p>
                  <p className="text-sm text-slate-600 font-medium">Total Fares</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.activeFares}</p>
                  <p className="text-sm text-slate-600 font-medium">Active Fares</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">LKR {stats.avgFare.toFixed(0)}</p>
                  <p className="text-sm text-slate-600 font-medium">Avg Fare</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg">
                  <Route className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.totalRoutes}</p>
                  <p className="text-sm text-slate-600 font-medium">Routes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-green-600" />
                Fare Controls
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={refreshFares} variant="outline" disabled={loading}>
                  <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                  Refresh
                </Button>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm} className="bg-gradient-to-r from-green-500 to-emerald-500">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Fare
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingFare ? 'Edit Fare' : 'Add New Fare'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label>Route</Label>
                        <Select
                          value={formData.routeId}
                          onValueChange={(value) => setFormData({...formData, routeId: value})}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select route" />
                          </SelectTrigger>
                          <SelectContent>
                            {routes.map(route => (
                              <SelectItem key={route.id} value={route.id}>
                                {route.routeNumber} - {route.startLocation} to {route.endLocation}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Bus Type</Label>
                        <Select
                          value={formData.busType}
                          onValueChange={(value) => setFormData({...formData, busType: value})}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select bus type" />
                          </SelectTrigger>
                          <SelectContent>
                            {busTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Base Price (LKR)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.basePrice}
                          onChange={(e) => setFormData({...formData, basePrice: parseFloat(e.target.value) || 0})}
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        />
                        <Label htmlFor="isActive">Active</Label>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={loading} className="flex-1">
                          <Save className="h-4 w-4 mr-2" />
                          {loading ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsFormOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search fares..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={selectedBusType} onValueChange={setSelectedBusType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by bus type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bus Types</SelectItem>
                  {busTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Routes</SelectItem>
                  {routes.map(route => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.routeNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Fares List */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              Fare List ({filteredFares.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {filteredFares.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-700 mb-2">No fares found</h3>
                  <p className="text-slate-500">Add your first fare to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFares.map((fare) => (
                    <div
                      key={fare.id}
                      className="p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {fare.route.routeNumber}
                            </Badge>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700">
                              {fare.busType}
                            </Badge>
                            <Badge 
                              variant={fare.isActive ? "default" : "secondary"}
                              className={fare.isActive ? "bg-green-500" : ""}
                            >
                              {fare.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-slate-500">Route</p>
                              <p className="font-medium text-slate-800">
                                {fare.route.startLocation} → {fare.route.endLocation}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Base Price</p>
                              <p className="text-2xl font-bold text-green-600">
                                {fare.currency} {fare.basePrice.toFixed(2)}
                              </p>
                            </div>
                            {fare.route.distance && (
                              <div>
                                <p className="text-sm text-slate-500">Distance</p>
                                <p className="font-medium text-slate-800">
                                  {fare.route.distance.toFixed(1)} km
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-slate-500">Price per km</p>
                              <p className="font-medium text-slate-800">
                                {fare.route.distance 
                                  ? `${fare.currency} ${(fare.basePrice / fare.route.distance).toFixed(2)}`
                                  : 'N/A'
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-6">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditForm(fare)}
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteConfirm(fare.id)}
                            disabled={loading}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Delete Fare
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-slate-600">
                Are you sure you want to delete this fare? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
