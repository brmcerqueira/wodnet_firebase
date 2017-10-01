import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  templateUrl: './dice-board.component.html',
  styleUrls: ['./dice-board.component.scss']
})
export class DiceBoardComponent {

  public isStoryteller: boolean;

  constructor(private activatedRoute: ActivatedRoute) {
    this.isStoryteller = activatedRoute.snapshot.data.isStoryteller;
  }
}
