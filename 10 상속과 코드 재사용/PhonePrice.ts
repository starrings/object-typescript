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
  // 자식을 추가하는 것이 아닌 추상화 된 부모를 추가하여 상속
  abstract class Phone {
    private calls: Call[] = [];
    private taxRate: number;

    constructor(taxRate: number) {
      // 인스턴스가 추가되야하는 경우에는 자식들도 수정 필요
      this.taxRate = taxRate;
    }

    public calculateFee(): number {
      let result: number = 0;

      for (const call of this.calls) {
        //부모와 자식의 차이를 메서드로 분리
        result += this.calculateCallFee(call);
      }

      return result + (result * this.taxRate);
    }

    protected abstract calculateCallFee(call: Call): number;
  };

  class RegularPhone extends Phone {
    private amount: number;
    private seconds: number;
    private calls: Call[];
    private taxRate: number;

    constructor(seconds: number, amount: number, taxRate: number) {
      super(taxRate);
      this.seconds = seconds;
      this.amount = amount;
    }

    public call(call: Call) {
      this.calls.push(call);
    }

    public getCalls(): Call[] {
      return this.calls;
    }

    public getAmount(): number {
      return this.amount;
    }

    public getSeconds(): number {
      return this.seconds;
    }

    protected calculateCallFee(call: Call): number {
      return (call.getDuration() / this.seconds) * this.amount
    }
  }
  // 상속을 이용한 중복 제거
  class NightDiscountPhone extends Phone {
    private static readonly LATE_NIGHT_HOUR = 22;
    
    private nightlyAmount: number;
    private regularAmount: number;
    private seconds: number;

    constructor(nightlyAmount: number, regularAmount: number, seconds: number, taxRate: number) {
      super(taxRate);
      this.nightlyAmount = nightlyAmount;
      this.regularAmount = regularAmount;
      this.seconds = seconds;
    }

    protected calculateCallFee(call: Call): number {
      if (call.getFrom().getHours() >= NightDiscountPhone.LATE_NIGHT_HOUR) {
        return this.nightlyAmount * (call.getDuration() / this.seconds);
      } else {
        return this.regularAmount * (call.getDuration() / this.seconds);
      }
    }
  }
}