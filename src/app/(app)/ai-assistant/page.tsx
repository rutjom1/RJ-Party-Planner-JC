import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSuggester } from "@/components/ai/theme-suggester";
import { InvitationDrafter } from "@/components/ai/invitation-drafter";
import { GameRecommender } from "@/components/ai/game-recommender";
import { Lightbulb, Mail, Puzzle } from "lucide-react";

export default function AiAssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Party Assistant</h1>
        <p className="text-muted-foreground">Let our AI help you with the creative parts of party planning.</p>
      </div>
      <Tabs defaultValue="themes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="themes">
            <Lightbulb className="mr-2 h-4 w-4" />
            Theme Ideas
          </TabsTrigger>
          <TabsTrigger value="invitations">
            <Mail className="mr-2 h-4 w-4" />
            Invitation Wording
          </TabsTrigger>
          <TabsTrigger value="games">
            <Puzzle className="mr-2 h-4 w-4" />
            Game Recommendations
          </TabsTrigger>
        </TabsList>
        <TabsContent value="themes">
          <ThemeSuggester />
        </TabsContent>
        <TabsContent value="invitations">
          <InvitationDrafter />
        </TabsContent>
        <TabsContent value="games">
          <GameRecommender />
        </TabsContent>
      </Tabs>
    </div>
  );
}
