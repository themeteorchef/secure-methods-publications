import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import Documents from './documents';
import rateLimit from '../../modules/rate-limit.js';
import isAuthorized from '../../modules/is-authorized.js';

export const upsertDocument = new ValidatedMethod({
  name: 'documents.upsert',
  validate: new SimpleSchema({
    _id: { type: String, optional: true },
    title: { type: String, optional: true },
    body: { type: String, optional: true },
  }).validator(),
  run(document) {
    return isAuthorized({ userId: this.userId, documentId: document._id })
    .then((owner) => {
      const documentToInsert = document;
      documentToInsert.owner = owner;
      return Documents.upsert({ _id: document._id }, { $set: documentToInsert });
    })
    .catch((error) => { throw new Meteor.Error('500', error); });
  },
});

export const removeDocument = new ValidatedMethod({
  name: 'documents.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run(document) {
    return isAuthorized({ userId: this.userId, documentId: document._id })
    .then(() => {
      Documents.remove(document._id);
    })
    .catch((error) => { throw new Meteor.Error('500', error); });
  },
});

rateLimit({
  methods: [
    upsertDocument,
    removeDocument,
  ],
  limit: 5,
  timeRange: 1000,
});
