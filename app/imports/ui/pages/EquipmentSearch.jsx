import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Dropdown, Header } from 'react-bootstrap';
import { Equipments } from '../../api/equipment/Equipment';

const EquipmentSearch = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleChange = (value) => {
    setSelectedCategory(value);
  };

  const handleSearchChange = (searchQuery) => {
    // You can implement search functionality if needed
  };

  const equipment = Equipments.collection.find({}).fetch();

  const filteredEquipment = equipment.filter((item) => {
    if (!selectedCategory) return true; // If no category is selected, return all items
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const categoryOptions = [
    { key: 'all', value: '', text: 'All Categories' },
    { key: 'sports', value: 'Sports', text: 'Sports' },
    { key: 'games', value: 'Games', text: 'Games' },
    { key: 'music', value: 'Music', text: 'Music' },
    { key: 'academic', value: 'Academic', text: 'Academic' },
    // Add more categories as needed
  ];

  return (
    <Container className="py-3">
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <h2 className="text-center">Equipment Search</h2>
        </Col>
      </Row>
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <Form>
            <Row>
              <Col>
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    Filter Equipment
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {categoryOptions.map((option) => (
                      <Dropdown.Item key={option.key} onClick={() => handleChange(option.value)}>
                        {option.text}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row className="mt-5">
        {filteredEquipment.map((item) => (
          <Col md={6} className="mb-3" key={item._id}>
            <Card>
              <Card.Img variant="top" src={item.image} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
              </Card.Body>
              <Card.Footer>{item.owner}</Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default EquipmentSearch;
