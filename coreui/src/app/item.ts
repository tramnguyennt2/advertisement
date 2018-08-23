export class Item {
  title?: string; // ?: maybe has or not
  content?: string;
  cat_id?: string;
  cat?: string;
  sub_cat_id?: string;
  sub_cat?: string;
  loc_id?: string;
  prov_id?: string;
  price?: number;
  couchdb_id?: string;
  created_at: string;
  type: string;

  constructor(title?: string, content?: string, cat_id?: string, cat?: string, sub_cat_id?: string,
              sub_cat?: string, loc_id?: string, prov_id?: string, price?: number, couchdb_id?: string) {
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
    if (prov_id) {
      this.prov_id = prov_id;
    }
    if (price > 0) {
      this.price = price;
    }
    if (couchdb_id) {
      this.couchdb_id = couchdb_id;
    }
    let now = new Date();
    this.created_at = now.toISOString();
    this.type = "item";
  }
}
