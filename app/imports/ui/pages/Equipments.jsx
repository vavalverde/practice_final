import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Card, Image, Label, Header } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Interests } from '../../api/interests/Interests';
import { Equipments } from '../../api/equipments/Equipments';
import { EquipmentsInterests } from '../../api/equipments/EquipmentsInterests';
import { EquipmentsParticipation } from '../../api/equipments/EquipmentsParticipation';
import { EquipmentsWorkouts} from '../../api/equipments/EquipmentsWorkouts';

function getEquipmentData(email) {
  const data = Equipments.collection.findOne({ email });
  const interests = _.pluck(EquipmentsInterests.collection.find({ equipment: email }).fetch(), 'interest');
  const workouts = _.pluck(EquipmentsWorkouts.collection.find({ equipment: email }).fetch(), 'workout');
  const participation = _.pluck(EquipmentsParticipation.collection.find({ equipment: email }).fetch(), 'workout');
  // console.log(_.extend({ }, data, { interests, projects: projectPictures }));
  return _.extend({}, data, { interests, workouts, participation });
}

/** Component for layout out a equipment Card. */
const MakeCard = (props) => (
  <Card>
    <Card.Content>
      <Image floated='right' size='mini' src={props.equipment.picture}/>
      <Card.Header>{props.equipment.firstName} {props.equipment.lastName}</Card.Header>
      <Card.Meta>
        <span className='date'>{props.equipment.year}</span>
      </Card.Meta>
      <Card.Description>
        {props.equipment.bio}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Interests</Header>
      {_.map(props.equipment.interests,
        (interest, index) => <Label key={index} size='tiny' color='teal'>{interest}</Label>)}
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Workouts</Header>
      {_.map(props.equipment.workouts, (workout, index) => <Label key={index} size='tiny' color='teal'>{workout}</Label>)}
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Joined Workouts</Header>
      {_.map(props.equipment.participation, (workout, index) => <Label key={index} size='tiny' color='teal'>{workout}</Label>)}
    </Card.Content>
  </Card>
);

/** Properties */
MakeCard.propTypes = {
  equipment: PropTypes.object.isRequired,
};

/** Renders the equipment Collection as a set of Cards. */
class EquipmentsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { interests: [] };
  }

  submit(data) {
    this.setState({ interests: data.interests || [] });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const emailsall = _.pluck(Equipments.collection.find().fetch(), 'email');
    const equipmentDataAll = emailsall.map(email => getEquipmentData(email));
    return (
      <div>
        <Header as="h1" textAlign='center' >All Equipments</Header>
        <Container id="equipments-page">
          <Card.Group style={{ paddingTop: '10px' }}>
            {_.map(equipmentDataAll, (equipment, index) => {
              if (equipment.firstName) {
                return <MakeCard key={index} equipment={equipment}/>;
              }
              return null;
            })}
          </Card.Group>
        </Container>
      </div>
    );
  }
}

/** Require an array of Stuff documents in the props. */
EquipmentsPage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Equipments.userPublicationName);
  const sub2 = Meteor.subscribe(EquipmentsInterests.userPublicationName);
  const sub3 = Meteor.subscribe(EquipmentsWorkouts.userPublicationName);
  const sub4 = Meteor.subscribe(EquipmentsParticipation.userPublicationName);
  const sub5 = Meteor.subscribe(Interests.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready(),
  };
})(EquipmentsPage);
