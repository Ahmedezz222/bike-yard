interface Config {
  api: {
    baseUrl: string;
    timeout: number;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
  };
}

const config: Config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 5000,
  },
  app: {
    name: 'Bike Yard',
    version: '0.1.0',
    environment: (process.env.NODE_ENV as Config['app']['environment']) || 'development',
  },
};

export default config; 