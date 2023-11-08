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

class Screening {
  private movie: Movie;
  private sequence: number;
  private whenScreened: Date;

  constructor(movie: Movie, sequence: number, whenScreened: Date) {
    this.movie = movie;
    this.sequence = sequence;
    this.whenScreened = whenScreened;
  }

  public getStartTime(): Date {
    return this.whenScreened;
  }

  public isSequence(sequence: number) {
    return this.sequence == sequence;
  }

  public getMovieFee() {
    return this.movie.getFee();
  }

  public reserve(customer: Customer, audienceCount: number): Reservation {
    return new Reservation(customer, this, this.calculateFee(audienceCount), audienceCount);
  }

  private calculateFee(audienceCount: number): Money {
    return this.movie.calculateMovieFee(this).times(audienceCount);
  }
}

class Money {
  public static readonly ZERO: Money = Money.wons(0);

  private readonly amount: number;

  public static wons(amount: number): Money {
    return new Money(amount);
  }

  constructor(amount: number) {
    this.amount = amount;
  }

  public plus (amount: Money): Money {
    return new Money(this.amount + amount.amount);
  }

  public minus(amount: Money): Money {
    return new Money(this.amount - amount.amount);
  }

  public times(percent: number): Money {
    return new Money(this.amount * percent);
  }

  public isLessThan(other: Money): boolean {
    return this.amount < other.amount ? true : false; 
  }

  public isGreaterThanOrEqual(other: Money): boolean {
    return this.amount >= other.amount ? true : false;
  }
}

class Reservation {
  private customer: Customer;
  private screening: Screening;
  private fee: Money;
  private audienceCount: number;

  constructor(customer: Customer, screening: Screening, fee: Money, audienceCount: number) {
    this.customer = customer;
    this.screening = screening;
    this.fee = fee;
    this.audienceCount = audienceCount;
  }
}

class Customer {
  private name: string;
  private id: string;

  constructor(name: string, id: string) {
    this.id = id;
    this.name = name;
  }
}

class Movie {
  private title: string;
  private runningTime: Date;
  private fee: Money;
  private discouontPolicy: DiscountPolicy;

  constructor(title: string, runningTime: Date, fee: Money, discountPolicy: DiscountPolicy) {
    this.title = title;
    this.runningTime = runningTime;
    this.fee = fee;
    this.discouontPolicy = discountPolicy;
  }

  public getFee(): Money {
    return this.fee;
  }

  public calculateMovieFee(screening: Screening): Money {
    return this.fee.minus(this.discouontPolicy.calculateDiscountAmount(screening));
  }
}

// 금액 할인 정책과 비율 할인 정책을 상속 받게 하기 위한 추상 클래스
// 템플릿 패턴
abstract class DiscountPolicy {
  private conditions: DiscountCondition[] = new Array<DiscountCondition>();

  constructor(...condisions: DiscountCondition[]) {
    this.conditions = [...condisions];
  }

  public calculateDiscountAmount(screening: Screening) {
    for(const each of this.conditions) {
      if(each.isSatisfiedBy(screening)) {
        return this.getDiscountAmount(screening);
      }
    }

    return Money.ZERO;
  }

  protected abstract getDiscountAmount(screening: Screening);
}

// 순번 조건과 기간 조건의 각각 사용하기 위해 인터페이스 사용
interface DiscountCondition {
  isSatisfiedBy(screening: Screening): boolean;
}

class SequenceCondition implements DiscountCondition {
  private sequence: number;
  
  
  constructor(sequence: number) {
    this.sequence = sequence;
  }

  public isSatisfiedBy(screening: Screening): boolean {
    return screening.isSequence(this.sequence);
  }
}

class PeriodCondition implements DiscountCondition {
  private dayOfWeek: DayOfWeek;
  private startTime: Date;
  private endTime: Date;
  
  constructor(dayOfweek: DayOfWeek, startTime: Date, endTime:  Date) {
    this.dayOfWeek = dayOfweek;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public isSatisfiedBy(screening: Screening): boolean {
    return getDayOfWeek(screening.getStartTime()) == this.dayOfWeek &&
      this.startTime <= screening.getStartTime() &&
      this.endTime >= screening.getStartTime()
  }
}

class AmountDiscountPolicy extends DiscountPolicy {
  private discountAmount: Money;

  constructor(discountAmount: Money, ...conditions: DiscountCondition[]) {
    super(...conditions);
    this.discountAmount = discountAmount;
  }

  // 추상 클래스를 상속받아 오버라이딩 함
  protected getDiscountAmount(screening: Screening): Money {
    return this.discountAmount;
  }
}

class PercentDiscountPolicy extends DiscountPolicy {
  private percent: number;

  constructor(discountAmount: Money, ...conditions: DiscountCondition[]) {
    super(...conditions);
    this.percent = this.percent;
  }

    // 추상 클래스를 상속받아 오버라이딩 함
    protected getDiscountAmount(screening: Screening): Money {
      return screening.getMovieFee().times(this.percent);
    }
}