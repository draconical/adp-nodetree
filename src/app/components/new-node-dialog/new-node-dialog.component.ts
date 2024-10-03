import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-node-dialog',
  templateUrl: './new-node-dialog.component.html',
  styleUrls: ['./new-node-dialog.component.scss']
})
export class NewNodeDialogComponent {
  nodeName = new FormControl('', [Validators.required, Validators.minLength(3)]);

  constructor(public dialogRef: MatDialogRef<NewNodeDialogComponent>) {}

  cancelClickHandler(): void {
    this.dialogRef.close();
  }

  createClickHandler(): void {
    this.nodeName.markAsTouched();

    if (!this.nodeName.valid) return;

    this.dialogRef.close(this.nodeName.value);
  }
}
