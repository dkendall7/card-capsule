import { useState } from "react";
import { Plus, Search, Filter, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardPreview } from "./CardPreview";

// Mock data for demonstration
const mockCards = [
  {
    id: "1",
    frontImage: "/placeholder.svg",
    insideImage: "/placeholder.svg",
    transcription: "Happy Birthday! Hope your special day is wonderful and that you have a fantastic year ahead. Love, Mom & Dad",
    tags: ["birthday", "family", "2024"],
    person: "Mom & Dad",
    event: "birthday",
    date: "2024-03-15",
    thumbnail: "/placeholder.svg"
  },
  {
    id: "2", 
    frontImage: "/placeholder.svg",
    insideImage: "/placeholder.svg",
    transcription: "Congratulations on your graduation! We are so proud of all your hard work and achievements.",
    tags: ["graduation", "achievement", "2024"],
    person: "Grandma",
    event: "graduation", 
    date: "2024-05-20",
    thumbnail: "/placeholder.svg"
  }
];

export const Timeline = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredCards = mockCards.filter(card => {
    const matchesSearch = card.transcription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.person.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && card.event === filter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground mb-4">CardCapsule</h1>
          
          {/* Search and Filter */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search cards, people, or events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary/50 border-border"
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Filter Tags */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["all", "birthday", "graduation", "wedding", "sympathy"].map((tag) => (
              <Button
                key={tag}
                variant={filter === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(tag)}
                className="whitespace-nowrap capitalize"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="px-4 pb-24">
        {filteredCards.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No cards yet</h3>
            <p className="text-muted-foreground mb-6">Start preserving your memories by capturing your first card</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">
              {filteredCards.length} {filteredCards.length === 1 ? 'card' : 'cards'}
            </h2>
            
            <div className="grid gap-4">
              {filteredCards.map((card) => (
                <CardPreview key={card.id} card={card} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="floating-shadow rounded-full w-14 h-14 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};