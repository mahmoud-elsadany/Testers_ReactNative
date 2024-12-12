import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalStorageService {
  private static accessTokenKey = 'access_token';
  private static refreshTokenKey = 'refresh_token';

  // Save tokens
  static async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.accessTokenKey, accessToken);
      await AsyncStorage.setItem(this.refreshTokenKey, refreshToken);
      console.log('Tokens saved successfully');
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  // Get access token
  static async getAccessToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(this.accessTokenKey);
      console.log('Access Token retrieved:', token);
      return token;
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  }

  // Get refresh token
  static async getRefreshToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(this.refreshTokenKey);
      console.log('Refresh Token retrieved:', token);
      return token;
    } catch (error) {
      console.error('Error retrieving refresh token:', error);
      return null;
    }
  }

  // Clear tokens
  static async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.accessTokenKey);
      await AsyncStorage.removeItem(this.refreshTokenKey);
      console.log('Tokens cleared successfully');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }
}

export default LocalStorageService;
