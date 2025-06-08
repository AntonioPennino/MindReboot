
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface AffirmationCardProps {
  affirmation: string;
}

export default function AffirmationCard({ affirmation }: AffirmationCardProps) {
  return (
    <Card className="shadow-lg bg-gradient-to-br from-primary to-accent">
      <CardHeader className="flex flex-row items-center gap-2 text-primary-foreground">
        <Sparkles className="h-6 w-6" />
        <CardTitle className="text-xl">La Tua Affermazione Personalizzata</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-primary-foreground text-center py-4">
          "{affirmation}"
        </p>
      </CardContent>
    </Card>
  );
}
