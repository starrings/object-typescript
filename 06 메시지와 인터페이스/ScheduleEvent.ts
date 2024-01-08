namespace ch6 {
  class Event {
    private subject: string;
    private from: Date;
    private dayOfweek: string;
    private duration: Date;

    constructor(subject: string, from: Date, dayOfweek: string, duration: Date) {
      this.subject = subject;
      this.from = from;
      this.dayOfweek = dayOfweek;
      this.duration = duration;
    }

    // 명령(Command)과 쿼리(Query)를 분리하여 예측가능하고 유지보수가 수월한 코드가 됨
    public isSatisfied(schedule: RecurringSchedule) {
      if(this.dayOfweek !== schedule.getDayOfWeek() || !(this.from === schedule.getFrom()) || !(this.duration === schedule.getDuration())) {
        return false;
      }

      return true;
    }

    public reschedule(schedule: RecurringSchedule) {
      this.from = schedule.getFrom();
      this.duration = schedule.getDuration();
    }
  } 

  class RecurringSchedule {
    private subject: string;
    private dayOfWeek: string;
    private from: Date;
    private duration: Date;

    constructor(subject: string, dayOfWeek: string, from: Date, duration: Date) {
      this.subject = subject;
      this.dayOfWeek = dayOfWeek;
      this.from = from;
      this.duration = duration;
    }

    public getDayOfWeek(): string {
      return this.dayOfWeek;
    }

    public getFrom(): Date {
      return this.from;
    }

    public getDuration(): Date {
      return this.duration;
    }
  }
}