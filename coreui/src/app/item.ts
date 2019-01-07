export class Item {
  db_id?: string;
  id?: string;
  title?: string; // ?: maybe has or not
  content?: string;
  cat_id?: string;
  cat?: string;
  sub_cat_id?: string;
  sub_cat?: string;
  loc_id?: string;
  loc?: string;
  _rev?: string;
  sub_loc_id?: string;
  sub_loc?: string;
  price?: string;
  created_at: string;
  type: string;
  user_id?: string;
  _attachments?: object;
  token: any[];

  constructor(title?: string, content?: string, cat_id?: string, cat?: string, sub_cat_id?: string, sub_cat?: string,
              loc_id?: string, loc?: string, sub_loc_id?: string, sub_loc?: string, price?: string, user_id?: string, id?: string, _attachments?: object, token?: any[]) {
    if (title) this.title = title;
    if (content) this.content = content;
    if (cat_id) this.cat_id = cat_id;
    if (cat) this.cat = cat;
    if (sub_cat_id) this.sub_cat_id = sub_cat_id;
    if (sub_cat) this.sub_cat = sub_cat;
    if (loc_id) this.loc_id = loc_id;
    if (loc) this.loc = loc;
    if (sub_loc_id) this.sub_loc_id = sub_loc_id;
    if (sub_loc) this.sub_loc = sub_loc;
    if (price) this.price = price;
    if (id) this.id = id;
    if (_attachments) this._attachments = _attachments;
    if (token) this.token = token;
    if (user_id) this.user_id = user_id;
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
    this.sub_loc_id = obj.sub_loc_id;
    this.sub_loc = obj.sub_loc;
    this.price = obj.price;
    this.user_id = obj.user_id;
    this.id = obj._id;
    this._attachments = obj._attachments;
    this.token = obj.token;
    this.created_at = obj.created_at;
    this._rev = obj._rev;
    this.type = "item";
  }

  addDbId(id) {
    this.db_id = id;
  }
}
