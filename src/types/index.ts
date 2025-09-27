export type ReportType = 'traffic' | 'fare' | 'availability' | 'accident';

export type TrafficLevel = 'low' | 'moderate' | 'high' | 'severe';

export interface Report {
  id: string;
  type: ReportType;
  route: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  fare?: number;
  trafficLevel?: TrafficLevel;
  matatuAvailable?: boolean;
  timestamp: Date;
  userId: string;
  userName: string;
  upvotes: number;
  downvotes: number;
  validated: boolean;
}

export interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  standardFare: number;
  currentFare?: number;
  estimatedTime: string;
  trafficStatus: TrafficLevel;
  lastUpdated: Date;
  coordinates: Array<{ lat: number; lng: number }>;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  reputationScore: number;
  totalReports: number;
  validatedReports: number;
}