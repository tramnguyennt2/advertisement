import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from "@angular/router";
import {PouchdbService} from "../pouchdb.service";
import {Ad} from "../ad";

@Component({
  selector: 'app-ad-detail',
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.css']
})
export class AdDetailComponent implements OnInit {
  item = new Ad('', '', '','',0);

  constructor(private http: HttpClient, private pouchdb: PouchdbService, private route: ActivatedRoute,) {
    this.display();
  }

  ngOnInit() {
  }

  display() {
    this.pouchdb.get(this.route.snapshot.paramMap.get('id')).then((res) => {
      this.item = res;
    });
  }
}
