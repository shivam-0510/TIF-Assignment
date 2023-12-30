const communityModel = require("../Models/community.model");
const userModel = require("../Models/user.model");
const memberModel = require("../Models/member.model");
const roleModel = require("../Models/role.model");
const snowflake = require("../Id.Generator");
const validationSchema = require("../Validation/schema");

const ITEMS_PER_PAGE = 10;

//CREATE COMMUNITY
exports.newCommunity = async (req, res) => {
  try {
    const { name } = req.body;

    //Check for valid input
    const { error } = validationSchema.communitySchema.validate({ name });
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

    const newComm = new communityModel({
      id: snowflake.generateId(),
      name: name,
      slug: name,
      owner: req.user.id,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    await newComm.save();

    const role = await roleModel.findOne({ name: "Community Admin" });
    const firstMember = new memberModel({
      id: snowflake.generateId(),
      community: newComm.id,
      user: req.user.id,
      role: role.id,
      created_at: Date.now(),
    });

    await firstMember.save();

    const data = {
      id: newComm.id,
      name: newComm.name,
      slug: newComm.slug,
      owner: newComm.owner,
      created_at: newComm.created_at,
      updated_at: newComm.updated_at,
    };

    return res.status(200).json({ status: true, content: { data: data } });
  } catch (err) {
    return res.status(400).json({ message: { err } });
  }
};

//GET ALL COMMUNITIES
exports.getAllCommunity = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const totalComms = await communityModel.countDocuments({});
    const totalPages = Math.ceil(totalComms / ITEMS_PER_PAGE);

    const comms = await communityModel
      .find({})
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    const allComms = [];
    for (const comm of comms) {
      const owner = await userModel.findOne({ id: comm.owner });
      //console.log(owner);
      const resultComm = {
        id: comm.id,
        name: comm.name,
        slug: comm.slug,
        owner: owner ? { id: owner.id, name: owner.name } : null,
        created_at: comm.created_at,
        updated_at: comm.updated_at,
      };
      allComms.push(resultComm);
    }

    return res.status(200).json({
      status: true,
      content: {
        meta: { total: totalComms, pages: totalPages, page: page },
        data: allComms,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

//Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const totalComms = await communityModel.countDocuments({});
    const totalPages = Math.ceil(totalComms / ITEMS_PER_PAGE);

    const { id } = req.params;
    const getMembers = await memberModel
      .find({ community: id })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    const allMembers = [];

    for (const member of getMembers) {
      const user = await userModel.findOne({ id: member.user });
      const role = await roleModel.findOne({ id: member.role });
      const resultMember = {
        id: member.id,
        community: member.community,
        user: user ? { id: user.id, name: user.name } : null,
        role: role ? { id: role.id, name: role.name } : null,
        created_at: member.created_at,
      };
      allMembers.push(resultMember);
    }

    return res.status(200).json({
      status: true,
      content: {
        meta: { total: totalComms, pages: totalPages, page: page },
        data: allMembers,
      },
    });
  } catch (err) {
    return res.status(400).json({ message: { err } });
  }
};

//Get admin communities
exports.getAdminJoinedComms = async (req, res) => {
  try {
    const { id } = req.user;

    const page = parseInt(req.query.page) || 1;
    const totalComms = await communityModel.countDocuments({});
    const totalPages = Math.ceil(totalComms / ITEMS_PER_PAGE);

    const adminComm = await communityModel
      .find({ owner: id })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    const allAdminComms = [];
    for (comm of adminComm) {
      const resultComm = {
        id: comm.id,
        name: comm.name,
        slug: comm.slug,
        owner: comm.owner,
        created_at: comm.created_at,
        updated_at: comm.updated_at,
      };
      allAdminComms.push(resultComm);
    }

    return res.status(200).json({
      status: true,
      content: {
        meta: { total: totalComms, pages: totalPages, page: page },
        data: allAdminComms,
      },
    });
  } catch (err) {
    return res.status(400).json({ error: { err } });
  }
};

//Get me joined communities
exports.getMeComms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const totalComms = await communityModel.countDocuments({});
    const totalPages = Math.ceil(totalComms / ITEMS_PER_PAGE);

    const { id } = req.user;
    const meComms = await memberModel
      .find({ user: id })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    const meAllComms = [];
    for (comm of meComms) {
      const commId = comm.community;
      const findComm = await communityModel.findOne({ id: commId });
      const findOwner = await userModel.findOne({ id: findComm.owner });
      const resultComm = {
        id: findComm.id,
        name: findComm.name,
        slug: findComm.slug,
        owner: findOwner ? { id: findOwner.id, name: findOwner.name } : null,
        created_at: findComm.created_at,
        updated_at: findComm.updated_at,
      };
      meAllComms.push(resultComm);
    }
    return res.status(200).json({
      status: true,
      content: {
        meta: { total: totalComms, pages: totalPages, page: page },
        data: meAllComms,
      },
    });
  } catch (err) {
    return res.status(400).json({ error: { err } });
  }
};
