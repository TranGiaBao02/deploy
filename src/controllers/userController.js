import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Vui lòng nhập đầy đủ thông tin!",
    });
  }
  let userData = await userService.handleUserLogin(email, password);
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};
//
let handleGetAllUsers = async (req, res) => {
  let id = req.query.id; // all, id
  // validate phia server
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
      users: [],
    });
  }
  let users = await userService.getAllUsers(id);
  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message);
};
// Sửa người dùng
let handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUserData(data);
  return res.status(200).json(message);
};
// Xóa người dùng
let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Nhập thiếu tham số",
    });
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
};
//
let getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (e) {
    console.log("Get all code err: ", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
//
let handleUpdateUserInfo = async (req, res) => {
  const { id, phoneNumber, address } = req.body;

  if (!id) {
    return res.status(400).json({
      errCode: 1,
      errMessage: 'Thiếu ID người dùng',
    });
  }

  let response = await userService.updateUserInfo(id, { phoneNumber, address });
  return res.status(200).json(response);
};
module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  getAllCode: getAllCode,
  handleUpdateUserInfo: handleUpdateUserInfo,
};
