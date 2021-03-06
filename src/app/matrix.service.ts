import { element } from 'protractor';
import { Injectable } from '@angular/core';
import { Matrix } from './matrix.model';
import { DataRequestService } from './data-request.service';

@Injectable({
  providedIn: 'root'
})
export class MatrixService {

  matrix: Matrix;
  max = 12;

  constructor(private dataRequest: DataRequestService) { }

  getValues() {
    return this.matrix.matrix;
  }

  getMatrixRows(matrix: Matrix): number {
    try {
      return matrix.matrix.length;
    } catch (error) {
      return 0;
    }
  }

  getMatrixCols(matrix: Matrix): number {
    try {
      return matrix.matrix[0].length;
    } catch (error) {
      return 0;
    }
  }

  fixSize(row, col) {
    let numberRow = row;
    let numberCol = col;
    if (row < 1) {
      numberRow = 1;
    } else if (row > this.max) {
      numberRow = this.max;
    } else {
      numberRow = 3;
    }
    if (col > this.max) {
      numberCol = this.max;
    } else if (col < 1) {
      numberCol = 1;
    } else {
      numberCol = 3;
    }
    return [numberRow, numberCol];
  }

  validateSize(row, col) {
    return (row <= this.max && col <= this.max && ((row >= 1 && col > 1) || (row > 1 && col >= 1)));
  }

  public validMatrix(m: Matrix): boolean {
    let c1: boolean;
    c1 = this.validateSize(this.getMatrixCols(m), this.getMatrixRows(m));
    return (c1);
  }

  setSize(data, row: number, col: number) {
    if (row === col) {
      switch (row) {
        case 2:
          data = [[0, 0], [0, 0]];
          break;
        case 3:
          data = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
          break;
        case 4:
          data = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
          break;
        default:
          break;
      }
    } else {
      data = new Array(row);
      for (let i = 0; i < row; i++) {
        data[i] = new Array(col);
        for (let j = 0; j < col; j++) {
          data[i][j] = 0;
        }
      }
    }
    return data;
  }

  setMatrix(matrix: Matrix) {
    this.matrix = matrix;
  }

  cleanMatrix(matrix: Matrix) {
    let i;
    const n = matrix.matrix.length;
    for (i = 0; i < n; ++i) {
      for (let j = 0; j < matrix.matrix[i].length; j++) {
        matrix.matrix[i][j] = 0;
      }
    }
    return matrix;
  }

  public getIdentity(matrix) {
    // matrix = this.cleanMatrix(matrix);
    const l = matrix.length;
    let position = 0;
    for (let i = 0; i < l; i++) {
      const element = matrix[i];
      for (let e = 0; e < element.length; e++) {
        if (e === position) {
          matrix[i][e] = 1;
        } else {
          matrix[i][e] = 0;
        }
      }
      position++;
    }
    return matrix;
  }

  public OpAddMatrix(A: Matrix, B: Matrix): Matrix {
    const matrixC = new Matrix(200, `C`, new Array(A.matrix.length));
    for (let i = 0; i < A.matrix.length; i++) {
      matrixC.matrix[i] = new Array(A.matrix[i].length);
      for (let j = 0; j < A.matrix[i].length; j++) {
        const element = Number(A.matrix[i][j]) + Number(B.matrix[i][j]);
        matrixC.matrix[i][j] = element;
      }
    }
    return matrixC;
  }

  public OpSubMatrix(A: Matrix, B: Matrix): Matrix {
    const matrixC = new Matrix(200, `C`, new Array(A.matrix.length));
    for (let i = 0; i < A.matrix.length; i++) {
      matrixC.matrix[i] = new Array(A.matrix[i].length);
      for (let j = 0; j < A.matrix[i].length; j++) {
        const element = Number(A.matrix[i][j]) - Number(B.matrix[i][j]);
        matrixC.matrix[i][j] = element;
      }
    }
    return matrixC;
  }

  OpScaMatrix(A: Matrix, scalar: number): Matrix {
    const matrixC = new Matrix(200, `C`, new Array(A.matrix.length));
    for (let i = 0; i < A.matrix.length; i++) {
      matrixC.matrix[i] = new Array(A.matrix[i].length);
      for (let j = 0; j < A.matrix[i].length; j++) {
        const element = Number(A.matrix[i][j]) * scalar;
        matrixC.matrix[i][j] = element;
      }
    }
    return matrixC;
  }

  OpMulMatrix(A: Matrix, B: Matrix): Matrix {
    let matrixC = new Matrix(200, `C`, new Array(A.matrix.length));

    // const matrixC = new Matrix(200, `C`, new Array(A.matrix.length));
    // for (let i = 0; i < A.matrix.length; i++) {
    //   matrixC.matrix[i] = new Array(A.matrix[i].length);
    //   for (let j = 0; j < A.matrix[i].length; j++) {
    //     const element = Number(A.matrix[i][j]) * 1;
    //     matrixC.matrix[i][j] = element;
    //   }
    // }
    // return matrixC;

    matrixC.matrix = this.matrixDot(A.matrix, B.matrix);
    return matrixC;
  }

  private matrixDot(A, B): number[][] {
    try {
      var result = new Array(A.length).fill(0).map(row => new Array(B[0].length).fill(0));

      return result.map((row, i) => {
        return row.map((val, j) => {
          return A[i].reduce((sum, elm, k) => sum + (elm * B[k][j]), 0)
        })
      })

    } catch (error) {
      console.error(error);
      return null;
    }
  }

  getTransposeMatrix(matrix: Matrix){
    let C: Matrix;
    if (this.dataRequest.isOnline()) {
      const obj2 = JSON.parse(this.getMatrixDataJSON(matrix));
      const js = obj2;
      C = new Matrix(0, `C`, []);
      try {
        this.dataRequest.getTransposed(js).subscribe(matrixRes =>
          C.matrix = matrixRes.matrix
        );
        C.setMessage(`succesful operation`);
        C.setStatus(200);
      } catch (error) {
        C = new Matrix(0, `undefined`, []);
        C.setMessage(`error: ${error}`);
        C.setStatus(404);
      }
    } else {
      C = new Matrix(0, `undefined`, []);
      C.setStatus(404);
      C.setMessage(this.dataRequest.getMessage());
    }
    return C;
  }

  OpGetGauss(A: Matrix): Matrix {
    let C: Matrix;
    if (this.dataRequest.isOnline()) {
      const obj2 = JSON.parse(this.getMatrixDataJSON(A));
      const js = obj2;
      C = new Matrix(0, `C`, []);
      try {
        this.dataRequest.getGauss(js).subscribe(matrixRes =>
          C.matrix = matrixRes.matrix
        );
        C.setMessage(`succesful operation`);
        C.setStatus(200);
      } catch (error) {
        C = new Matrix(0, `undefined`, []);
        C.setMessage(`error: ${error}`);
        C.setStatus(404);
      }
    } else {
      C = new Matrix(0, `undefined`, []);
      C.setStatus(404);
      C.setMessage(this.dataRequest.getMessage());
    }
    return C;
  }

  OpGetGaussJordan(A: Matrix): Matrix {

    let C: Matrix;

    if (this.dataRequest.isOnline()) {

      if (A.getMatrixCols() !== A.getMatrixRows()) {
        console.log(`cols:${A.getMatrixCols()} rows: ${A.getMatrixRows()}`);
        const obj2 = JSON.parse(this.getMatrixDataJSON(A));
        const js = obj2;
        C = new Matrix(1, `C`, []);
        try {
          this.dataRequest.getGaussJordan(js).subscribe(matrixRes =>
            C.matrix = matrixRes.matrix
          );
          C.setMessage(`succesful operation`);
          C.setStatus(200);
        } catch (error) {
          C = new Matrix(0, `undefined`, []);
          C.setMessage(`error: ${error}`);
          C.setStatus(404);
        }
      } else {
        C = new Matrix(0, `undefined`, []);
        C.setMessage(`error: the last coloumn is for the values (extended matrix). `);
        C.setStatus(500);
      }
    } else {
      C = new Matrix(0, `undefined`, []);
      C.setMessage(this.dataRequest.getMessage());
      C.setStatus(404);
    }
    return C;
  }

  

  OpGetInverse(A: Matrix): Matrix {

    let C: Matrix;

    if (this.dataRequest.isOnline()) {

      if (A.getMatrixCols() === A.getMatrixRows()) {
        console.log(`cols:${A.getMatrixCols()} rows: ${A.getMatrixRows()}`);
        const obj2 = JSON.parse(this.getMatrixDataJSON(A));
        const js = obj2;
        C = new Matrix(1, `C`, []);
        try {
          this.dataRequest.getInverse(js).subscribe(matrixRes =>
            C.matrix = matrixRes.matrix
          );
          C.setMessage(`succesful operation`);
          C.setStatus(200);
        } catch (error) {
          C = new Matrix(0, `undefined`, []);
          C.setMessage(`error: ${error}`);
          C.setStatus(404);
        }
      } else {
        C = new Matrix(0, `undefined`, []);
        C.setMessage(`error: this matrix service only works for nxn matrices `);
        C.setStatus(500);
      }
    } else {
      C = new Matrix(0, `undefined`, []);
      C.setMessage(this.dataRequest.getMessage());
      C.setStatus(404);
    }
    return C;
  }


  public getMatrixDataJSON(matrix: Matrix): string {
    return `{"matrix": [${this.getDataJson(matrix)}]}`;
  }

  private getDataJson(matrix: Matrix): string {
    let dataText = ``;
    let r;
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < matrix.matrix.length; index++) {
      r = matrix.matrix[index];

      if (index === 0) {
        dataText = `${dataText} [`;
      } else {
        dataText = `${dataText}, [`;
      }

      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < r.length; j++) {

        if (j !== 0) {
          dataText = `${dataText},`;
        }

        const element = r[j];

        dataText = `${dataText} ${element}`;
      }
      dataText = `${dataText} ]`;
    }
    return dataText;
  }

  OpGetDeterminant(A: Matrix): Matrix {

    let C: Matrix;

    if (this.dataRequest.isOnline()) {
      const obj2 = JSON.parse(this.getMatrixDataJSON(A));
      const js = obj2;
      C = new Matrix(1, `C`, []);
      try {
        this.dataRequest.getDeterminant(js).subscribe(matrixRes =>
          C.matrix = matrixRes.matrix
        );
        C.setMessage(`succesful operation`);
        C.setStatus(200);
      } catch (error) {
        C = new Matrix(0, `undefined`, []);
        C.setMessage(`error: ${error}`);
        C.setStatus(404);
      }
    } else {
      C = new Matrix(0, `undefined`, []);
      C.setMessage(this.dataRequest.getMessage());
      C.setStatus(404);
    }
    return C;
  }
}
