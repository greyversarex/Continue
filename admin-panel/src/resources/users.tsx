import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  SelectField,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  Show,
  SimpleShowLayout,
  EditButton,
  ShowButton,
  DeleteButton,
  required,
  email,
} from 'react-admin';

const userRoleChoices = [
  { id: 'client', name: 'Client' },
  { id: 'agent', name: 'Agent' },
  { id: 'admin', name: 'Admin' },
];

export const UsersList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <SelectField source="role" choices={userRoleChoices} />
      <DateField source="created_at" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const UsersCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="email" validate={[required(), email()]} />
      <SelectInput source="role" choices={userRoleChoices} defaultValue="client" />
    </SimpleForm>
  </Create>
);

export const UsersEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" validate={[required()]} />
      <TextInput source="email" validate={[required(), email()]} />
      <SelectInput source="role" choices={userRoleChoices} />
    </SimpleForm>
  </Edit>
);

export const UsersShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <SelectField source="role" choices={userRoleChoices} />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
);

export const UsersResource = {
  list: UsersList,
  create: UsersCreate,
  edit: UsersEdit,
  show: UsersShow,
};