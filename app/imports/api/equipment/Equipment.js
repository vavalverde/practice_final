import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/** Encapsulates state and variable values for this collection. */
class EquipmentsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'EquipmentsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      clubName: String,
      description: String,
      meetingTimes: String,
      location: String,
      url: String,
      contactInfo: String,
      photo: String,
      category: String,
      clubAdmin: String,
      clubAdminName: String,
    });
    // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
  }
}

export const Equipments = new EquipmentsCollection();
