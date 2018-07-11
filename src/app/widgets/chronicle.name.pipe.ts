import {PipeTransform, Pipe} from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

import {Observable} from "rxjs/Observable";
import {map} from "rxjs/operators";

@Pipe({ name: 'chronicleName' })
export class ChronicleNamePipe implements PipeTransform {

  constructor(private database: AngularFireDatabase) {}

  public transform(chronicleId: string): Observable<string> {
    return this.database.object<any>(`chronicles/${chronicleId}`).valueChanges().pipe(map(c => c.name));
  }
}
