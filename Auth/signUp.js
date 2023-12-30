const userModel = require("../Models/user.model");
const snowflake=require("../Id.Generator");
const validationSchema = require("../Validation/schema");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Check for input validations
    const { error } = validationSchema.signUpSchema.validate({
      name,
      email,
      password,
    });
    if (error) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: `${error.details[0].path[0]}`,
            message: `${
              error.details[0].path +
              "" +
              error.details[0].message.split('"')[2]
            }`,
            code: "INVALID_INPUT",
          },
        ],
      });
    }

    //If Account already exists
    const oldUser = await userModel.findOne({ email });
    if (oldUser) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "email",
            message: "User with this email address already exists.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    }

    //Creating new user
    const user_id = snowflake.generateId();
    const user = new userModel({
      id: user_id,
      name,
      email,
      password,
    });

    await user.save();

    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };

    const token = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    //res.cookie("jwt", token, { httpOnly: true });
    return res.status(200).json({
      status: true,
      content: { data, meta: { access_token: token } },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
