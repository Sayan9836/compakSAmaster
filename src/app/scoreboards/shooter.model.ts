export class Shooter {
  public userID: string;
  public initials: string;
  public surname: string;
  public category: string;
  public class: string;
  public province: string;
  public range1Score: string;
  public range2Score: string;
  public range3Score: string;
  public range4Score: string;
  public range5Score: string;
  public range6Score: string;
  public range7Score: string;
  public range8Score: string;
  public day1Total: string;
  public day2Total: string;
  public grandTotal: string;
  public highGunPercentage: string;


  constructor(
    userID: string,
    initials: string,
    surname: string,
    category: string,
    shootingClass: string,
    province: string,
    range1Score: string,
    range2Score: string,
    range3Score: string,
    range4Score: string,
    range5Score: string,
    range6Score: string,
    range7Score: string,
    range8Score: string,
    day1Total: string,
    day2Total: string,
    grandTotal: string,
    highGunPercentage: string
  ) {
    this.userID = userID;
    this.initials = initials;
    this.surname = surname;
    this.category = category;
    this.class = shootingClass;
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
  }





}
