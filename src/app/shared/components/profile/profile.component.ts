import { Component, OnInit } from '@angular/core';
import { DbOffService } from '../../services/dbOffSvc.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  avatarImgSrc: string = 'assets/images/avatar.png';
  userName: string = '';
  eMail: string = '';
  
  constructor(
    private dbOffSvc: DbOffService
  ) { }

  ngOnInit() {
    this.dbOffSvc.get('user/id').toPromise().then(res => {
      if(res.result === 200)
      this.userName = res.data[0].Name;
      this.eMail = res.data[0].Email;
    }).catch(err => {
      console.log(err);
    });
  }

}
