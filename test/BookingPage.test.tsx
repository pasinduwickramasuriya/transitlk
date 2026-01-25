import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import BookTicketsPage from '@/app/booking/page'
import * as authUtils from '@/utils/auth'

// Mock dependencies
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
    useSearchParams: () => ({ get: jest.fn() }),
}))

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
    },
}))

jest.mock('@/components/landing/Navbar', () => ({
    Navbar: () => <div data-testid="navbar">Navbar</div>
}))

// Mock Booking Sub-components
jest.mock('@/components/booking/SearchForm', () => ({
    SearchForm: ({ onSearch }: any) => (
        <div data-testid="search-form">
            <button onClick={() => onSearch({ from: 'A', to: 'B', date: '2023-01-01' })}>Search</button>
        </div>
    )
}))

jest.mock('@/components/booking/RouteSelection', () => ({
    RouteSelection: ({ onBusSelection }: any) => (
        <div data-testid="route-selection">
            <button onClick={() => onBusSelection(
                { fares: [{ busType: 'Highway', isActive: true }] }, // Route
                { bus: { busType: 'Highway' } } // Schedule
            )}>Mock Select Bus</button>
        </div>
    )
}))

jest.mock('@/components/booking/SeatSelection', () => ({
    SeatSelection: ({ onSeatSelection, onProceedToPayment }: any) => (
        <div data-testid="seat-selection">
            <button onClick={() => onSeatSelection([1, 2])}>Select Seat</button>
            <button onClick={onProceedToPayment}>Proceed Pay</button>
        </div>
    )
}))

jest.mock('@/components/booking/PaymentProcess', () => ({
    PaymentProcess: ({ onPaymentComplete }: any) => (
        <div data-testid="payment-process">
            <button onClick={() => onPaymentComplete({ id: '123' })}>Pay Now</button>
        </div>
    )
}))

jest.mock('@/components/booking/TicketConfirmation', () => ({
    TicketConfirmation: ({ onNewBooking }: any) => (
        <div data-testid="ticket-confirmation">
            <button onClick={onNewBooking}>New Booking</button>
        </div>
    )
}))

jest.mock('@/utils/auth', () => ({
    isUserLoggedIn: jest.fn(),
    saveReturnUrl: jest.fn(),
    getCurrentUser: jest.fn(),
    forceCheckExpiry: jest.fn(),
}))

// Mock Fetch
global.fetch = jest.fn()

describe('BookTicketsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
            // Default logged in state
            ; (authUtils.isUserLoggedIn as jest.Mock).mockReturnValue(true)
            ; (authUtils.getCurrentUser as jest.Mock).mockReturnValue({ name: 'Test User' })
    })

    it('renders search form initially', async () => {
        (authUtils.isUserLoggedIn as jest.Mock).mockReturnValue(true)

        render(<BookTicketsPage />)

        // Wait for client-side hydration
        await waitFor(() => {
            expect(screen.getByTestId('search-form')).toBeInTheDocument()
        })
    })

    it('navigates to route selection after search', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true, routes: [{ id: 1 }] })
        })

        render(<BookTicketsPage />)

        await waitFor(() => screen.getByTestId('search-form'))

        fireEvent.click(screen.getByText('Search'))

        await waitFor(() => {
            expect(screen.getByTestId('route-selection')).toBeInTheDocument()
        })
    })

    it('handles bus selection and proceeds to seats if logged in', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true, routes: [{ id: 1, fares: [{ busType: 'Highway', isActive: true }] }] })
        })

        render(<BookTicketsPage />)

        // 1. Search
        await waitFor(() => screen.getByTestId('search-form'))
        fireEvent.click(screen.getByText('Search'))

        // 2. Select Bus
        await waitFor(() => screen.getByTestId('route-selection'))
        fireEvent.click(screen.getByText('Mock Select Bus')) // Defines selectedBus and moves to step 2

        // 3. Verify Seat Selection appears
        await waitFor(() => {
            expect(screen.getByTestId('seat-selection')).toBeInTheDocument()
        })
    })
})
