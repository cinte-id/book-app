import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { tutorials } from "@/data/tutorials";

export default function TutorialTabs() {
  return (
    <section className="w-full">
      <Tabs defaultValue={String(tutorials[0].id)}>
        <TabsList className="flex w-full flex-wrap h-auto">
          {tutorials.map((tutorial) => (
            <TabsTrigger key={tutorial.id} value={String(tutorial.id)}>
              {tutorial.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {tutorials.map((tutorial) => (
          <TabsContent key={tutorial.id} value={String(tutorial.id)}>
            <Card>
              <CardHeader>
                <CardTitle>{tutorial.title}</CardTitle>
                <CardDescription>{tutorial.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {tutorial.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                      <p className="text-sm text-muted-foreground">{step}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
