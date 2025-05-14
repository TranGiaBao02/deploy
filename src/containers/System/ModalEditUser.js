import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import _ from 'lodash'

class ModalEditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // isOpen: false,
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: ''
        };

    }
    
    componentDidMount() {
        let user = this.props.currentUser;
        if(user && !_.isEmpty(user)){ //check object !wrong = true
            this.setState({
                id: user.id,
                email: user.email,
                password: 'password',
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
            })
        }
        console.log('Didmount edit modal', this.props.currentUser)
    }
    
    toggle = () => {
        this.props.toggleFormParent();
    };

    handleOnChangeInput = (event, id) => {
        //
        let copyState = {...this.state};
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        }, () => {
            console.log('Copystate: ', copyState)
        })
    }
    //
    checkValidateInput = () => {
        let isValue = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
        for(let i = 0; i < arrInput.length; i++){
            console.log(this.state[arrInput[i]], arrInput[i])
            if(!this.state[arrInput[i]]){
                isValue = false;
                alert('Nhập thiếu trường: ' + arrInput[i] + ' .Vui lòng điền đầy đủ thông tin!');
                break;
            }
        }
        return isValue;
    }
    //
    handleAddNewUser = () => {
       let isValid = this.checkValidateInput();
       if(isValid === true){
        this.props.createNewUser(this.state);
       }
    }
    //
    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if(isValid === true) {
            this.props.editUser(this.state);
        }
    }
    render() {
        return (
            <>
                <Modal 
                    isOpen={this.props.isOpen} 
                    toggle={() => {this.toggle()}} 
                    className={'modal-user-container'}
                    size = 'lg'
                    centered
                    >
                    <ModalHeader toggle={() => {this.toggle()}}>Sửa thông tin  người dùng</ModalHeader>
                    <ModalBody>
                        <div className='modal-user-body'>
                            <div className='input-container'>
                                <label>Email</label>
                                <input 
                                type='text' 
                                onChange={(event) => {this.handleOnChangeInput(event, 'email')}} 
                                value={this.state.email}
                                disabled
                                />
                            </div>
                            <div className='input-container'>
                                <label>Password</label>
                                <input 
                                type='password' 
                                onChange={(event) => {this.handleOnChangeInput(event, 'password')}} 
                                value={this.state.password}
                                disabled
                                />
                            </div>
                            <div className='input-container'>
                                <label>FirstName</label>
                                <input 
                                type='text' 
                                onChange={(event) => {this.handleOnChangeInput(event, 'firstName')}} 
                                value={this.state.firstName}/>
                            </div>
                            <div className='input-container'>
                                <label>LastName</label>
                                <input 
                                type='text' 
                                onChange={(event) => {this.handleOnChangeInput(event, 'lastName')}} 
                                value={this.state.lastName}
                                />
                            </div>
                            <div className='input-container max-width-input'>
                                <label>Address</label>
                                <input 
                                type='text' 
                                onChange={(event) => {this.handleOnChangeInput(event, 'address')}} 
                                value={this.state.address}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                        color="primary px-2" 
                        onClick={() => {this.handleSaveUser()}}
                        >
                            Lưu
                        </Button>{' '}
                        <Button 
                        color="secondary px-2" 
                        onClick={() => {this.toggle()}}
                        >
                            Hủy
                        </Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
