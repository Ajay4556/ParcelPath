import User from '../Models/User.js';

export const submitReview = async (req, res) => {
  try {
    const { userId, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid rating provided',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    user.reviews.push(rating);
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Review submitted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};