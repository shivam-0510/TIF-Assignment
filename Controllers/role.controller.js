const roleModel = require("../Models/role.model");
const snowflake = require("../Id.Generator");
const validationSchema = require("../Validation/schema");

//CREATE A ROLE
exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;
    const { error } = validationSchema.roleSchema.validate({ name });
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

    const newRole = new roleModel({
      id: snowflake.generateId(),
      name: name,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    const data = {
      id: newRole.id,
      name: newRole.name,
      created_at: newRole.created_at,
      updated_at: newRole.updated_at,
    };

    await newRole.save();
    return res.status(200).json({ status: true, content: { data: data } });
  } catch (err) {
    return res.status(400).json({ message: { err } });
  }
};

//GET ALL ROLE
const ITEMS_PER_PAGE = 10;

exports.getAllRole = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const totalRoles = await roleModel.countDocuments({});
    const totalPages = Math.ceil(totalRoles / ITEMS_PER_PAGE);

    const roles = await roleModel
      .find({})
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    const allRoles = [];
    for (role of roles) {
      allRoles.push({
        id: role.id,
        name: role.name,
        created_at: role.created_at,
        updated_at: role.updated_at,
      });
    }

    return res.status(200).json({
      status: true,
      content: {
        meta: { total: totalRoles, pages: totalPages, page: page },
        data: allRoles,
      },
    });
  } catch (err) {
    return res.status(400).json({ message: { err } });
  }
};
