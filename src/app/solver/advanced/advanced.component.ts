import { Component, OnInit } from '@angular/core';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import { Matrix } from 'src/app/matrix.model';
import { MatrixService } from 'src/app/matrix.service';
import { advanced_op_title, determinant_title, basic_op_title } from 'src/lgs/lg';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  styleUrls: ['./advanced.component.css']
})
export class AdvancedComponent implements OnInit {
  public matrixA: Matrix;
  public matrixC: Matrix; // Auxiliar
  public message: string;
  public showResult: boolean;
  public showMessage: boolean;

  operator;
  operationText;

  iconBasic = faCalculator;
  advancedText = basic_op_title;
  determinantText = determinant_title;

  closeResult() {
    this.showResult = false;
  }

  ngClickGauss() {
    this.operator = 'gss';
  }
  ngClickGaussJordan() {
    this.operator = 'gsj';
  }
  ngClickDet() {
    this.operator = 'det';
  }
  ngClickTrs() {
    this.operator = 'trs';
  }
  ngClickInv() {
    this.operator = 'inv';
  }

  constructor(private matrixService: MatrixService, private _Activatedroute: ActivatedRoute) {
    this.operator = 'gss';
    this.message = 'loading matrix...'
    this.operator = this._Activatedroute.snapshot.paramMap.get("id");
    if (this.operator != 'gss' && this.operator != 'gsj' && this.operator != 'det') {
      this.operator = 'gss';
    }

    this.showResult = false;
    this.showMessage = false;
    this.matrixA = new Matrix(200, `A`, [[1.0, 1.0, 1.0, 1.0], [2.0, 1.0, 1.0, 1.0], [2.0, 2.0, 1.0, 1.0]]);
    this.matrixA = new Matrix(200, `A`, [[1.0, 1.0, 1.0, 1.0], [2.0, 1.0, 1.0, 1.0], [2.0, 2.0, 1.0, 1.0], [0.0, 2.0, 2.0, 1.0]]);
  }

  private callGauss() {
    this.matrixC = this.matrixService.OpGetGauss(this.matrixA);
    this.checkStatus();
    this.showResult = true;
  }


  private callGaussJordan() {
    if (this.matrixA.getMatrixCols() !== this.matrixA.getMatrixRows()) {
      this.matrixC = this.matrixService.OpGetGaussJordan(this.matrixA);
      this.checkStatus();
      this.showResult = true;
    } else {
      const dim = `Dimensions: A rows = ${this.matrixA.getMatrixRows()}, cols = ${this.matrixA.getMatrixCols()}`;
      this.message = `Error: the last col is for the values (extended matrix). ${dim}`
      this.showMessage = true;
    }
  }

  private callInverse() {
    if (this.matrixA.getMatrixCols() === this.matrixA.getMatrixRows()) {
      this.matrixC = this.matrixService.OpGetInverse(this.matrixA);
      this.checkStatus();
      this.showResult = true;
    } else {
      const dim = `Dimensions: A rows = ${this.matrixA.getMatrixRows()}, cols = ${this.matrixA.getMatrixCols()}`;
      this.message = `Error: This service only works for nxn matrices. ${dim}`
      this.showMessage = true;
    }
  }


  private callTranspose() {
    this.matrixC = this.matrixService.getTransposeMatrix(this.matrixA);
    console.log(this.matrixC);
    this.checkStatus();
    this.showResult = true;
  }



  private callDeterminants() {
    this.matrixC = this.matrixService.OpGetDeterminant(this.matrixA);
    this.checkStatus();
    this.showResult = true;
  }

  private checkStatus() {
    if (this.matrixC.getStatus() != 200) {
      this.message = `Trying to connect...  \n We don't found response from the server. Check ur connection or try later. Estatus: ${this.matrixC.getStatus()}`
      console.error(`${this.message}`);
      this.showMessage = true;
    }
  }


  submit() {
    this.showResult = true;
    this.showMessage = false;
    switch (this.operator) {
      case 'gss':
        this.callGauss();
        break;
      case 'gsj':
        this.callGaussJordan();
        break;
      case 'inv':
        this.callInverse();
        break;
      case 'det':
        this.callDeterminants();
        break;
      case 'trs':
        this.callTranspose();
        break;
      default:
        break;
    }
  }


  ngOnInit() {
  }

}
