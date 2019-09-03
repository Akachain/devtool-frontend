import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { menuService } from '../../services/menu.service';
import { GlobalService } from '../../services/global.service';
import { Configuration } from '../../services//configuration.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [menuService]
})
export class SidebarComponent implements OnInit {

  akachainlogo = 'assets/images/logo-full-white2x.png';
  public menuInfo: Array<any> = [];
  public sidebarToggle = true;
  public appVersion = '1.0.0';

  constructor(private _menuService: menuService,
    public _globalService: GlobalService,
    private _configuration: Configuration) {
      this.appVersion = _configuration.appVersion;
    }

  ngOnInit() {
    this.menuInfo = this._menuService.putSidebarJson();
    this._sidebarToggle();
    this._menuService.selectItem(this.menuInfo);
    this._isSelectItem(this.menuInfo);
  }

  public _sidebarToggle() {
    this._globalService.data$.subscribe(data => {
      if (data.ev === 'sidebarToggle') {
        this.sidebarToggle = data.value;
      }
    }, error => {
      console.log('Error: ' + error);
    });

  }

  _isSelectItem(item) {
    for (const i in item) {
      if (item[i].children) {
        for (const index in item[i].children) {
          if (item[i].children[index].isActive || item[i].children[index].toggle === 'on') {
            item[i].toggle = 'on';
            break;
          } else {
            this._isSelectItem(item[i].children);
          }
        }
      }
    }
  }

}
