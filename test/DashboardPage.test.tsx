import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import UserDashboard from '@/app/dashboard/page'
import { useSession } from 'next-auth/react'

// Mocks
jest.mock('next-auth/react')
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
}))
jest.mock('sonner', () => ({
    toast: { error: jest.fn() }
}))

// Mock Sub Components to simplify DOM
jest.mock('@/components/ui/card', () => ({
    Card: ({ children }: any) => <div data-testid="card">{children}</div>,
    CardHeader: ({ children }: any) => <div>{children}</div>,
    CardTitle: ({ children }: any) => <div>{children}</div>,
    CardContent: ({ children }: any) => <div>{children}</div>,
    CardDescription: ({ children }: any) => <div>{children}</div>,
}))

global.fetch = jest.fn()

describe('UserDashboard', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('shows loading state initially', () => {
        (useSession as jest.Mock).mockReturnValue({ data: null, status: 'loading' })
        render(<UserDashboard />)

        expect(screen.queryByText('Total Bookings')).not.toBeInTheDocument()
    })

    it('redirects if unauthenticated', () => {
        (useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' })
        render(<UserDashboard />)

        // Should NOT render dashboard content
        expect(screen.queryByText('Total Bookings')).not.toBeInTheDocument()
    })

    it('renders dashboard data when authenticated', async () => {
        (useSession as jest.Mock).mockReturnValue({
            data: { user: { name: 'Test User' } },
            status: 'authenticated'
        })

        const mockData = {
            stats: { totalBookings: 10, completedTrips: 5, upcomingTrips: 2, totalSpent: 5000 },
            recentBookings: [],
            upcomingTrips: []
        }

            ; (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockData
            })

        render(<UserDashboard />)

        await waitFor(() => {
            expect(screen.getByText('Total Bookings')).toBeInTheDocument()
            expect(screen.getByText('10')).toBeInTheDocument()
            expect(screen.getByText('Rs. 5,000')).toBeInTheDocument()
        })
    })
})
