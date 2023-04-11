import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  message: string;
  redSpiner: boolean;
  fullSpiner: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
