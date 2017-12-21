import { Component, OnInit } from '@angular/core';
import { BasicService } from './basic.service';

@Component({
    selector: 'dshb-app',
    templateUrl: './dshbApp.routerComponent.html',
    styleUrls: ['./dshbApp.routerComponent.less']
    //directives: [MATERIAL_DIRECTIVES, MD_SIDENAV_DIRECTIVES,
    //MdToolbar, MdIcon]
})

export class DshbRouterComponent implements OnInit {
    constructor(
        private _basicService: BasicService) {
        this.siteName = (() => {
            switch (window.location.hostname) {
                case "xn--80adaks1accdqj2p.su":
                    return "соревнования.su";
                case "xn----8sbefdzklpjc6b0b2h.xn--p1ai":
                    return "тхэквондо-лига.рф";
                default:
                    return "isportevent.com";
            }
        })();
    }

    title = 'DASHBOARD';
    selectedItem: String;
    siteName: String;
    data: any
    windowLocHref: string;

    ngOnInit() {
      this.windowLocHref = 'manager/companies';
      this._basicService.getAuthorizedUserData().then((data) => {
          this.data = data;
        });

      this.selectedItem = 'Главная';
    }

    onSelect(item: String) {
        this.selectedItem = item;
    }

    goToAccount() {
        window.location.href = window.location.origin + "/account";
    }

    goToOrgMgr() {
        window.location.href = window.location.origin + '/manager/companies';
    }
}
