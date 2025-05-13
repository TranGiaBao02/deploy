import db from '../models/index'
import CRUDServices from '../services/CRUDServices';
let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        
        return res.render('homePage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e)
    }
}

let getAboutPage = (req, res) => {
    return res.render('./test/about.ejs');
}

let getCRUDPage = (req, res) => {
    return res.render('./test/CRUDPage.ejs');
}

let postCRUD = async (req, res) => {
    let message = await CRUDServices.createNewUser(req.body);
    console.log(message);
    return res.send('post crud from server');
}

let getCRUD = async (req, res) => {
    let data = await CRUDServices.getAllUser();
    return res.render('display-crud.ejs', {
        dataTable: data
    });
}
// cập nhật thông tin
let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if(userId){
        let userData = await CRUDServices.getUserInfoById(userId);
        return res.render('edit-crud.ejs', {
            user: userData,
        });
    }
    else{
        return res.send('Users không tồn tại!');
    }
}
// info toàn bộ user
let putCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDServices.updateUserData(data);
    return res.render('display-crud.ejs', {
        dataTable: allUser
    })
}
//
let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if(id){
        await CRUDServices.deleteUserById(id);
        return res.send('Xóa người dùng thành công!');
    }
    else {
        return res.send('Xóa người dùng thất bại!');
    }
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUDPage: getCRUDPage,
    postCRUD: postCRUD,
    getCRUD: getCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
    // handleCreateNewUser: handleCreateNewUser,
} 