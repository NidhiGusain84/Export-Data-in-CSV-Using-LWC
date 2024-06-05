import { LightningElement, wire } from 'lwc';
import fetchRecords from '@salesforce/apex/CsvController.fetchRecords';

const COLUMNS = [
    { label: 'Account Name', fieldName: 'Name' },
    { label: 'Website', fieldName: 'Website', type: 'url' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
    { label: 'Industry', fieldName: 'Industry', type: 'text' }
];

export default class CsvComponent extends LightningElement {
    accountData = [];
    columns = COLUMNS;
    @wire(fetchRecords) wiredFunction({ data, error }) {
        if (data) {
            console.log("Data", data);
            this.accountData = data;
        } else if (error) {
            console.log("Error", error);
        }
    }

    get checkRecord() {
        return this.accountData.length > 0 ? false : true;
    }

    clickHandler() {
        //If records are selected on data table
        let selectedRows = [];
        let downloadRecords = [];
        selectedRows = this.template.querySelector("lightning-datatable").getSelectedRows();
        //If records are selected or not, in case records are not selected download all records in table.
        if (selectedRows.length > 0) {
            downloadRecords = [...selectedRows];
        } else {
            downloadRecords = [...this.accountData];
        }

        //convert array into csv
        let csvFile = this.convertArrayToCsv(downloadRecords);
        this.createLinkForDownload(csvFile);

    }

    convertArrayToCsv(downloadRecords) {
        let csvHeader = Object.keys(downloadRecords[1]).toString();
        let csvBody = downloadRecords.map(currentItem => Object.values(currentItem).toString());
        let csvFile = csvHeader + '\n' + csvBody.join('\n');
        return csvFile;
    }

    createLinkForDownload(csvFile) {
        const downloadLink = document.createElement("a");
        downloadLink.href = "data:text/csv;charset=utf-8," + encodeURI(csvFile);
        downloadLink.target = '_blank';
        downloadLink.download = 'Account_Data.csv';
        downloadLink.click();
    }

}