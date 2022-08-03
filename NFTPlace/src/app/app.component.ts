import { Component } from '@angular/core';
import { ContractService } from './contract.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NFTPlace';
  file: File | undefined;
  fileName: string = "";

  constructor(public contractService: ContractService){
  }

  ngOnInit(): void {
    this.contractService.componentWillMount();
  }

  onFileSelected(event: any) {
    const file:File = event.target.files[0];

    if (file) {
        console.log(file)
        this.fileName = file.name;
        this.file = file;
    }
}

  uploadFile(){
    this.contractService.uploadImage(this.file);
  }
}
