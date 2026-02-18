'use client';
import { useDoc, useFirestore } from "@/firebase";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar, Link as LinkIcon, Loader2 } from "lucide-react";
import { doc } from "firebase/firestore";
import { Project } from "@/lib/types";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const eventRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, "events", params.id);
  }, [firestore, params.id]);
  const { data: project, loading } = useDoc<Project>(eventRef);

  if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
  }

  if (!project) {
    notFound();
  }

  const projectDate = new Date(project.startDate.replace(/-/g, '/'));

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-headline">{project.name}</CardTitle>
          <CardDescription className="text-lg">{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">{projectDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-muted-foreground" />
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">{project.repoUrl}</Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Stack:</span>
            <span className="text-foreground">{project.techStack}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>Task management, team collaboration, and CI/CD integration are being planned!</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Check back later to manage all aspects of your project right from this page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
