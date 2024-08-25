export class Club {
  public clubID: string;
  public name: string;
  public contactPerson: string;
  public emailAddress: string;
  // public postalAddress: string;
  // public physicalAddress: string;
  public address: string;
  public websiteAddress: string;
  public GPS: string;
  public bankingDetails: string;
  // public area: string;
  public logoPath: string;
  public contactNumber: string;
  public provinceID: number;
  constructor(
    clubID: string,
    name: string,
    contactPerson: string,
    contactNumber: string,
    emailAddress: string,
    // postalAddress: string,
    // physicalAddress: string,
    address: string,
    websiteAddress: string,
    GPS: string,
    bankingDetails: string,
    // area: string,
    logoPath: string,
    africanRank: number,
    worldRank: number,
    provinceID: number,
  ) {
    this.clubID = clubID;
    this.name = name;
    this.contactPerson = contactPerson;
    this.emailAddress = emailAddress;
    // this.postalAddress = postalAddress;
    // this.physicalAddress = physicalAddress;
    this.address = address;
    this.websiteAddress = websiteAddress;
    this.GPS = GPS;
    this.bankingDetails = bankingDetails;
    // this.area = area;
    this.logoPath = logoPath;
    this.contactNumber = contactNumber;
    this.provinceID = provinceID;
  }
}
