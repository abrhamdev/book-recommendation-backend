const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.]).{8,}$/;

const validateForm = (req, res, next) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (!fullName || fullName.trim().length < 3) {
    return res.status(400).json({ message: 'Full Name must be at least 3 characters long' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        'Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character',
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  next();
};

export default validateForm;
