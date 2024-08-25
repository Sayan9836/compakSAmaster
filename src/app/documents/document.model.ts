export class Document {
  public documentID: number;
  public name: string;
  public location: string;

  constructor(
    documentID: number,
    name: string,
    location: string,
  ) {
    this.documentID = documentID;
    this.name = name;
    this.location = location;
  }
}
