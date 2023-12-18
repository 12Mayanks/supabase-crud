import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Modules
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router'



@Component({
  selector: 'app-add-emp',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,

  ],
  templateUrl: './add-emp.component.html',
  styleUrl: './add-emp.component.css'
})
export class AddEmpComponent {

  dataId: any;
  formData: any = {};
  constructor(private supabaseService: ApiService, private _fb: FormBuilder, private route: ActivatedRoute) {

  }

  submitForm() {

    this.supabaseService.insertData('user', this.formData)
      .then((insertedData: any) => {
        console.log('Data inserted successfully:', insertedData);
      });


  }
}
