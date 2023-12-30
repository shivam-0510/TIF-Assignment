const userModel = require("../Models/user.model");

//Get me
exports.getMe = async (req, res) => {
  const email = req.user.email;
  const user = await userModel.findOne({ email });
  const data = {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  };
  return res.status(200).json({ status: true, content: data });
};
