/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Documents from '../api/documents/documents.js';

const isAuthorized = ({ userId, documentId }) => {
  const existingDocument = Documents.findOne(documentId, { fields: { owner: 1 } });
  const owner = existingDocument ? existingDocument.owner : userId;
  const isAdmin = Roles.userIsInRole(userId, 'admin');

  if (userId && (userId === owner || isAdmin)) return owner;
  throw new Meteor.Error('500', 'Sorry, you\'re not allowed to do that!');
};

export default isAuthorized;
