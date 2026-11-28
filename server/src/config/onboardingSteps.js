// The onboarding steps for each type of user.
// The order of the list is the order the user must follow.
const STEPS = {
  STUDENT: [
    {
      key: 'personal-details',
      title: 'Personal details',
      description: 'Confirm your basic personal information.',
    },
    {
      key: 'academic-details',
      title: 'Academic details',
      description: 'Add your previous education details.',
    },
    {
      key: 'upload-documents',
      title: 'Upload documents',
      description: 'Upload the documents needed for verification.',
    },
    {
      key: 'review-submit',
      title: 'Review and submit',
      description: 'Check everything and submit your application.',
    },
  ],
  INSTITUTION: [
    {
      key: 'institution-details',
      title: 'Institution details',
      description: 'Enter the name and address of your institution.',
    },
    {
      key: 'contact-person',
      title: 'Contact person',
      description: 'Add the person who will manage this account.',
    },
    {
      key: 'upload-documents',
      title: 'Upload documents',
      description: 'Upload the registration documents of your institution.',
    },
    {
      key: 'review-submit',
      title: 'Review and submit',
      description: 'Check everything and submit your application.',
    },
  ],
  ADMIN: [],
};

const getStepsForRole = (role) => STEPS[role] || [];

module.exports = { getStepsForRole };