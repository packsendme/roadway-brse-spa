import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/location',          title: 'Location',          icon:'nc-bank',       class: '' },
    { path: '/vehicle-view',           title: 'Vehicle',           icon:'nc-diamond',    class: '' },
    { path: '/categories',        title: 'Category',          icon:'nc-bell-55',    class: '' },
    { path: '/transport',         title: 'Transport',         icon:'nc-tile-56',    class: '' },
    { path: '/businessrule-view', title: 'Roadway-BRE',       icon:'nc-tile-56',    class: '' },
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
