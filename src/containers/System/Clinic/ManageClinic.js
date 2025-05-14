import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageClinic.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
import {
  createNewClinic,
  getAllClinic,
  deleteClinic,
  updateClinic,
} from "../../../services/userService";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt();

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      clinicList: [],
      editClinicId: null,
    };
  }

  async componentDidMount() {
    await this.fetchClinics();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }
  //
  handleOnChangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };
  //
  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };
  //
  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
    }
  };
  //
  handleSaveNewClinic = async () => {
    let { editClinicId } = this.state;
    let res;
    if (editClinicId) {
      res = await updateClinic({ ...this.state, id: editClinicId });
    } else {
      res = await createNewClinic(this.state);
    }

    if (res && res.errCode === 0) {
      toast.success(
        editClinicId ? "Cập nhật thành công" : "Thêm phòng khám thành công"
      );
      this.setState({
        name: "",
        imageBase64: "",
        address: "",
        descriptionHTML: "",
        descriptionMarkdown: "",
        editClinicId: null,
      });
      this.fetchClinics();      
    } else {
      toast.error("Thao tác thất bại");
    }
  };

  //
  handleEditClinic = (clinic) => {
    this.setState({
      name: clinic.name,
      address: clinic.address,
      descriptionHTML: clinic.descriptionHTML,
      descriptionMarkdown: clinic.descriptionMarkdown,
      imageBase64: "",
      editClinicId: clinic.id,
    });
  };
  //
  handleDeleteClinic = async (clinicId) => {
    let res = await deleteClinic(clinicId);
    if (res && res.errCode === 0) {
      toast.success("Xoá phòng khám thành công");
      this.fetchClinics();
    } else {
      toast.error("Xoá phòng khám thất bại");
    }
  };
  //
  fetchClinics = async () => {
    let res = await getAllClinic(); 
    if (res && res.errCode === 0) {
      this.setState({
        clinicList: res.data,
      });
    } else {
      toast.error("Lấy danh sách phòng khám thất bại");
    }
  };
  
  render() {
    return (
      <div className="manage-specialty-container">
        <div className="ms-title"><FormattedMessage id='manage-clinic.title'/></div>
        <div className="add-new-clinic row">
          <div className="col-6 form-group">
            <label><FormattedMessage id='manage-clinic.name-clinic'/></label>
            <input
              className="form-control"
              type="text"
              value={this.state.name}
              onChange={(event) => this.handleOnChangeInput(event, "name")}
            />
          </div>
          <div className="col-6 form-group">
            <label><FormattedMessage id='manage-clinic.pic-clinic'/></label>
            <input
              className="form-control-file"
              type="file"
              onChange={(event) => this.handleOnChangeImage(event)}
            />
          </div>
          <div className="col-6 form-group">
            <label><FormattedMessage id='manage-clinic.address-clinic'/></label>
            <input
              className="form-control"
              type="text"
              value={this.state.address}
              onChange={(event) => this.handleOnChangeInput(event, "address")}
            />
          </div>
          <div className="col-12">
            <MdEditor
              style={{ height: "300px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.descriptionMarkdown}
            />
          </div>
          <div className="col-12">
            <button
              className="btn-save-clinic"
              onClick={() => this.handleSaveNewClinic()}
            >
              <FormattedMessage id='manage-clinic.save'/>
            </button>
          </div>
        </div>
        <div className="clinic-list mt-4">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th><FormattedMessage id='manage-clinic.name'/></th>
                <th><FormattedMessage id='manage-clinic.address'/></th>
                <th><FormattedMessage id='manage-clinic.action'/></th>
              </tr>
            </thead>
            <tbody>
              {this.state.clinicList.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.address}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => this.handleEditClinic(item)}
                    >
                      <FormattedMessage id='manage-clinic.edit'/>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => this.handleDeleteClinic(item.id)}
                    >
                      <FormattedMessage id='manage-clinic.delete'/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
