import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mindmate.app',
  appName: 'MindMate',
  webDir: 'out', // still for prod build
  server: {
    // Replace with your PC LAN IP so Android device can reach it
    url: 'http://192.168.29.12:3000',
    cleartext: true,
  },
};

export default config;
