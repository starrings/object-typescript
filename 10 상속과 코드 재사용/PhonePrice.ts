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
    private static readonly LATE_NIGHT_HOUR = 22;
    
    private amount: number;
    private regularAmount: number;
    private nightlyAmount: number;
    private seconds: number;
    private calls: Call[];
    private taxRate: number;
    private type: PhoneType;

    constructor(type: PhoneType, seconds: number, amount: number, nightlyAmount: number, regularAmount: number) {
      if(type === PhoneType.REGULAR) {
        this.type = type;
        this.seconds = seconds;
        this.amount = amount;
        this.nightlyAmount = 0;
        this.regularAmount = 0;
      } else if (type == PhoneType.NIGHTLY) {
        this.type = type;
        this.seconds = seconds;
        this.amount = 0;
        this.nightlyAmount = nightlyAmount;
        this.regularAmount = regularAmount;
      }
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
        if(this.type = PhoneType.REGULAR) {
          result += (call.getDuration() / this.seconds) * this.amount;
        } else {
          if (call.getFrom().getHours() >= Phone.LATE_NIGHT_HOUR) {
            result += (call.getDuration() / this.seconds) * this.nightlyAmount;
          } else {
            result += (call.getDuration() / this.seconds) * this.regularAmount;
          }
        }
        
      }

      return result + (result * this.taxRate);
    }
  }

  // class NightDiscountPhone {
  //   private static readonly LATE_NIGHT_HOUR = 22;
    
  //   private nightlyAmount: number;
  //   private regularAmount: number;
  //   private seconds: number;
  //   private calls: Call[];
  //   private taxRate: number;

  //   constructor(nightlyAmount: number, regularAmount: number, seconds: number, taxRate: number) {
  //     this.nightlyAmount = nightlyAmount;
  //     this.regularAmount = regularAmount;
  //     this.seconds = seconds;
  //     this.taxRate = taxRate;
  //   }
  //   // phone과 중복 코드를 가지고 있어 수정사항이 발생하면 둘 다 수정 필요해짐
  //   public caculateFee(): number {
  //     let result = 0;

  //     for (const call of this.calls) {
  //       if (call.getFrom().getHours() >= NightDiscountPhone.LATE_NIGHT_HOUR) {
  //         result += (call.getDuration() / this.seconds) * this.nightlyAmount;
  //       } else {
  //         result += (call.getDuration() / this.seconds) * this.regularAmount;
  //       }
  //     }
  //     // 세금 부과 로직을 중복된 코드에 모두 추가함
  //     return result + (result * this.taxRate);
  //   }
  // }
}