import { Mongo } from 'meteor/mongo';

//making mongo collection for comments
export const comments = new Mongo.Collection('comments');

