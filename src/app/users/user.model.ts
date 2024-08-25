import { Club } from '../clubs/club.model';

export class User {
  public userID: number;
  public name: string;
  public surname: string;
  public email: string;
  public cellNumber: string;
  public landNumber: string;
  public ID: string;
  public gender: string;
  public postalAddress: string;
  public physicalAddress: string;
  public category: string;
  public class: string;
  public DOB: string;
  public province: string;
  public club: Club;
  public africanRank: number;
  public worldRank: number;
  public paidStatus: string;
  public dedicatedShooter: boolean;
  public img: string;

  constructor(
    userID: number,
    name: string,
    surname: string,
    email: string,
    cellNumber: string,
    landNumber: string,
    ID: string,
    gender: string,
    postalAddress: string,
    physicalAddress: string,
    category: string,
    scoreClass: string,
    DOB: string,
    province: string,
    club: Club,
    africanRank: number,
    worldRank: number,
    paidStatus: string,
    dedicatedShooter: boolean,
    img: string
  ) {
    this.userID = userID;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.cellNumber = cellNumber;
    this.landNumber = landNumber;
    this.ID = ID;
    this.gender = gender;
    this.postalAddress = postalAddress;
    this.physicalAddress = physicalAddress;
    this.category = category;
    this.class = scoreClass;
    this.DOB = DOB;
    this.province = province;
    this.club = club;
    this.africanRank = africanRank;
    this.worldRank = worldRank;
    this.paidStatus = paidStatus;
    this.dedicatedShooter = dedicatedShooter;
    this.img = img;
  }
}
