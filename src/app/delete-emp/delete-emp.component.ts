import { Component ,Inject } from '@angular/core';
import { ApiService } from '../api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdateEmpComponent } from '../update-emp/update-emp.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-emp',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './delete-emp.component.html',
  styleUrl: './delete-emp.component.css'
})
export class DeleteEmpComponent {
  dataId: any;
  formData: any = {};

  constructor(
    private supabaseService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UpdateEmpComponent>
  ) {  
  }
  
  deleteRecord() {
    console.log('Data ID:', this.dataId);
    console.log(this.data);
    
    // Check if dataId is a valid number
    if (!isNaN(this.data.id)) {
      // Call the deleteData method from the ApiService to delete the record
      this.supabaseService.deleteData('user', this.data.id)
        .then(() => {
          console.log('Record deleted successfully');
          this.dialogRef.close(true); // Close the dialog with a positive result
        })
        .catch((error) => {
          console.error('Error deleting record:', error);
        });
    } else {
      console.warn('Invalid Data ID. Delete aborted.');
      this.dialogRef.close(false); // Close the dialog with a negative result
    }
  }
 
}
