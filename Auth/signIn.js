const userModel = require("../Models/user.model");
const validationSchema = require("../Validation/schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check for input validations
    const { error } = validationSchema.signInSchema.validate({
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
            code: "INVALID INPUT",
          },
        ],
      });
    }

    //Find user
    const findUser = await userModel.findOne({ email });

    //If user not found, then ask them to sign up
    if (!findUser) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "email",
            message: "User not found, please sign up",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }

    //Compare password
    bcrypt.compare(password, findUser.password, (err, result) => {
      if (!result) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              param: "password",
              message: "The credentials you provided are invalid.",
              code: "INVALID_CREDENTIALS",
            },
          ],
        });
      } else {
        const data = {
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
          created_at: findUser.created_at,
        };
        const token = jwt.sign(data, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        return res.status(200).json({
          status: true,
          content: { data, meta: { access_token: token } },
        });
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
