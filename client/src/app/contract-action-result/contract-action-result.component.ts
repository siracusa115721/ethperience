import { Component, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-contract-action-result',
  templateUrl: './contract-action-result.component.html',
  styleUrls: ['./contract-action-result.component.css']
})
export class ContractActionResultComponent implements OnInit {

  error: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data) { 
    this.error = data.error;
  }

  ngOnInit(): void {
  }

}
