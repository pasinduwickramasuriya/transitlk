import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SignUpPage from '@/app/auth/signup/page'
import { useRouter } from 'next/navigation'

// --- MOCKS ---

// Mock fetching
global.fetch = jest.fn()

// Mock Next Navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}))

// Mock Sonner Toast
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}))

// Mock Checkbox
jest.mock('@/components/ui/checkbok', () => ({
    Checkbox: ({ onCheckedChange, checked, id }: any) => (
        <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            data-testid={id}
        />
    ),
}))

describe('SignUpPage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders the sign up form correctly', () => {
        render(<SignUpPage />)

        expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument()
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Terms of Service/i)).toBeInTheDocument()
    })

    it('shows error if password and confirm password do not match', async () => {
        render(<SignUpPage />)

        // Check terms (necessary for submission)
        fireEvent.click(screen.getByTestId('terms'))

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } })
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } })
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'mismatch' } })

        const submitBtn = screen.getAllByRole('button').find(b => b.getAttribute('type') === 'submit')
        if (submitBtn) fireEvent.click(submitBtn)

        await waitFor(() => {
            expect(screen.getByText(/Passwords don't match/i)).toBeInTheDocument()
        })
    })

    it('prevents submission if terms not accepted', async () => {
        render(<SignUpPage />)

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } })
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } })
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } })

        // Do NOT check terms

        const submitBtn = screen.getAllByRole('button').find(b => b.getAttribute('type') === 'submit')
        expect(submitBtn).toBeDisabled()
    })

    it('handles successful registration', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ success: true }),
        })

        render(<SignUpPage />)

        fireEvent.click(screen.getByTestId('terms'))

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test User' } })
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } })
        // Fill optional phone number to match fetch body
        fireEvent.change(screen.getByPlaceholderText('+94 77 123 4567'), { target: { value: '0771234567' } })

        fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } })
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } })

        const submitBtn = screen.getAllByRole('button').find(b => b.getAttribute('type') === 'submit')
        if (submitBtn) fireEvent.click(submitBtn)

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({
                    name: 'Test User',
                    email: 'test@example.com',
                    phoneNumber: '0771234567',
                    password: 'password123',
                })
            }))
        })

        await waitFor(() => {
            expect(screen.getByText('Account created successfully! Redirecting to sign in...')).toBeInTheDocument()
        })
    })
})
