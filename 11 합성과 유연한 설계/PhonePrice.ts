namespace ch10 {
  class Call {
    private from: Date;
    private to: Date;

    constructor(from: Date, to: Date) {
      this.from = from;
      this.to = to;
    }

    public getDuration(): number {
      return this.from.getTime() - this.to.getTime();
    }

    public getFrom(): Date {
      return this.from;
    }
  }

  enum PhoneType { REGULAR, NIGHTLY };
  abstract class Phone {
    private calls: Call[] = [];

    public calculateFee(): number {
      let result: number = 0;

      for (const call of this.calls) {
        result += this.calculateCallFee(call);
      }

      return result;
    }
    //훅 메서드: 오버라이딩 용도이나 편의를 위해 기본 메서드 제공
    protected afterCalculated(fee: number): number {
      return fee;
    }

    protected abstract calculateCallFee(call: Call): number;
  };

  class RegularPhone extends Phone {
    private amount: number;
    private seconds: number;

    constructor(seconds: number, amount: number) {
      super();
      this.seconds = seconds;
      this.amount = amount;
    }

    protected calculateCallFee(call: Call): number {
      return (call.getDuration() / this.seconds) * this.amount
    }
  }

  class TaxableRegularPhone extends RegularPhone {
    private taxRate: number;

    constructor(amount: number, seconds: number, taxRate: number) {
      super(amount, seconds); 
      this.taxRate = taxRate;
    }

    public afterCalculated(fee: number): number {
      return fee + fee * this.taxRate;
    }
  }

  class NightlyDiscountPhone extends Phone {
    private static readonly LATE_NIGHT_HOUR = 22;
    
    private nightlyAmount: number;
    private regularAmount: number;
    private seconds: number;

    constructor(nightlyAmount: number, regularAmount: number, seconds: number) {
      super();
      this.nightlyAmount = nightlyAmount;
      this.regularAmount = regularAmount;
      this.seconds = seconds;
    }

    protected calculateCallFee(call: Call): number {
      if (call.getFrom().getHours() >= NightlyDiscountPhone.LATE_NIGHT_HOUR) {
        return this.nightlyAmount * (call.getDuration() / this.seconds);
      } else {
        return this.regularAmount * (call.getDuration() / this.seconds);
      }
    }
  }

  class TaxableNightlyPhone extends NightlyDiscountPhone {
    private taxRate: number;

    constructor(nightlyamount: number, regularamount: number, seconds: number, taxRate: number) {
      super(nightlyamount, regularamount, seconds); 
      this.taxRate = taxRate;
    }

    // 중복된 코드
    public afterCalculated(fee: number): number {
      return fee + fee * this.taxRate;
    }
  }
}