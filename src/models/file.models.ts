export interface IFormidableFile {
  size: number;
  path: string;
  name: string;
  type: string;
  mtime: string;
}

export interface ITemplateExcelQuestion {
  question: string; // editor has removed the quotes and left with the accent
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correctAnswer: number;
  theme: string;
  customTheme: string;
  difficulty: string;
}
