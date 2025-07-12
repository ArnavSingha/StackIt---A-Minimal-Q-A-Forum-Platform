import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Eye,
  Tag as TagIcon,
  CheckCircle2,
  User,
} from 'lucide-react';
import { getQuestionById } from '@/lib/data';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { VoteButtons } from './_components/vote-buttons';
import { AnswerForm } from './_components/answer-form';

export default async function QuestionPage({ params }: { params: { id: string } }) {
  const question = await getQuestionById(params.id);

  if (!question) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
      <div>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-headline font-bold">
              {question.title}
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground gap-4 pt-2">
              <span>
                Asked{' '}
                <time dateTime={question.createdAt.toISOString()}>
                  {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                </time>
              </span>
              <div className="flex items-center gap-1" title="Views">
                <Eye className="h-4 w-4" />
                <span>{question.views} views</span>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="py-6 flex gap-6">
            <VoteButtons
              upvotes={question.upvotes}
              downvotes={question.downvotes}
            />
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
            <div className="flex justify-end w-full">
              <Card className="bg-secondary p-3 w-fit">
                <div className="text-xs text-muted-foreground mb-1">
                  asked {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={question.author.avatarUrl} />
                    <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold text-primary">{question.author.name}</span>
                </div>
              </Card>
            </div>
          </CardFooter>
        </Card>

        {question.answers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-headline font-bold mb-4">
              {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
            </h2>
            <div className="space-y-6">
              {question.answers.map((answer) => (
                <Card key={answer.id} className={`transition-shadow ${answer.isAccepted ? 'border-green-500 shadow-lg' : ''}`}>
                  <CardContent className="py-6 flex gap-6">
                     <VoteButtons
                        upvotes={answer.upvotes}
                        downvotes={answer.downvotes}
                        isAccepted={answer.isAccepted}
                      />
                    <div className="flex-1">
                      <div
                        className="prose dark:prose-invert max-w-none mb-6"
                        dangerouslySetInnerHTML={{ __html: answer.content }}
                      />
                      <div className="flex justify-end w-full">
                         <Card className="bg-secondary p-3 w-fit">
                            <div className="text-xs text-muted-foreground mb-1">
                              answered {formatDistanceToNow(answer.createdAt, { addSuffix: true })}
                            </div>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={answer.author.avatarUrl} />
                                <AvatarFallback>{answer.author.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-semibold text-primary">{answer.author.name}</span>
                            </div>
                          </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <AnswerForm />
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-headline">About the author</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={question.author.avatarUrl} />
                <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-primary">{question.author.name}</p>
                <p className="text-sm text-muted-foreground">Member for 2 years</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </aside>
    </div>
  );
}
