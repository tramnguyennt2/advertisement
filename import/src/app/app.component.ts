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
                                    new Date(2017, 0, 1),
                                    new Date(2018, 11, 31)
                                );
                                let string = arr[11].concat(arr[10]);
                                self.nodejsService.post(string).subscribe((token) => {
                                    if (token) {
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
                                    }
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
        if (type == "item") {
            for (let i = 1; i <= 2000; i++) {
                let id = 'ad-' + i;
                this.dataService.deleteDoc(id);
                //console.log("Deleted item ", id);
            }
        }
        if (type == "rating") {
            console.log("begin deleting rating");
            this.dataService.db.find({
                selector: {
                    type: type
                }
            }).then(result => {
                console.log("length", result.docs.length);
                for (let rating of result.docs) {
                    this.dataService.deleteDoc(rating._id);
                    //console.log("deleting rating " + rating._id);
                }
            });
        }
    }

    generateRating() {
        const userPrefix = "user-";
        for (let i = 1; i <= 100; i++) {
            this.dataService.getDoc(userPrefix + i).then(user => {
                console.log("generate 10 ratings for user ", user._id);
                let arr_item = [];
                for (let i = 1; i <= 10; i++) {
                    let random_item = Math.floor(Math.random() * 1000) + 1;
                    while (arr_item.indexOf(random_item) > -1) {
                        random_item = Math.floor(Math.random() * 1000) + 1;
                    }
                    arr_item.push(random_item);
                    let random_rating = Math.floor(Math.random() * 5) + 1;
                    this.dataService.addAds({
                        user_id: user._id,
                        item_id: "ad-" + random_item,
                        rating: random_rating,
                        type: "rating"
                    });
                }
            })
        }
    }
}

function randomDate(start, end) {
    return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
    ).toISOString();
}
