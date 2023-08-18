import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.selp.app.vscode',
  appName: 'vscode-mobile',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
