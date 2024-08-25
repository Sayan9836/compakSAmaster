import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../reports.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-paid-members-by-club',
  templateUrl: './paid-members-by-club.page.html',
  styleUrls: ['./paid-members-by-club.page.scss'],
})
export class PaidMembersByClubPage implements OnInit {

  constructor(
    private reportsService: ReportsService
  ) { }

  // Subs
  subs = [];

  // Users
  clubs: any[] = [];
  loading = false;

  ngOnInit() {
  }

  loadReport() {
    this.reportsService.loadPaidMembersByClub();
    this.loading = true;
  }

  ionViewDidEnter() {
    this.subs.push(
      this.reportsService.usersLoaded.subscribe(
        (clubs: any[]) => {
          this.loading = false;
          this.clubs = clubs;
        }
      )
    );
    this.loadReport();
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
  }

  ionViewDidLeave() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

}
