const strings = {
    login: {
      title: 'Tester App',
      emailPlaceholder: 'Email',
      passwordPlaceholder: 'Password',
      loginButton: 'Login',
      loggingIn:'Logging in...',
      errorEmptyFields: 'Please fill in all fields',
      successLogin: (email: string): string => `Welcome, ${email}`,
    },
    testsList:{
      title: 'List of Tests',
      messagelogout: 'Are you sure you want to logout?',
      cancel: 'cancel',
      logout: 'logout',
      device: 'device',
      duration:'duration',
      fee: 'fee',
      testsLoading:'Loading Tests...',
      ModeratedTests:'Moderated Tests',
      NoModeratedTests: 'No Moderated Tests Available',
      UnModeratedTests: 'Unmoderated Tests',
      NoUnModeratedTests: 'No Unmoderated Tests Available'
    }
  };
  
  export default strings;
  