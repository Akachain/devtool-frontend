import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  urlDeploy = 'https://akc-assets.s3-ap-southeast-1.amazonaws.com/documents/Akachain_Deployment_guideline.pdf';
	urlChaincode = 'https://akc-assets.s3-ap-southeast-1.amazonaws.com/documents/AKC_Chaincode_guideline.pdf';

  constructor() { }

  ngOnInit() {
  }

  downloadDGl(){
    window.open(this.urlDeploy);
  }
  
  downloadCGl(){
    window.open(this.urlChaincode);
  }
}
