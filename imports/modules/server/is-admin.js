import { Roles } from 'meteor/alanning:roles';

export default function isAdmin(userId) {
  return Roles.userIsInRole(userId, 'admin');
}
