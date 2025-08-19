import { useState } from "react";
import { Camera, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

type CaptureStep = "front" | "inside" | "review";

export const CaptureFlow = () => {
  const [currentStep, setCurrentStep] = useState<CaptureStep>("front");
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [insideImage, setInsideImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageCapture = (step: CaptureStep) => {
    // In a real app, this would open the camera
    // For demo purposes, we'll use a placeholder
    const mockImage = "/placeholder.svg";
    
    if (step === "front") {
      setFrontImage(mockImage);
      setCurrentStep("inside");
    } else if (step === "inside") {
      setInsideImage(mockImage);
      setCurrentStep("review");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "front":
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-32 h-40 bg-secondary rounded-lg border-2 border-dashed border-border flex items-center justify-center">
              <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Capture the Front</h2>
              <p className="text-muted-foreground">
                Take a photo of the front of your card
              </p>
            </div>
            <Button 
              size="lg" 
              onClick={() => handleImageCapture("front")}
              className="w-full"
            >
              <Camera className="w-5 h-5 mr-2" />
              Take Photo
            </Button>
          </div>
        );

      case "inside":
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-32 h-40 bg-secondary rounded-lg border-2 border-dashed border-border flex items-center justify-center">
              <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Capture the Inside</h2>
              <p className="text-muted-foreground">
                Now take a photo of the inside with the message
              </p>
            </div>
            <Button 
              size="lg" 
              onClick={() => handleImageCapture("inside")}
              className="w-full"
            >
              <Camera className="w-5 h-5 mr-2" />
              Take Photo
            </Button>
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Review Your Card</h2>
              <p className="text-muted-foreground">
                Check the photos and transcription
              </p>
            </div>
            
            {/* Image Preview */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Front</p>
                <div className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden">
                  {frontImage && (
                    <img src={frontImage} alt="Front" className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Inside</p>
                <div className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden">
                  {insideImage && (
                    <img src={insideImage} alt="Inside" className="w-full h-full object-cover" />
                  )}
                </div>
              </div>
            </div>

            {/* Mock Transcription */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Transcription</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Happy Birthday! Hope your special day is wonderful and that you have a fantastic year ahead. Love, Mom & Dad
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Suggested Tags:</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-1 bg-accent-soft text-accent-foreground text-xs rounded">birthday</span>
                      <span className="px-2 py-1 bg-accent-soft text-accent-foreground text-xs rounded">family</span>
                      <span className="px-2 py-1 bg-accent-soft text-accent-foreground text-xs rounded">2024</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button size="lg" className="w-full" onClick={() => navigate("/")}>
              <Check className="w-5 h-5 mr-2" />
              Save Card
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold">New Card</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${currentStep === "front" ? "bg-primary" : "bg-muted"}`} />
              <div className={`w-2 h-2 rounded-full ${currentStep === "inside" ? "bg-primary" : "bg-muted"}`} />
              <div className={`w-2 h-2 rounded-full ${currentStep === "review" ? "bg-primary" : "bg-muted"}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8">
        {renderStepContent()}
      </div>
    </div>
  );
};