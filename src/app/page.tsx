import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Eye,
  Tag as TagIcon,
} from 'lucide-react';
import { getQuestions, getTags } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

export default async function Home() {
  const questions = await getQuestions();
  const tags = await getTags();

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12">
      <aside className="hidden md:block">
        <div className="sticky top-24">
          <h2 className="text-lg font-headline font-semibold mb-4 flex items-center">
            <TagIcon className="mr-2 h-5 w-5" />
            Popular Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="cursor-pointer hover:bg-muted">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </aside>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-headline font-bold">All Questions</h1>
          <div className="flex gap-2">
            <Button variant="outline">Newest</Button>
            <Button variant="ghost">Popular</Button>
            <Button variant="ghost">Unanswered</Button>
          </div>
        </div>

        {questions.map((question) => (
          <Card key={question.id} className="hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <Link href={`/questions/${question.id}`}>
                <CardTitle className="font-headline text-xl text-primary hover:underline">
                  {question.title}
                </CardTitle>
              </Link>
              <div className="flex flex-wrap gap-2 pt-2">
                {question.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground gap-4">
                <div className="flex items-center gap-1" title="Votes">
                  <ArrowBigUp className="h-4 w-4" />
                  <span>{question.upvotes - question.downvotes}</span>
                </div>
                <div className="flex items-center gap-1" title="Answers">
                  <MessageSquare className="h-4 w-4" />
                  <span>{question.answers.length}</span>
                </div>
                <div className="flex items-center gap-1" title="Views">
                  <Eye className="h-4 w-4" />
                  <span>{question.views}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={question.author.avatarUrl} alt={question.author.name} />
                  <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-semibold text-primary">{question.author.name}</span>
                  <span className="text-muted-foreground"> asked </span>
                  <time dateTime={question.createdAt.toISOString()}>
                    {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                  </time>
                </div>
              </div>
              <Link href={`/questions/${question.id}`} passHref>
                <Button variant="ghost">View Question</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
