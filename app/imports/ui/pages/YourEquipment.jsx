import React from 'react';
import { Grid, Segment, Header, Form, Loader } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, SubmitField } from 'uniforms-semantic';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { Interests } from '../../api/interests/Interests';
import { Equipments } from '../../api/equipments/Equipments';
import { EquipmentsInterests } from '../../api/equipments/EquipmentsInterests';
import { updateEquipmentMethod } from '../../startup/both/Methods';
import RadioField from '../forms/controllers/RadioField';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allInterests) => new SimpleSchema({
  email: { type: String, label: 'Email', optional: true },
  firstName: { type: String, label: 'First', optional: true },
  lastName: { type: String, label: 'Last', optional: true },
  bio: { type: String, label: 'Biographical statement', optional: true },
  year: { type: Array, label: 'Year', optional: true },
  'year.$': { type: String, allowedValues: ['Freshman', 'Sophomore', 'Junior', 'Senior'] },
  picture: { type: String, label: 'Picture URL', optional: true },
  interests: { type: Array, label: 'Interests', optional: true },
  'interests.$': { type: String, allowedValues: allInterests },
});

/** Renders the Home Page: what appears after the user logs in. */
class YourEquipment extends React.Component {

  /** On submit, insert the data. */
  submit(data) {
    Meteor.call(updateEquipmentMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Equipment updated successfully', 'success');
      }
    });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    const email = Meteor.user().username;
    // Create the form schema for uniforms. Need to determine all interests and projects for multiselect list.
    const allInterests = _.pluck(Interests.collection.find().fetch(), 'name');
    const formSchema = makeSchema(allInterests);
    const bridge = new SimpleSchema2Bridge(formSchema);
    // Now create the model with all the user information.
    const interests = _.pluck(EquipmentsInterests.collection.find({ equipment: email }).fetch(), 'interest');
    const equipment = Equipments.collection.findOne({ email });
    const model = _.extend({}, equipment, { interests });
    return (
      <Grid id="your-equipment-page" container centered>
        <Grid.Column>
          <Header as="h2" textAlign="center">Your Equipment</Header>
          <Header as="h3" textAlign="center">Please fill out form to be displayed in equipments</Header>
          <AutoForm model={model} schema={bridge} onSubmit={data => this.submit(data)}>
            <Segment>
              <Form.Group widths={'equal'}>
                <TextField id='firstName' name='firstName' showInlineError={true} placeholder={'First Name'}/>
                <TextField id='lastName' name='lastName' showInlineError={true} placeholder={'Last Name'}/>
                <TextField name='email' showInlineError={true} placeholder={'email'} disabled/>
              </Form.Group>
              <LongTextField id='bio' name='bio' placeholder='Write a little bit about yourself.'/>
              <Form.Group widths={'equal'}>
                <RadioField id='year' name='year' inline='true' showInlineError={true} placeholder={'Year'}/>
                <TextField name='picture' showInlineError={true} placeholder={'URL to picture'}/>
              </Form.Group>
              <Form.Group widths={'equal'}>
                <MultiSelectField name='interests' showInlineError={true} placeholder={'Interests'}/>
              </Form.Group>
              <SubmitField id='your-equipment-page-submit' value='Update'/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}

YourEquipment.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Interests.userPublicationName);
  const sub2 = Meteor.subscribe(Equipments.userPublicationName);
  const sub3 = Meteor.subscribe(EquipmentsInterests.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready(),
  };
})(YourEquipment);
