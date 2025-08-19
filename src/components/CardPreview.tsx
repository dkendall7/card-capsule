import { useState } from "react";
import { Calendar, User, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CardData {
  id: string;
  frontImage: string;
  insideImage: string;
  transcription: string;
  tags: string[];
  person: string;
  event: string;
  date: string;
  thumbnail: string;
}

interface CardPreviewProps {
  card: CardData;
}

export const CardPreview = ({ card }: CardPreviewProps) => {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="card-shadow hover:card-shadow-hover transition-all duration-200 cursor-pointer group">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Card Image */}
          <div className="relative w-20 h-20 shrink-0">
            <div className="w-full h-full bg-secondary rounded-lg overflow-hidden">
              {!imageError ? (
                <img
                  src={card.thumbnail}
                  alt="Card preview"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-primary-soft flex items-center justify-center">
                  <div className="w-8 h-10 bg-primary/20 rounded-sm"></div>
                </div>
              )}
            </div>
          </div>

          {/* Card Content */}
          <div className="flex-1 min-w-0">
            {/* Metadata */}
            <div className="flex items-center gap-3 mb-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="font-medium">{card.person}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(card.date)}</span>
              </div>
            </div>

            {/* Transcription Preview */}
            <p className="text-foreground text-sm leading-relaxed mb-3 line-clamp-2">
              {card.transcription}
            </p>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-3 h-3 text-muted-foreground" />
              {card.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-accent-soft text-accent-foreground"
                >
                  {tag}
                </Badge>
              ))}
              {card.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{card.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};