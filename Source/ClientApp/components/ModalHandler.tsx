import * as React from 'react';
import ReactModal from 'react-modal';
import 'isomorphic-fetch';

export class FetchDataStateModalHandler {
    showModal: boolean;
    showInfoModal: boolean;
    showDeleteModal: boolean;
    showItemInfoModal: boolean;
    showDeleteItemModal: boolean;
    closeButtonDisabled: boolean;
}

export class ModalHandler extends React.Component<{}, FetchDataStateModalHandler> {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showInfoModal: false,
            showDeleteModal: false,
            showItemInfoModal: false,
            showDeleteItemModal: false,
            closeButtonDisabled: false,
        };
    }

    public PopupCustomStyles = {
        overlay: {
            backgroundColor: 'black'
        },
        content: {
            zIndex: 100,
            left: '20%',
            bottom: 'auto',
            width: '75%',
            height: '90%',
            borderWidth: '3px'
        }
    };

    public PopupCustomStylesItem = {
        overlay: {
            backgroundColor: 'black'
        },
        content: {
            zIndex: 100,
            left: '20%',
            bottom: 'auto',
            width: '65%',
            height: '65%',
            borderWidth: '3px'
        }
    };

    public InfoWindowCustomStyles = {
        content: {
            zIndex: 100,
            left: '40%',
            top: '20%',
            bottom: 'auto',
            width: '300px',
            height: '120px',
            borderRadius: '10px',
            borderWidth: '3px',
        }
    };

    public CloseButtonStyle = {
        content: {
            padding: '20px'
        }
    };

    public PopupWindow = ({ popupContent, isOpen, handleClose, customStyle }) => {
        return (
            <div>
                <ReactModal
                    isOpen={isOpen}
                    style={customStyle}
                    shouldCloseOnOverlayClick={true}
                    onRequestClose={handleClose}
                >
                    <button className="dialog-button" onClick={handleClose} disabled={this.state.closeButtonDisabled}>Stäng</button>
                    <div>
                        {popupContent}
                    </div>
                </ReactModal>
            </div>
        );
    };

    public DeleteConfirmedWindow = ({ isOpen, handleCloseDelete, handleDelete }) => {
        return (
            <div>
                <ReactModal
                    isOpen={isOpen}
                    style={this.InfoWindowCustomStyles}
                    shouldCloseOnOverlayClick={true}
                    onRequestClose={handleCloseDelete}
                >
                    <div>
                        <p>Kunden och tillhörande artiklar och fakturor kommer att raderas.</p>
                        <button  className="dialog-button" onClick={handleCloseDelete}>Stäng</button>
                        <button className="dialog-button dialog-red-button" onClick={handleDelete}>OK</button>
                    </div>
                </ReactModal>
            </div>
        );
    };

    handleCloseModal() {
        this.setState({
            showModal: false
        });
    }

    handleCloseInfoModal() {
        this.setState({
            showInfoModal: false
        });
    }

    handleOpenDeleteModal() {
        this.setState({
            showDeleteModal: true
        });
    }

    handleCloseDeleteModal() {
        this.setState({
            showDeleteModal: false
        });
    }

    handleCloseItemInfoModal() {
        this.setState({
            showItemInfoModal: false
        });
    }

    handleOpenDeleteItemModal() {
        this.setState({
            showDeleteItemModal: true
        });
    }

    handleCloseDeleteItemModal() {
        this.setState({
            showDeleteItemModal: false
        });
    }
}