import axios from 'axios';
import { PathConfigList, PathConfig } from '../types/mediamtx-types';

// Centralized API service for MediaMTX
export class MediaMTXAPI {
  private baseURL: string;

  constructor(apiUrl: string = 'http://localhost:9997') {
    this.baseURL = apiUrl;
  }

  // Generic GET request handler
  async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const response = await axios.get<T>(`${this.baseURL}/v3${endpoint}`, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Generic PATCH request handler
  async patch<T>(endpoint: string, data: Record<string, any>): Promise<T> {
    try {
      const response = await axios.patch<T>(`${this.baseURL}/v3${endpoint}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Error handling
  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      console.error('MediaMTX API Error:', error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
  }

  // Specific API methods
  async getServerInfo() {
    return this.get('/info');
  }

  async getGlobalConfig() {
    return this.get('/config/global/get');
  }

  async updateGlobalConfig(config: any) {
    return this.patch('/config/global/patch', config);
  }

  // Paths
  async getPaths(page = 0, itemsPerPage = 100): Promise<PathConfig[]> {
    const result = await this.get<PathConfigList | PathConfig[]>('/paths/list', { page, itemsPerPage });
    
    // If result is already an array of PathConfig, return it
    if (Array.isArray(result)) {
      return result;
    }
    
    // If result is PathConfigList, return its items
    const pathConfigList = result as PathConfigList;
    return pathConfigList.items || [];
  }

  async createPath(pathConfig: any) {
    return this.post(`/config/paths/add/${pathConfig.name}`, pathConfig);
  }

  async updatePath(name: string, pathConfig: any) {
    return this.patch(`/config/paths/patch/${name}`, pathConfig);
  }

  async deletePath(name: string) {
    return this.delete(`/config/paths/delete/${name}`);
  }

  // RTMP Connections
  async getRTMPConnections(page = 0, itemsPerPage = 100) {
    return this.get('/rtmpconns/list', { page, itemsPerPage });
  }

  // RTSP Connections and Sessions
  async getRTSPConnections(page = 0, itemsPerPage = 100) {
    return this.get('/rtspconns/list', { page, itemsPerPage });
  }

  async getRTSPSessions(page = 0, itemsPerPage = 100) {
    return this.get('/rtspsessions/list', { page, itemsPerPage });
  }

  async kickRTSPSession(id: string) {
    return this.post(`/rtspsessions/kick/${id}`, {});
  }

  // WebRTC Sessions
  async getWebRTCSessions(page = 0, itemsPerPage = 100) {
    return this.get('/webrtcsessions/list', { page, itemsPerPage });
  }

  // SRT Connections
  async getSRTConnections(page = 0, itemsPerPage = 100) {
    return this.get('/srtconns/list', { page, itemsPerPage });
  }

  // HLS Muxers
  async getHLSMuxers(page = 0, itemsPerPage = 100) {
    return this.get('/hlsmuxers/list', { page, itemsPerPage });
  }

  // Generic POST request handler
  async post<T>(endpoint: string, data: Record<string, any>): Promise<T> {
    try {
      const response = await axios.post<T>(`${this.baseURL}/v3${endpoint}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Generic DELETE request handler
  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await axios.delete<T>(`${this.baseURL}/v3${endpoint}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}