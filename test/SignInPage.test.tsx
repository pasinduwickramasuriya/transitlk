// import React from 'react'
// import { render, screen, fireEvent, waitFor } from '@testing-library/react'
// import '@testing-library/jest-dom'
// //  THIS LINE FIXES YOUR ERROR
// import { jest } from '@jest/globals' 
// import SignInPage from '@/app/auth/signin/page' 
// import { signIn, getSession } from 'next-auth/react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import * as authUtils from '@/utils/auth'

// // --- MOCKS ---

// // 1. Mock Next Auth
// jest.mock('next-auth/react', () => ({
//   signIn: jest.fn(),
//   getSession: jest.fn(),
// }))

// // 2. Mock Next Navigation
// jest.mock('next/navigation', () => ({
//   useRouter: jest.fn(),
//   useSearchParams: jest.fn(),
// }))

// // 3. Mock Sonner Toast
// jest.mock('sonner', () => ({
//   toast: {
//     success: jest.fn(),
//     error: jest.fn(),
//   },
// }))

// // 4. Mock Auth Utils
// jest.mock('@/utils/auth', () => ({
//   saveUser: jest.fn(),
//   getReturnUrl: jest.fn(),
//   clearReturnUrl: jest.fn(),
//   debugAuthState: jest.fn(),
// }))

// // 5. Mock UI Components
// jest.mock('@/components/ui/checkbok', () => ({
//   Checkbox: (props: any) => <input type="checkbox" {...props} />,
// }))

// describe('SignInPage', () => {
//   const mockPush = jest.fn()
//   // Cast mocks using jest.Mock type
//   const mockSignIn = signIn as unknown as jest.Mock
//   const mockGetSession = getSession as unknown as jest.Mock

//   beforeEach(() => {
//     jest.clearAllMocks()

//     // Setup Router Mock
//     (useRouter as unknown as jest.Mock).mockReturnValue({
//       push: mockPush,
//     })

//     // Setup SearchParams Mock
//     (useSearchParams as unknown as jest.Mock).mockReturnValue({
//       get: jest.fn().mockReturnValue(null),
//     })

//     // Setup Timers
//     jest.useFakeTimers()
//   })

//   afterEach(() => {
//     jest.useRealTimers()
//   })

//   it('renders the sign in form correctly', () => {
//     render(<SignInPage />)

//     expect(screen.getByText(/Sign In/i)).toBeInTheDocument()
//     expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
//     expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    
//     // Check for sign in button
//     const signInButtons = screen.getAllByText('Sign In')
//     expect(signInButtons.length).toBeGreaterThan(0)
    
//     expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument()
//   })

//   it('shows validation errors for invalid inputs', async () => {
//     render(<SignInPage />)

//     const submitBtn = screen.getAllByRole('button').find(b => b.getAttribute('type') === 'submit')
    
//     if (submitBtn) {
//         fireEvent.click(submitBtn)
//     }

//     await waitFor(() => {
//       expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument()
//       expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument()
//     })
//   })

//   it('handles successful credential login', async () => {
//     mockSignIn.mockResolvedValue({ error: null, ok: true, status: 200 })
    
//     mockGetSession.mockResolvedValue({
//       user: {
//         id: '123',
//         name: 'John Doe',
//         email: 'john@example.com',
//         role: 'USER',
//         image: 'img.jpg'
//       }
//     })

//     render(<SignInPage />)

//     fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } })
//     fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } })

//     const submitBtn = screen.getAllByRole('button').find(b => b.getAttribute('type') === 'submit')
//     if (submitBtn) fireEvent.click(submitBtn)

//     await waitFor(() => {
//       expect(mockSignIn).toHaveBeenCalledWith('credentials', {
//         email: 'john@example.com',
//         password: 'password123',
//         redirect: false,
//       })
//       expect(authUtils.saveUser).toHaveBeenCalled()
//     })

//     jest.runAllTimers()

//     expect(mockPush).toHaveBeenCalledWith('/dashboard')
//   })

//   it('handles failed credential login', async () => {
//     mockSignIn.mockResolvedValue({ error: 'Invalid credentials', ok: false, status: 401 })

//     render(<SignInPage />)

//     fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'wrong@example.com' } })
//     fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } })
    
//     const submitBtn = screen.getAllByRole('button').find(b => b.getAttribute('type') === 'submit')
//     if (submitBtn) fireEvent.click(submitBtn)

//     await waitFor(() => {
//       // Check if toast error was triggered (since we mocked sonner)
//       const { toast } = require('sonner')
//       expect(toast.error).toHaveBeenCalled()
//     })

//     expect(mockPush).not.toHaveBeenCalled()
//   })

//   it('handles Google sign in', async () => {
//     render(<SignInPage />)

//     const googleBtn = screen.getByText(/Continue with Google/i)
//     fireEvent.click(googleBtn)

//     await waitFor(() => {
//       expect(mockSignIn).toHaveBeenCalledWith('google', {
//         callbackUrl: '/dashboard',
//         redirect: true,
//       })
//     })
//   })

//   it('toggles password visibility', () => {
//     render(<SignInPage />)

//     const passwordInput = screen.getByLabelText(/Password/i)
//     expect(passwordInput).toHaveAttribute('type', 'password')

//     const toggleBtn = passwordInput.parentElement?.querySelector('button')

//     if (toggleBtn) {
//       fireEvent.click(toggleBtn)
//       expect(passwordInput).toHaveAttribute('type', 'text')

//       fireEvent.click(toggleBtn)
//       expect(passwordInput).toHaveAttribute('type', 'password')
//     }
//   })

//   it('redirects ADMIN users to /admin', async () => {
//     mockSignIn.mockResolvedValue({ error: null, ok: true })
//     mockGetSession.mockResolvedValue({
//       user: { name: 'Admin', email: 'admin@test.com', role: 'ADMIN' }
//     })

//     render(<SignInPage />)

//     fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'admin@test.com' } })
//     fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '123456' } })
    
//     const submitBtn = screen.getAllByRole('button').find(b => b.getAttribute('type') === 'submit')
//     if (submitBtn) fireEvent.click(submitBtn)

//     await waitFor(() => expect(authUtils.saveUser).toHaveBeenCalled())

//     jest.runAllTimers()

//     expect(mockPush).toHaveBeenCalledWith('/admin')
//   })
// })