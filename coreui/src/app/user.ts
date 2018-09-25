export class User {
  email?: string;
  password?: string;
  fullname?: string;
  phone?: string;
  address?: string;
  role: string;
  type: string;
  user_id?: string;

  constructor(
    id?: string,
    email?: string,
    password?: string,
    fullname?: string,
    phone?: string,
    address?: string,
    _id?: string
  ) {
    if (_id) {
      this.user_id = _id;
    }
    if (email) {
      this.email = email;
    }
    if (password) {
      this.password = password;
    }
    if (fullname) {
      this.fullname = fullname;
    }
    if (phone) {
      this.phone = phone;
    }
    if (address) {
      this.address = address;
    }
    this.role = "user";
    this.type = "user";
  }

  setUser(obj) {
    this.user_id = obj._id;
    this.email = obj.email;
    this.password = obj.password;
    this.fullname = obj.fullname;
    this.phone = obj.phone;
    this.address = obj.address;
    this.role = "user";
    this.type = "user";
  }
}
