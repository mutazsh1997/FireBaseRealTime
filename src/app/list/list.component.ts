import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase, AngularFireList, } from "angularfire2/database";
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {

  cars$: AngularFireList<any>;

  cars: any[];
  subscription: Subscription;

  constructor(private db: AngularFireDatabase) {

  }

  ngOnInit() {
    this.cars$ = this.db.list('/car');
     
    this.subscription = this.cars$.snapshotChanges().subscribe(car => {
      this.cars = car.map(c => { return c });

      console.log(this.cars)
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  add(car: HTMLInputElement) {
    this.cars$.push(car.value);
    car.value = ''
  }
  update(item, newValue: HTMLInputElement) {

    if (newValue.value !== '') {
      this.db.object('/car/' + item.key).set(newValue.value);
    }
  }
  remove(item) {
    this.db.object('/car/' + item.key).remove().then(a => console.log(" item deleted"));
    console.log(item.payload.val());
  }
}
