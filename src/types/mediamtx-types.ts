// Server Info Type
export interface ServerInfo {
  version: string;
  started: string;
}

// Global Configuration Types
export interface GlobalConfig {
  logLevel?: string;
  logDestinations?: string[];
  logStructured?: boolean;
  
  // Add more fields from the OpenAPI specification as needed
  api?: boolean;
  apiAddress?: string;
  apiEncryption?: boolean;
  
  // Protocol-specific configurations
  rtsp?: boolean;
  rtmp?: boolean;
  hls?: boolean;
  webrtc?: boolean;
}

// Path Configuration Type
// Connections and Sessions Types
export interface RTMPConnection {
  id: string;
  created: string;
  remoteAddr: string;
  state: 'idle' | 'read' | 'publish';
  path: string;
  query?: string;
  bytesReceived: number;
  bytesSent: number;
}

export interface RTSPConnection {
  id: string;
  created: string;
  remoteAddr: string;
  bytesReceived: number;
  bytesSent: number;
  session?: string;
  tunnel?: string;
}

export interface RTSPSession {
  id: string;
  created: string;
  remoteAddr: string;
  state: 'idle' | 'read' | 'publish';
  path: string;
  query?: string;
  transport?: string;
  profile?: string;
  bytesReceived: number;
  bytesSent: number;
  rtpPacketsReceived: number;
  rtpPacketsSent: number;
  rtpPacketsLost: number;
}

export interface WebRTCSession {
   id: string;
   created: string;
   remoteAddr: string;
   peerConnectionEstablished: boolean;
   localCandidate?: string;
   remoteCandidate?: string;
   state: 'read' | 'publish';
   path: string;
   query?: string;
   bytesReceived: number;
   bytesSent: number;
   rtpPacketsSent: number;
   rtpPacketsReceived: number;
   rtpPacketsLost: number;
}

export interface SRTConnection {
   id: string;
   created: string;
   remoteAddr: string;
   state: 'idle' | 'read' | 'publish';
   path: string;
   query?: string;
   packetsSent: number;
   packetsReceived: number;
   bytesSent: number;
   bytesReceived: number;
   mbpsSendRate: number;
   mbpsReceiveRate: number;
   packetsSendLossRate: number;
   packetsReceivedLossRate: number;
}

// Connection List Types
export interface RTMPConnectionList {
  pageCount: number;
  itemCount: number;
  items: RTMPConnection[];
}

export interface RTSPConnectionList {
  pageCount: number;
  itemCount: number;
  items: RTSPConnection[];
}

export interface RTSPSessionList {
  pageCount: number;
  itemCount: number;
  items: RTSPSession[];
}

export interface WebRTCSessionList {
  pageCount: number;
  itemCount: number;
  items: WebRTCSession[];
}

export interface SRTConnectionList {
  pageCount: number;
  itemCount: number;
  items: SRTConnection[];
}

// Path Configuration Type (expanded)
export interface PathSource {
  type: string;
  id: string;
}

export interface PathConfig {
  name: string;
  confName?: string;
  source: PathSource | string;
  sourceOnDemand?: boolean;
  record?: boolean;
  recordPath?: string;
  ready?: boolean;
  readyTime?: string;
  tracks?: string[];
  bytesReceived?: number;
  bytesSent?: number;
  readers?: PathSource[];
  
  // Streaming protocols
  rtspTransport?: 'udp' | 'tcp' | 'auto';
  rtmpUrl?: string;
  srtMode?: 'listener' | 'caller';
  
  // Record and streaming options
  recordFormat?: 'mp4' | 'mkv';
  recordPartDuration?: string;
  recordMaxPartSize?: string;
  
  // Hooks and advanced configurations
  runOnInit?: string;
  runOnDemand?: string;
  runOnReady?: string;
  
  // Additional protocol-specific configurations
  rtspAnyPort?: boolean;
  webrtcICEServers?: string[];
}

export interface PathConfigList {
  pageCount: number;
  itemCount: number;
  items: PathConfig[];
}

// Common API Response Type
export interface HLSMuxer {
  path: string;
  created: string;
  sourceReady: boolean;
  segmentCount: number;
  bytesSent: number;
  lastRequest?: string;
}

export interface HLSMuxerList {
  pageCount: number;
  itemCount: number;
  items: HLSMuxer[];
}

export interface ApiResponse<T> {
  status: 'ok' | 'error';
  data?: T;
  error?: string;
}