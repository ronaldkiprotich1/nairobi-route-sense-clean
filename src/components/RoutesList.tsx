import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Route } from '@/types';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Navigation
} from 'lucide-react';

interface RoutesListProps {
  routes: Route[];
  onRouteSelect: (routeId: string) => void;
  selectedRoute?: string;
}

const RoutesList: React.FC<RoutesListProps> = ({ routes, onRouteSelect, selectedRoute }) => {
  const getTrafficBadge = (status: string) => {
    const variants: Record<string, any> = {
      low: { variant: 'outline' as const, className: 'text-success border-success' },
      moderate: { variant: 'outline' as const, className: 'text-warning border-warning' },
      high: { variant: 'outline' as const, className: 'text-accent border-accent' },
      severe: { variant: 'destructive' as const },
    };

    return (
      <Badge {...(variants[status] || variants.moderate)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getFareChange = (standardFare: number, currentFare?: number) => {
    if (!currentFare || currentFare === standardFare) return null;
    
    const change = currentFare - standardFare;
    const percentage = ((change / standardFare) * 100).toFixed(0);
    
    if (change > 0) {
      return (
        <span className="flex items-center text-destructive text-xs">
          <TrendingUp className="h-3 w-3 mr-1" />
          +{percentage}%
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-success text-xs">
          <TrendingDown className="h-3 w-3 mr-1" />
          {percentage}%
        </span>
      );
    }
  };

  return (
    <div className="space-y-3">
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Popular Routes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {routes.map((route) => (
              <div
                key={route.id}
                className={`p-4 cursor-pointer transition-all duration-300 hover:bg-muted/50 ${
                  selectedRoute === route.id ? 'bg-primary/10' : ''
                }`}
                onClick={() => onRouteSelect(route.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{route.name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {route.from} → {route.to}
                    </p>
                  </div>
                  {getTrafficBadge(route.trafficStatus)}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        KSH {route.currentFare || route.standardFare}
                      </p>
                      {getFareChange(route.standardFare, route.currentFare)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{route.estimatedTime}</p>
                  </div>
                </div>

                {selectedRoute === route.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRouteSelect(route.id);
                    }}
                  >
                    View on Map
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoutesList;