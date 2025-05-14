import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";

import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersRedux: [],
    };
  }

  componentDidMount() {
    this.props.fetchUserRedux();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listUsers !== this.props.listUsers) {
      this.setState({ usersRedux: this.props.listUsers });
    }
  }
  //
  handleDeleteUser = (user) => {
    this.props.deleteUserRedux(user.id);
  };
  //
  handleEditUser = (user) => {
    this.props.handleEditUserFromParentKey(user);
  };
  // Life cycle
  render() {
    let { usersRedux } = this.state;
    let adminDoctorUsers = usersRedux.filter(user => user.roleId === "R1" || user.roleId === "R2");
    let normalUsers = usersRedux.filter(user => user.roleId === "R3");
  
    const renderTable = (title, users, showEdit) => (
      <>
        <h2>{title}</h2>
        <table>
          <thead>
            <tr>
              <th><FormattedMessage id="manage-user.email" /></th>
              <th><FormattedMessage id="manage-user.firstName" /></th>
              <th><FormattedMessage id="manage-user.lastName" /></th>
              <th><FormattedMessage id="manage-user.address" /></th>
              <th><FormattedMessage id="manage-user.phone" /></th>
              <th><FormattedMessage id="manage-user.action" /></th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((item, index) => (
                <tr key={index}>
                  <td>{item.email}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.address}</td>
                  <td>{item.phoneNumber}</td>
                  <td>
                    {showEdit && (
                      <button className="btn-edit" onClick={() => this.handleEditUser(item)}>
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                    )}
                    <button className="btn-delete" onClick={() => this.handleDeleteUser(item)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">Không có dữ liệu</td></tr>
            )}
          </tbody>
        </table>
      </>
    );
  
    return (
      <div className="manage-title">
        <FormattedMessage id="manage-user.title-table"/>
        {renderTable(<FormattedMessage id="manage-user.doctor-admin"/>,adminDoctorUsers, true)}
        {renderTable(<FormattedMessage id="manage-user.patient"/>, normalUsers, false)}
      </div>
    );
  }
  
}  

const mapStateToProps = (state) => {
  return {
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    deleteUserRedux: (id) => dispatch(actions.deleteAUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
