import { Menu } from './menu.model';

export class MenuGroup {
    public name: string;
    public menus: Menu[];

    constructor(name: string, menus: Menu[]) {
        this.name = name;
        this.menus = menus;
    }
}