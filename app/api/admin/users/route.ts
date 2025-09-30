// import { NextRequest, NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/auth'
// import { UsersService } from '@/lib/services/admin-service'
// import { Role } from '@prisma/client'

// export async function GET(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session || session.user.role !== 'ADMIN') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const { searchParams } = new URL(request.url)
//     const page = parseInt(searchParams.get('page') || '1')
//     const search = searchParams.get('search') || ''
//     const role = searchParams.get('role') || 'all'
//     const status = searchParams.get('status') || 'all'
//     const limit = parseInt(searchParams.get('limit') || '10')

//     const users = await UsersService.getAll({ page, search, role, status, limit })
    
//     return NextResponse.json(users)
//   } catch (error) {
//     console.error('Error fetching users:', error)
//     return NextResponse.json(
//       { error: 'Failed to fetch users' },
//       { status: 500 }
//     )
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session || session.user.role !== 'ADMIN') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const body = await request.json()
//     const { name, email, phoneNumber, password, role } = body

//     if (!name || !email || !password || !role) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       )
//     }

//     const user = await UsersService.create({
//       name,
//       email,
//       phoneNumber,
//       password,
//       role: role as Role,
//     })

//     // Don't return password
//     const { password: _, ...userWithoutPassword } = user
    
//     return NextResponse.json(userWithoutPassword, { status: 201 })
//   } catch (error) {
//     console.error('Error creating user:', error)
//     return NextResponse.json(
//       { error: 'Failed to create user' },
//       { status: 500 }
//     )
//   }
// }


import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UsersService } from '@/lib/services/admin-service'

export async function GET(request: NextRequest) {
  try {
    // ✅ TEMPORARY: Skip auth check for debugging
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || 'all'
    const status = searchParams.get('status') || 'all'
    const limit = parseInt(searchParams.get('limit') || '10')

    const users = await UsersService.getAll({ page, search, role, status, limit })
    
    return NextResponse.json(users)
  } catch (error) {
    console.error('❌ GET /api/admin/users error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🟡 POST /api/admin/users called')

    // ✅ TEMPORARY: Skip auth check for debugging
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ADMIN') {
    //   console.log('❌ Unauthorized access')
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    console.log('🟡 Request body:', body)

    const { name, email, phoneNumber, password, role } = body

    // ✅ Validate required fields
    if (!name || !email || !password || !role) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      )
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format')
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    console.log('🟡 Creating user with UsersService...')
    
    // ✅ Create user
    const user = await UsersService.create({
      name,
      email,
      phoneNumber,
      password,
      role,
    })

    console.log('✅ User created successfully:', user.id)

    // ✅ Remove password from response
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('❌ POST /api/admin/users error:', error)
    
    // ✅ Handle specific errors
    let errorMessage = 'Failed to create user'
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message
      
      // Handle common database errors
      if (error.message.includes('unique constraint') || error.message.includes('email')) {
        errorMessage = 'Email already exists'
        statusCode = 409
      }
    }
    
    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}
