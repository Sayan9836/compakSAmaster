import { Component, OnInit } from "@angular/core";
import { NoticesService } from "../services/notices.service";
import { ClubsService } from "./clubs.service";
import { Club } from "./club.model";

@Component({
  selector: "app-clubs",
  templateUrl: "./clubs.page.html",
  styleUrls: ["./clubs.page.scss"],
})
export class ClubsPage implements OnInit {
  constructor(
    private notice: NoticesService,
    private clubsService: ClubsService,
  ) {}

  clubs: Club[];
  noClubs = true;
  clubsLoaded = false;
  clubsSub;
  clubsUnfiltered: Club[];
  loading = false;
  loadingSub;
  ngOnInit() {}
  search(event) {
    this.clubs = this.clubsUnfiltered;
    const search = event.srcElement.value;
    this.clubs = this.clubs.filter((club) => {
      if (club.name.toLowerCase().search(search) !== -1) {
        return true;
      } else {
        return false;
      }
    });
  }
  clearSearch() {
    this.clubs = this.clubsUnfiltered;
  }
  ionViewDidEnter() {
    this.loadingSub = this.notice.loading.subscribe((state: boolean) => {
      this.loading = state;
    });
    this.clubsSub = this.clubsService.clubsLoaded.subscribe((clubs: Club[]) => {
      this.notice.hideLoader();
      this.clubsLoaded = true;
      this.clubs = clubs;
      this.clubsUnfiltered = clubs;
      this.clubs.forEach((club) => {
        if (club.logoPath === "") {
          club.logoPath = "/assets/img/no-image.png";
        } else if (club.logoPath.search("https://www.compaksa.co.za/") === -1) {
          club.logoPath = "https://www.compaksa.co.za/" + club.logoPath;
        }
      });
      if (clubs.length === 0) {
        this.noClubs = true;
      } else {
        this.noClubs = false;
      }
    });
    this.loadClubs();
  }

  loadClubs() {
    this.clubs = null;
    this.notice.showLoader();
    this.clubsService.fetchClubs();
  }

  ionViewDidLeave() {
    this.clubsSub.unsubscribe();
    this.loadingSub.unsubscribe();
  }
}
