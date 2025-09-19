import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        emailVerified: true,
        image: true,
        isActive: true,
        createdAt: true,
        role: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Format user data for frontend
    const profileData = {
      id: user.id,
      firstName: user.name?.split(' ')[0] || '',
      lastName: user.name?.split(' ').slice(1).join(' ') || '',
      email: user.email,
      phone: user.phoneNumber || '',
      dateOfBirth: '', // Add this field to your User model if needed
      gender: '', // Add this field to your User model if needed
      address: '', // Add this field to your User model if needed
      city: '', // Add this field to your User model if needed
      profileImage: user.image,
      emailVerified: !!user.emailVerified,
      phoneVerified: !!user.phoneNumber, // Assuming if phone exists, it's verified
      memberSince: user.createdAt.toISOString().split('T')[0],
      role: user.role
    }

    return NextResponse.json(profileData)

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, phoneNumber, dateOfBirth, gender, address, city } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: `${firstName} ${lastName}`.trim(),
        phoneNumber: phoneNumber || null,
        // Add other fields to your User model if needed
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        emailVerified: true,
        image: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
