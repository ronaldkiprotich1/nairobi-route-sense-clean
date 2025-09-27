import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Report, ReportType, TrafficLevel } from '@/types';
import { MapPin, AlertTriangle, DollarSign, Bus, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportFormProps {
  onSubmit: (report: Omit<Report, 'id' | 'timestamp' | 'userId' | 'userName' | 'upvotes' | 'downvotes' | 'validated'>) => void;
  location?: { lat: number; lng: number };
  popularRoutes: string[];
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, location, popularRoutes }) => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<ReportType>('traffic');
  const [route, setRoute] = useState('');
  const [description, setDescription] = useState('');
  const [fare, setFare] = useState('');
  const [trafficLevel, setTrafficLevel] = useState<TrafficLevel>('moderate');
  const [matatuAvailable, setMatatuAvailable] = useState<boolean>(true);
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!route || !description || !location) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields and select a location on the map.',
        variant: 'destructive',
      });
      return;
    }

    const reportData: Omit<Report, 'id' | 'timestamp' | 'userId' | 'userName' | 'upvotes' | 'downvotes' | 'validated'> = {
      type: reportType,
      route,
      location: {
        lat: location.lat,
        lng: location.lng,
        address: address || 'Unknown Location',
      },
      description,
      ...(reportType === 'fare' && { fare: parseFloat(fare) }),
      ...(reportType === 'traffic' && { trafficLevel }),
      ...(reportType === 'availability' && { matatuAvailable }),
    };

    onSubmit(reportData);

    // Reset form
    setDescription('');
    setFare('');
    setAddress('');
    
    toast({
      title: 'Report Submitted',
      description: 'Thank you for contributing to safer commutes!',
      variant: 'default',
    });
  };

  return (
    <Card className="w-full shadow-lg bg-gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Submit Report
        </CardTitle>
        <CardDescription>
          Help fellow commuters with real-time updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Report Type Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button
              type="button"
              variant={reportType === 'traffic' ? 'default' : 'outline'}
              onClick={() => setReportType('traffic')}
              className="flex items-center gap-1"
            >
              <AlertTriangle className="h-4 w-4" />
              Traffic
            </Button>
            <Button
              type="button"
              variant={reportType === 'fare' ? 'default' : 'outline'}
              onClick={() => setReportType('fare')}
              className="flex items-center gap-1"
            >
              <DollarSign className="h-4 w-4" />
              Fare
            </Button>
            <Button
              type="button"
              variant={reportType === 'availability' ? 'default' : 'outline'}
              onClick={() => setReportType('availability')}
              className="flex items-center gap-1"
            >
              <Bus className="h-4 w-4" />
              Matatu
            </Button>
            <Button
              type="button"
              variant={reportType === 'accident' ? 'default' : 'outline'}
              onClick={() => setReportType('accident')}
              className="flex items-center gap-1"
            >
              <AlertTriangle className="h-4 w-4" />
              Accident
            </Button>
          </div>

          {/* Route Selection */}
          <div className="space-y-2">
            <Label htmlFor="route">Route *</Label>
            <Select value={route} onValueChange={setRoute}>
              <SelectTrigger id="route">
                <SelectValue placeholder="Select route" />
              </SelectTrigger>
              <SelectContent>
                {popularRoutes.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Click on map to select location"
                value={location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : ''}
                readOnly
                className="flex-1"
              />
            </div>
            <Input
              placeholder="Location description (optional)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Type-specific fields */}
          {reportType === 'traffic' && (
            <div className="space-y-2">
              <Label>Traffic Level</Label>
              <RadioGroup value={trafficLevel} onValueChange={(value) => setTrafficLevel(value as TrafficLevel)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="text-success">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="moderate" />
                  <Label htmlFor="moderate" className="text-warning">Moderate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="text-accent">High</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="severe" id="severe" />
                  <Label htmlFor="severe" className="text-destructive">Severe</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {reportType === 'fare' && (
            <div className="space-y-2">
              <Label htmlFor="fare">Current Fare (KSH) *</Label>
              <Input
                id="fare"
                type="number"
                placeholder="Enter fare amount"
                value={fare}
                onChange={(e) => setFare(e.target.value)}
                min="0"
                required
              />
            </div>
          )}

          {reportType === 'availability' && (
            <div className="space-y-2">
              <Label>Matatu Availability</Label>
              <RadioGroup 
                value={matatuAvailable ? 'available' : 'unavailable'} 
                onValueChange={(value) => setMatatuAvailable(value === 'available')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="available" id="available" />
                  <Label htmlFor="available" className="text-success">Available</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unavailable" id="unavailable" />
                  <Label htmlFor="unavailable" className="text-destructive">Not Available</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide details about the situation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <Button type="submit" variant="hero" className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Submit Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportForm;