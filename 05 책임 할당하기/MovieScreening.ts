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

  class Movie {
    private title: string;
    private runningTime: Date;
    private fee: Money;
    private discountConditions: DiscountCondition[];

    private moneyType: MovieType;
    private discountAmount: Money;
    private discountPercent: number;

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

    private calculateDiscountAmount() {
      switch(this.moneyType) {
        case MovieType.AMOUNT_DISCOUNT:
          return this.calculateAmountDiscountAmount();
        case MovieType.PERCENT_DISCOUNT:
          return this.calculatePercentDiscountAmount();
        case MovieType.NONE_DISCOUNT:
          return this.calculateNoneDiscountAmount();
      }

      throw new Error();
    }

    private calculateAmountDiscountAmount() {
      return this.discountAmount;
    }

    private calculatePercentDiscountAmount() {
      return this.fee.times(this.discountPercent);
    }

    private calculateNoneDiscountAmount() {
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

  // 이전 코드에서는 DiscountCondition에서 한가지 이상의 변경사항이 나타나
  // 응집도가 떨어져
  // 각 기능들을 분리하여 응집도를 향상시켰으나
  // 분리한 이후 Movie에서 서로 다른  두 클래스에 결합되어
  // 결합도가 높아지는 새로운 문제가 생기게 되었다.
  // class PeriodCondition {
  //   private dayOfWeek: DayOfWeek;
  //   private startTime: Date;
  //   private endTime: Date;

  //   constructor(dayOfWeek: DayOfWeek, startTime: Date, endTime: Date) {
  //     this.dayOfWeek = dayOfWeek;
  //     this.startTime = startTime;
  //     this.endTime = endTime;
  //   }

  //   public isSatisfiedBy(screening: Screening): boolean {
  //     return getDayOfWeek(screening.getWhenScreened()) == this.dayOfWeek &&
  //     this.startTime <= screening.getStartTime() &&
  //     this.endTime >= screening.getStartTime()
  //   }
  // }

  // class SequenceCondition {
  //   private sequence: number;

  //   constructor(sequence: number) {
  //     this.sequence = sequence;
  //   }

  //   public isSatisfiedBy(screening: Screening) {
  //     return this.sequence == screening.getSequence();
  //   }
  // }
}


