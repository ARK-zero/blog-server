/**
 * Created by aman on 3/18/2018.
 */
export class Validator {
  public static validateUsername(username) {
    const pattern = /^[\u4e00-\u9fa5\w\d]{2,12}$/;
    return username.match(pattern);
  }

  public static validatePassword(password) {
    const pattern = /^[\w\d!@#$%^&*]{8,30}$/;
    return password.match(pattern);
  }
}
