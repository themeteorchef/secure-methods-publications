/* eslint-disable consistent-return */

import { Roles } from 'meteor/alanning:roles';
import Documents from '../api/documents/documents.js';

const isAuthorized = ({ userId, documentId }) =>
new Promise((resolve, reject) => {
  const existingDocument = Documents.findOne(documentId, { fields: { owner: 1 } });
  const owner = existingDocument ? existingDocument.owner : userId;
  const isAdmin = Roles.userIsInRole(userId, 'admin');
  if (userId && (userId === owner || isAdmin)) resolve(owner);
  reject('Sorry, you\'re not allowed to do that!');
});

export default isAuthorized;
