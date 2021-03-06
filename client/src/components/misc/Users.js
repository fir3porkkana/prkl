import React, { useState } from 'react';
import { useStore } from 'react-hookstore';
import { Header, Loader, Card, Input, Divider, Button } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { EDIT_USER_ROLE } from '../../GqlQueries';
import roles from '../../util/user_roles';

export default ({ allUsersError, allUsersLoading }) => {
  const [users] = useStore('allUsersStore');
  const [search, setSearch] = useState('');
  const [editUserRole] = useMutation(EDIT_USER_ROLE);
  const intl = useIntl();

  const handleSearchChange = event => {
    setSearch(event.target.value);
  };

  const handleRoleButtonClick = (id, role) => {
    const variables = { id, role };
    try {
      editUserRole({
        variables,
      });
    } catch (e) {
      console.log('error editing role:', e);
    }
  };

  if (allUsersError !== undefined) {
    console.log('error:', allUsersError);
    return (
      <div>
        <FormattedMessage id="groups.loadingError" />
      </div>
    );
  }

  if (allUsersLoading || !users) {
    return <Loader active />;
  }

  return (
    <div>
      <Input
        onChange={handleSearchChange}
        placeholder={intl.formatMessage({ id: 'users.searchPlaceholder' })}
      />
      <Divider />
      {users.length === 0 ? (
        <div>
          <p />
          <Header as="h3" block>
            <FormattedMessage id="users.empty" />
          </Header>
        </div>
      ) : (
        <div>
          {users
            .filter(
              u =>
                u.firstname?.toLowerCase().includes(search.toLowerCase()) ||
                u.lastname?.toLowerCase().includes(search.toLowerCase()) ||
                u.studentNo?.includes(search.toLowerCase())
            )
            .map(u => (
              <Card key={u.id} raised fluid>
                <Card.Content>
                  <Card.Header content={`${u.lastname} ${u.firstname}`} />
                  <Card.Description content={`${u.email} - ${u.studentNo}`} />
                  <Card.Content>
                    {u.role === roles.ADMIN_ROLE ? (
                      <FormattedMessage id="users.admin" />
                    ) : (
                      <div>
                        <Button
                          onClick={() => handleRoleButtonClick(u.id, roles.STAFF_ROLE)}
                          primary={u.role === roles.STAFF_ROLE}
                        >
                          {intl.formatMessage({ id: 'users.staff' })}
                        </Button>
                        <Button
                          onClick={() => handleRoleButtonClick(u.id, roles.STUDENT_ROLE)}
                          primary={u.role === roles.STUDENT_ROLE}
                        >
                          {intl.formatMessage({ id: 'users.student' })}
                        </Button>
                      </div>
                    )}
                  </Card.Content>
                </Card.Content>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};
