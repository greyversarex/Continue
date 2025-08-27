import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  NumberInput,
  Show,
  SimpleShowLayout,
  EditButton,
  ShowButton,
  DeleteButton,
  required,
} from 'react-admin';

export const PromotionsList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <NumberField source="discount" />
      <DateField source="start_date" />
      <DateField source="end_date" />
      <DateField source="created_at" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const PromotionsCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="description" multiline rows={4} />
      <NumberInput source="discount" min={0} max={100} />
      <DateInput source="start_date" />
      <DateInput source="end_date" />
    </SimpleForm>
  </Create>
);

export const PromotionsEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" validate={[required()]} />
      <TextInput source="description" multiline rows={4} />
      <NumberInput source="discount" min={0} max={100} />
      <DateInput source="start_date" />
      <DateInput source="end_date" />
    </SimpleForm>
  </Edit>
);

export const PromotionsShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <NumberField source="discount" />
      <DateField source="start_date" />
      <DateField source="end_date" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
);

export const PromotionsResource = {
  list: PromotionsList,
  create: PromotionsCreate,
  edit: PromotionsEdit,
  show: PromotionsShow,
};