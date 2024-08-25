import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Scoreboard } from "./scoreboard.model";
import { DatabaseService } from "../services/database.service";
import { NetworkService } from "../services/network.service";
import { NoticesService } from "../services/notices.service";
import { AuthService } from "../auth/auth.service";
import { Document } from "../documents/document.model";
import { Score } from "./score.model";

@Injectable({
  providedIn: "root",
})
export class ScoreboardsService {
  itemProcessed = new EventEmitter<boolean>();
  processSub;
  scoreboardUpdated = new EventEmitter<Scoreboard>();
  scoresUpdated = new EventEmitter<Score[]>();
  eventHistoryUpdated = new EventEmitter<Document>();
  scoreboard: Scoreboard;

  constructor(
    private http: HttpClient,
    private database: DatabaseService,
    private network: NetworkService,
    private notice: NoticesService,
    private authService: AuthService,
  ) {}
  domain = environment.domain;
  fetchScoreboard(eventID, mode) {
    this.notice.presentLoader();
    if (this.network.connected) {
      // TODO Capture Scores by Shooter BUG
      let modeParam = "";
      if (mode !== null) {
        modeParam = "/" + mode;
      }
      // this.domain + '/api/v2/scoreboards/' + eventID + modeParam
      this.http
        .get<Scoreboard>(
          "https://new.compaksa.co.za/wp-json/api/v2/scoreboards/" + eventID,
        )
        .subscribe(
          (resp) => {
            // console.log(resp);
            this.scoreboard = resp;
            this.scoreboardUpdated.emit(resp);
            this.notice.dismissLoader();
            if (this.database.sync) {
              this.syncScoreboardDetails(resp);
            }
          },
          (error: HttpErrorResponse) => {
            console.log(error.status + " - " + error.statusText);
            this.scoreboardUpdated.emit(null);
            this.notice.dismissLoader();
          },
        );
    } else {
      this.database.getObject("scoreboards").then((resp) => {
        let scoreboard = null;
        if (resp !== null) {
          if (resp.length > 1) {
            resp.forEach((scoreboardDetail) => {
              if (scoreboardDetail.eventID === eventID) {
                scoreboard = scoreboardDetail;
              }
            });
          }
        }
        this.scoreboardUpdated.emit(scoreboard);

        this.notice.dismissLoader();
      });
    }
  }
  fetchShootOffScores(eventID) {
    this.notice.presentLoader();
    if (this.network.connected) {
      this.http
        .get<Score[]>(
          this.domain + "/api/v2/scoreboards/" + eventID + "/shootOff",
        )
        .subscribe(
          (resp) => {
            this.scoresUpdated.emit(resp);
            this.notice.dismissLoader();
            if (this.database.sync) {
              this.syncShootOffScores(resp);
            }
          },
          (error: HttpErrorResponse) => {
            console.log(error.status + " - " + error.statusText);
            this.scoresUpdated.emit(null);
            this.notice.dismissLoader();
          },
        );
    } else {
      this.database.getObject("shootOffScores").then((resp) => {
        this.scoresUpdated.emit(resp);
        this.notice.dismissLoader();
      });
    }
  }
  fetchHistory() {
    this.http
      .get<Document>(this.domain + "/api/v2/scoreboards?mode=history")
      .subscribe(
        (resp) => {
          this.eventHistoryUpdated.emit(resp);
        },
        (error: HttpErrorResponse) => {
          console.log(error.status + " - " + error.statusText);
          this.eventHistoryUpdated.emit(null);
        },
      );
  }
  storeUpdates(scoreboard) {
    const scoreboards = [];
    this.database.getObject("scoreboardUpdates").then((data) => {
      if (data !== null) {
        if (data.length > 0) {
          data.forEach((scoreboardDetail) => {
            scoreboards.push(scoreboardDetail);
          });
        }
      }
      scoreboards.push(scoreboard);
      this.database.setObject("scoreboardUpdates", scoreboards);
    });
  }
  storeShootOffUpdates(scoreData) {
    const scores = [];
    this.database.getObject("shootOffUpdates").then((data) => {
      if (data !== null) {
        if (data.length > 0) {
          data.forEach((scoreDetail) => {
            scores.push(scoreDetail);
          });
        }
      }
      scores.push(scoreData);
      this.database.setObject("shootOffUpdates", scores);
    });
  }
  processUpdates() {
    this.processSub = this.itemProcessed.subscribe((resp) => {
      if (resp) {
        const scoreboards = [];
        this.database.getObject("scoreboardUpdates").then((data) => {
          if (data !== null) {
            for (let i = 1; i < data.length; i++) {
              const scoreboard = data[i];
              scoreboards.push(scoreboard);
            }
          }
          this.database.setObject("scoreboardUpdates", scoreboards);
        });
      }
      this.saveUpdate();
    });
    this.saveUpdate();
  }
  saveUpdate() {
    this.database.getObject("scoreboardUpdates").then((data) => {
      // console.log(data);
      if (data !== null) {
        if (this.authService.permissions.includes(26)) {
          this.http
            .post(this.domain + "/api/v2/scoreboards", data[0])
            .subscribe(
              (resp: any) => {
                this.itemProcessed.emit(true);
              },
              (error: HttpErrorResponse) => {
                this.itemProcessed.emit(false);
                // console.log(error);
                this.notice.presentToast("Unable to sync scores", "danger");
                this.processSub.unsubscribe();
              },
            );
        } else {
          this.processSub.unsubscribe();
          this.notice.presentToast("Scoreboard sync completed", "success");
        }
      }
    });
  }

  syncScoreboardDetails(scoreboard) {
    let scoreboards = [];
    this.database.getObject("scoreboards").then((data) => {
      // console.log(data, scoreboard);
      if (data === null) {
        scoreboards.push(scoreboard);
      } else {
        // console.log(data);
        if (data.length > 1) {
          data.forEach((scoreboardDetail) => {
            if (scoreboardDetail.eventID !== scoreboard.eventID) {
              scoreboards.push(scoreboardDetail);
            }
          });
        } else {
          if (data[0].eventID === scoreboard.eventID) {
            scoreboards = [];
          } else {
            scoreboards.push(data[0]);
          }
        }
        scoreboards.push(scoreboard);
      }
      this.database.setObject("scoreboards", scoreboards);
    });
  }
  syncShootOffScores(scores) {
    this.database.setObject("shootOffScores", scores);
  }
}
