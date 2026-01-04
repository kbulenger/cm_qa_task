export const generateUserData = () => {
  const timestamp = Date.now();
  return {
    firstName: 'Test',
    lastName: 'User',
    street: 'Street 1',
    city: 'City',
    state: 'State',
    country: 'US',
    postcode: '12345',
    phone: '1234567890',
    dob: '1990-07-20',
    email: `qa_candidate_${timestamp}@test.com`,
    password: `Pass${timestamp}!`,
  };
};