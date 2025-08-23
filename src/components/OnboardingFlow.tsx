import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Camera, Heart, Share2, CheckCircle, ArrowRight } from 'lucide-react';

interface OnboardingFlowProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingFlow({ open, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    username: '',
    bio: ''
  });
  const { profile, updateProfile, user } = useAuth();
  const navigate = useNavigate();

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    await updateProfile({
      username: profileData.username,
      bio: profileData.bio,
      onboarding_completed: true
    });
    
    setStep(4);
  };

  const handleComplete = () => {
    onComplete();
    navigate('/capture');
  };

  const steps = [
    {
      title: "Welcome to CardCapsule!",
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Preserve Your Precious Moments</h3>
            <p className="text-muted-foreground">
              CardCapsule helps you capture, store, and share your greeting cards and special messages forever.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <Camera className="w-8 h-8 mx-auto text-primary" />
              <p className="text-sm font-medium">Capture</p>
              <p className="text-xs text-muted-foreground">Take photos of your cards</p>
            </div>
            <div className="space-y-2">
              <Heart className="w-8 h-8 mx-auto text-primary" />
              <p className="text-sm font-medium">Preserve</p>
              <p className="text-xs text-muted-foreground">Keep memories safe</p>
            </div>
            <div className="space-y-2">
              <Share2 className="w-8 h-8 mx-auto text-primary" />
              <p className="text-sm font-medium">Share</p>
              <p className="text-xs text-muted-foreground">Show loved ones</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Set Up Your Profile",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Choose a Username</Label>
            <Input
              id="username"
              placeholder="e.g. @cardlover"
              value={profileData.username}
              onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              This will be your unique identifier for sharing cards
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Tell us about yourself (optional)</Label>
            <Textarea
              id="bio"
              placeholder="I love collecting greeting cards from my family..."
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
            />
          </div>
        </div>
      )
    },
    {
      title: "You're Ready!",
      content: (
        <div className="text-center space-y-6">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
          <div>
            <h3 className="text-xl font-semibold mb-2">All Set!</h3>
            <p className="text-muted-foreground mb-4">
              Your profile is ready. Let's capture your first card and experience the magic of preserving memories.
            </p>
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <p className="text-sm font-medium text-primary mb-1">💡 Pro Tip</p>
              <p className="text-sm text-muted-foreground">
                Take photos of both the front and inside of your cards for the complete memory
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full ${
                  i + 1 <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <div className="min-h-[300px]">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {steps[step - 1].title}
            </h2>
            {steps[step - 1].content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              Back
            </Button>
            
            {step < 3 ? (
              <Button
                onClick={() => {
                  if (step === 2) {
                    handleProfileUpdate();
                  } else {
                    setStep(step + 1);
                  }
                }}
                disabled={step === 2 && !profileData.username.trim()}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete}>
                Create Your First Card
                <Camera className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}