import { ArrowLeft, Share2, Edit, User, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CardDetailProps {
  card: {
    id: string;
    frontImage: string;
    insideImage: string;
    transcription: string;
    tags: string[];
    person: string;
    event: string;
    date: string;
  };
}

export const CardDetail = ({ card }: CardDetailProps) => {
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
          <Button variant="ghost" size="icon">
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