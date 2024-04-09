import React from 'react';
import { Card } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Equipment = ({ equipment }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{equipment.clubName}</Card.Title>
        <Card.Text>
          <strong>Description:</strong> {equipment.description}
        </Card.Text>
        <Card.Text>
          <strong>Meeting Times:</strong> {equipment.meetingTimes}
        </Card.Text>
        <Card.Text>
          <strong>Location:</strong> {equipment.location}
        </Card.Text>
        <Card.Text>
          <strong>URL:</strong> {equipment.url}
        </Card.Text>
        <Card.Text>
          <strong>Contact Info:</strong> {equipment.contactInfo}
        </Card.Text>
        <Card.Text>
          <strong>Category:</strong> {equipment.category}
        </Card.Text>
        <Card.Text>
          <strong>Club Admin:</strong> {equipment.clubAdmin} / {equipment.clubAdminName}
        </Card.Text>
        <Card.Img src={equipment.photo} />
      </Card.Body>
    </Card>
  );
};

// Prop types validation
Equipment.propTypes = {
  equipment: PropTypes.shape({
    clubName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    meetingTimes: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    contactInfo: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    clubAdmin: PropTypes.string.isRequired,
    clubAdminName: PropTypes.string.isRequired,
  }).isRequired,
};

export default Equipment;
