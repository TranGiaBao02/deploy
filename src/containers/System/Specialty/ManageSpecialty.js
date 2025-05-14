import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './ManageSpecialty.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils } from '../../../utils';
import { createNewSpecialty, getAllSpecialty, deleteSpecialty, updateSpecialty } from '../../../services/userService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            specialties: [],
            isEditing: false,
            editingId: null, 
        };
    }

    async componentDidMount() {
        this.fetchSpecialties();
    }

    fetchSpecialties = async () => {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                specialties: res.data,
            });
        } else {
            toast.error("Lấy danh sách chuyên khoa thất bại");
        }
    };

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy,
        });
    };

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        });
    };

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        if (data && data[0]) {
            let file = data[0];
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            });
        }
    };

    handleSaveNewSpecialty = async () => {
        let { editingId, name, descriptionHTML, descriptionMarkdown, imageBase64 } = this.state;  
        let res;        
        if (editingId) {
            res = await updateSpecialty({
                id: editingId, 
                name, 
                descriptionHTML, 
                descriptionMarkdown, 
                imageBase64
            });
        } else {
            res = await createNewSpecialty({
                name, 
                descriptionHTML, 
                descriptionMarkdown, 
                imageBase64
            });
        }

        if (res && res.errCode === 0) {
            toast.success(
                editingId ? "Cập nhật thành công" : "Thêm chuyên khoa thành công"
            );
            this.setState({
                name: "",
                imageBase64: "",
                descriptionHTML: "",
                descriptionMarkdown: "",
                editingId: null, 
            });
            this.fetchSpecialties();
        } else {
            toast.error(`Thao tác thất bại: ${res.errMessage || 'Lỗi không xác định'}`);
        }
    };

    handleDeleteSpecialty = async (specialtyId) => {
        let res = await deleteSpecialty(specialtyId);
        if (res && res.errCode === 0) {
            toast.success("Xoá chuyên khoa thành công");
            this.fetchSpecialties();
        } else {
            toast.error("Xoá chuyên khoa thất bại");
        }
    };

    handleEditSpecialty = (specialty) => {
        console.log('che: ', specialty);
        
        this.setState({
            name: specialty.name,
            descriptionHTML: specialty.descriptionHTML,
            descriptionMarkdown: specialty.descriptionMarkdown,
            imageBase64: specialty.img,
            editingId: specialty.id,  
        });
    };

    render() {
        return (
            <div className="manage-specialty-container">
                <div className="ms-title"><FormattedMessage id='manage-specialty.title'/></div>
                <div className="add-new-specialty-row">
                    <div className="col-6 form-group">
                        <label><FormattedMessage id='manage-specialty.name-specialty'/></label>
                        <input
                            className="form-group"
                            type="text"
                            value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label><FormattedMessage id='manage-specialty.pic-specialty'/></label>
                        <input
                            className="form-group-file"
                            type="file"
                            onChange={(event) => this.handleOnChangeImage(event)}
                        />
                    </div>
                    <div className="col-12">
                        <MdEditor
                            style={{ height: '300px' }}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className="col-12">
                        <button
                            className="btn-save-specialty"
                            onClick={this.handleSaveNewSpecialty}
                        >
                            {this.state.editingId ? <FormattedMessage id='manage-specialty.update'/> : <FormattedMessage id='manage-specialty.save'/>}
                        </button>
                    </div>
                </div>

                {/* Bảng hiển thị danh sách chuyên khoa */}
                <div className="specialty-table">
                    <table>
                        <thead>
                            <tr>
                                <th><FormattedMessage id='manage-specialty.name'/></th>
                                <th><FormattedMessage id='manage-specialty.action'/></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.specialties && this.state.specialties.length > 0 ? (
                                this.state.specialties.map((specialty) => (
                                    <tr key={specialty.id}>
                                        <td>{specialty.name}</td>
                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() => this.handleEditSpecialty(specialty)}
                                            >
                                                <FormattedMessage id='manage-specialty.edit'/>
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => this.handleDeleteSpecialty(specialty.id)}
                                            >
                                                <FormattedMessage id='manage-specialty.delete'/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3"><FormattedMessage id='manage-specialty.note'/></td>
                                </tr>
                            )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
