import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Home, Share2, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PostSaveActionsProps {
  lastCardOccasion?: string;
  onAddAnother: () => void;
  onGoHome: () => void;
}

export function PostSaveActions({ lastCardOccasion, onAddAnother, onGoHome }: PostSaveActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-lg text-green-800">🎉 Card Saved Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lastCardOccasion && (
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-center">
                <strong>💡 Pro Tip:</strong> Did you receive more cards for your <strong>{lastCardOccasion.toLowerCase()}</strong>? 
                Add them now while you're here!
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-3">
            <Button 
              size="lg" 
              onClick={onAddAnother}
              className="w-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Card
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={onGoHome}
              className="w-full"
            >
              <Home className="w-5 h-5 mr-2" />
              View All Cards
            </Button>
          </div>
          
          <div className="text-center pt-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                // TODO: Implement sharing
                alert('Sharing feature coming soon!');
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share This Card
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}