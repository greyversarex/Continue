import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  SelectField,
  NumberField,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  SelectInput,
  NumberInput,
  Show,
  SimpleShowLayout,
  EditButton,
  ShowButton,
  DeleteButton,
  ReferenceField,
  ReferenceInput,
} from 'react-admin';

const bookingStatusChoices = [
  { id: 'pending', name: 'Pending' },
  { id: 'confirmed', name: 'Confirmed' },
  { id: 'cancelled', name: 'Cancelled' },
  { id: 'completed', name: 'Completed' },
];

export const BookingsList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField source="user_id" reference="users" link="show">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="tour_id" reference="tours" link="show">
        <TextField source="title" />
      </ReferenceField>
      <SelectField source="status" choices={bookingStatusChoices} />
      <DateField source="booking_date" />
      <DateField source="created_at" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const BookingsCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="user_id" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput source="tour_id" reference="tours">
        <SelectInput optionText="title" />
      </ReferenceInput>
      <SelectInput source="status" choices={bookingStatusChoices} defaultValue="pending" />
      <DateInput source="booking_date" />
    </SimpleForm>
  </Create>
);

export const BookingsEdit = () => (
  <Edit>
    <SimpleForm>
      <ReferenceInput source="user_id" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput source="tour_id" reference="tours">
        <SelectInput optionText="title" />
      </ReferenceInput>
      <SelectInput source="status" choices={bookingStatusChoices} />
      <DateInput source="booking_date" />
    </SimpleForm>
  </Edit>
);

export const BookingsShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="user_id" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="tour_id" reference="tours">
        <TextField source="title" />
      </ReferenceField>
      <SelectField source="status" choices={bookingStatusChoices} />
      <DateField source="booking_date" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
);

export const BookingsResource = {
  list: BookingsList,
  create: BookingsCreate,
  edit: BookingsEdit,
  show: BookingsShow,
};