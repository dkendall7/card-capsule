import { useState, useEffect } from "react";
import { Plus, Calendar, Heart, Share2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardPreview } from "./CardPreview";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "./AuthModal";
import { OnboardingFlow } from "./OnboardingFlow";
import { UserNav } from "./UserNav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InstallPrompt } from "./InstallPrompt";

export function Timeline() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Fetch user's cards
  const { data: cards = [], isLoading: cardsLoading } = useQuery({
    queryKey: ['cards', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Show onboarding for new users who haven't completed it
  useEffect(() => {
    if (user && profile && !profile.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [user, profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show auth modal for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">CardCapsule</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowAuthModal(true)}
              >
                Log In
              </Button>
              <Button onClick={() => navigate("/capture")}>
                Try It Now
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="container mx-auto px-4 py-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Problem Statement */}
            <div className="bg-muted/30 rounded-2xl p-6 mb-6">
              <p className="text-lg text-muted-foreground">
                We get it. You want to keep those heartfelt cards, but you also want a tidy home. You shouldn't have to choose between preserving precious memories and avoiding clutter.
              </p>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-6xl font-bold">
                Keep the Love,
                <span className="text-primary block">Lose the Clutter</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Turn fleeting moments into timeless keepsakes you can revisit anytime — without the guilt of tossing cards or the burden of clutter.
              </p>
            </div>

            {/* Primary CTAs - Above the fold */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 mb-8">
              <Button 
                size="lg" 
                onClick={() => navigate("/capture")}
              >
                Try CardCapsule Now
                <Camera className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowAuthModal(true)}
              >
                Sign Up Free
                <Heart className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Visual Demo */}
            <div className="mt-8 mb-8">
              <div className="bg-muted/20 rounded-3xl p-8 max-w-4xl mx-auto">
                <img 
                  src="/product-comparison-mockup.jpg" 
                  alt="Side-by-side comparison of physical greeting card and digital keepsake in mobile app"
                  className="w-full rounded-xl shadow-lg"
                />
                <p className="text-center text-sm font-medium text-primary mt-6">
                  Two taps to capture, forever safe in your private archive.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Capture & Digitize</h3>
                <p className="text-muted-foreground">
                  Quickly photograph your cards and transform them into digital keepsakes in seconds
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Guilt-Free Storage</h3>
                <p className="text-muted-foreground">
                  Keep every heartfelt message safe, while letting go of the paper.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Share2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Relive & Share</h3>
                <p className="text-muted-foreground">
                  Access your memories anywhere and share special moments with loved ones instantly
                </p>
              </div>
            </div>

            
            {/* Trust Signal */}
            <p className="text-sm text-muted-foreground mt-6">
              Your memories are private and secure. Only you control what's shared.
            </p>
          </div>
        </main>

        <AuthModal 
          open={showAuthModal} 
          onOpenChange={setShowAuthModal}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">CardCapsule</h1>
          </div>
          <UserNav />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {cards.length === 0 && !cardsLoading ? (
          /* Empty State */
          <div className="text-center py-16 space-y-6">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Your Memory Collection Awaits</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start capturing your first greeting card to begin building your personal memory collection.
              </p>
            </div>
            <Button size="lg" onClick={() => navigate("/capture")}>
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Card
            </Button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Your Cards</h2>
              <Badge variant="secondary" className="text-sm">
                {cards.length} {cards.length === 1 ? 'card' : 'cards'}
              </Badge>
            </div>

            {cardsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="aspect-video bg-muted animate-pulse" />
                    <CardHeader>
                      <div className="h-4 bg-muted animate-pulse rounded" />
                      <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card: any) => (
                  <CardPreview
                    key={card.id}
                    card={{
                      id: card.id,
                      frontImage: card.front_image_url,
                      insideImage: card.inside_image_url,
                      transcription: card.message || card.title,
                      tags: [card.occasion.toLowerCase()],
                      person: card.recipient,
                      event: card.occasion.toLowerCase(),
                      date: card.date_created,
                      thumbnail: card.front_image_url
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <Button
          size="lg"
          onClick={() => navigate("/capture")}
          className="floating-shadow rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Onboarding Flow */}
      <OnboardingFlow 
        open={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />

      {/* Install Prompt */}
      <InstallPrompt />
    </div>
  );
}