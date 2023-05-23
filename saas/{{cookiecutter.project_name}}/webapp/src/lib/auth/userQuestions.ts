type ValueOf<T> = T[keyof T];

export const userQuestionsKeys = {
	question1: 'question1',
	question2: 'question2',
	question3: 'question3',
	question4: 'question4',
	question5: 'question5'
} as const;

export type UserQuestionsKey = ValueOf<typeof userQuestionsKeys>;

export const userQuestions: Record<UserQuestionsKey, string> = {
	question1: 'Where did your parents meet?',
	question2: 'What is the name of your first pet?',
	question3: 'What is your home town?',
	question4: 'What is the name of your first teacher?',
	question5: 'What is the surname of your mother before wedding?'
} as const;

export type UserAnswers = Record<UserQuestionsKey, string>;
