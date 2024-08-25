import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ReportsService } from 'src/app/reports/reports.service';

@Component({
  selector: 'app-paid-members-by-province',
  templateUrl: './paid-members-by-province.page.html',
  styleUrls: ['./paid-members-by-province.page.scss'],
})
export class PaidMembersByProvincePage implements OnInit {

  constructor(
    private reportsService: ReportsService
  ) { }

  // Users
  provinces: any[] = [];
  loading = true;
  exported = false;

  ngOnInit() {
  }
  loadReport() {
    this.reportsService.loadPaidMembersByProvince();
    this.loading = true;
  }

  ionViewDidEnter() {
    this.reportsService.usersLoaded.subscribe(
      (provinces: any[]) => {
        this.provinces = provinces;
        this.exportXLSX();
      }
    )
    this.loadReport();
  }

  exportXLSX() {
    const headers = ['Name', 'Surname', 'Email Address', 'Cellphone Number'];
    let rows = [];

    this.provinces.forEach(province => {
      rows.push([province.name]);
      rows.push(headers);
      province.users.forEach(user => {
        rows.push([user.name, user.surname, user.email, user.cellNumber])
      });
      rows.push([]);
    });

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(rows);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Paid Shooters By Province');

    /* save to file */
    XLSX.writeFile(wb, 'Paid Members By Province.xlsx');
    this.exported = true;
    this.loading = false;
  }
}
