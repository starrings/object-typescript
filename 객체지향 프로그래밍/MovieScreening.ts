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

// NoneDisCountPolicy 메서드의 리턴 값이 의미 없어지는 현상 방지(부모에 의존하지 않게!)
// 한편으로 NoneDisCountPolicy만을 위해 인터페이스를 추가하는 것이 과하다고 생각할 수도 있음
// 구현과 관련된 모든 것은 트레이드 오프의 관계! 모든 코드에는 합당한 설계가 필요
interface DiscountPolicy {
  calculateDiscountAmount(screening: Screening): Money;
}

// 금액 할인 정책과 비율 할인 정책을 상속 받게 하기 위한 추상 클래스
// 템플릿 패턴
abstract class DefaultDiscountPolicy implements DiscountPolicy {
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

class AmountDiscountPolicy extends DefaultDiscountPolicy {
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

class PercentDiscountPolicy extends DefaultDiscountPolicy {
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

// 할인 정책이 없는 경우에도 일관성 있게 책임을 DiscountPolicy로 넘김
class NoneDisCountPolicy implements DiscountPolicy {
  // 추상 클래스를 상속받아 오버라이딩 함
  public calculateDiscountAmount(screening: Screening) {
    return Money.ZERO;  
  }
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