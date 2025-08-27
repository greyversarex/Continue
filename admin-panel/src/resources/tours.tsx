import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  SelectField,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  SelectInput,
  Show,
  SimpleShowLayout,
  EditButton,
  ShowButton,
  DeleteButton,
  useTranslate,
} from 'react-admin';
import { Card } from '@mui/material';

const tourStatusChoices = [
  { id: 'active', name: 'Active' },
  { id: 'inactive', name: 'Inactive' },
];

export const ToursList = () => {
  const translate = useTranslate();
  
  return (
    <List>
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="country" />
        <TextField source="price" />
        <TextField source="category" />
        <DateField source="start_date" />
        <DateField source="end_date" />
        <SelectField source="status" choices={tourStatusChoices} />
        <ShowButton />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
};

export const ToursCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" required />
      <TextInput source="description" multiline rows={4} />
      <TextInput source="country" />
      <TextInput source="price" />
      <TextInput source="category" />
      <DateInput source="start_date" />
      <DateInput source="end_date" />
      <SelectInput source="status" choices={tourStatusChoices} defaultValue="active" />
    </SimpleForm>
  </Create>
);

export const ToursEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" required />
      <TextInput source="description" multiline rows={4} />
      <TextInput source="country" />
      <TextInput source="price" />
      <TextInput source="category" />
      <DateInput source="start_date" />
      <DateInput source="end_date" />
      <SelectInput source="status" choices={tourStatusChoices} />
    </SimpleForm>
  </Edit>
);

export const ToursShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="country" />
      <TextField source="price" />
      <TextField source="category" />
      <DateField source="start_date" />
      <DateField source="end_date" />
      <SelectField source="status" choices={tourStatusChoices} />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
);

export const ToursResource = {
  list: ToursList,
  create: ToursCreate,
  edit: ToursEdit,
  show: ToursShow,
};