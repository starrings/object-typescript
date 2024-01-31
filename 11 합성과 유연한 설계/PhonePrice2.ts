namespace ch11 {
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

  interface RatePolicy {
    calculateFee(phone: Phone): number;
  }
  
  abstract class BasicRatePolicy implements RatePolicy {
    public calculateFee(phone: Phone): number {
      let result: number = 0;
      
      for (const call of phone.getCalls()) {
        result += this.calculateCallFee(call);
      }

      return result;
    }

    protected abstract calculateCallFee(call: Call);
  }

  class RegularPolicy extends BasicRatePolicy {
    private amount: number;
    private seconds: number;

    constructor(amount: number, seconds: number) {
      super();
      this.amount = amount;
      this.seconds = seconds;
    }

    protected calculateCallFee(call: Call) {
      return this.amount * (call.getDuration() / this.seconds);  
    }
  }

  class NightlyDiscountPolicy extends BasicRatePolicy {
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

    protected calculateCallFee(call: Call) {
      if(call.getFrom().getHours() >= NightlyDiscountPolicy.LATE_NIGHT_HOUR) {
        return this.nightlyAmount * (call.getDuration() / this.seconds);
      }

      return this.regularAmount * (call.getDuration() / this.seconds);
    }
  }
  // 합성을 통한 부가정책 구현
  abstract class AdditiionalRatePolicy implements RatePolicy {
    private next: RatePolicy;

    constructor(next: RatePolicy) {
      this.next = next;
    }

    public calculateFee(phone: Phone): number {
      const fee = this.next.calculateFee(phone);
      return this.afterCalculated(fee);    
    }

    protected abstract afterCalculated(fee: number);
  }

  class TaxablePolicy extends AdditiionalRatePolicy {
    private taxRatio: number;

    constructor(taxRatio: number, next: RatePolicy) {
      super(next);
      this.taxRatio = taxRatio;
    }

    protected afterCalculated(fee: number) {
      return fee + fee * this.taxRatio;  
    }
  }

  class RateDiscountablePolicy extends AdditiionalRatePolicy {
    private discountAmount: number;

    constructor(discountAmount: number, next: RatePolicy) {
      super(next);
      this.discountAmount = discountAmount;
    }

    protected afterCalculated(fee: number) {
      return fee - this.discountAmount;  
    }
  }

  class Phone {
    private ratePolicy: RatePolicy; // Phone은 인터페이스에 의존 그리고 합성을 통해 구체화
    private calls: Call[];

    constructor(ratePolicy: RatePolicy) {
      this.ratePolicy = ratePolicy;
    }

    public getCalls(): Call[] {
      return this.calls;
    }

    public calculateFee(): number {
      return this.ratePolicy.calculateFee(this);
    }
  }
}