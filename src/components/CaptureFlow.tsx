import { useState, useRef } from "react";
import { Camera, ArrowLeft, Check, Upload, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import birthdayCardFront from "@/assets/birthday-card-front.jpg";
import birthdayCardInside from "@/assets/birthday-card-inside.jpg";

type CaptureStep = "front" | "inside" | "details" | "review";

export const CaptureFlow = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CaptureStep>("front");
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [insideImage, setInsideImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cardData, setCardData] = useState({
    title: "",
    occasion: "",
    recipient: "",
    message: ""
  });
  
  const frontInputRef = useRef<HTMLInputElement>(null);
  const insideInputRef = useRef<HTMLInputElement>(null);
  const frontCameraRef = useRef<HTMLInputElement>(null);
  const insideCameraRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Redirect if not authenticated
  if (!user) {
    navigate('/');
    return null;
  }

  const handleCameraCapture = (step: CaptureStep) => {
    if (isMobile) {
      // On mobile, trigger the camera input
      if (step === "front" && frontCameraRef.current) {
        frontCameraRef.current.click();
      } else if (step === "inside" && insideCameraRef.current) {
        insideCameraRef.current.click();
      }
    } else {
      // On desktop, use mock images for demo
      const mockImages = {
        front: birthdayCardFront,
        inside: birthdayCardInside
      };
      
      if (step === "front") {
        setFrontImage(mockImages.front);
        setCurrentStep("inside");
        toast({
          title: "Photo captured!",
          description: "Front of card captured successfully."
        });
      } else if (step === "inside") {
        setInsideImage(mockImages.inside);
        setCurrentStep("details");
        toast({
          title: "Photo captured!",
          description: "Inside of card captured successfully."
        });
      }
    }
  };

  const handleFileUpload = (step: CaptureStep, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (step === "front") {
        setFrontImage(result);
        setCurrentStep("inside");
        toast({
          title: "Photo captured!",
          description: "Front of card captured successfully."
        });
      } else if (step === "inside") {
        setInsideImage(result);
        setCurrentStep("details");
        toast({
          title: "Photo captured!",
          description: "Inside of card captured successfully."
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = (step: CaptureStep) => {
    if (step === "front" && frontInputRef.current) {
      frontInputRef.current.click();
    } else if (step === "inside" && insideInputRef.current) {
      insideInputRef.current.click();
    }
  };

  const handleSaveCard = async () => {
    if (!user || !cardData.title || !cardData.occasion) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      const { data, error } = await supabase
        .from('cards')
        .insert({
          user_id: user.id,
          title: cardData.title,
          occasion: cardData.occasion,
          recipient: cardData.recipient || null,
          message: cardData.message || null,
          front_image_url: frontImage,
          inside_image_url: insideImage,
          is_public: false
        });

      if (error) throw error;

      toast({
        title: "Card Saved!",
        description: "Your precious memory has been preserved successfully."
      });
      
      navigate("/");
    } catch (error) {
      console.error('Error saving card:', error);
      toast({
        title: "Error Saving Card",
        description: "There was an issue saving your card. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
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
            <div className="space-y-3">
              <Button 
                size="lg" 
                onClick={() => handleCameraCapture("front")}
                className="w-full"
              >
                <Camera className="w-5 h-5 mr-2" />
                {isMobile ? "Take Photo" : "Take Photo (Demo)"}
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                onClick={() => triggerFileInput("front")}
                className="w-full"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Image
              </Button>
            </div>
            <input
              ref={frontInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload("front", file);
              }}
              className="hidden"
            />
            <input
              ref={frontCameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload("front", file);
              }}
              className="hidden"
            />
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
            <div className="space-y-3">
              <Button 
                size="lg" 
                onClick={() => handleCameraCapture("inside")}
                className="w-full"
              >
                <Camera className="w-5 h-5 mr-2" />
                {isMobile ? "Take Photo" : "Take Photo (Demo)"}
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                onClick={() => triggerFileInput("inside")}
                className="w-full"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Image
              </Button>
            </div>
            <input
              ref={insideInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload("inside", file);
              }}
              className="hidden"
            />
            <input
              ref={insideCameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload("inside", file);
              }}
              className="hidden"
            />
          </div>
        );

      case "details":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Card Details</h2>
              <p className="text-muted-foreground">
                Tell us more about this special card
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Card Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Happy Birthday Mom!"
                  value={cardData.title}
                  onChange={(e) => setCardData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="occasion">Occasion *</Label>
                <Input
                  id="occasion"
                  placeholder="e.g., Birthday, Wedding, Graduation"
                  value={cardData.occasion}
                  onChange={(e) => setCardData(prev => ({ ...prev, occasion: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="recipient">From/To (optional)</Label>
                <Input
                  id="recipient"
                  placeholder="e.g., From Mom & Dad"
                  value={cardData.recipient}
                  onChange={(e) => setCardData(prev => ({ ...prev, recipient: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Type the message from the card here..."
                  rows={4}
                  value={cardData.message}
                  onChange={(e) => setCardData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full" 
              onClick={() => setCurrentStep("review")}
              disabled={!cardData.title || !cardData.occasion}
            >
              Continue to Review
            </Button>
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Review Your Card</h2>
              <p className="text-muted-foreground">
                Check everything looks good before saving
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

            {/* Card Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  {cardData.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Occasion: </span>
                  <span className="text-sm text-muted-foreground">{cardData.occasion}</span>
                </div>
                {cardData.recipient && (
                  <div>
                    <span className="text-sm font-medium">From/To: </span>
                    <span className="text-sm text-muted-foreground">{cardData.recipient}</span>
                  </div>
                )}
                {cardData.message && (
                  <div>
                    <span className="text-sm font-medium">Message: </span>
                    <p className="text-sm text-muted-foreground mt-1">{cardData.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full" 
                onClick={handleSaveCard}
                disabled={isUploading}
              >
                <Check className="w-5 h-5 mr-2" />
                {isUploading ? "Saving Card..." : "Save Card"}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full" 
                onClick={() => setCurrentStep("details")}
                disabled={isUploading}
              >
                Back to Edit
              </Button>
            </div>
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
              <div className={`w-2 h-2 rounded-full ${currentStep === "details" ? "bg-primary" : "bg-muted"}`} />
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