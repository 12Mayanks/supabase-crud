import { Component, ViewChild } from '@angular/core';
import { AddEmpComponent } from '../app/add-emp/add-emp.component';
import { MatDialog , MAT_DIALOG_DATA} from '@angular/material/dialog'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { ApiService } from './api.service';



// Modules
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule  } from '@angular/material/table';
import { UpdateEmpComponent } from './update-emp/update-emp.component';
import { DeleteEmpComponent } from './delete-emp/delete-emp.component';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'supabase_test_2';
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'email', 'action'];

  private dataUpdatedSubscription: Subscription = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog: MatDialog, private supabaseService: ApiService) {
    this.dataUpdatedSubscription = this.supabaseService.onDataUpdated().subscribe(() => {
      this.loadData();
    });
  }

  async ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.dataUpdatedSubscription.unsubscribe();
  }

  private async loadData() {
    const tableName = 'user';
    const data = await this.supabaseService.getData(tableName);
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  openAddEditDialog() {
    const dialogRef = this._dialog.open(AddEmpComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadData()
        }
      }
    })
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(UpdateEmpComponent, {
      data: { id: data.id, ...data },
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadData()
        }
      },
    })
  }

  deleteData(data: any) {
    const dialogRef = this._dialog.open(DeleteEmpComponent, {
      data: { id: data.id, ...data },
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.loadData();
        }
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
