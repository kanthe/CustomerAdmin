import * as React from 'react';
import ReactModal from 'react-modal';
import 'isomorphic-fetch';
import * as ReactDataGrid from 'react-data-grid';
import { Customer } from './CustomerPanel';
import { ItemPanel } from './ItemPanel';
import { CustomerItem } from './ItemPanel';
import { ModalHandler } from './ModalHandler';
import { CopyToClipboard } from 'react-copy-to-clipboard';

enum ItemType {
    "Rörlig månadsavgift" = 1,
    "Fast månadsavgift",
    "Serverhyra",
    "Tillvalsmodul",
    "Hyra stämpelterminal",
    "Engångsfaktura",
} 

interface ICustomerFormProps {
    customerRef: number;
    onCloseCustomerModal: any;
}

interface FetchDataStateEdit {
    columns: Array<any>;
    loading: boolean;
    rows: Array<any>;
    selectedIndexes: Array<any>;
    customerRef: number;
    customerName: string;
    webAdress: string;
    customerNumber: number;
    fortnoxNumber: number;
    version: string;
    salarySystem: string;
    startDate: string;
    endDate: string;
    comment: string;
    databaseName: string;
    quotedMaxEmployee: number;
    serverName: string;
    hotels: string[];
    ci: CustomerItem[];
    infoMessage: string;
    customerItemRef: number;
    showModal: boolean;
    showDeleteModal: boolean;
    showInfoModal: boolean;
    customerDeleted: boolean;
    cStringCopy: string;
}

interface ICustomerAndItems {
    customer: Customer;
    customerItems: CustomerItem;
}

const PopupCustomStyles = {
    overlay: {
        backgroundColor: 'black'
    },
    content: {
        zIndex: 100,
        left: '25%',
        right: '20px',
        bottom: 'auto',
        width: '75%',
        height: '75%',
        borderRadius: '25px',
        borderWidth: '3px',
        marginRight: '20px'
    }
}

export class EditCustomerPanel extends React.Component<ICustomerFormProps, FetchDataStateEdit> {
    public ModalHandlerItem = new ModalHandler({});
    public ModalHandlerInfo = new ModalHandler({});
    public ModalHandlerDelete = new ModalHandler({});

    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            loading: true,
            rows: [],
            selectedIndexes: [],
            customerRef: null,
            customerName: "",
            webAdress: "",
            customerNumber: null,
            fortnoxNumber: null,
            version: "",
            salarySystem: "",
            startDate: "",
            endDate: "",
            comment: "",
            databaseName: "",
            quotedMaxEmployee: null,
            serverName: "",
            hotels: [],
            ci: [],
            infoMessage: "",
            customerItemRef: 0,
            showModal: false,
            showDeleteModal: false,
            showInfoModal: false,
            customerDeleted: false,
            cStringCopy: "",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.ModalHandlerItem.handleCloseModal = this.ModalHandlerItem.handleCloseModal.bind(this);
        this.ModalHandlerInfo.handleCloseInfoModal = this.ModalHandlerInfo.handleCloseInfoModal.bind(this);
        this.ModalHandlerDelete.handleOpenDeleteModal = this.ModalHandlerDelete.handleOpenDeleteModal.bind(this);
        this.ModalHandlerDelete.handleCloseDeleteModal = this.ModalHandlerDelete.handleCloseDeleteModal.bind(this);
        this.handleDeleteModal = this.handleDeleteModal.bind(this);

        if (this.props.customerRef != 0) {
            this.getCustomer();
        }

    }

    getCustomer() {
        let myRequest = new Request('/api/Customer/GetCustomerAndItems?customerRef='
            + this.props.customerRef);
        fetch(myRequest)
            .then(response => response.json() as Promise<ICustomerAndItems>)
            .then(data => {
                this.setState({
                    loading: false,
                    customerRef: data[0].customer.customerRef,
                    customerName: data[0].customer.customerName,
                    webAdress: data[0].customer.webAdress,
                    customerNumber: data[0].customer.customerNumber,
                    fortnoxNumber: data[0].customer.fortnoxNumber,
                    version: data[0].customer.version,
                    salarySystem: data[0].customer.salarySystem,
                    startDate: data[0].customer.startDate,
                    endDate: data[0].customer.endDate,
                    comment: data[0].customer.comment,
                    databaseName: data[0].customer.databaseName,
                    quotedMaxEmployee: data[0].customer.quotedMaxEmployee,
                    serverName: data[0].customer.serverName,
                    hotels: data[0].customer.hotels,
                    rows: this.createRows(data[0].items),
                    ci: data[0].items,
                    cStringCopy: '"Data Source=' + data[0].customer.serverName +
                        '; User ID=timeplandb; Password=Fern4nd0; Initial Catalog=' + data[0].customer.databaseName + ';"',
                });
            });
    }

    public render() {

        if (this.state.customerDeleted) {
            this.setState({ customerDeleted: false });
            this.setState({ showDeleteModal: true });
            return null;
        }

        let headline = "";
        let contents = null;
        

        if (this.state.customerRef != null || this.props.customerRef == 0) {

            if (this.props.customerRef == 0) {
                headline = "Ny kund";
            }

            else {
                contents = this.state.loading
                    ? <p><em>Loading...</em></p>
                    : this.renderCustomerItemTable();
                headline = this.state.customerName;
            }

            return <div>
                <h2>{headline}
                    <button className="del-buttom" onClick={this.ModalHandlerDelete.handleOpenDeleteModal}>Radera kund</button>
                </h2>
                <this.ModalHandlerItem.PopupWindow
                    popupContent={<ItemPanel
                        customerRef={this.state.customerRef}
                        customerItemRef={this.state.customerItemRef}
                        onDeleteItem={this.handleDeleteItem}
                    />}
                    isOpen={this.state.showModal}
                    handleClose={this.ModalHandlerItem.handleCloseModal}
                    customStyle={this.ModalHandlerItem.PopupCustomStylesItem}
                />
                <this.ModalHandlerInfo.PopupWindow
                    popupContent={<p><br />{this.state.infoMessage}</p>}
                    isOpen={this.state.showInfoModal}
                    handleClose={this.ModalHandlerInfo.handleCloseInfoModal}
                    customStyle={this.ModalHandlerInfo.InfoWindowCustomStyles}
                />
                <this.ModalHandlerDelete.DeleteConfirmedWindow
                    isOpen={this.state.showDeleteModal}
                    handleCloseDelete={this.ModalHandlerDelete.handleCloseDeleteModal}
                    handleDelete={this.handleDeleteModal}
                />
                <hr />
                <form onSubmit={this.handleSubmit}>
                    <div className="form-wrap-left">
                        <label className="form-label">Kund
                    <input className="form-input" type="text"
                                name="customerName"
                                value={this.state.customerName}
                                onChange={this.handleChange} />
                        </label>
                        <br />
                        <br />
                        <label className="form-label">Kundnr
                    <input className="form-input" type="number"
                                name="customerNumber"
                                value={this.state.customerNumber}
                                onChange={this.handleChange} />
                        </label>
                        <br />
                        <br />
                        <label className="form-label">Fortnox nr
                    <input className="form-input" type="number"
                                name="fortnoxNumber"
                                value={this.state.fortnoxNumber}
                                onChange={this.handleChange} />
                        </label>
                        <br />
                        <br />
                        <label className="form-label">Max antal anställda
                    <input className="form-input" type="number"
                                name="quotedMaxEmployee"
                                value={this.state.quotedMaxEmployee}
                                onChange={this.handleChange} />
                        </label>
                        <br />
                        <br />
                        <label className="form-label">Startdatum
                    <input className="form-input" type="text"
                                name="startDate"
                                value={(this.state.startDate === null) ?
                                    "" : this.state.startDate.substr(0, 10)}
                            />
                        </label>
                        <br />
                        <br />
                        <label className="form-label">Slutdatum
                    <input className="form-input" type="text"
                                name="endDate"
                                value={(this.state.endDate === null) ?
                                    "" : this.state.endDate.substr(0, 10)}
                            />
                        </label>

                    </div>

                    <div className="form-wrap-right">

                        <label className="form-label textarea">Kommentar
                    <textarea className="form-input"
                                name="comment"
                                value={this.state.comment}
                                onChange={this.handleChange} />
                        </label>
                        <br />
                        <label className="form-label">Webbadress
                    <input className="form-input" type="text"
                                name="webAdress"
                                value={this.state.webAdress}
                                disabled />
                        </label>
                        <br />
                        <br />
                        <label className="form-label">Version
                    <input className="form-input" type="text"
                                name="version"
                                value={this.state.version}
                                disabled />
                        </label>
                        <br />
                        <br />
                        <label className="form-label">Lönesystem
                    <input className="form-input" type="text"
                                name="salarySystem"
                                value={this.state.salarySystem}
                                disabled />
                        </label>
                        <br />
                        <br />
                        <label className="form-label">Server
                    <input className="form-input" type="text"
                                name="serverName"
                                value={this.state.serverName}
                                disabled />
                        </label>
                        <br />
                        <br />
                        <label className="form-label">Databas
                    <input className="form-input" type="text"
                                name="databaseName"
                                value={this.state.databaseName}
                                disabled />
                        </label>
                        <br />
                        <br />
                        <label className="form-label textarea">Hotels
                    <textarea className="form-input"
                                name="hotels"
                                value={this.createHotelList()}
                                disabled />
                        </label>
                        <br />
                        <br />
                    </div>
                    <br />
                    <br />
                    <label className="form-label">
                        <input type="submit" className="mybutton" value="Spara" />
                    </label>

                </form>
                <button className="mybutton newbutton" onClick={this.newItem} >Ny Artikel</button>
                <CopyToClipboard onCopy={this.onCopy} text={this.state.cStringCopy}>
                    <button className="mybutton mybutton-connection-string">Generera connection string</button>
                </CopyToClipboard>
                <div className="wrap-below-form">
                    <hr />
                    <h3>Artiklar</h3>
                    {contents}
                </div>
            </div>
        }

        this.ModalHandlerInfo.setState({closeButtonDisabled: false});
        return null;
    }

    renderCustomerItemTable = () => {

        return (
            <ReactDataGrid
                columns={[
                    {
                        key: 'itemRef',
                        name: 'Typ av artikel',
                        width: 150
                    },
                    {
                        key: 'itemPerHotel',
                        name: 'Artikel per hotell',
                        width: 130
                    },
                    {
                        key: 'fromDate',
                        name: 'Fråndatum',
                        width: 90
                    },
                    {
                        key: 'untilDate',
                        name: 'Tilldatum',
                        width: 90
                    },
                    {
                        key: 'minAmountPerMonth',
                        name: 'Minbelopp',
                        width: 90
                    },
                    {
                        key: 'maxAmountPerMonth',
                        name: 'Maxbelopp',
                        width: 90
                    },
                    {
                        key: 'pricePerItem',
                        name: 'Pris',
                        width: 50
                    },
                    {
                        key: 'invoicetext',
                        name: 'Fakturatext'
                    },
                    {
                        key: 'comment',
                        name: 'Kommentar'
                    },
                    {
                        key: 'prePaidMonths',
                        name: 'Mån i förskott',
                        width: 110
                    },
                    {
                        key: 'invoiceMonth',
                        name: 'Fakturamån',
                        width: 100
                    }
                ]}
                rowGetter={this.rowGetter}
                rowsCount={this.state.rows.length}
                minColumnWidth={120}
                enableCellSelect={true}
                onCellSelected={this.onCellSelected}
            />);
    };

    handleChange(event) {
        const target = event.target;
        const value = target.value;
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
                "CustomerRef": this.props.customerRef,
                "CustomerName": this.state.customerName,
                "WebAdress": this.state.webAdress,
                "customerNumber": this.state.customerNumber,
                "FortnoxNumber": this.state.fortnoxNumber,
                "SalarySystem": this.state.salarySystem,
                "StartDate": this.state.startDate,
                "EndDate": this.state.endDate,
                "Comment": this.state.comment,
                "DatabaseName": this.state.databaseName,
                "ServerName": this.state.serverName,
                "Version": this.state.version,
                "QuotedMaxEmployee": this.state.quotedMaxEmployee,
                "Hotels": this.state.hotels,
                "Flag": this.state.infoMessage
            })
        };
        fetch('/api/Customer/Update', myRequest)
            .then(response => response.json() as Promise<string>)
            .then(data => {
                this.setState({
                    infoMessage: data
                });
            });
        this.setState({ showInfoModal: true });

        if (this.props.customerRef == 0) {
            this.setState({ customerDeleted: true });
            this.props.onCloseCustomerModal("Kund tillagd");
        }

        event.preventDefault();
    }

    onCopy = () => {
        this.setState({ showInfoModal: true, infoMessage: "Kopierad" })
    }

    createRows(customerItems) {
        let rows = [];

        if (customerItems != null) {

            for (let i = 0; i < customerItems.length; i++) {
                let itemPerHotel = customerItems[i].itemPerHotel ? "Ja" : "Nej";
                rows.push({
                    customerItemRef: customerItems[i].customerItemRef,
                    customerRef: customerItems[i].customerRef,
                    itemPerHotel: itemPerHotel,
                    itemRef: ItemType[customerItems[i].itemRef],
                    fromDate: customerItems[i].fromDate === null ?
                        "" : customerItems[i].fromDate.substr(0, 10),
                    untilDate: customerItems[i].untilDate === null ?
                        "" : customerItems[i].untilDate.substr(0, 10),
                    minAmountPerMonth: customerItems[i].minAmountPerMonth,
                    maxAmountPerMonth: customerItems[i].maxAmountPerMonth,
                    pricePerItem: customerItems[i].pricePerItem,
                    invoicetext: customerItems[i].invoicetext,
                    comment: customerItems[i].comment,
                    prePaidMonths: customerItems[i].prePaidMonths,
                    invoiceMonth: customerItems[i].invoiceMonth
                });
            }
        }
        return rows;
    }

    createHotelList() {
        let hotelList = '';

        for (let h = 0; h < this.state.hotels.length; h++) {
            hotelList += this.state.hotels[h];
            h == this.state.hotels.length - 1 ? '' : hotelList += ', ';
        }
        return hotelList;
    }

    rowGetter = (i) => {
        return this.state.rows[i];
    };

    //onRowsSelected = (rows) => {
    //    this.setState({
    //        selectedIndexes: this.state.selectedIndexes.concat(
    //            rows.map(r => r.rowIdx))
    //    });
    //};

    //onRowsDeselected = (rows) => {
    //    this.setState({
    //        selectedIndexes: this.state.selectedIndexes.filter(
    //            i => rows.map(r => r.rowIdx).indexOf(i) === -1)
    //    });
    //};

    //handleGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    //    let rows = this.state.rows;

    //    for (let i = fromRow; i <= toRow; i++) {
    //        let rowToUpdate = rows[i];
    //        let updatedRow = { ...rowToUpdate, ...updated };
    //        rows[i] = updatedRow;
    //    }

    //    this.setState({ rows });
    //};

    onCellSelected = ({ rowIdx, idx }) => {
        this.setState({
            showModal: true,
            customerRef: this.state.customerRef,
            customerItemRef: this.state.rows[rowIdx].customerItemRef
        });
    };

    newItem = () => {
        this.setState({
            showModal: true,
            customerRef: this.state.customerRef,
            customerItemRef: 0
        });
    };

    deleteCustomer = () => {
        let myRequest = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "DELETE"
        };
        fetch('/api/Customer/Delete?customerRef='
            + this.props.customerRef, myRequest);
    };

    public handleDeleteItem = (x) => {
        this.ModalHandlerItem.handleCloseModal();
        this.setState({ infoMessage: x });
        this.setState({ showInfoModal: true });
        this.getCustomer();
        this.render();
    };

    handleDeleteModal() {
        this.deleteCustomer();
        this.setState({ customerDeleted: true });
        this.props.onCloseCustomerModal("Kund raderad");
    }
}