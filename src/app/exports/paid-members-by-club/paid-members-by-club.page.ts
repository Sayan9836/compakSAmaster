import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ReportsService } from 'src/app/reports/reports.service';

@Component({
  selector: 'app-paid-members-by-club',
  templateUrl: './paid-members-by-club.page.html',
  styleUrls: ['./paid-members-by-club.page.scss'],
})
export class PaidMembersByClubPage implements OnInit {

  constructor(
    private reportsService: ReportsService
  ) { }

  // Users
  clubs: any[] = [];
  loading = true;
  exported = false;

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.reportsService.usersLoaded.subscribe(
      (clubs: any[]) => {
        this.clubs = clubs;
        this.exportXLSX();
      }
    );
    this.loadReport();
  }
  loadReport() {
    this.reportsService.loadPaidMembersByClub();
  }
  exportXLSX() {
    const headers = ['Name', 'Surname', 'Email Address', 'Cellphone Number'];
    let rows = [];

    this.clubs.forEach(club => {
      rows.push([club.name]);
      rows.push(headers);
      club.users.forEach(user => {
        rows.push([user.name, user.surname, user.email, user.cellNumber])
      });
      rows.push([]);
    });

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(rows);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Paid Shooters By Club');

    /* save to file */
    XLSX.writeFile(wb, 'Paid Members By Club.xlsx');
    this.exported = true;
    this.loading = false;
  }

}
