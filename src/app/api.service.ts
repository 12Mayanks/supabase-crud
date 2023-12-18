import { Injectable } from '@angular/core';
import { createClient, PostgrestError, PostgrestResponse, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private supabaseUrl = 'https://ktsfgeynbpsgbezphqav.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0c2ZnZXluYnBzZ2JlenBocWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEyMzkwMjAsImV4cCI6MjAxNjgxNTAyMH0.9pNaEzcT2wush7jLBQpU2QqX3X-_BCqHEcxw90gucGM';

  private supabase: SupabaseClient;

  private dataUpdatedSubject = new BehaviorSubject<null>(null);

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }


  async insertData(tableName: string, data: any): Promise<any> {
    const { data: insertedData, error } = await this.supabase
      .from(tableName)
      .upsert([data]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      // Notify subscribers that data has been updated
      this.dataUpdatedSubject.next(null);
    }
    return insertedData;
  }

  // Function to get data into a Supabase table
  async getData(tableName: string): Promise<any> {
    let { data, error } = await this.supabase
      .from(tableName)
      .select('*')

    if (error) {
      console.error('Error inserting data:', error);
    }
    return data;
  }

  onDataUpdated() {
    return this.dataUpdatedSubject.asObservable();
  }

  // Function to update data into a Supabase table
  async updateData(tableName: string, data: any, rowId: number): Promise<any> {
    try {
      const { data: updatedData, error } = await this.supabase
        .from(tableName)
        .update(data)
        .eq('id', rowId);

      if (error) {
        console.error('Error updating data:', error);
      }
      else {
        // Notify subscribers that data has been updated
        this.dataUpdatedSubject.next(null);
      }
      return updatedData;
    }
    catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }

  async deleteData(tableName: string, dataId: any): Promise<PostgrestResponse<any>> {
    try {
      const { data, error }: { data: any; error: PostgrestError | null } = await this.supabase
        .from(tableName)
        .delete()
        .eq('id', dataId);

      if (error) {
        console.error('Error deleting data:', error);
      } else {
        this.notifyDataUpdated();
      }

      return { data, error } as PostgrestResponse<any>;
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  }

  private notifyDataUpdated() {
    this.dataUpdatedSubject.next(null);
  }

}
