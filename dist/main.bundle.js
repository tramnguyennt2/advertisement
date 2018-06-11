webpackJsonp(["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/ad-detail/ad-detail.component.css":
/***/ (function(module, exports) {

module.exports = ".ad-item {\r\n  margin-left: 15%;\r\n  margin-right: 15%;\r\n}\r\n\r\n.ad-title {\r\n  color: brown\r\n}\r\n\r\n.ad-content {\r\n  text-align: justify\r\n}\r\n"

/***/ }),

/***/ "./src/app/ad-detail/ad-detail.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"ad-item\">\n  <br>\n  <h3 class=\"ad-title\">{{item.title}}</h3>\n  <h6>{{item.area}} - {{item.price}}đ</h6>\n  <p class=\"ad-content\">{{item.content}}</p>\n</div>\n"

/***/ }),

/***/ "./src/app/ad-detail/ad-detail.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdDetailComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pouchdb_service__ = __webpack_require__("./src/app/pouchdb.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AdDetailComponent = /** @class */ (function () {
    function AdDetailComponent(http, pouchdb, route) {
        this.http = http;
        this.pouchdb = pouchdb;
        this.route = route;
        this.item = {};
        this.display();
    }
    AdDetailComponent.prototype.ngOnInit = function () {
    };
    AdDetailComponent.prototype.display = function () {
        var _this = this;
        this.pouchdb.get(this.route.snapshot.paramMap.get('id')).then(function (res) {
            _this.item = res;
        });
    };
    AdDetailComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-ad-detail',
            template: __webpack_require__("./src/app/ad-detail/ad-detail.component.html"),
            styles: [__webpack_require__("./src/app/ad-detail/ad-detail.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_3__pouchdb_service__["a" /* PouchdbService */], __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* ActivatedRoute */]])
    ], AdDetailComponent);
    return AdDetailComponent;
}());



/***/ }),

/***/ "./src/app/ad.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Ad; });
var Ad = /** @class */ (function () {
    function Ad(title, content, area, category, price, couchdb_id) {
        this.title = title;
        this.content = content;
        this.area = area;
        this.category = category;
        this.price = price;
        if (couchdb_id) {
            this.couchdb_id = couchdb_id;
        }
    }
    return Ad;
}());



/***/ }),

/***/ "./src/app/app-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ad_detail_ad_detail_component__ = __webpack_require__("./src/app/ad-detail/ad-detail.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__contact_contact_component__ = __webpack_require__("./src/app/contact/contact.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__content_area_content_area_component__ = __webpack_require__("./src/app/content-area/content-area.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__intro_intro_component__ = __webpack_require__("./src/app/intro/intro.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__signin_signin_component__ = __webpack_require__("./src/app/signin/signin.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__signup_signup_component__ = __webpack_require__("./src/app/signup/signup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__new_ad_new_ad_component__ = __webpack_require__("./src/app/new-ad/new-ad.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var routes = [
    { path: '', component: __WEBPACK_IMPORTED_MODULE_4__content_area_content_area_component__["a" /* ContentAreaComponent */] },
    { path: 'contact', component: __WEBPACK_IMPORTED_MODULE_3__contact_contact_component__["a" /* ContactComponent */] },
    { path: 'sign-in', component: __WEBPACK_IMPORTED_MODULE_6__signin_signin_component__["a" /* SigninComponent */] },
    { path: 'sign-up', component: __WEBPACK_IMPORTED_MODULE_7__signup_signup_component__["a" /* SignupComponent */] },
    { path: 'intro', component: __WEBPACK_IMPORTED_MODULE_5__intro_intro_component__["a" /* IntroComponent */] },
    { path: 'detail/:id', component: __WEBPACK_IMPORTED_MODULE_2__ad_detail_ad_detail_component__["a" /* AdDetailComponent */] },
    { path: 'new-ad', component: __WEBPACK_IMPORTED_MODULE_8__new_ad_new_ad_component__["a" /* NewAdComponent */] },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            imports: [
                // Exporting RouterModule makes router directives available for use in the AppModule components that will need them
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* RouterModule */].forRoot(routes)
            ],
            // Exporting RouterModule makes router directives available for use in the AppModule components that will need them
            exports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* RouterModule */]
            ]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<app-nav></app-nav>\r\n<router-outlet></router-outlet>\r\n<app-footer></app-footer>\r\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__("./src/app/app.component.html"),
            styles: [__webpack_require__("./src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__("./src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_routing_module__ = __webpack_require__("./src/app/app-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pouchdb_service__ = __webpack_require__("./src/app/pouchdb.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__solr_service__ = __webpack_require__("./src/app/solr.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ad_detail_ad_detail_component__ = __webpack_require__("./src/app/ad-detail/ad-detail.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__category_category_component__ = __webpack_require__("./src/app/category/category.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__contact_contact_component__ = __webpack_require__("./src/app/contact/contact.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__content_area_content_area_component__ = __webpack_require__("./src/app/content-area/content-area.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__footer_footer_component__ = __webpack_require__("./src/app/footer/footer.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__header_header_component__ = __webpack_require__("./src/app/header/header.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__intro_intro_component__ = __webpack_require__("./src/app/intro/intro.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__nav_nav_component__ = __webpack_require__("./src/app/nav/nav.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__search_search_component__ = __webpack_require__("./src/app/search/search.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__signin_signin_component__ = __webpack_require__("./src/app/signin/signin.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__signup_signup_component__ = __webpack_require__("./src/app/signup/signup.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__top_product_top_product_component__ = __webpack_require__("./src/app/top-product/top-product.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__new_ad_new_ad_component__ = __webpack_require__("./src/app/new-ad/new-ad.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_8__ad_detail_ad_detail_component__["a" /* AdDetailComponent */],
                __WEBPACK_IMPORTED_MODULE_9__category_category_component__["a" /* CategoryComponent */],
                __WEBPACK_IMPORTED_MODULE_10__contact_contact_component__["a" /* ContactComponent */],
                __WEBPACK_IMPORTED_MODULE_11__content_area_content_area_component__["a" /* ContentAreaComponent */],
                __WEBPACK_IMPORTED_MODULE_12__footer_footer_component__["a" /* FooterComponent */],
                __WEBPACK_IMPORTED_MODULE_13__header_header_component__["a" /* HeaderComponent */],
                __WEBPACK_IMPORTED_MODULE_14__intro_intro_component__["a" /* IntroComponent */],
                __WEBPACK_IMPORTED_MODULE_15__nav_nav_component__["a" /* NavComponent */],
                __WEBPACK_IMPORTED_MODULE_16__search_search_component__["a" /* SearchComponent */],
                __WEBPACK_IMPORTED_MODULE_17__signin_signin_component__["a" /* SigninComponent */],
                __WEBPACK_IMPORTED_MODULE_18__signup_signup_component__["a" /* SignupComponent */],
                __WEBPACK_IMPORTED_MODULE_19__top_product_top_product_component__["a" /* TopProductComponent */],
                __WEBPACK_IMPORTED_MODULE_20__new_ad_new_ad_component__["a" /* NewAdComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_5__app_routing_module__["a" /* AppRoutingModule */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_6__pouchdb_service__["a" /* PouchdbService */],
                __WEBPACK_IMPORTED_MODULE_7__solr_service__["a" /* SolrService */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/category/category.component.css":
/***/ (function(module, exports) {

module.exports = ".container {\r\n  position: relative;\r\n  width: 15%;\r\n  margin-left: 1%;\r\n}\r\n\r\n.image {\r\n  opacity: 1;\r\n  display: block;\r\n  width: 100%;\r\n  height: auto;\r\n  -webkit-transition: .5s ease;\r\n  transition: .5s ease;\r\n  -webkit-backface-visibility: hidden;\r\n          backface-visibility: hidden;\r\n}\r\n\r\n.middle {\r\n  -webkit-transition: .5s ease;\r\n  transition: .5s ease;\r\n  opacity: 0;\r\n  position: absolute;\r\n  top: 50%;\r\n  left: 50%;\r\n  -webkit-transform: translate(-50%, -50%);\r\n          transform: translate(-50%, -50%);\r\n  -ms-transform: translate(-50%, -50%);\r\n  text-align: center;\r\n}\r\n\r\n.container:hover .image {\r\n  opacity: 0.3;\r\n}\r\n\r\n.container:hover .middle {\r\n  opacity: 1;\r\n}\r\n\r\n.text {\r\n  background-color: black;\r\n  color: white;\r\n  font-size: 14px;\r\n  padding: 16px 32px;\r\n  opacity: 0.7;\r\n}\r\n\r\nh2 {\r\n  text-align: center;\r\n  margin: 40px;\r\n}\r\n"

/***/ }),

/***/ "./src/app/category/category.component.html":
/***/ (function(module, exports) {

module.exports = "<h2>ALL CATEGORIES</h2>\n<div class=\"row\">\n  <div class=\"container\">\n    <img src=\"https://images.meredith.com/content/dam/bhg/Images/2011/07/101616225.jpg.rendition.550.jpg\" alt=\"Avatar\" class=\"image\" style=\"width:100%\">\n    <div class=\"middle\">\n      <div class=\"text\">Home & Garden</div>\n    </div>\n  </div>\n  <div class=\"container\">\n    <img src=\"https://image.yes24.vn/Upload/ProductImage/minhchau2017/1869499_M.jpg\" alt=\"Avatar\" class=\"image\" style=\"width:100%\">\n    <div class=\"middle\">\n      <div class=\"text\">Fashion</div>\n    </div>\n  </div>\n  <div class=\"container\">\n    <img src=\"https://www.thegoodguys.com.au/wcsstore/TGGCAS/idcplg?IdcService=GET_FILE&RevisionSelectionMethod=LatestReleased&noSaveAs=1&dDocName=50048706_512055&Rendition=ZOOMIMAGE\" alt=\"Avatar\" class=\"image\" style=\"width:100%\">\n    <div class=\"middle\">\n      <div class=\"text\">Electronic</div>\n    </div>\n  </div>\n  <div class=\"container\">\n    <img src=\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTucnlUTijtmncea_VgeNePqHARt-r2WSNJIfPflNyI-moIrBwQjA\" alt=\"Avatar\" class=\"image\" style=\"width:100%\">\n    <div class=\"middle\">\n      <div class=\"text\">Sport</div>\n    </div>\n  </div>\n  <div class=\"container\">\n    <img src=\"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNuEI8pMjZCDQDakJ8r8pGcW6nWhusrGrLBy3GZawHg-hDtNBBdw\" alt=\"Avatar\" class=\"image\" style=\"width:100%\">\n    <div class=\"middle\">\n      <div class=\"text\">Plant</div>\n    </div>\n  </div>\n  <div class=\"container\">\n    <img src=\"https://images-na.ssl-images-amazon.com/images/I/51BvbVR7UeL._SX258_BO1,204,203,200_.jpg\" alt=\"Avatar\" class=\"image\" style=\"width:100%\">\n    <div class=\"middle\">\n      <div class=\"text\">Pets</div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/category/category.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategoryComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var CategoryComponent = /** @class */ (function () {
    function CategoryComponent() {
    }
    CategoryComponent.prototype.ngOnInit = function () {
    };
    CategoryComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-category',
            template: __webpack_require__("./src/app/category/category.component.html"),
            styles: [__webpack_require__("./src/app/category/category.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], CategoryComponent);
    return CategoryComponent;
}());



/***/ }),

/***/ "./src/app/contact/contact.component.css":
/***/ (function(module, exports) {

module.exports = "@import url(\"https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css\");\r\n\r\n.container{\r\n  margin-top: 50px\r\n}\r\n"

/***/ }),

/***/ "./src/app/contact/contact.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm-6\">\n      <div class=\"well\">\n        <h3 style=\"line-height:20%;\"><i class=\"fa fa-home fa-1x\" style=\"line-height:6%;color:#339966\"></i> Address</h3>\n        <p style=\"margin-top:6%;line-height:35%\">120 Dien Bien Phu Street, Binh Thanh District, Ho Chi Minh City</p>\n        <br />\n        <br />\n        <h3 style=\"line-height:20%;\"><i class=\"fa fa-phone fa-1x\" style=\"line-height:6%;color:#339966\"></i> Phone Number</h3>\n        <p style=\"margin-top:6%;line-height:35%\">(+84)282 333 777</p>\n        <br />\n        <br />\n        <h3 style=\"line-height:20%;\"><i class=\"fa fa-envelope fa-1x\" style=\"line-height:6%;color:#339966\"></i> E-Mail Address</h3>\n        <p style=\"margin-top:6%;line-height:35%\">abc@gmail.com</p>\n        <br />\n        <br />\n        <h3 style=\"line-height:20%;\"><i class=\"fa fa-user fa-1x\" style=\"line-height:6%;color:#339966\"></i> Representative</h3>\n        <p style=\"margin-top:6%;line-height:35%\">Mr. David Nguyen</p>\n        <br />\n        <br />\n        <h3 style=\"line-height:20%;\"><i class=\"fa fa-yelp fa-1x\" style=\"line-height:6%;color:#339966\"></i> Website</h3>\n        <p style=\"margin-top:6%;line-height:35%\"><a href=\"/\">abc.com</a></p>\n      </div>\n    </div>\n    <div class=\"col-sm-6\">\n      <iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96690.80542089987!2d29.864461132544537!3d40.77109282810726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cb4f66644bfb9d%3A0x82690ee7586b7eb9!2zxLB6bWl0LCBLb2NhZWxp!5e0!3m2!1str!2str!4v1480782606579\" width=\"565\" height=\"430\" frameborder=\"0\" style=\"border:0\" allowfullscreen></iframe>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/contact/contact.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContactComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ContactComponent = /** @class */ (function () {
    function ContactComponent() {
    }
    ContactComponent.prototype.ngOnInit = function () {
    };
    ContactComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-contact',
            template: __webpack_require__("./src/app/contact/contact.component.html"),
            styles: [__webpack_require__("./src/app/contact/contact.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ContactComponent);
    return ContactComponent;
}());



/***/ }),

/***/ "./src/app/content-area/content-area.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/content-area/content-area.component.html":
/***/ (function(module, exports) {

module.exports = "<app-search></app-search>\n<!-- <app-category></app-category> -->\n<app-top-product></app-top-product>\n"

/***/ }),

/***/ "./src/app/content-area/content-area.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContentAreaComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ContentAreaComponent = /** @class */ (function () {
    function ContentAreaComponent() {
    }
    ContentAreaComponent.prototype.ngOnInit = function () {
    };
    ContentAreaComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-content-area',
            template: __webpack_require__("./src/app/content-area/content-area.component.html"),
            styles: [__webpack_require__("./src/app/content-area/content-area.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], ContentAreaComponent);
    return ContentAreaComponent;
}());



/***/ }),

/***/ "./src/app/footer/footer.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/footer/footer.component.html":
/***/ (function(module, exports) {

module.exports = "<br/>\n<br/>\n<br/>\n<div class=\"footer-copyright py-3 text-center\">\n  © 2018 Copyright:\n  <a href=\"#\"> abc.com </a>\n</div>\n"

/***/ }),

/***/ "./src/app/footer/footer.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FooterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FooterComponent = /** @class */ (function () {
    function FooterComponent() {
    }
    FooterComponent.prototype.ngOnInit = function () {
    };
    FooterComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-footer',
            template: __webpack_require__("./src/app/footer/footer.component.html"),
            styles: [__webpack_require__("./src/app/footer/footer.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], FooterComponent);
    return FooterComponent;
}());



/***/ }),

/***/ "./src/app/header/header.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/header/header.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"logo\">\n  <img src=\"https://image.flaticon.com/icons/png/512/295/295144.png\" alt=\"Logo\" width=\"50\"/>\n</div>\n"

/***/ }),

/***/ "./src/app/header/header.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeaderComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HeaderComponent = /** @class */ (function () {
    function HeaderComponent() {
    }
    HeaderComponent.prototype.ngOnInit = function () {
    };
    HeaderComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-header',
            template: __webpack_require__("./src/app/header/header.component.html"),
            styles: [__webpack_require__("./src/app/header/header.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], HeaderComponent);
    return HeaderComponent;
}());



/***/ }),

/***/ "./src/app/intro/intro.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/intro/intro.component.html":
/***/ (function(module, exports) {

module.exports = "<div id=\"carouselExampleIndicators\" class=\"carousel slide\" data-ride=\"carousel\">\n  <ol class=\"carousel-indicators\">\n    <li data-target=\"#carouselExampleIndicators\" data-slide-to=\"0\" class=\"active\"></li>\n    <li data-target=\"#carouselExampleIndicators\" data-slide-to=\"1\"></li>\n    <li data-target=\"#carouselExampleIndicators\" data-slide-to=\"2\"></li>\n  </ol>\n  <div class=\"carousel-inner\">\n    <div class=\"carousel-item active\">\n      <img class=\"d-block w-100\" src=\"http://www.uniwallpaper.com/static/images/FFS8vxT.jpg\" alt=\"First slide\">\n    </div>\n    <div class=\"carousel-item\">\n      <img class=\"d-block w-100\" src=\"data:image/jpeg;base64,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\" alt=\"Second slide\">\n    </div>\n    <div class=\"carousel-item\">\n      <img class=\"d-block w-100\" src=\"data:image/jpeg;base64,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\" alt=\"Third slide\">\n    </div>\n  </div>\n  <a class=\"carousel-control-prev\" href=\"#carouselExampleIndicators\" role=\"button\" data-slide=\"prev\">\n    <span class=\"carousel-control-prev-icon\" aria-hidden=\"true\"></span>\n    <span class=\"sr-only\">Previous</span>\n  </a>\n  <a class=\"carousel-control-next\" href=\"#carouselExampleIndicators\" role=\"button\" data-slide=\"next\">\n    <span class=\"carousel-control-next-icon\" aria-hidden=\"true\"></span>\n    <span class=\"sr-only\">Next</span>\n  </a>\n</div>\n"

/***/ }),

/***/ "./src/app/intro/intro.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IntroComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var IntroComponent = /** @class */ (function () {
    function IntroComponent() {
    }
    IntroComponent.prototype.ngOnInit = function () {
    };
    IntroComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-intro',
            template: __webpack_require__("./src/app/intro/intro.component.html"),
            styles: [__webpack_require__("./src/app/intro/intro.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], IntroComponent);
    return IntroComponent;
}());



/***/ }),

/***/ "./src/app/nav/nav.component.css":
/***/ (function(module, exports) {

module.exports = "button{\r\n  margin-right: 5px;\r\n}\r\n"

/***/ }),

/***/ "./src/app/nav/nav.component.html":
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-expand-sm bg-dark navbar-dark\">\n  <a routerLink=\"/\">\n    <img src=\"http://icons.iconarchive.com/icons/graphicloads/100-flat/256/home-icon.png\" alt=\"Logo\" width=\"40\" />\n  </a>\n  <div id=\"navbarNavDropdown\" class=\"navbar-collapse collapse\">\n    <ul class=\"navbar-nav mr-auto\">\n      <li class=\"nav-item\">\n        <a routerLink=\"/\" class=\"nav-link\">Home\n          <span class=\"sr-only\">(current)</span>\n        </a>\n      </li>\n      <li class=\"nav-item\">\n        <a routerLink=\"/intro\" class=\"nav-link\">Introduce</a>\n      </li>\n      <li class=\"nav-item\">\n        <a class=\"nav-link\">Support</a>\n      </li>\n      <li class=\"nav-item\">\n        <a routerLink=\"/contact\" class=\"nav-link\">Contact</a>\n      </li>\n\n    </ul>\n    <ul class=\"navbar-nav\">\n      <li class=\"nav-item\">\n        <button routerLink=\"/sign-in\" class=\"btn btn-info\">Sign In</button>\n      </li>\n      <li class=\"nav-item\">\n        <button routerLink=\"/sign-up\" class=\"btn btn-outline-info\">Sign Up</button>\n      </li>\n      <li class=\"nav-item dropdown\">\n        <a class=\"nav-link dropdown-toggle\" href=\"http://example.com\" id=\"navbarDropdownMenuLink\" data-toggle=\"dropdown\" aria-haspopup=\"true\"\n           aria-expanded=\"false\">\n          Language\n        </a>\n        <div class=\"dropdown-menu\" aria-labelledby=\"navbarDropdownMenuLink\">\n          <a class=\"dropdown-item\" href=\"#\">English</a>\n          <a class=\"dropdown-item\" href=\"#\">Tiếng Việt</a>\n        </div>\n      </li>\n    </ul>\n  </div>\n</nav>\n"

/***/ }),

/***/ "./src/app/nav/nav.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var NavComponent = /** @class */ (function () {
    function NavComponent() {
    }
    NavComponent.prototype.ngOnInit = function () {
    };
    NavComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-nav',
            template: __webpack_require__("./src/app/nav/nav.component.html"),
            styles: [__webpack_require__("./src/app/nav/nav.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], NavComponent);
    return NavComponent;
}());



/***/ }),

/***/ "./src/app/new-ad/new-ad.component.css":
/***/ (function(module, exports) {

module.exports = ".white{\r\n  color:#000;\r\n  background-color:#fff;\r\n}\r\n\r\n.btn-facebook {\r\n  color: #ffffff;\r\n  -webkit-text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);\r\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);\r\n  background-color: #2b4b90;\r\n  *background-color: #133783;\r\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#3b5998), to(#133783));\r\n  background-image: linear-gradient(to bottom, #3b5998, #133783);\r\n  background-repeat: repeat-x;\r\n  border-color: #133783 #133783 #091b40;\r\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\r\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff3b5998', endColorstr='#ff133783', GradientType=0);\r\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\r\n}\r\n\r\n.btn-facebook:hover,\r\n.btn-facebook:focus,\r\n.btn-facebook:active,\r\n.btn-facebook.active,\r\n.btn-facebook.disabled,\r\n.btn-facebook[disabled] {\r\n  color: #ffffff;\r\n  background-color: #133783 !important;\r\n  *background-color: #102e6d !important;\r\n}\r\n\r\n.btn-facebook:active,\r\n.btn-facebook.active {\r\n  background-color: #0d2456 \\9 !important;\r\n}\r\n\r\n.panel-title{\r\n  text-align: center\r\n}\r\n\r\n.container{\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center\r\n}\r\n"

/***/ }),

/***/ "./src/app/new-ad/new-ad.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"panel-heading\">\n        <h3 class=\"panel-title\">Post Advertisement</h3>\n      </div>\n      <label>Title</label>\n      <input class=\"form-control\" name=\"title\" placeholder=\"title\" [(ngModel)]=\"ad.title\" type=\"text\"/>\n      <label>Area</label>\n      <input class=\"form-control\" name=\"area\" placeholder=\"area\" [(ngModel)]=\"ad.area\" type=\"text\"/>\n      <label>Category</label>\n      <input class=\"form-control\" name=\"category\" placeholder=\"category\" [(ngModel)]=\"ad.category\" type=\"text\"/>\n      <label>Price</label>\n      <input class=\"form-control\" name=\"price\" placeholder=\"price\" [(ngModel)]=\"ad.price\" type=\"text\"/>\n      <label>Content</label>\n      <textarea class=\"form-control\" name=\"content\" placeholder=\"content\" type=\"textarea\"\n                [(ngModel)]=\"ad.content\"></textarea>\n      <br>\n      <button class=\"btn btn-lg btn-primary btn-block\" type=\"submit\" (click)=\"addAd()\">Post</button>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/new-ad/new-ad.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewAdComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ad__ = __webpack_require__("./src/app/ad.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pouchdb_service__ = __webpack_require__("./src/app/pouchdb.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__solr_service__ = __webpack_require__("./src/app/solr.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var NewAdComponent = /** @class */ (function () {
    function NewAdComponent(pouchdb, solr) {
        this.pouchdb = pouchdb;
        this.solr = solr;
        this.ad = new __WEBPACK_IMPORTED_MODULE_1__ad__["a" /* Ad */]('', '', '', '', 0);
    }
    NewAdComponent.prototype.ngOnInit = function () {
    };
    NewAdComponent.prototype.addAd = function () {
        var a = this.pouchdb.addAd(this.ad);
        console.log('inserted to couchdb');
        this.ad = new __WEBPACK_IMPORTED_MODULE_1__ad__["a" /* Ad */]('', '', '', '', 0);
    };
    NewAdComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-new-ad',
            template: __webpack_require__("./src/app/new-ad/new-ad.component.html"),
            styles: [__webpack_require__("./src/app/new-ad/new-ad.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__pouchdb_service__["a" /* PouchdbService */], __WEBPACK_IMPORTED_MODULE_3__solr_service__["a" /* SolrService */]])
    ], NewAdComponent);
    return NewAdComponent;
}());



/***/ }),

/***/ "./src/app/pouchdb.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PouchdbService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pouchdb__ = __webpack_require__("./node_modules/pouchdb/lib/index-browser.es.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from__ = __webpack_require__("./node_modules/rxjs/_esm5/add/observable/from.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__solr_service__ = __webpack_require__("./src/app/solr.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ad__ = __webpack_require__("./src/app/ad.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__environments_environment__ = __webpack_require__("./src/environments/environment.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var PouchDB = __WEBPACK_IMPORTED_MODULE_1_pouchdb__["a" /* default */];
var PouchdbService = /** @class */ (function () {
    function PouchdbService(solr) {
        this.solr = solr;
        this.remote = __WEBPACK_IMPORTED_MODULE_5__environments_environment__["a" /* environment */].couchdb_server + '/advertisement';
        this.db = new PouchDB('advertisement');
        var options = {
            live: true,
            retry: true
        };
        this.db.sync(this.remote, options);
    }
    // add to both CouchDB and Solr
    PouchdbService.prototype.addAd = function (item) {
        var self = this;
        this.db.post(item, function (err, response) {
            if (err) {
                return console.log(err);
            }
            var solr_item = new __WEBPACK_IMPORTED_MODULE_4__ad__["a" /* Ad */](item.title, item.content, item.area, item.category, item.price, response.id);
            self.solr.add(solr_item).subscribe(function (res) { return console.log('inserted to solr'); });
        });
    };
    // add to CouchDB
    PouchdbService.prototype.add = function (item) {
        this.db.post(item, function (err, response) {
            if (err) {
                return console.log(err);
            }
        });
    };
    PouchdbService.prototype.get = function (id) {
        return this.db.get(id);
    };
    PouchdbService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__solr_service__["a" /* SolrService */]])
    ], PouchdbService);
    return PouchdbService;
}());



/***/ }),

/***/ "./src/app/search/search.component.css":
/***/ (function(module, exports) {

module.exports = ".input-group-btn, input{\r\n  margin-right: 3px;\r\n}\r\n\r\n.container{\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center\r\n}\r\n\r\n.btn-info {\r\n  margin-right:15px;\r\n  text-transform:uppercase;\r\n  padding:10px;\r\n  display:block;\r\n  float:left;\r\n}\r\n\r\n.btn-info a {\r\n  display:block;\r\n  text-decoration:none;\r\n  width:100%;\r\n  height:100%;\r\n  color:#fff;\r\n}\r\n\r\n.more {\r\n  float:right;\r\n}\r\n\r\n.ad-item {\r\n  margin-left: 15%;\r\n  margin-right: 15%;\r\n\r\n}\r\n\r\n.ad-title {\r\n  color: brown\r\n}\r\n\r\n.ad-content {\r\n  line-height: 1.5em;\r\n  height: 4.5em;\r\n  overflow: hidden;\r\n}\r\n\r\n.result {\r\n  text-align: center\r\n}\r\n"

/***/ }),

/***/ "./src/app/search/search.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"jumbotron\">\r\n  <div class=\"container\">\r\n    <div class=\"col-md-12 col-md-offset-8\">\r\n      <div class=\"input-group\">\r\n        <select class=\"form-control col-md-2\" id=\"area\" [(ngModel)]=\"area\">z\r\n          <option>Hà Nội</option>\r\n          <option>Da Nang</option>\r\n          <option>Hồ Chí Minh</option>\r\n          <option value=\"all\">All areas</option>\r\n        </select>\r\n        <select class=\"form-control col-md-2\" id=\"category\" [(ngModel)]=\"cat\">\r\n          <option>Fashion</option>\r\n          <option>Pets</option>\r\n          <option>Home</option>\r\n          <option value=\"all\">All categories</option>\r\n        </select>\r\n        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"keyword\" name=\"keyword\" placeholder=\"Search term...\">\r\n        <span class=\"input-group-btn\">\r\n          <button class=\"btn btn-warning\" type=\"button\" (click)=\"searchDocument()\">\r\n            <span class=\"glyphicon glyphicon-search\">Search</span>\r\n          </button>\r\n        </span>\r\n        <span class=\"input-group-btn\">\r\n          <button class=\"btn btn-danger\" type=\"button\" routerLink=\"/new-ad\">\r\n            <span class=\"glyphicon glyphicon-search\">Post Now</span>\r\n          </button>\r\n        </span>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<!-- Search results -->\r\n<div *ngFor=\"let item of items\">\r\n  <div class=\"ad-item\">\r\n    <h3 class=\"ad-title\">{{item.title}}</h3>\r\n    <h6>{{item.area}} - {{item.price}}đ</h6>\r\n    <p class=\"ad-content\">{{item.content}}</p>\r\n    <a class=\"more\" routerLink=\"/detail/{{item.couchdb_id}}\" (click)=\"saveUserBehavior(item.couchdb_id)\">Read more</a>\r\n    <br/>\r\n    <hr>\r\n    <!--<a routerLink=\"/detail/{{item.id}}\" innerHTML=\"{{item.title}}\" (click)=\"saveUserBehavior(item.id)\" id=\"title\"></a>-->\r\n    <!-- <p innerHTML=\"{{item.title}}\" id=\"title\"></p> -->\r\n  </div>\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/search/search.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pouchdb_service__ = __webpack_require__("./src/app/pouchdb.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__solr_service__ = __webpack_require__("./src/app/solr.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__user_behavior__ = __webpack_require__("./src/app/user-behavior.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var SearchComponent = /** @class */ (function () {
    function SearchComponent(http, pouchdb, solr) {
        this.http = http;
        this.pouchdb = pouchdb;
        this.solr = solr;
        this.keyword = '';
        this.items = [];
        this.behavior = new __WEBPACK_IMPORTED_MODULE_4__user_behavior__["a" /* UserBehavior */](1);
        this.area = 'all';
        this.cat = 'all';
    }
    SearchComponent.prototype.ngOnInit = function () {
    };
    SearchComponent.prototype.searchDocument = function () {
        var _this = this;
        this.items = [];
        return this.solr.search(this.keyword, this.area, this.cat).subscribe(function (res) {
            Object.keys(res.response.docs).map(function (k) {
                var doc = res.response.docs[k];
                // let id = doc.id;
                var couchdb_id = doc.couchdb_id[0];
                var title = doc.title[0];
                var area = doc.area[0];
                var content = doc.content[0];
                var price = doc.price[0];
                _this.items.push({
                    // 'id': id,
                    'couchdb_id': couchdb_id,
                    'title': title,
                    'area': area,
                    'content': content,
                    'price': price
                });
            });
        });
    };
    SearchComponent.prototype.saveUserBehavior = function (item_id) {
        this.behavior.item = item_id;
        this.pouchdb.add(this.behavior);
    };
    SearchComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-search',
            template: __webpack_require__("./src/app/search/search.component.html"),
            styles: [__webpack_require__("./src/app/search/search.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_1__pouchdb_service__["a" /* PouchdbService */], __WEBPACK_IMPORTED_MODULE_2__solr_service__["a" /* SolrService */]])
    ], SearchComponent);
    return SearchComponent;
}());



/***/ }),

/***/ "./src/app/signin/signin.component.css":
/***/ (function(module, exports) {

module.exports = ".white{\r\n  color:#000;\r\n  background-color:#fff;\r\n}\r\n\r\n.btn-facebook {\r\n  color: #ffffff;\r\n  -webkit-text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);\r\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);\r\n  background-color: #2b4b90;\r\n  *background-color: #133783;\r\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#3b5998), to(#133783));\r\n  background-image: linear-gradient(to bottom, #3b5998, #133783);\r\n  background-repeat: repeat-x;\r\n  border-color: #133783 #133783 #091b40;\r\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\r\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff3b5998', endColorstr='#ff133783', GradientType=0);\r\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\r\n}\r\n\r\n.btn-facebook:hover,\r\n.btn-facebook:focus,\r\n.btn-facebook:active,\r\n.btn-facebook.active,\r\n.btn-facebook.disabled,\r\n.btn-facebook[disabled] {\r\n  color: #ffffff;\r\n  background-color: #133783 !important;\r\n  *background-color: #102e6d !important;\r\n}\r\n\r\n.btn-facebook:active,\r\n.btn-facebook.active {\r\n  background-color: #0d2456 \\9 !important;\r\n}\r\n\r\n.panel-title{\r\n  text-align: center\r\n}\r\n\r\n.container{\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center\r\n}\r\n"

/***/ }),

/***/ "./src/app/signin/signin.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"col-md-6 col-md-offset-3\">\n    <div class=\"panel panel-default\">\n      <div class=\"panel-heading\">\n        <h3 class=\"panel-title\">Login</h3>\n      </div>\n      <div class=\"panel-body\">\n        <div class=\"form-group\">\n          <input class=\"form-control\" placeholder=\"yourmail@example.com\" name=\"email\" type=\"text\">\n        </div>\n        <div class=\"form-group\">\n          <input class=\"form-control\" placeholder=\"Password\" name=\"password\" type=\"password\" value=\"\">\n        </div>\n        <div class=\"checkbox\">\n          <label>\n            <input name=\"remember\" type=\"checkbox\" value=\"Remember Me\"> Remember Me\n          </label>\n        </div>\n        <input class=\"btn btn-lg btn-success btn-block\" type=\"submit\" value=\"Login\">\n\n        <input class=\"btn btn-lg btn-facebook btn-block\" type=\"submit\" value=\"Login via facebook\">\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/signin/signin.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SigninComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SigninComponent = /** @class */ (function () {
    function SigninComponent() {
    }
    SigninComponent.prototype.ngOnInit = function () {
    };
    SigninComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-signin',
            template: __webpack_require__("./src/app/signin/signin.component.html"),
            styles: [__webpack_require__("./src/app/signin/signin.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], SigninComponent);
    return SigninComponent;
}());



/***/ }),

/***/ "./src/app/signup/signup.component.css":
/***/ (function(module, exports) {

module.exports = "body { padding-top:30px; }\r\n.form-control { margin-bottom: 10px; }\r\n.container{\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center\r\n}\r\n.panel-title{\r\n  text-align: center\r\n}\r\n"

/***/ }),

/***/ "./src/app/signup/signup.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"panel-heading\">\n        <h3 class=\"panel-title\">Sign Up</h3>\n      </div>\n      <form action=\"#\" method=\"post\" class=\"form\" role=\"form\">\n        <div class=\"row\">\n          <div class=\"col-xs-6 col-md-6\">\n            <input class=\"form-control\" name=\"firstname\" placeholder=\"First Name\" type=\"text\"\n                   required autofocus/>\n          </div>\n          <div class=\"col-xs-6 col-md-6\">\n            <input class=\"form-control\" name=\"lastname\" placeholder=\"Last Name\" type=\"text\" required/>\n          </div>\n        </div>\n        <input class=\"form-control\" name=\"youremail\" placeholder=\"Your Email\" type=\"email\"/>\n        <input class=\"form-control\" name=\"reenteremail\" placeholder=\"Re-enter Email\" type=\"email\"/>\n        <input class=\"form-control\" name=\"password\" placeholder=\"New Password\" type=\"password\"/>\n        <label for=\"\">\n          Birth Date</label>\n        <div class=\"row\">\n          <div class=\"col-xs-4 col-md-4\">\n            <select class=\"form-control\">\n              <option value=\"Month\">Month</option>\n            </select>\n          </div>\n          <div class=\"col-xs-4 col-md-4\">\n            <select class=\"form-control\">\n              <option value=\"Day\">Day</option>\n            </select>\n          </div>\n          <div class=\"col-xs-4 col-md-4\">\n            <select class=\"form-control\">\n              <option value=\"Year\">Year</option>\n            </select>\n          </div>\n        </div>\n        <label class=\"radio-inline\">\n          <input type=\"radio\" name=\"sex\" id=\"inlineCheckbox1\" value=\"male\"/>\n          Male\n        </label>\n        <label class=\"radio-inline\">\n          <input type=\"radio\" name=\"sex\" id=\"inlineCheckbox2\" value=\"female\"/>\n          Female\n        </label>\n        <br/>\n        <br/>\n        <button class=\"btn btn-lg btn-primary btn-block\" type=\"submit\">\n          Sign up\n        </button>\n      </form>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/signup/signup.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SignupComponent = /** @class */ (function () {
    function SignupComponent() {
    }
    SignupComponent.prototype.ngOnInit = function () {
    };
    SignupComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-signup',
            template: __webpack_require__("./src/app/signup/signup.component.html"),
            styles: [__webpack_require__("./src/app/signup/signup.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], SignupComponent);
    return SignupComponent;
}());



/***/ }),

/***/ "./src/app/solr.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SolrService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__("./src/environments/environment.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SolrService = /** @class */ (function () {
    function SolrService(http) {
        this.http = http;
        this.solr_url = __WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].solr_server + '/advertisement';
    }
    SolrService.prototype.add = function (ads) {
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.solr_url + '/update/json/docs?commit=true', ads, {
            headers: headers
        });
    };
    SolrService.prototype.search = function (keyword, area, cat) {
        var url = this.solr_url + '/select' +
            '?q=' + keyword + ' AND category:' + cat + ' AND area:' + area + '&wt=json';
        return this.http.get(url);
    };
    SolrService.prototype.getDetail = function (id) {
        //return this.http.get(this.solr_url + '/select?q=id:' + id + '&fl=title,description&wt=json');
        return this.http.get(this.solr_url + '/select?q=id:' + id);
    };
    SolrService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], SolrService);
    return SolrService;
}());



/***/ }),

/***/ "./src/app/top-product/top-product.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/top-product/top-product.component.html":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/top-product/top-product.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TopProductComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TopProductComponent = /** @class */ (function () {
    function TopProductComponent() {
    }
    TopProductComponent.prototype.ngOnInit = function () {
    };
    TopProductComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-top-product',
            template: __webpack_require__("./src/app/top-product/top-product.component.html"),
            styles: [__webpack_require__("./src/app/top-product/top-product.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], TopProductComponent);
    return TopProductComponent;
}());



/***/ }),

/***/ "./src/app/user-behavior.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserBehavior; });
var UserBehavior = /** @class */ (function () {
    function UserBehavior(item) {
        this.item = item;
        this.user = 1;
        this.type = 'user_behavior';
    }
    return UserBehavior;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false,
    couchdb_server: 'http://127.0.0.1:5984',
    solr_server: 'http://localhost:8983/solr',
};


/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("./src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("./src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map