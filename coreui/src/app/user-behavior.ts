export class UserBehavior {
  user_id: string;
  type: string;
  item_id: string;
  rating: number;

  constructor(user_id: string, item_id: string, rating?: number) {
    this.user_id = user_id;
    this.item_id = item_id;
    if (rating) {
      this.rating = rating;
    } else {
      this.rating = 1;
    }
    this.type = "rating";
  }
}
