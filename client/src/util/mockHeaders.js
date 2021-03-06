const mocks = [
  {
    uid: '1',
    givenname: 'Firstname 1 (Student)',
    sn: 'Lastname 1',
    schacpersonaluniquecode: 'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:000000001',
    mail: 'user-1@email.com',
    role: 1,
  },
  {
    uid: '2',
    givenname: 'Firstname 2 (Staff)',
    sn: 'Lastname 2',
    schacpersonaluniquecode: 'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:000000002',
    mail: 'user-2@email.com',
    role: 2,
  },
  {
    uid: '3',
    givenname: 'Firstname 3 (Admin)',
    sn: 'Lastname 3',
    schacpersonaluniquecode: 'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:000000003',
    mail: 'user-3@email.com',
    role: 3,
  },
];

export const getMockHeaders = () => mocks[localStorage.getItem('mockHeaderIndex') || 0];

export const setMockHeaders = index => localStorage.setItem('mockHeaderIndex', index);
