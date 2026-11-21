const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// Only these roles can be chosen when signing up.
// ADMIN is not allowed here, so nobody can make themselves an admin.
const ALLOWED_ROLES = ['STUDENT', 'INSTITUTION'];

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check that the required fields are present
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Name, email and password are required' });
    }

    if (String(password).length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters' });
    }

    const userRole = role ? String(role).toUpperCase() : 'STUDENT';
    if (!ALLOWED_ROLES.includes(userRole)) {
      return res
        .status(400)
        .json({ message: 'Role must be STUDENT or INSTITUTION' });
    }

    // 2. Check that this email is not already used
    const cleanEmail = String(email).trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // 3. Hash the password (never store the real password)
    const passwordHash = await bcrypt.hash(String(password), 10);

    // 4. Save the new user in PostgreSQL
    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: cleanEmail,
        passwordHash,
        role: userRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        onboardingStatus: true,
        createdAt: true,
      },
    });

    res.status(201).json({ message: 'Registration successful', user });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check that both fields are present
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    // 2. Find the user by email
    const cleanEmail = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // 3. Compare the typed password with the saved hash.
    // The same message is used for "no such user" and "wrong password",
    // so nobody can use this route to find out which emails exist.
    const passwordIsCorrect = user
      ? await bcrypt.compare(String(password), user.passwordHash)
      : false;

    if (!passwordIsCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 4. Create the login token (JWT)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingStatus: user.onboardingStatus,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        onboardingStatus: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('GetMe error:', error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { register, login, getMe };