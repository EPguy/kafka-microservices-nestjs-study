import { User } from '../user/user.dto';

export class AuthorizedRequest extends Request {
  user?: User;
}
