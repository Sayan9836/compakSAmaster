export class Event {
  public eventID: number;
  public name: string;
  public startDate: string;
  public endDate: string;
  public startTime: string;
  public hostingClub: string;
  public type: string;
  public trial: string;
  public maximumEntries: string;
  public entryRates: {
    mens: string,
    seniors: string,
    veterans: string,
    masters: string,
    juniors: string,
    ladies: string
  };
  public resultsLink: string;
  public registered: boolean;
  public entries: number;

  constructor(
    eventID: number,
    name: string,
    startDate: string,
    endDate: string,
    startTime: string,
    hostingClub: string,
    type: string,
    trial: string,
    maximumEntries: string,
    entryRates: {
      mens: string,
      seniors: string,
      veterans: string,
      masters: string,
      juniors: string,
      ladies: string
    },
    resultsLink: string,
    registered: boolean,
    entries: number
  ) {
    this.eventID = eventID;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.startTime = startTime;
    this.hostingClub = hostingClub;
    this.type = type;
    this.trial = trial;
    this.maximumEntries = maximumEntries;
    this.entryRates = entryRates;
    this.resultsLink = resultsLink;
    this.registered = registered;
    this.entries = entries;
  }
}
