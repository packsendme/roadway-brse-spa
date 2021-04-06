import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/location-view',          title: 'Localizaçao',          icon:'nc-bank',       class: '' },
    { path: '/vehicle-view',           title: 'Veiculos',           icon:'nc-diamond',    class: '' },
    { path: '/category-view',        title: 'Regras de Negocio',          icon:'nc-bell-55',    class: '' },
    { path: '/fueltolls-view', title: 'Pedágio & Combustivel',       icon:'nc-tile-56',    class: '' },
    { path: '/simulation-crud', title: 'Simulaçao Entrega',       icon:'nc-tile-56',    class: '' },

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
