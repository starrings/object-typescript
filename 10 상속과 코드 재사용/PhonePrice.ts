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

  class Phone {
    private amount: number;
    private seconds: number;
    private calls: Call[];

    constructor(amount: number, seconds: number) {
      this.amount = amount;
      this.seconds = seconds;
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

    public calculateFee(): number {
      let result: number = 0;

      for (const call of this.calls) {
        result += (call.getDuration() / this.seconds) * this.amount;
      }

      return result;
    }
  }

  class NightDiscountPhone {
    private static readonly LATE_NIGHT_HOUR = 22;
    
    private nightlyAmount: number;
    private regularAmount: number;
    private seconds: number;
    private calls: Call[];

    constructor(nightlyAmount: number, regularAmount: number, seconds: number) {
      this.nightlyAmount = nightlyAmount;
      this.regularAmount = regularAmount;
      this.seconds = seconds;
    }
    // phone과 중복 코드를 가지고 있어 수정사항이 발생하면 둘 다 수정 필요해짐
    public caculateFee(): number {
      let result = 0;

      for (const call of this.calls) {
        if (call.getFrom().getHours() >= NightDiscountPhone.LATE_NIGHT_HOUR) {
          result += (call.getDuration() / this.seconds) * this.nightlyAmount;
        } else {
          result += (call.getDuration() / this.seconds) * this.regularAmount;
        }
      }

      return result;
    }
  }
}