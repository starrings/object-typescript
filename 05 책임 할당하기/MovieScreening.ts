namespace ch5 {
  enum MovieType {
    AMOUNT_DISCOUNT,
    PERCENT_DISCOUNT,
    NONE_DISCOUNT,
  }

  enum DayOfWeek {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY
  }

  function getDayOfWeek(date: Date): DayOfWeek {
    const day = date.getDay();
    switch (day) {
        case 0:
            return DayOfWeek.SUNDAY;
        case 1:
            return DayOfWeek.MONDAY;
        case 2:
            return DayOfWeek.TUESDAY;
        case 3:
            return DayOfWeek.WEDNESDAY;
        case 4:
            return DayOfWeek.THURSDAY;
        case 5:
            return DayOfWeek.FRIDAY;
        case 6:
            return DayOfWeek.SATURDAY;
        default:
            throw new Error("Invalid date");
    }
  }

  enum DiscountConditionType {
    SEQUENCE,
    PERIOD,
  }

  class Screening {
    private movie: Movie;
    private sequence: number;
    private whenScreened: Date;

    public reserve (customer: Customer, audienceCount: number): Reservation {
      return new Reservation(customer, this, this.calculateFee(audienceCount), audienceCount);
    }

    private calculateFee(audienceCount: number): Money {
      // movie의 내부 구현을 고려하지 않고 작성
      return this.movie.calculateMovieFee(this).times(audienceCount);
    } 

    public getWhenScreened() {
      return this.whenScreened;
    }

    public getSequence() {
      return this.sequence;
    }

    public getStartTime(): Date {
      return this.whenScreened;
    }
  }

  abstract class Movie {
    private title: string;
    private runningTime: Date;
    private fee: Money;
    private discountConditions: DiscountCondition[];

    private moneyType: MovieType;
    private discountAmount: Money;
    private discountPercent: number;

    constructor(title: string, runningTime: Date, fee: Money, ...discountConditions: DiscountCondition[]) {
      this.title = title;
      this.runningTime = runningTime;
      this.fee = fee;
      this.discountConditions.push(discountConditions);
    }

    public calculateMovieFee(screening: Screening): Money {
      if(this.isDiscountable(screening)) {
        return this.fee.minus(this.calculateDiscountAmount());
      }

      return this.fee;
    }

    // 할인 조건 찾기
    private isDiscountable(screening: Screening): boolean {
      return this.discountConditions.some(condition => {
        return condition.isSatisfiedBy(screening);
      });
    }

    // 상속을 통햐여 할인 방법을 캡슐화
    protected abstract calculateDiscountAmount();

    protected getFee(): Money {
      return this.fee;
    }
  }

  class AmountDiscountMovie extends Movie {
    private discountAmount: Money;

    constructor (title: string, runningTime: Date, fee: Money, discountAmount: Money, ...discountConditions: DiscountCondition[]) {
      super(title, runningTime, fee, ...discountConditions);
      this.discountAmount = discountAmount;
    }

    protected calculateDiscountAmount() {
      return this.discountAmount;
    }
  }

  class PercentDiscountMovie extends Movie {
    private discountPercent: number;

    constructor (title: string, runningTime: Date, fee: Money, discountPercent: number, ...discountConditions: DiscountCondition[]) {
      super(title, runningTime, fee, ...discountConditions);
      this.discountPercent = discountPercent;
    }

    protected calculateDiscountAmount() {
      return super.getFee().times(this.discountPercent);
    }
  }

  class NoneDiscountMovie extends Movie {
    constructor(title: string, runningTime: Date, fee: Money) {
      super(title, runningTime, fee);
    }

    protected calculateDiscountAmount() {
      return Money.ZERO;  
    }
  }

  class DiscountCondition {
    private type: DiscountConditionType;
    private sequence: number;
    private dayOfWeek: DayOfWeek;
    private startTime: Date;
    private endTime: Date;

    public isSatisfiedBy(screening: Screening) {
      if(this.type == DiscountConditionType.PERIOD) {
        return this.isSatisfiedByPeriod(screening);
      }

      return this.isSatisfiedBySequence(screening);
    }

    private isSatisfiedByPeriod(screening: Screening) {
      return getDayOfWeek(screening.getWhenScreened()) == this.dayOfWeek &&
      this.startTime <= screening.getStartTime() &&
      this.endTime >= screening.getStartTime()
    }

    private isSatisfiedBySequence(screening: Screening){
      return this.sequence == screening.getSequence();
    }
  }

  // interface 구현을 통햐여 할인 조건을 캡슐화
  interface DiscountCondition {
    isSatisfiedBy(screening: Screening): boolean;
  }

  class PeriodCondition implements DiscountCondition {
    private dayOfWeek: DayOfWeek;
    private startTime: Date;
    private endTime: Date;

    constructor(dayOfWeek: DayOfWeek, startTime: Date, endTime: Date) {
      this.dayOfWeek = dayOfWeek;
      this.startTime = startTime;
      this.endTime = endTime;
    }

    public isSatisfiedBy(screening: Screening): boolean {
      return getDayOfWeek(screening.getWhenScreened()) == this.dayOfWeek &&
      this.startTime <= screening.getStartTime() &&
      this.endTime >= screening.getStartTime()
    }
  }

  class SequenceCondition implements DiscountCondition {
    private sequence: number;

    constructor(sequence: number) {
      this.sequence = sequence;
    }

    public isSatisfiedBy(screening: Screening) {
      return this.sequence == screening.getSequence();
    }
  }
}


