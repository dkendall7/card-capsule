import { useState, useRef } from "react";
import { Camera, ArrowLeft, Check, Upload, Heart, Eye } from "lucide-react";
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
import { PostSaveActions } from "./PostSaveActions";
import { AuthModal } from "./AuthModal";
import { ImageViewerDialog } from "./ImageViewerDialog";

type CaptureStep = "front" | "inside" | "details" | "review" | "success";

export const CaptureFlow = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CaptureStep>("front");
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [insideImage, setInsideImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [viewerImage, setViewerImage] = useState<{ url: string; title: string }>({ url: '', title: '' });
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
  // Remove the redirect logic - allow unauthenticated users
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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

  const handleImageView = (imageUrl: string, title: string) => {
    setViewerImage({ url: imageUrl, title });
    setShowImageViewer(true);
  };

  // Show auth modal when trying to save without authentication
  const handleBackNavigation = () => {
    switch (currentStep) {
      case "inside":
        setCurrentStep("front");
        break;
      case "details":
        setCurrentStep("inside");
        break;
      case "review":
        setCurrentStep("details");
        break;
      case "success":
        setCurrentStep("review");
        break;
      case "front":
      default:
        navigate("/");
        break;
    }
  };

  const handleSaveCard = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    if (!cardData.title || !cardData.occasion) {
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
      
      setCurrentStep("success");
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
                  Add details about this special card (we're working on auto-extraction!)
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
            
            {/* Compact Image Preview */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <p className="text-sm font-medium">Front</p>
                <div 
                  className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden cursor-pointer relative group"
                  onClick={() => frontImage && handleImageView(frontImage, 'Card Front')}
                >
                  {frontImage && (
                    <>
                      <img src={frontImage} alt="Front" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Inside</p>
                <div 
                  className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden cursor-pointer relative group"
                  onClick={() => insideImage && handleImageView(insideImage, 'Card Inside')}
                >
                  {insideImage && (
                    <>
                      <img src={insideImage} alt="Inside" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </>
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

            {!user && (
              <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                <div className="text-center space-y-2">
                  <Heart className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Ready to save your memory?</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign up for free to preserve this card forever.<br />
                    <span className="font-medium text-primary">Always free, no hidden costs.</span>
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full" 
                onClick={handleSaveCard}
                disabled={isUploading}
              >
                <Check className="w-5 h-5 mr-2" />
                {!user ? "Sign Up Free & Save Card" : isUploading ? "Saving Card..." : "Save Card"}
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

      case "success":
        return (
          <div className="text-center space-y-6">
            <PostSaveActions
              lastCardOccasion={cardData.occasion}
              onAddAnother={() => {
                // Reset form for new card
                setFrontImage(null);
                setInsideImage(null);
                setCardData({
                  title: "",
                  occasion: cardData.occasion, // Pre-fill same occasion
                  recipient: "",
                  message: ""
                });
                setCurrentStep("front");
                toast({
                  title: "Ready for another card!",
                  description: `Adding another ${cardData.occasion.toLowerCase()} card.`
                });
              }}
              onGoHome={() => navigate("/")}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <Button variant="ghost" size="icon" onClick={handleBackNavigation}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold">New Card</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${currentStep === "front" ? "bg-primary" : "bg-muted"}`} />
              <div className={`w-2 h-2 rounded-full ${currentStep === "inside" ? "bg-primary" : "bg-muted"}`} />
              <div className={`w-2 h-2 rounded-full ${currentStep === "details" ? "bg-primary" : "bg-muted"}`} />
              <div className={`w-2 h-2 rounded-full ${currentStep === "review" ? "bg-primary" : "bg-muted"}`} />
              <div className={`w-2 h-2 rounded-full ${currentStep === "success" ? "bg-green-500" : "bg-muted"}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8">
        {renderStepContent()}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
      />

      {/* Image Viewer */}
      <ImageViewerDialog 
        open={showImageViewer}
        onOpenChange={setShowImageViewer}
        imageUrl={viewerImage.url}
        title={viewerImage.title}
      />
    </div>
  );
};