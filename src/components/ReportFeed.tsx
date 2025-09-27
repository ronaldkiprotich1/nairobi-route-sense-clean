import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Report } from '@/types';
import { 
  Clock, 
  MapPin, 
  ThumbsUp, 
  ThumbsDown, 
  AlertTriangle, 
  DollarSign, 
  Bus,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReportFeedProps {
  reports: Report[];
  onUpvote: (reportId: string) => void;
  onDownvote: (reportId: string) => void;
}

const ReportFeed: React.FC<ReportFeedProps> = ({ reports, onUpvote, onDownvote }) => {
  const getReportIcon = (type: string) => {
    switch (type) {
      case 'traffic':
        return <AlertTriangle className="h-4 w-4" />;
      case 'fare':
        return <DollarSign className="h-4 w-4" />;
      case 'availability':
        return <Bus className="h-4 w-4" />;
      case 'accident':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getReportVariant = (type: string) => {
    switch (type) {
      case 'traffic':
        return 'default';
      case 'fare':
        return 'secondary';
      case 'availability':
        return 'outline';
      case 'accident':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getTrafficBadge = (level?: string) => {
    if (!level) return null;
    
    const variants: Record<string, any> = {
      low: { variant: 'outline' as const, className: 'text-success border-success' },
      moderate: { variant: 'outline' as const, className: 'text-warning border-warning' },
      high: { variant: 'outline' as const, className: 'text-accent border-accent' },
      severe: { variant: 'destructive' as const, className: '' },
    };

    return (
      <Badge {...variants[level]}>
        {level.charAt(0).toUpperCase() + level.slice(1)} Traffic
      </Badge>
    );
  };

  if (reports.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No reports yet. Be the first to contribute!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <Card key={report.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={getReportVariant(report.type)}>
                  {getReportIcon(report.type)}
                  <span className="ml-1">{report.type.charAt(0).toUpperCase() + report.type.slice(1)}</span>
                </Badge>
                {report.validated && (
                  <Badge variant="outline" className="text-success border-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm mb-1">{report.route}</h4>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {report.location.address}
              </p>
            </div>

            <p className="text-sm">{report.description}</p>

            {/* Type-specific information */}
            <div className="flex flex-wrap gap-2">
              {report.trafficLevel && getTrafficBadge(report.trafficLevel)}
              {report.fare && (
                <Badge variant="secondary">
                  Fare: KSH {report.fare}
                </Badge>
              )}
              {report.matatuAvailable !== undefined && (
                <Badge variant={report.matatuAvailable ? 'outline' : 'destructive'}>
                  {report.matatuAvailable ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Matatu Available
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      No Matatu
                    </>
                  )}
                </Badge>
              )}
            </div>

            {/* Voting section */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onUpvote(report.id)}
                  className="text-success hover:text-success hover:bg-success/10"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {report.upvotes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownvote(report.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  {report.downvotes}
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">
                by {report.userName}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReportFeed;