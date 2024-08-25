import { Score } from './score.model';
import { Shooter } from './shooter.model';

export class Scoreboard {
  public event: number;
  public date: string;
  public venue: string;
  public scores: Score[];
  public overallLeaders: Shooter[];
  public mensLeaders: Shooter[];
  public seniorLeaders: Shooter[];
  public veteranLeaders: Shooter[];
  public masterLeaders: Shooter[];
  public ladiesLeaders: Shooter[];
  public juniorLeaders: Shooter[];
  public classALeaders: Shooter[];
  public classBLeaders: Shooter[];
  public classCLeaders: Shooter[];
  public provinceLeaders: string;


  constructor(
    event: number,
    date: string,
    venue: string,
    scores: Score[],
    overallLeaders: Shooter[],
    mensLeaders: Shooter[],
    seniorLeaders: Shooter[],
    veteranLeaders: Shooter[],
    masterLeaders: Shooter[],
    ladiesLeaders: Shooter[],
    juniorLeaders: Shooter[],
    classALeaders: Shooter[],
    classBLeaders: Shooter[],
    classCLeaders: Shooter[],
    provinceLeaders: string
  ) {
    this.event = event;
    this.date = date;
    this.venue = venue;
    this.scores = scores;
    this.overallLeaders = overallLeaders;
    this.mensLeaders = mensLeaders;
    this.seniorLeaders = seniorLeaders;
    this.veteranLeaders = veteranLeaders;
    this.masterLeaders = masterLeaders;
    this.ladiesLeaders = ladiesLeaders;
    this.juniorLeaders = juniorLeaders;
    this.classALeaders = classALeaders;
    this.classBLeaders = classBLeaders;
    this.classCLeaders = classCLeaders;
    this.provinceLeaders = provinceLeaders;
  }





}
