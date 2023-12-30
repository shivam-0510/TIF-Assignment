const userModel = require("../Models/user.model");
const communityModel = require("../Models/community.model");
const memberModel = require("../Models/member.model");
const roleModel = require("../Models/role.model");
const snowflake = require("../Id.Generator");
const validationSchema = require("../Validation/schema");

//CREATE A MEMBER
exports.createMember = async (req, res) => {
  try {
    //console.log(req.user);
    const { community, user, role } = req.body;

    //Check for validation
    const { error } = validationSchema.memberSchema.validate({
      community,
      user,
      role,
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

    const communityFind = await communityModel.findOne({ id: community });
    const userFind = await userModel.findOne({ id: user });
    const roleFind = await roleModel.findOne({ id: role });

    //If the user is not the owner of the community
    const communityOwner = communityFind.owner;
    if (communityOwner != req.user.id) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "You are not authorized to perform this action.",
            code: "NOT_ALLOWED_ACCESS",
          },
        ],
      });
    }

    //If member already exists
    const memberFind = await memberModel.findOne({
      community: community,
      user: user,
    });
    if (memberFind) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "member",
            message: "Member already exists",
            code: "RESOURCE_ALREADY_EXISTS",
          },
        ],
      });
    }

    //If community doesn't exist

    if (!communityFind) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "community",
            message: "Community not found",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }

    //If user doesn't exist
    if (!userFind) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "user",
            message: "User not found",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }

    //If role doesn't exist
    if (!roleFind) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "role",
            message: "Role not found",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }

    //Create new member
    const newMember = new memberModel({
      id: snowflake.generateId(),
      community: community,
      user: user,
      role: role,
      created_at: Date.now(),
    });

    await newMember.save();

    const data = {
      id: newMember.id,
      community: newMember.community,
      user: newMember.user,
      role: newMember.role,
      created_at: newMember.created_at,
    };

    return res.status(200).json({ status: true, content: { data: data } });
  } catch (err) {
    console.log(err);
  }
};

//Delete a user
exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const findAdmin = await memberModel.findOne({ user: req.user.id });
    const role = await roleModel.findOne({ id: findAdmin.role });
    if (role.name == "Community Admin" || role.name == "Community Moderator") {
      const memberFind = await memberModel.findOne({ id: id });
      if (!memberFind) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "Member not found",
              code: "RESOURCE_NOT_FOUND",
            },
          ],
        });
      }
      await memberModel.deleteOne({ id: id });
      return res.status(200).json({ status: true });
    } else {
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "You are not authorized to perform this action.",
            code: "NOT_ALLOWED_ACCESS",
          },
        ],
      });
    }
  } catch (err) {
    return res.status(400).json({ error: { err } });
  }
};
