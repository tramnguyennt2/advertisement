export class Item {
  title?: string; // ?: maybe has or not
  content?: string;
  cat_id?: string;
  cat?: string;
  sub_cat_id?: string;
  sub_cat?: string;
  loc_id?: string;
  loc?: string;
  prov_id?: string;
  prov?: string;
  price?: string;
  couchdb_id?: string;
  created_at: string;
  type: string;
  user_id?: string;

  constructor(
    title?: string,
    content?: string,
    cat_id?: string,
    cat?: string,
    sub_cat_id?: string,
    sub_cat?: string,
    loc_id?: string,
    loc?: string,
    prov_id?: string,
    prov?: string,
    price?: string,
    couchdb_id?: string,
    user_id?: string,
    _id?: string
  ) {
    if (title) {
      this.title = title;
    }
    if (content) {
      this.content = content;
    }
    if (cat_id) {
      this.cat_id = cat_id;
    }
    if (cat) {
      this.cat = cat;
    }
    if (sub_cat_id) {
      this.sub_cat_id = sub_cat_id;
    }
    if (sub_cat) {
      this.sub_cat = sub_cat;
    }
    if (loc_id) {
      this.loc_id = loc_id;
    }
    if (loc) {
      this.loc = loc;
    }
    if (prov_id) {
      this.prov_id = prov_id;
    }
    if (prov) {
      this.prov = prov;
    }
    if (price) {
      this.price = price;
    }
    if (couchdb_id) {
      this.couchdb_id = couchdb_id;
    }
    if (_id) {
      this.couchdb_id = _id;
    }
    if (user_id) {
      this.user_id = user_id;
    }
    let now = new Date();
    this.created_at = now.toISOString();
    this.type = "item";
  }

  setItem(obj) {
    this.title = obj.title;
    this.content = obj.content;
    this.cat_id = obj.cat_id;
    this.cat = obj.cat;
    this.sub_cat_id = obj.sub_cat_id;
    this.sub_cat = obj.sub_cat;
    this.loc_id = obj.loc_id;
    this.loc = obj.loc;
    this.prov_id = obj.prov_id;
    this.prov = obj.prov;
    this.price = obj.price;
    this.user_id = obj.user_id;
    if (obj.couchdb_id) {
      this.couchdb_id = obj.couchdb_id;
    } else {
      this.couchdb_id = obj._id;
    }
    this.created_at = obj.created_at;
    this.type = "item";
  }
}
