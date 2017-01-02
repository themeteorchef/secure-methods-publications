import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Documents from '../documents';
import isAdmin from '../../../modules/server/is-admin.js';

Meteor.publish('documents.list', function documentsListPublication() {
  if (isAdmin(this.userId)) return Documents.find();
  return Documents.find({ owner: this.userId });
});

Meteor.publish('documents.view', function documentsViewPublication(_id) {
  check(_id, String);
  const documents = Documents.find({ _id });
  const document = documents.fetch()[0];
  const owner = document ? document.owner : null;

  if (this.userId && (owner === this.userId || isAdmin(this.userId))) {
    return Documents.find({ _id });
  }
  return this.ready();
});
