import {Component} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HttpHeaders, HttpClient} from "@angular/common/http";
import {DataService} from "./data.service";
import "rxjs/add/observable/of";
import "rxjs/add/operator/map";
import {NodejsService} from "./nodejs.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    constructor(private http: HttpClient, private dataService: DataService, private nodejsService: NodejsService) {
    }

    file: any;
    dataPouch: any = {
        _id: "",
        user_id: "",
        cat_id: "",
        cat: "",
        sub_cat_id: "",
        sub_cat: "",
        loc_id: "",
        loc: "",
        sub_loc_id: "",
        sub_loc: "",
        title: "",
        content: "",
        price: "",
        image: "",
        created_at: "",
        token: "",
        type: "item"
    };
    dataSolr: any = {
        sub_cat_id: "",
        sub_loc_id: "",
        title: "",
        content: "",
        price: "",
        created_at: "",
        db_id: "",
        type: "item"
    };
    user: any = {
        _id: "",
        fullname: "",
        email: "",
        password: "",
        phone: "",
        role: "",
        type: "user"
    };

    fileChanged(e) {
        this.file = e.target.files[0];
    }

    importItem() {
        let fileReader = new FileReader();
        fileReader.onload = e => {
            let lines = fileReader.result.split("\n");
            let self = this;
            if (lines[0]) {
                // file khong trong
                lines.forEach(function (line, index) {
                    if (line) {
                        // check last line
                        line = Observable.of(line);
                        line.map(item => {
                            let arr = item.split("||");
                            if (arr[0] != "") {
                                let time = randomDate(
                                    new Date(2018, 1, 1),
                                    new Date(2018, 12, 31)
                                );
                                self.nodejsService.post(arr[11]).subscribe((token) => {
                                    console.log("token received:", token);
                                    self.dataPouch.token = token;
                                    self.dataPouch._id = arr[0];
                                    self.dataPouch.user_id = arr[1];
                                    self.dataPouch.cat_id = arr[2];
                                    self.dataPouch.cat = arr[3];
                                    self.dataPouch.sub_cat_id = arr[4];
                                    self.dataPouch.sub_cat = arr[5];
                                    self.dataPouch.loc_id = arr[6];
                                    self.dataPouch.loc = arr[7];
                                    self.dataPouch.sub_loc_id = arr[8];
                                    self.dataPouch.sub_loc = arr[9];
                                    self.dataPouch.title = arr[10];
                                    self.dataPouch.content = arr[11];
                                    self.dataPouch.price = arr[12];
                                    self.dataPouch.image = arr[13];
                                    self.dataPouch.created_at = time;
                                    // save to CouchDb
                                    self.dataService.addAds(self.dataPouch);
                                });

                                self.dataSolr.db_id = arr[0];
                                self.dataSolr.sub_cat_id = arr[4];
                                self.dataSolr.sub_loc_id = arr[8];
                                self.dataSolr.title = arr[10];
                                self.dataSolr.content = arr[11];
                                self.dataSolr.price = arr[12];
                                self.dataSolr.created_at = time;
                            }
                        }).subscribe(() => {
                            // save to solr
                            let headers = new HttpHeaders();
                            headers.append("Content-Type", "application/json");
                            self.http
                                .post(
                                    "http://localhost:8983/solr/item/update/json/docs?commit=true --data-binary ",
                                    self.dataSolr,
                                    {
                                        headers: headers
                                    }
                                )
                                .subscribe(res => console.log(res));
                        });
                    }
                });
            }
        };
        fileReader.readAsText(this.file);
    }

    importUser() {
        let fileReader = new FileReader();
        fileReader.onload = e => {
            let lines = fileReader.result.split("\n");
            let self = this;
            if (lines[0]) {
                // file khong trong
                lines.forEach(function (line, index) {
                    if (line) {
                        // check last line
                        line = Observable.of(line);
                        line
                            .map(item => {
                                let arr = item.split("*****");
                                if (arr[0] != "") {
                                    self.user._id = arr[0];
                                    self.user.fullname = arr[1];
                                    self.user.email = arr[2];
                                    self.user.password = arr[3];
                                    self.user.phone = arr[4];
                                    self.user.role = arr[5];
                                }
                            })
                            .subscribe(() => {
                                // save to CouchDb
                                self.dataService.addAds(self.user);
                                console.log("inserted user");
                            });
                    }
                });
            }
        };
        fileReader.readAsText(this.file);
    }

    deleteAllItem(type) {
        //this.dataService.deleteDoc('ad-1')
        for (let i = 1; i <= 1000; i++) {
            let id = 'ad-' + i;
            this.dataService.deleteDoc(id);
        }
    }
}

function randomDate(start, end) {
    return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
    ).toISOString();
}
