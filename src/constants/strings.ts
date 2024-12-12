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
  };
  
  export default strings;
  