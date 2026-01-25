import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'


import SignInPage from '@/app/auth/signin/page'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// --- MOCKS ---

const mockSignIn = jest.fn()
const mockGetSession = jest.fn()

jest.mock('next-auth/react', () => ({
    __esModule: true,
    signIn: (...args: any[]) => mockSignIn(...args),
    getSession: (...args: any[]) => mockGetSession(...args),
    useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
}))

const mockPush = jest.fn()
const mockGet = jest.fn()
const mockUseSearchParams = jest.fn(() => ({ get: mockGet }))

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
    useSearchParams: () => mockUseSearchParams(),
}))

jest.mock('sonner', () => ({
    toast: { success: jest.fn(), error: jest.fn() },
}))

jest.mock('@/utils/auth', () => ({
    saveUser: jest.fn(),
    getReturnUrl: jest.fn(),
    clearReturnUrl: jest.fn(),
    debugAuthState: jest.fn(),
}))

jest.mock('@/components/ui/checkbok', () => ({
    Checkbox: ({ onCheckedChange, ...props }: any) => (
        <input
            type="checkbox"
            data-testid="checkbox"
            onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
            {...props}
        />
    ),
}))

describe('SignInPage', () => {
    beforeEach(() => {
        // Manually clear mocks
        mockPush.mockClear()
        mockGet.mockClear()
        mockSignIn.mockClear()
        mockGetSession.mockClear()

        // Setup default mock values
        mockGetSession.mockResolvedValue(null);
        mockSignIn.mockResolvedValue({ error: null, ok: true, status: 200, url: '' });
        mockGet.mockReturnValue(null);
    })

    it('renders the sign in form correctly', () => {
        render(<SignInPage />)
        expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument()
        expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
    })

    it('shows validation errors for invalid inputs', async () => {
        render(<SignInPage />)
        const submitBtn = screen.getAllByRole('button').find(b => b.getAttribute('type') === 'submit')
        if (submitBtn) fireEvent.click(submitBtn)
        await waitFor(() => {
            expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument()
        })
    })

    it('handles successful credential login', async () => {
        mockSignIn.mockResolvedValue({ error: null, ok: true, status: 200, url: '' });
        mockGetSession.mockResolvedValue({
            user: { id: '123', name: 'John Doe', email: 'john@example.com', role: 'USER', image: 'img.jpg' },
            expires: '2099-01-01'
        });

        render(<SignInPage />)
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } })
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } })

        const submitBtn = screen.getAllByRole('button').find(b => b.getAttribute('type') === 'submit')
        if (submitBtn) fireEvent.click(submitBtn)

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith('credentials', expect.objectContaining({
                email: 'john@example.com',
                password: 'password123',
                redirect: false
            }))
        })

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/dashboard')
        }, { timeout: 3000 })
    })

    it('handles Google sign in', async () => {
        render(<SignInPage />)
        const googleBtn = screen.getByText(/Continue with Google/i)
        fireEvent.click(googleBtn)

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith('google', expect.objectContaining({ redirect: true }))
        })
    })
})