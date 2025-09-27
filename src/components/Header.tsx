import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Bus, 
  Menu, 
  Bell, 
  User,
  MapPin,
  Activity
} from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
  activeReports: number;
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, activeReports, userName }) => {
  return (
    <header className="bg-gradient-hero backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="bg-primary-foreground/20 p-2 rounded-lg">
                <Bus className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">
                  Nairobi Matatu
                </h1>
                <p className="text-xs text-primary-foreground/80 hidden sm:block">
                  Real-time Traffic & Transit
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Badge 
              variant="secondary" 
              className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 hidden sm:flex"
            >
              <Activity className="h-3 w-3 mr-1" />
              {activeReports} Active
            </Badge>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/10 relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-accent rounded-full animate-pulse" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/10 hidden sm:flex"
              >
                <User className="h-4 w-4 mr-2" />
                {userName || 'Guest'}
              </Button>
            </div>
          </div>
        </div>

        {/* Live status bar */}
        <div className="flex items-center gap-4 mt-3 text-xs text-primary-foreground/80">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>Nairobi, Kenya</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
            <span>System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;