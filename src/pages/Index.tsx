import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Map from '@/components/Map';
import ReportForm from '@/components/ReportForm';
import ReportFeed from '@/components/ReportFeed';
import RoutesList from '@/components/RoutesList';
import { Report, Route } from '@/types';
import { 
  MapIcon, 
  FileText, 
  Navigation, 
  Users,
  TrendingUp,
  AlertCircle,
  Shield,
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [selectedRoute, setSelectedRoute] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState('map');

  // Initialize with sample data
  useEffect(() => {
    // Sample routes
    const sampleRoutes: Route[] = [
      {
        id: '1',
        name: 'Route 2',
        from: 'CBD',
        to: 'Kibera',
        standardFare: 50,
        currentFare: 70,
        estimatedTime: '25 mins',
        trafficStatus: 'high',
        lastUpdated: new Date(),
        coordinates: [
          { lat: -1.2864, lng: 36.8172 },
          { lat: -1.3130, lng: 36.7880 },
        ],
      },
      {
        id: '2',
        name: 'Route 23',
        from: 'Westlands',
        to: 'CBD',
        standardFare: 40,
        currentFare: 40,
        estimatedTime: '15 mins',
        trafficStatus: 'moderate',
        lastUpdated: new Date(),
        coordinates: [
          { lat: -1.2634, lng: 36.8031 },
          { lat: -1.2864, lng: 36.8172 },
        ],
      },
      {
        id: '3',
        name: 'Route 111',
        from: 'Ngong',
        to: 'CBD',
        standardFare: 80,
        currentFare: 100,
        estimatedTime: '45 mins',
        trafficStatus: 'severe',
        lastUpdated: new Date(),
        coordinates: [
          { lat: -1.3632, lng: 36.6547 },
          { lat: -1.2864, lng: 36.8172 },
        ],
      },
      {
        id: '4',
        name: 'Route 46',
        from: 'Kawangware',
        to: 'Yaya Centre',
        standardFare: 60,
        currentFare: 60,
        estimatedTime: '20 mins',
        trafficStatus: 'low',
        lastUpdated: new Date(),
        coordinates: [
          { lat: -1.2840, lng: 36.7470 },
          { lat: -1.2940, lng: 36.7850 },
        ],
      },
    ];
    setRoutes(sampleRoutes);

    // Sample reports
    const sampleReports: Report[] = [
      {
        id: '1',
        type: 'traffic',
        route: 'Route 2 - CBD to Kibera',
        location: {
          lat: -1.2950,
          lng: 36.8050,
          address: 'Kenyatta Avenue',
        },
        description: 'Heavy traffic due to road construction. Expect delays.',
        trafficLevel: 'high',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        userId: '1',
        userName: 'John K.',
        upvotes: 12,
        downvotes: 1,
        validated: true,
      },
      {
        id: '2',
        type: 'fare',
        route: 'Route 111 - Ngong to CBD',
        location: {
          lat: -1.3200,
          lng: 36.7000,
          address: 'Ngong Road',
        },
        description: 'Fare increased to 100 KSH due to evening rush.',
        fare: 100,
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        userId: '2',
        userName: 'Mary W.',
        upvotes: 8,
        downvotes: 0,
        validated: false,
      },
      {
        id: '3',
        type: 'availability',
        route: 'Route 46 - Kawangware to Yaya',
        location: {
          lat: -1.2840,
          lng: 36.7470,
          address: 'Kawangware Stage',
        },
        description: 'Many matatus available, no waiting time.',
        matatuAvailable: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 8),
        userId: '3',
        userName: 'Peter M.',
        upvotes: 5,
        downvotes: 0,
        validated: false,
      },
    ];
    setReports(sampleReports);
  }, []);

  const popularRoutes = routes.map(r => `${r.name} - ${r.from} to ${r.to}`);

  const handleReportSubmit = (reportData: Omit<Report, 'id' | 'timestamp' | 'userId' | 'userName' | 'upvotes' | 'downvotes' | 'validated'>) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      timestamp: new Date(),
      userId: 'current-user',
      userName: 'You',
      upvotes: 0,
      downvotes: 0,
      validated: false,
    };
    
    setReports([newReport, ...reports]);
    setActiveTab('feed'); // Switch to feed to show the new report
  };

  const handleUpvote = (reportId: string) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, upvotes: report.upvotes + 1 }
        : report
    ));
    
    // Check if report should be validated
    const report = reports.find(r => r.id === reportId);
    if (report && report.upvotes >= 10 && !report.validated) {
      setReports(reports.map(r => 
        r.id === reportId 
          ? { ...r, validated: true }
          : r
      ));
      toast({
        title: 'Report Verified',
        description: 'This report has been verified by the community.',
        variant: 'default',
      });
    }
  };

  const handleDownvote = (reportId: string) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, downvotes: report.downvotes + 1 }
        : report
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        activeReports={reports.length}
        userName="Guest User"
      />

      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <Card className="mb-6 bg-gradient-hero text-primary-foreground overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Welcome to Nairobi Matatu Monitor
            </CardTitle>
            <CardDescription className="text-primary-foreground/90">
              Community-powered real-time traffic and transit information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <div>
                  <p className="text-2xl font-bold">1,234</p>
                  <p className="text-xs text-primary-foreground/80">Active Users</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <div>
                  <p className="text-2xl font-bold">{reports.length}</p>
                  <p className="text-xs text-primary-foreground/80">Live Reports</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-primary-foreground/80">Active Alerts</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <div>
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-xs text-primary-foreground/80">Accuracy</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map and Tabs Section */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <MapIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Map</span>
                </TabsTrigger>
                <TabsTrigger value="feed" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Feed</span>
                </TabsTrigger>
                <TabsTrigger value="routes" className="flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  <span className="hidden sm:inline">Routes</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="map" className="mt-4">
                <div className="h-[500px] rounded-lg overflow-hidden">
                  <Map
                    reports={reports}
                    routes={routes}
                    onLocationSelect={(lat, lng) => setSelectedLocation({ lat, lng })}
                    selectedRoute={selectedRoute}
                  />
                </div>
              </TabsContent>

              <TabsContent value="feed" className="mt-4">
                <ReportFeed
                  reports={reports}
                  onUpvote={handleUpvote}
                  onDownvote={handleDownvote}
                />
              </TabsContent>

              <TabsContent value="routes" className="mt-4">
                <RoutesList
                  routes={routes}
                  onRouteSelect={setSelectedRoute}
                  selectedRoute={selectedRoute}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Form */}
            <ReportForm
              onSubmit={handleReportSubmit}
              location={selectedLocation}
              popularRoutes={popularRoutes}
            />

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Peak Hours</span>
                  <Badge variant="destructive">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Fare Change</span>
                  <Badge variant="secondary" className="text-warning border-warning">+25%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Report Accuracy</span>
                  <Badge variant="secondary" className="text-success border-success">89%</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Mobile App CTA */}
            <Card className="bg-gradient-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Smartphone className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Get the App</h3>
                    <p className="text-xs text-muted-foreground">Coming Soon</p>
                  </div>
                </div>
                <Button variant="hero" className="w-full">
                  Join Waitlist
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;