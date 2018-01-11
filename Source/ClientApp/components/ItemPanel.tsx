import * as React from 'react';
import 'isomorphic-fetch';
import * as $ from 'jquery';
import { ModalHandler } from './ModalHandler';
import ReactModal from 'react-modal';

interface JQuery {
    addClass(className: string): JQuery;
    attr(attributeName: string, value: string | number): JQuery;
}

interface ICustomerItemFormProps {
    customerRef: number;
    customerItemRef: number;
    onDeleteItem: any;
}

interface FetchDataState {
    customerItem: CustomerItem[];
    loading: boolean;
    customerItemRef: number;
    itemPerHotel: boolean;
    itemRef: number;
    fromDate: string;
    untilDate: string;
    minAmountPerMonth: number;
    maxAmountPerMonth: number;
    pricePerItem: number;
    invoicetext: string;
    comment: string;
    prePaidMonths: number;
    invoiceMonth: number;
    infoMessage: string;
    showItemInfoModal: boolean;
    showDeleteItemModal: boolean;
    itemDeleted: boolean;
    modalOpen: boolean;
}

export class CustomerItem {
    customerItemRef: number;
    itemPerHotel: boolean;
    itemRef: number;
    fromDate: string;
    untilDate: string;
    minAmountPerMonth: number;
    maxAmountPerMonth: number;
    pricePerItem: number;
    invoicetext: string;
    comment: string;
    prePaidMonths: number;
    invoiceMonth: number;
}

export class ItemPanel extends React.Component<ICustomerItemFormProps, FetchDataState> {
    public ModalHandlerItemInfo = new ModalHandler({});
    public ModalHandlerDeleteItem = new ModalHandler({});

    constructor(props) {
        super(props);
        this.state = {
            customerItem: null,
            loading: true,
            customerItemRef: null,
            itemPerHotel: false,
            itemRef: 1,
            fromDate: "",
            untilDate: "",
            minAmountPerMonth: null,
            maxAmountPerMonth: null,
            pricePerItem: null,
            invoicetext: "",
            comment: "",
            invoiceMonth: null,
            prePaidMonths: null,
            infoMessage: "initvalue",
            showItemInfoModal: false,
            showDeleteItemModal: false,
            itemDeleted: false,
            modalOpen: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.ModalHandlerItemInfo.handleCloseItemInfoModal = this.ModalHandlerItemInfo.handleCloseItemInfoModal.bind(this);
        this.ModalHandlerDeleteItem.handleOpenDeleteItemModal = this.ModalHandlerDeleteItem.handleOpenDeleteItemModal.bind(this);
        this.ModalHandlerDeleteItem.handleCloseDeleteItemModal = this.ModalHandlerDeleteItem.handleCloseDeleteItemModal.bind(this);
        this.handleDeleteItemModal = this.handleDeleteItemModal.bind(this);

        if (this.props.customerItemRef != 0) {
            let myRequest = new Request('/api/CustomerItem/GetOne?customerItemRef='
                + this.props.customerItemRef);
            fetch(myRequest)
                .then(response => response.json() as Promise<CustomerItem[]>)
                .then(data => {
                    this.setState({
                        customerItem: data,
                        loading: false,
                        customerItemRef: data[0].customerItemRef,
                        itemPerHotel: data[0].itemPerHotel,
                        itemRef: data[0].itemRef,
                        fromDate: data[0].fromDate,
                        untilDate: data[0].untilDate,
                        minAmountPerMonth: data[0].minAmountPerMonth,
                        maxAmountPerMonth: data[0].maxAmountPerMonth,
                        pricePerItem: data[0].pricePerItem,
                        invoicetext: data[0].invoicetext,
                        comment: data[0].comment,
                        prePaidMonths: data[0].prePaidMonths,
                        invoiceMonth: data[0].invoiceMonth
                    });
                });
        }
    }

    public render() {

        if (this.state.itemDeleted) {
            this.setState({ itemDeleted: false })
            return null;
        }

        let customerItemRef = this.props.customerItemRef;
        let headline = "Artikel ";

        if (this.state.customerItemRef != null || customerItemRef == 0) {

            if (this.state.fromDate.length > 10) {
                this.setState({ fromDate: this.state.fromDate.substring(0, 10) });
            }

            if (this.state.untilDate != null && this.state.untilDate.length > 10) {
                this.setState({ untilDate: this.state.untilDate.substring(0, 10) });
            }

            let minMaxAmountDisabled = true;

            if (this.state.itemRef == 1) {
                minMaxAmountDisabled = false;
            }

            if (customerItemRef == 0) {
                headline = "Ny artikel";
            }
            else {
                headline += this.state.customerItemRef;
            }

            return <div>
                <h2>{headline}
                    <button className="del-buttom" onClick={this.ModalHandlerDeleteItem.handleOpenDeleteItemModal}>Radera artikel</button>
                </h2>
                <this.ModalHandlerItemInfo.PopupWindow
                    popupContent={<p><br />{this.state.infoMessage}</p>}
                    isOpen={this.state.showItemInfoModal}
                    handleClose={this.ModalHandlerItemInfo.handleCloseItemInfoModal}
                    customStyle={this.ModalHandlerItemInfo.InfoWindowCustomStyles}
                />
                <this.ModalHandlerDeleteItem.DeleteConfirmedWindow
                    isOpen={this.state.showDeleteItemModal}
                    handleCloseDelete={this.ModalHandlerDeleteItem.handleCloseDeleteItemModal}
                    handleDelete={this.handleDeleteItemModal}
                />
                <hr />
                <form onSubmit={this.handleSubmit}>
                    <div className="form-wrap-left">
                    <label className="form-label">Typ av artikel
                    <select className="form-input" name="itemRef" value={this.state.itemRef} onChange={this.handleChange}>
                        <option value="1">Rörlig månadsavgift</option>
                        <option value="2">Fast månadsavgift</option>
                        <option value="3">Serverhyra</option>
                        <option value="4">Tillvalsmodul</option>
                        <option value="5">Hyra stämpelterminal</option>
                        <option value="6">Engångsfaktura</option>
                    </select>
                    </label>
                    <br />
                    <br />
                    <label className="form-label">Artikel per hotell
                    <input className="form-input form-checkbox" type="checkbox"
                        name="itemPerHotel"
                        checked={this.state.itemPerHotel}
                        onChange={this.handleChange} />
                    </label>
                    <br />
                    <br />
                    <label className="form-label">Fråndatum
                    <input className="form-input" type="date"
                        name="fromDate"
                        value={this.state.fromDate.toString()}
                        onChange={this.handleChange}
                        required />
                    <text className="form-info">Obligatiorisk</text>
                    </label>
                    <br />
                    <br />
                    <label className="form-label">Tilldatum
                    <input className="form-input" type="date"
                        name="untilDate"
                        value={this.state.untilDate}
                        onChange={this.handleChange} />
                    </label>
                    <br />
                    <br />
                    <label className="form-label">Minbelopp
                    <input className="form-input" type="number"
                        name="minAmountPerMonth"
                        value={this.state.minAmountPerMonth}
                        disabled={minMaxAmountDisabled}
                        onChange={this.handleChange} />
                        <text className="form-info">Bara vid rörlig månadsavgift</text>
                    </label>
                    <br />
                    <br />
                    <label className="form-label">MaxBelopp
                    <input className="form-input" type="number"
                        name="maxAmountPerMonth"
                        value={this.state.maxAmountPerMonth}
                        disabled={minMaxAmountDisabled}
                        onChange={this.handleChange} />
                        <text className="form-info">Bara vid rörlig månadsavgift</text>
                    </label>
                    <br />
                    <br />
                    </div>
                    <div className="form-wrap-right">
                    <label className="form-label">Pris
                    <input className="form-input" type="number"
                        name="pricePerItem"
                        value={this.state.pricePerItem}
                        required
                        onChange={this.handleChange} />
                    <text className="form-info">Obligatiorisk</text>

                    </label>
                    <br />
                    <br />
                    <label className="form-label">Fakturatext
                    <input className="form-input" type="text"
                        name="invoicetext"
                        value={this.state.invoicetext}
                        onChange={this.handleChange} />
                    </label>
                    <br />
                    <br />
                    <label className="form-label textarea">Kommentar
                    <textarea className="form-input"
                            name="comment"
                            value={this.state.comment}
                            onChange={this.handleChange} />
                    </label>
                    <br />
                    <br />
                    <label className="form-label">Månader i förskott
                    <select className="form-input" name="prePaidMonths" value={this.state.prePaidMonths} onChange={this.handleChange}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>
                    </label>
                    <br />
                    <br />
                    <label className="form-label">Fakturamånad
                    <select className="form-input" name="invoiceMonth" value={this.state.invoiceMonth} onChange={this.handleChange}>
                        <option value="1">Januari</option>
                        <option value="2">Februari</option>
                        <option value="3">Mars</option>
                        <option value="4">April</option>
                        <option value="5">Maj</option>
                        <option value="6">Juni</option>
                        <option value="7">Juli</option>
                        <option value="8">Augusti</option>
                        <option value="9">September</option>
                        <option value="10">Oktober</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                    </label>
                    </div>
                    <label className="form-label">
                        <input className="mybutton" type="submit" value="Spara" />
                    </label>
                </form>
                <div className="wrap-below-form">
                    <hr />
                </div>
            </div>
        }
        return null;
    }

    handleChange(event) {
        const target = event.target;
        let val;

        if (target.type === 'checkbox') {
            val = target.checked;
        }
        else {
            val = target.value;
        }

        const value = val;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        let myRequest = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify({
                "CustomerItemRef": this.props.customerItemRef,
                "CustomerRef": this.props.customerRef,
                "ItemPerHotel": this.state.itemPerHotel,
                "ItemRef": this.state.itemRef,
                "FromDate": this.state.fromDate,
                "UntilDate": this.state.untilDate,
                "MinAmountPerMonth": this.state.minAmountPerMonth,
                "MaxAmountPerMonth": this.state.maxAmountPerMonth,
                "PricePerItem": this.state.pricePerItem,
                "Invoicetext": this.state.invoicetext,
                "Comment": this.state.comment,
                "PrePaidMonths": this.state.prePaidMonths,
                "InvoiceMonth": this.state.invoiceMonth
            })
        };
        fetch('/api/CustomerItem/Update', myRequest)
            .then(response => response.json() as Promise<string[]>)
            .then(data => {
                this.setState({
                    loading: false,
                    infoMessage: data[0]
                })
            });
        this.setState({ showItemInfoModal: true });

        if(this.props.customerItemRef == 0) {
            this.setState({ itemDeleted: true });
            this.props.onDeleteItem("Artikel tillagd");
        }
        
        event.preventDefault();
    }

    deleteItem = () => {
        let myRequest = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "DELETE"
        };
        fetch('/api/CustomerItem/Delete?customerItemRef='
            + this.props.customerItemRef, myRequest);
    };

    handleDeleteItemModal() {
        this.deleteItem();
        this.setState({ itemDeleted: true });
        this.props.onDeleteItem("Artikel raderad");
    }
}
