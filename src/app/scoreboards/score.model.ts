export class Score {
  public userID: number;
  public initials: string;
  public surname: string;
  public category: string;
  public class: string;
  public province: string;
  public range1Score: number;
  public range2Score: number;
  public range3Score: number;
  public range4Score: number;
  public range5Score: number;
  public range6Score: number;
  public range7Score: number;
  public range8Score: number;
  public day1Total: number;
  public day2Total: number;
  public grandTotal: number;
  public highGunPercentage: number;
  public squadNumber: number;
  public shootOff: boolean;

  constructor(
    userID: number,
    initials: string,
    surname: string,
    category: string,
    province: string,
    shooterClass: string,
    range1Score: number,
    range2Score: number,
    range3Score: number,
    range4Score: number,
    range5Score: number,
    range6Score: number,
    range7Score: number,
    range8Score: number,
    day1Total: number,
    day2Total: number,
    grandTotal: number,
    highGunPercentage: number,
    squadNumber: number,
    shootOff: boolean
  ) {
    this.userID = userID;
    this.initials = initials;
    this.surname = surname;
    this.category = category;
    this.class = shooterClass;
    this.province = province;
    this.range1Score = range1Score;
    this.range2Score = range2Score;
    this.range3Score = range3Score;
    this.range4Score = range4Score;
    this.range5Score = range5Score;
    this.range6Score = range6Score;
    this.range7Score = range7Score;
    this.range8Score = range8Score;
    this.day1Total = day1Total;
    this.day2Total = day2Total;
    this.grandTotal = grandTotal;
    this.highGunPercentage = highGunPercentage;
    this.squadNumber = squadNumber;
    this.shootOff = shootOff;
  }



}
