namespace ch12 {
  class Lecture {
    private pass: number;
    private title: string;
    private scores: number[] = [];

    constructor(title: string, pass: number, scores: number[]) {
      this.title = title;
      this.pass = pass;
      this.scores = scores;
    }

    public average(): number {
      return this.scores.reduce((acc, cur) => acc + cur, 0) / this.scores.length;
    }

    public getScores(): number[] {
      return this.scores;
    }
    
    public evaluate(): string {
      return `Pass: ${this.passCount()} Fail ${this.failCount()}`;
    }

    private passCount(): number  {
      return this.scores.filter((score) => score >= this.pass).length;
    }

    private failCount(): number {
      return this.scores.length - this.passCount();
    }
  }

  class GradeLecture extends Lecture {
    private grades: Grade[];

    constructor(name: string, pass: number, grades: Grade[], scores: number[]) {
      super(name, pass, scores);
      this.grades = grades;
    }

    public evaluate(): string {
      return `${super.evaluate()}, ${this.gradesStatistics()}`;
    }

    public avertage(gradeName: string): number {
      return this.gradeAverage((this.grades.filter((grade) => grade.isName(gradeName)))[0]);
    }

    private gradeAverage(grade: Grade): number {
      const scores = super.getScores().filter((score) => grade.include(score))
      return scores.reduce((acc, num) => acc + num, 0) / scores.length;
    }

    private gradesStatistics(): string {
      return this.grades.map((grade) => this.format(grade)).join(" ");
    }

    private format(grade: Grade): string {
      return `${grade.getName()}:${this.gradeCount(grade)}`;
    }

    private gradeCount(grade: Grade): number {
      return super.getScores().filter((score) => grade.include(score)).length;
    }
  }
  
  class Grade {
    private name: string;
    private upper: number;
    private lower: number;

    constructor(name: string, upper: number, lower: number) {
      this.name = name;
      this.upper = upper;
      this.lower = lower;
    }

    public getName(): string {
      return this.name;
    }

    public isName(name: string): boolean {
      return this.name === name;
    }

    public include(score: number): boolean {
      return score >= this.lower && score <= this.upper;
    }
  }

  class Professor {
    private name: string;
    private lecture: Lecture;

    constructor(name: string, lecture: Lecture) {
      this.name = name;
      this.lecture = lecture; // GradeLecture를 제공하는 것도 가능
    }

    public compileStatistics(): string {
      return `[${this.name}] ${this.lecture.evaluate()} - Avg: ${this.lecture.average()}`;
    }
  }
}