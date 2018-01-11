import * as React from 'react';
import ReactModal from 'react-modal';
import 'isomorphic-fetch';
import * as ReactDataGrid from 'react-data-grid';
import { Toolbar, Data } from 'react-data-grid-addons';
import { EditCustomerPanel } from './EditCustomerPanel';
import { ModalHandler } from './ModalHandler';
import PropTypes from 'prop-types';

interface FetchDataStateCustomer {
    columns: Array<any>;
    customers: Customer[];
    loading: boolean;
    rows: Array<any>;
    filters: Object;
    infoMessage: string;
    sortColumn: any;
    sortDirection: string;
    showModal: boolean;
    showInfoModal: boolean;
    customerRef: number;
}

export class Customer {
    customerRef: number;
    customerName: string;
    adress: string;
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
}

export class CustomerPanel extends React.Component<{}, FetchDataStateCustomer> {
    public ModalHandlerCustomer = new ModalHandler({});
    public ModalHandlerInfo = new ModalHandler({});

    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            customers: [],
            loading: true,
            rows: [],
            filters: null,
            infoMessage: "",
            sortColumn: null,
            sortDirection: "",
            showModal: false,
            showInfoModal: false,
            customerRef: 0
        }
        this.ModalHandlerCustomer.handleCloseModal = this.ModalHandlerCustomer.handleCloseModal.bind(this);
        this.ModalHandlerInfo.handleCloseInfoModal = this.ModalHandlerInfo.handleCloseInfoModal.bind(this);

        this.getCustomers();
    }

    getCustomers() {
        let myRequest = new Request('/api/Customer/GetAll');
        fetch(myRequest)
            .then(response => response.json() as Promise<Customer[]>)
            .then(data => {
                this.setState({
                    customers: data,
                    loading: false,
                    rows: this.createRows(data)
                });
            });
    }

    public render() {

        if (this.state.customers.length != 0) {
            let contents = this.state.loading
                ? <p><em>Loading...</em></p>
                : this.renderCustomerTable(this.state.customers);

            return <div>
                <h1>Kundlista</h1>
                <p>Klicka på kundnamnet för detaljer om kunden.</p>
                <button className="mybutton mybutton-customerlist" onClick={this.newCustomer}>Ny kund</button>
                <this.ModalHandlerCustomer.PopupWindow
                    popupContent={<EditCustomerPanel
                        customerRef={this.state.customerRef}
                        onCloseCustomerModal={this.handleDeleteCustomer}
                    />}
                    isOpen={this.state.showModal}
                    handleClose={this.ModalHandlerCustomer.handleCloseModal}
                    customStyle={this.ModalHandlerCustomer.PopupCustomStyles}
                />
                <this.ModalHandlerInfo.PopupWindow
                    popupContent={<p><br />{this.state.infoMessage}</p>}
                    isOpen={this.state.showInfoModal}
                    handleClose={this.ModalHandlerInfo.handleCloseInfoModal}
                    customStyle={this.ModalHandlerInfo.InfoWindowCustomStyles}
                />
                {contents}
            </div>
        }
        return null;
    }

    renderCustomerTable = (customers: Customer[]) => {
        return (
            <div>
                <ReactDataGrid
                    columns={[
                        {
                            key: 'customerName',
                            name: 'Kund',
                            resizable: true,
                            filterable: true,
                            sortable: true
                        },
                        {
                            key: 'adress',
                            name: 'Webbadress',
                            resizable: true,
                            filterable: true,
                            sortable: true,
                            width: 200
                        },
                        {
                            key: 'customerNumber',
                            name: 'Kundnr',
                            resizable: true,
                            filterable: true,
                            sortable: true,
                            width: 70
                        },
                        {
                            key: 'fortnoxNumber',
                            name: 'Fortnox nr',
                            resizable: true,
                            filterable: true,
                            sortable: true,
                            width: 85
                        },
                        {
                            key: 'version',
                            name: 'Version',
                            resizable: true,
                            filterable: true,
                            sortable: true,
                            width: 80
                        },
                        {
                            key: 'salarySystem',
                            name: 'Lönesystem',
                            resizable: true,
                            filterable: true,
                            sortable: true,
                            width: 125
                        },
                        {
                            key: 'startDate',
                            name: 'StartDatum',
                            resizable: true,
                            filterable: true,
                            sortable: true,
                            width: 90
                        },
                        {
                            key: 'endDate',
                            name: 'Slutdatum',
                            resizable: true,
                            filterable: true,
                            sortable: true,
                            width: 90
                        },
                        {
                            key: 'databaseName',
                            name: 'Databas',
                            resizable: true,
                            filterable: true,
                            sortable: true,
                            width: 140
                        },
                        {
                            key: 'serverName',
                            name: 'Server',
                            resizable: true,
                            filterable: true,
                            sortable: true,
                            width: 190
                        },
                        {
                            key: 'hotels',
                            name: 'Anläggningar',
                            resizable: true,
                            filterable: true,
                            sortable: true
                        }
                    ]}
                    rowGetter={this.rowGetter}
                    rowsCount={this.getSize()}
                    enableCellSelect={true}
                    onCellSelected={this.onCellSelected}
                    toolbar={<Toolbar enableFilter={true} />}
                    onGridSort={this.handleGridSort}
                    onAddFilter={this.handleFilterChange}
                    onClearFilters={this.onClearFilters}
                />
            </div>);
    };

    createRows(customers) {
        let rows = [];

        if (customers != null) {

            for (let i = 0; i < customers.length; i++) {
                rows.push({
                    customerRef: customers[i].customerRef,
                    customerName: customers[i].customerName,
                    adress: customers[i].webAdress,
                    customerNumber: customers[i].customerNumber,
                    fortnoxNumber: customers[i].fortnoxNumber,
                    version: customers[i].version,
                    salarySystem: customers[i].salarySystem,
                    startDate: customers[i].startDate === null ?
                        "" : customers[i].startDate.substr(0, 10),
                    endDate: customers[i].endDate === null ?
                        "" : customers[i].endDate.substr(0, 10),
                    databaseName: customers[i].databaseName,
                    serverName: customers[i].serverName,
                    hotels: this.createHotelList(customers[i])
                });
            }
        }
        return rows;
    }

    createHotelList(customer) {
        let hotelList = '';

        for (let h = 0; h < customer.hotels.length; h++) {
            hotelList += customer.hotels[h];
            h == customer.hotels.length - 1 ? '' : hotelList += ', ';
        }
        return hotelList;
    }

    rowGetter = (index) => {
        return this.getRows()[index];
    };

    getRows() {
        return Data.Selectors.getRows(this.state);
    }

    getSize() {
        return this.getRows().length;
    }

    handleGridSort = (sortColumn, sortDirection) => {

        this.setState({ sortColumn: sortColumn, sortDirection: sortDirection });
    };

    handleFilterChange = (filter) => {
        let newFilters = { ...this.state.filters };

        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }
        this.setState({ filters: newFilters });
    };

    onClearFilters = () => {
        this.setState({ filters: {} });
    };

    onCellSelected = ({ rowIdx, idx }) => {

        if (idx === 1 && this.state.rows[rowIdx].adress != "") {
            window.open(this.state.rows[rowIdx].adress);
        }
        else {
            let row = this.getRows()[rowIdx];
            this.setState({ showModal: true, customerRef: row.customerRef });
        }
    };

    newCustomer = () => {
        this.setState({ showModal: true, customerRef: 0 });
    };

    public handleDeleteCustomer = (x) => {
        this.ModalHandlerCustomer.handleCloseModal();
        this.setState({ infoMessage: x });
        this.setState({ showInfoModal: true });
        this.getCustomers();
        this.render();
    };
}

