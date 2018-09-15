export class User {
  email?: string;
  password?: string;
  fullname?: string;
  phone?: string;
  address?: string;
  role: string;
  type: string;

  constructor(
    email?: string,
    password?: string,
    fullname?: string,
    phone?: string,
    address?: string
  ) {
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
    this.email = obj.email;
    this.password = obj.password;
    this.fullname = obj.fullname;
    //this.phone = obj.phone;
    //this.address = obj.address;
    this.role = "user";
    this.type = "user";
  }
}
