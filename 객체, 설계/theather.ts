// 극장에서 티켓을 통하여(돈 or 초대장) 연극을 보기 우한 클래스 설계

class Invitation {
  private LocalDateTime!: Date;
}

class Ticket {
  private fee!: number;

  public getFee(): number {
      return this.fee;
  }
}

class Bag {
  private amount!: number;
  private invitation?: Invitation;
  private ticket!: Ticket;

  // 생성자: 매개변수가 없는 생성자 (기본 생성자)
  // constructor(amount: number);
  // constructor(amount: number, invitation: Invitation);
  constructor(amount: number, invitation?: Invitation){
      this.invitation = invitation;
      this.amount = amount;
  }

  public hasInvitation(): boolean {
      return this.invitation != null;
  }

  public hasTicket(): boolean{
      return this.ticket != null;
  }

  public setTicket(ticket: Ticket){
      this.ticket = ticket;
  }

  public minusAmount(amount: number){
      this.amount -= amount;
  }

  public plusAmount(amount: number){
      this.amount += amount;
  }
}

class Audience {
  private bag: Bag;

  constructor(bag: Bag) {
      this.bag = bag;
  }

  public getBag(): Bag {
      return this.bag;
  }

  public buy(ticket: Ticket): number {
      if(this.bag.hasInvitation()){
          this.bag.setTicket(ticket)
          return 0;    
      }else {
          this.bag.setTicket(ticket)
          this.bag.minusAmount(ticket.getFee())
          return ticket.getFee()
      }
  }
}

class TicketOffice {
  private amount: number;
  private tickets: Ticket[] = new Array<Ticket>();

  constructor(amount: number, ...tickets: Ticket []){ // Rest 파라미터
      this.amount = amount;
      this.tickets.push(...tickets);
  }

  public getTicket(): Ticket {
      // 티켓이 반드시 있다고 가정
      return this.tickets.shift()!;
  }

  public minusAmount(amount: number) {
      this.amount -= amount;
  }

  public plusAmount(amount: number) {
      this.amount += amount;
  }
}

class TicketSeller {
  private ticketOffice: TicketOffice;

  constructor(ticketOffice: TicketOffice){
      this.ticketOffice = ticketOffice;
  }

  public getTicketOffice(): TicketOffice {
      return this.ticketOffice;
  }

  public sellTo(audience: Audience){
      // TicketSeller와 Audience간의 결합도를 낮추고 구현을 캡슐화하여 Audience가 수정되더라도 영향을 받지 않도록 함
      this.ticketOffice.plusAmount(audience.buy(this.ticketOffice.getTicket()));
  }
}

class Theather {
  private ticketSeller: TicketSeller;

  constructor(ticketSeller: TicketSeller){
      this.ticketSeller = ticketSeller;
  }

  public enter(audience: Audience){
      //Theather는 TicketSeller의 인터페이스에만 의존하도록 하여(인터페이스와 구현 분리) 결합도를 낮추고 변경하기 쉬운 코드를 작성하려 함
      this.ticketSeller.sellTo(audience)
  }
}