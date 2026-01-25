import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AnalyticsPage from '@/app/analytics/page'

// Mock fetching
global.fetch = jest.fn()

// Mock Recharts to avoid canvas issues in jsdom
jest.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div className="recharts-responsive-container">{children}</div>,
    AreaChart: () => <div data-testid="area-chart" />,
    Area: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    BarChart: () => <div data-testid="bar-chart" />,
    Bar: () => null,
    PieChart: () => <div data-testid="pie-chart" />,
    Pie: () => null,
    Cell: () => null,
}))

// Mock next/navigation components
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        replace: jest.fn(),
        prefetch: jest.fn(),
    }),
    usePathname: () => '/analytics',
}))

describe('AnalyticsPage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders loading state initially', () => {
        // Mock fetch to never resolve immediately or resolve slowly
        (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => { }))

        render(<AnalyticsPage />)
        // Check for loading text (assuming "..." is displayed)
        const loadingIndicators = screen.getAllByText('...')
        expect(loadingIndicators.length).toBeGreaterThan(0)
    })

    it('renders fetched data correctly', async () => {
        const mockData = {
            users: 1500,
            bookings: 5000,
            buses: 50,
            routes: 10,
            revenue: 100000,
            rating: 4.5,
            growth: [{ name: 'Jan', val: 100 }]
        }

            // Mock successful fetch
            ; (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockData
            })

        render(<AnalyticsPage />)

        // Wait for data to load
        await waitFor(() => {
            // Use getAllByText for stats that might appear multiple times (Hero + Grid)
            const bookings = screen.getAllByText('5,000')
            expect(bookings.length).toBeGreaterThan(0)
            expect(bookings[0]).toBeInTheDocument()

            const users = screen.getAllByText('1,500')
            expect(users.length).toBeGreaterThan(0)
            expect(users[0]).toBeInTheDocument()

            const buses = screen.getAllByText('50')
            expect(buses.length).toBeGreaterThan(0)
            expect(buses[0]).toBeInTheDocument()

            const ratings = screen.getAllByText('4.5')
            expect(ratings.length).toBeGreaterThan(0)
            expect(ratings[0]).toBeInTheDocument()
        })

        // Check for static text
        expect(screen.getByText('Our Mission & Impact')).toBeInTheDocument()
        expect(screen.getByText('Revolutionizing')).toBeInTheDocument()
    })
})
