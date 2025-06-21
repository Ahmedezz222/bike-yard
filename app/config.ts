interface Config {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
  };
}

const config: Config = {
  app: {
    name: 'Bike Yard',
    version: '0.1.0',
    environment: (process.env.NODE_ENV as Config['app']['environment']) || 'development',
  },
};

export default config; 