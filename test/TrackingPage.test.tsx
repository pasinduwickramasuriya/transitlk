import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import TrackingPage from '@/app/tracking/page'

// Mock sub-components
jest.mock('@/components/user/PublicBusTrackingClient', () => ({
    PublicBusTrackingClient: () => <div data-testid="tracking-client">Tracking System</div>
}))

jest.mock('@/components/landing/Navbar', () => ({
    Navbar: () => <div data-testid="navbar">Navbar</div>
}))

jest.mock('@/components/landing/Footer', () => ({
    Footer: () => <div data-testid="footer">Footer</div>
}))

describe('TrackingPage', () => {
    it('renders correctly', () => {
        render(<TrackingPage />)

        expect(screen.getByTestId('navbar')).toBeInTheDocument()
        expect(screen.getByTestId('tracking-client')).toBeInTheDocument()
        expect(screen.getByTestId('footer')).toBeInTheDocument()
    })
})
