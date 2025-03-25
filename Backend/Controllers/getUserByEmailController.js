import User from '../Models/SocialUserSchema.js';

export const getUserByEmailController = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};