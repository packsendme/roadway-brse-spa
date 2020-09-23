import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/location',      title: 'Location',          icon:'nc-bank',       class: '' },
    { path: '/vehicle',       title: 'Vehicle',           icon:'nc-diamond',    class: '' },
    { path: '/bodywork',      title: 'Bodywork',          icon:'nc-pin-3',      class: '' },
    { path: '/category',      title: 'Category',          icon:'nc-bell-55',    class: '' },
    { path: '/transport',     title: 'Transport',         icon:'nc-tile-56',    class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
