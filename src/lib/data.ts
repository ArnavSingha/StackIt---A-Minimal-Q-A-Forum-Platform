import type { User, Tag, Question, Answer, QuestionWithAuthor, AnswerWithAuthor } from '@/types';
import { dbAdmin } from '@/lib/firebase/admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';

async function getUserById(userId: string): Promise<User | null> {
    if (!dbAdmin) return null;
    const userDoc = await dbAdmin.collection('users').doc(userId).get();
    return userDoc.exists ? (userDoc.data() as User) : null;
}

export async function getQuestions(): Promise<QuestionWithAuthor[]> {
    if (!dbAdmin) return [];

    const questionsSnapshot = await dbAdmin.collection('questions').orderBy('createdAt', 'desc').get();
    const questions: QuestionWithAuthor[] = [];

    for (const doc of questionsSnapshot.docs) {
        const questionData = doc.data() as Question;
        const author = await getUserById(questionData.authorId);
        if (author) {
            questions.push({
                ...questionData,
                id: doc.id,
                author,
                createdAt: (questionData.createdAt as unknown as Timestamp).toDate(),
            });
        }
    }
    return questions;
}

export async function getQuestionById(id: string): Promise<QuestionWithAuthor | undefined> {
    if (!dbAdmin) return undefined;

    const questionDoc = await dbAdmin.collection('questions').doc(id).get();
    if (!questionDoc.exists) {
        return undefined;
    }

    const questionData = questionDoc.data() as Question;

    // Increment views
    await questionDoc.ref.update({ views: FieldValue.increment(1) });
    questionData.views += 1;


    const author = await getUserById(questionData.authorId);
    if (!author) {
        // This case should ideally not happen in a consistent database
        throw new Error(`Author with ID ${questionData.authorId} not found for question ${id}`);
    }

    const answersSnapshot = await dbAdmin.collection('answers').where('questionId', '==', id).orderBy('createdAt', 'asc').get();
    const answers: AnswerWithAuthor[] = [];
    for (const doc of answersSnapshot.docs) {
        const answerData = doc.data() as Answer;
        const answerAuthor = await getUserById(answerData.authorId);
        if (answerAuthor) {
            answers.push({
                ...answerData,
                id: doc.id,
                author: answerAuthor,
                createdAt: (answerData.createdAt as unknown as Timestamp).toDate(),
            });
        }
    }
    
    // sort accepted answer to the top
    answers.sort((a, b) => (b.isAccepted ? 1 : 0) - (a.isAccepted ? 1 : 0));

    return {
        ...questionData,
        id: questionDoc.id,
        author,
        answers,
        createdAt: (questionData.createdAt as unknown as Timestamp).toDate(),
    };
}

export async function getTags(): Promise<Tag[]> {
    if (!dbAdmin) return [];
    const tagsSnapshot = await dbAdmin.collection('tags').orderBy('questionCount', 'desc').limit(20).get();
    return tagsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tag));
}

export async function getUsers(): Promise<User[]> {
    if (!dbAdmin) {
        console.log('Firestore not initialized, returning empty user array.');
        return [];
    }
    const usersSnapshot = await dbAdmin.collection('users').get();
    const users: User[] = [];
    usersSnapshot.forEach(doc => {
        users.push(doc.data() as User);
    });
    return users;
}

type NewAnswerData = {
    author: User;
    content: string;
};

export async function addAnswer(questionId: string, answerData: NewAnswerData): Promise<string> {
    if (!dbAdmin) throw new Error('Firestore not initialized');

    const questionRef = dbAdmin.collection('questions').doc(questionId);

    const newAnswerRef = dbAdmin.collection('answers').doc();
    await newAnswerRef.set({
        questionId: questionId,
        authorId: answerData.author.id,
        content: answerData.content,
        upvotes: 0,
        downvotes: 0,
        isAccepted: false,
        createdAt: FieldValue.serverTimestamp(),
    });

    await questionRef.update({
        answerCount: FieldValue.increment(1)
    });

    return newAnswerRef.id;
}

export async function acceptAnswer(questionId: string, answerId: string, userId: string): Promise<void> {
    if (!dbAdmin) throw new Error('Firestore not initialized');
    
    const questionRef = dbAdmin.collection('questions').doc(questionId);
    const questionDoc = await questionRef.get();

    if (!questionDoc.exists) throw new Error('Question not found');
    
    const questionData = questionDoc.data() as Question;
    if (questionData.authorId !== userId) {
        throw new Error('Only the question owner can accept an answer.');
    }

    const answerRef = dbAdmin.collection('answers').doc(answerId);
    const answerDoc = await answerRef.get();
    if (!answerDoc.exists) throw new Error('Answer not found');

    const batch = dbAdmin.batch();

    // Un-accept any other accepted answers for this question
    const currentlyAcceptedSnapshot = await dbAdmin.collection('answers')
        .where('questionId', '==', questionId)
        .where('isAccepted', '==', true)
        .get();
        
    currentlyAcceptedSnapshot.forEach(doc => {
        batch.update(doc.ref, { isAccepted: false });
    });

    // Accept the new answer
    batch.update(answerRef, { isAccepted: true });

    await batch.commit();
}


type NewQuestionData = {
    title: string;
    description: string;
    tags: string[];
    authorId: string;
}

export async function createQuestion(questionData: NewQuestionData): Promise<string> {
    if (!dbAdmin) throw new Error('Firestore not initialized');
    
    const questionRef = dbAdmin.collection('questions').doc();
    
    await questionRef.set({
        ...questionData,
        upvotes: 0,
        downvotes: 0,
        views: 0,
        answerCount: 0,
        createdAt: FieldValue.serverTimestamp(),
    });

    // Update tag counts
    for (const tagName of questionData.tags) {
        const tagRef = dbAdmin.collection('tags').doc(tagName.toLowerCase());
        const tagDoc = await tagRef.get();
        if (tagDoc.exists) {
            await tagRef.update({ questionCount: FieldValue.increment(1) });
        } else {
            await tagRef.set({ name: tagName, questionCount: 1 });
        }
    }

    return questionRef.id;
}
