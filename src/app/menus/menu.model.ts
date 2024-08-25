export class Menu {
  public name: string;
  public route: string;
  public icon: string;

  constructor(name: string, route: string, icon: string) {
    this.name = name;
    this.route = route;
    this.icon = icon;
  }
}
