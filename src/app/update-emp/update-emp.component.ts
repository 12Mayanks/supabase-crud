
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Validators

// Modules
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarService } from './core/snackbar.service';


@Component({
  selector: 'app-update-emp',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule

  ],
  templateUrl: './update-emp.component.html',
  styleUrl: './update-emp.component.css'
})
export class UpdateEmpComponent {

  dataId: any; // Pass the ID of the data to be updated
  formData: any = {};
  updateForm: FormGroup;

  constructor(private supabaseService: ApiService, private route: ActivatedRoute, private _coreservice: SnackbarService, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private _changeDetectorRef: ChangeDetectorRef,
  ) {
    {
      this.updateForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      });
    }
  }

  ngOnInit() {
    // Extract id from the injected data
    this.dataId = this.data.id;
    console.log('Data ID:', this.dataId);

    if (!isNaN(this.dataId)) {
      // Patch form data if available
      this.updateForm.patchValue({
        name: this.data.name,
        email: this.data.email,
      });
      console.log({
        name: this.data.name,
        email: this.data.email,
      });
      this._changeDetectorRef.markForCheck();

    } else {
      console.warn('Invalid Data ID. Form data will not be patched.');
    }
  }

  submitUpdate() {
    if (!isNaN(this.dataId)) {
      const tableName = 'user';
      this.supabaseService.updateData(tableName, this.updateForm.value, this.dataId)
        .then((updatedData: any) => {
          if (updatedData) {
            this.formData = { name: updatedData.name, email: updatedData.email };
          }
          this._coreservice.openSnackBar('Data updated successfully:', updatedData);
        })
        .catch((error) => {
          this._coreservice.openSnackBar('Error updating data:', error);
        });
    } else {
      this._coreservice.openSnackBar('Invalid Data ID. Update aborted.');
    }
  }

}
