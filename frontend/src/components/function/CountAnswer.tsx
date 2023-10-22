import React from 'react';
import { Question } from '../../types';

const countAnsweredQuestions = (questions: Question[]): number =>
    questions.filter(question => question.answers[0]).length;

const allCount = (questions: Question[], currentPage: number) =>
    countAnsweredQuestions(questions.slice((currentPage - 1) * 100, (currentPage - 1) * 100 + 99));

export { allCount }
