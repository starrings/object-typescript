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

  class Phone {
    private amount: number;
    private seconds: number;
    private calls: Call[];
    private taxRate: number;

    constructor(seconds: number, amount: number, taxRate: number) {
      this.seconds = seconds;
      this.amount = amount;
      this.taxRate = taxRate;
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
    // 두 코드를 하나의 클래스에 합쳐 타입마다 분기 시키면 중복문제는 해결했지만
    // 이전부터 계속 문제되었던 결합도와 응집도 문제가 생긴다.
    public calculateFee(): number {
      let result: number = 0;

      for (const call of this.calls) {
        result += (call.getDuration() / this.seconds) * this.amount;
      }

      return result + (result * this.taxRate);
    }
  }
  // 상속을 이용한 중복 제거
  class NightDiscountPhone extends Phone {
    private static readonly LATE_NIGHT_HOUR = 22;
    
    private nightlyAmount: number;

    constructor(nightlyAmount: number, regularAmount: number, seconds: number, taxRate: number) {
      super(regularAmount, seconds,taxRate);
      this.nightlyAmount = nightlyAmount;
    }
    // phone과 중복 코드를 가지고 있어 수정사항이 발생하면 둘 다 수정 필요해짐
    public caculateFee(): number {
      let result: number = super.calculateFee();
      let nightlyFee = 0;

      // 억지로 상속을 하여 코드가 약간 덜 직ㄴ관적임
      for (const call of this.getCalls()) {
        if (call.getFrom().getHours() >= NightDiscountPhone.LATE_NIGHT_HOUR) {
          nightlyFee += (this.getAmount() - this.nightlyAmount) * (call.getDuration() / this.getSeconds());
        } 
      }
      // 세금 부과 로직을 중복된 코드에 모두 추가함
      return result - nightlyFee;
    }
  }
}