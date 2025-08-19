import { ArrowLeft, Share2, Edit, User, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import birthdayCardFront from "@/assets/birthday-card-front.jpg";
import birthdayCardInside from "@/assets/birthday-card-inside.jpg";
import graduationCardFront from "@/assets/graduation-card-front.jpg";
import graduationCardInside from "@/assets/graduation-card-inside.jpg";

const mockCards = [
  {
    id: "1",
    frontImage: birthdayCardFront,
    insideImage: birthdayCardInside,
    transcription: "Happy Birthday! Hope your special day is wonderful and that you have a fantastic year ahead. Love, Mom & Dad",
    tags: ["birthday", "family", "2024"],
    person: "Mom & Dad",
    event: "birthday",
    date: "2024-03-15"
  },
  {
    id: "2", 
    frontImage: graduationCardFront,
    insideImage: graduationCardInside,
    transcription: "Congratulations on your graduation! We are so proud of all your hard work and achievements.",
    tags: ["graduation", "achievement", "2024"],
    person: "Grandma",
    event: "graduation", 
    date: "2024-05-20"
  }
];

export const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find the card by ID
  const card = mockCards.find(c => c.id === id);
  
  if (!card) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Card not found</p>
      </div>
    );
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Edit className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Metadata */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="font-medium text-foreground">{card.person}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(card.date)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-accent-soft text-accent-foreground"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Card Images */}
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-3">Front</h3>
            <div className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden card-shadow">
              <img
                src={card.frontImage}
                alt="Card front"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Inside</h3>
            <div className="aspect-[3/4] bg-secondary rounded-lg overflow-hidden card-shadow">
              <img
                src={card.insideImage}
                alt="Card inside"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Transcription */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">
              {card.transcription}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};